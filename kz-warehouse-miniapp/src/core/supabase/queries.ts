import { useQuery } from '@tanstack/react-query'
import {
  runtimeOverview, runtimeQueue, runtimeOpenCandidate, runtimeAnalytics,
} from '@core/runtime/client'
import { rpcQueue, rpcDetail, rpcOpenCandidate, rpcAnalyticsScreen, rpcOverviewScreen, rpcConfirmedLeads } from './rpc'
import {
  mapQueueRow, mapDetailRow, mapOpenCandidateResult, mapAnalyticsRow, mapOverviewScreen,
} from './mappers'
import type { ActiveFilters, ModePreset } from '@core/types/ui'
import type { RuntimeSource } from '@core/runtime/types'
import type { RpcQueueParams, RpcAnalyticsParams, RpcQueueScreenRow } from '@core/types/rpc'
import type { Candidate } from '@core/types/candidate'
import type { AnalyticsData } from '@core/types/analytics'

// ─── Filter helpers ──────────────────────────────────────────────────────────

const HEAT_TO_RU: Record<string, string> = { hot: 'Горячий', warm: 'Тёплый', cold: 'Холодный' }
const FRESHNESS_TO_RU: Record<string, string> = { fresh: 'Свежий', actual: 'Актуальный', stale: 'Устаревший' }

function mapHeat(v: string | null | undefined): string | null {
  if (!v) return null; return HEAT_TO_RU[v] ?? v
}
function mapFreshness(v: string | null | undefined): string | null {
  if (!v) return null; return FRESHNESS_TO_RU[v] ?? v
}
function mapContactType(v: string | null | undefined) {
  if (v === 'direct') return { p_has_contact: true as boolean | null,  p_contact_path_status_v2: null as string | null }
  if (v === 'path')   return { p_has_contact: null,  p_contact_path_status_v2: 'indirect_contact_path_found' }
  if (v === 'none')   return { p_has_contact: false as boolean | null, p_contact_path_status_v2: null }
  return                     { p_has_contact: null,  p_contact_path_status_v2: null }
}
function buildQueueParams(bucket: string, filters: ActiveFilters, mode: ModePreset | null): RpcQueueParams {
  const contact = mapContactType(filters.contactType)
  return {
    p_bucket: bucket,
    p_region: filters.region ?? mode?.params.region ?? null,
    p_market_role: filters.marketRole ?? null,
    p_heat_label_ru: mapHeat(filters.heat ?? mode?.params.heat),
    p_freshness_label_ru: mapFreshness(filters.freshness ?? mode?.params.freshness),
    p_has_contact: contact.p_has_contact,
    p_contact_path_status_v2: contact.p_contact_path_status_v2,
    p_limit: filters.limit || mode?.params.limit || 10,
    p_offset: 0,
  }
}
function buildAnalyticsParams(filters: ActiveFilters, mode: ModePreset | null): RpcAnalyticsParams {
  const contact = mapContactType(filters.contactType)
  return {
    p_region: filters.region ?? mode?.params.region ?? null,
    p_bucket: filters.bucket ?? mode?.params.bucket ?? (mode?.params.tier === 'all_active' ? 'all_active' : null),
    p_market_role: filters.marketRole ?? null,
    p_heat_label_ru: mapHeat(filters.heat ?? mode?.params.heat),
    p_freshness_label_ru: mapFreshness(filters.freshness ?? mode?.params.freshness),
    p_has_contact: contact.p_has_contact,
    p_contact_path_status_v2: contact.p_contact_path_status_v2,
  }
}

// ─── Queue ───────────────────────────────────────────────────────────────────
// Primary: runtime action "queue" → kz_miniapp_queue_screen_v1 (with priority/card_reason)
// Fallback: rpcQueue (v2, no priority/card_reason); source labeled explicitly

export function useQueueQuery(
  bucket: 'action_queue' | 'review_queue' | 'confirmed_leads',
  filters: ActiveFilters,
  mode: ModePreset | null,
  enabled = true,
) {
  const params = buildQueueParams(bucket, filters, mode)
  const contact = mapContactType(filters.contactType)

  return useQuery({
    queryKey: ['queue_rt', bucket, params],
    queryFn: async (): Promise<{ items: Candidate[]; source: RuntimeSource }> => {
      // Primary: runtime
      try {
        const envelope = await runtimeQueue({
          activeModeCode:     mode?.id ?? null,
          bucket,
          region:             params.p_region,
          marketRole:         params.p_market_role,
          heatLabelRu:        params.p_heat_label_ru,
          freshnessLabelRu:   params.p_freshness_label_ru,
          hasContact:         contact.p_has_contact,
          contactPathStatusV2:contact.p_contact_path_status_v2,
          limit:              params.p_limit,
          offset:             params.p_offset,
        })
        const data = envelope.data as Record<string, unknown> | null
        if (data) {
          // Runtime wraps queue as { queue: { items: [...] }, ... }
          // Fallback: flat array or { items: [...] }
          const queueBlock = data.queue as Record<string, unknown> | null
          const rawItems = (
            Array.isArray(data)                    ? data :
            Array.isArray(queueBlock?.items)       ? queueBlock!.items as RpcQueueScreenRow[] :
            (data.items ?? [])
          ) as RpcQueueScreenRow[]
          return { items: rawItems.map(mapQueueRow), source: 'runtime' }
        }
        console.warn('[queue] runtime returned ok:true but data is null — falling back')
      } catch (e) {
        console.warn('[queue] runtime failed, using legacy fallback:', e)
      }

      // Fallback: direct RPC v2
      const rows = await rpcQueue(params)
      return { items: rows.map(r => mapQueueRow(r as RpcQueueScreenRow)), source: 'legacy_fallback' }
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}

// ─── Detail ──────────────────────────────────────────────────────────────────
// Primary: runtime action "open_candidate" → kz_miniapp_open_candidate_v1 (priority+explanation)
// Fallback: rpcDetail (record_detail_v1, no priority/explanation)

export function useDetailQuery(candidateId: string | null, activeModeId?: string | null) {
  return useQuery({
    queryKey: ['detail_rt', candidateId, activeModeId],
    queryFn: async () => {
      if (!candidateId || candidateId === 'undefined') return null

      // Primary: runtime open_candidate
      try {
        const envelope = await runtimeOpenCandidate({
          candidateId,
          activeModeCode:  activeModeId ?? null,
          currentQueue:    'action_queue',
          activeModeOffset:0,
        })
        if (envelope.data) {
          // Runtime wraps result as { ok, sync, detail, screen, workspace_context }
          // The actual candidate payload is at envelope.data.detail
          const rawEnvData = envelope.data as Record<string, unknown>
          const detailPayload = (rawEnvData.detail ?? rawEnvData) as Parameters<typeof mapOpenCandidateResult>[0]
          const result = mapOpenCandidateResult(detailPayload)
          return { detail: result, source: 'runtime' as RuntimeSource }
        }
        console.warn('[detail] runtime returned ok:true but data is null — falling back')
      } catch (e) {
        console.warn('[detail] runtime failed, using legacy fallback:', e)
      }

      // Fallback 1: open_candidate_v1 RPC
      try {
        const openResult = await rpcOpenCandidate({ p_candidate_id: candidateId, p_lead_id: null })
        if (openResult) {
          return { detail: mapOpenCandidateResult(openResult), source: 'legacy_fallback' as RuntimeSource }
        }
      } catch { /* continue */ }

      // Fallback 2: plain detail RPC
      const row = await rpcDetail({ p_candidate_id: candidateId, p_lead_id: null })
      if (!row) return null
      return { detail: mapDetailRow(row), source: 'legacy_fallback' as RuntimeSource }
    },
    enabled: !!candidateId && candidateId !== 'undefined',
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

// ─── Analytics ───────────────────────────────────────────────────────────────
// Primary: runtime action "analytics" → kz_miniapp_analytics_screen_v1
// Fallback: rpcAnalyticsScreen (screen v1 or v2)

export function useAnalyticsQuery(filters: ActiveFilters, mode: ModePreset | null) {
  const params = buildAnalyticsParams(filters, mode)

  return useQuery({
    queryKey: ['analytics_rt', mode?.id ?? null, params],
    queryFn: async (): Promise<{ analytics: AnalyticsData; source: RuntimeSource } | null> => {
      // Primary: runtime
      try {
        const envelope = await runtimeAnalytics({ activeModeCode: mode?.id ?? null })
        if (envelope.data) {
          const rawData = envelope.data as Record<string, unknown>
          // Runtime may wrap as { ok, sync, analytics: {...} } or flat { ok, summary, charts }
          const analyticsPayload = (rawData.analytics ?? rawData) as Parameters<typeof mapAnalyticsRow>[0]
          const mapped = mapAnalyticsRow(analyticsPayload)
          return { analytics: mapped, source: 'runtime' }
        }
        console.warn('[analytics] runtime returned ok:true but data is null — falling back')
      } catch (e) {
        console.warn('[analytics] runtime failed, using legacy fallback:', e)
      }

      // Fallback: direct RPC (analytics_screen_v1 → analytics_v2)
      const row = await rpcAnalyticsScreen(params)
      if (!row) return null
      return { analytics: mapAnalyticsRow(row), source: 'legacy_fallback' }
    },
    staleTime: 3 * 60 * 1000,
    retry: 1,
  })
}

// ─── Overview ─────────────────────────────────────────────────────────────────
// Primary: runtime action "overview" → kz_miniapp_overview_screen_v1
// Fallback: rpcOverviewScreen + rpcAnalyticsScreen

export function useOverviewQuery(filters: ActiveFilters, mode: ModePreset | null) {
  const params = buildAnalyticsParams(filters, mode)

  return useQuery({
    queryKey: ['overview_rt', mode?.id ?? null, params],
    queryFn: async () => {
      // Primary: runtime overview action
      try {
        const envelope = await runtimeOverview({
          activeModeCode: mode?.id ?? null,
          limit:  10,
          offset: 0,
        })
        if (envelope.data) {
          const rawData = envelope.data as Record<string, unknown>
          // Runtime returns flat structure: summary_strip/priority_preview/main_insight at top level.
          // rawData.screen is only metadata (type/title/mode), NOT the actual screen data.
          // Prefer rawData.screen only if it contains the actual data fields.
          const screenCandidate = rawData.screen as Record<string, unknown> | undefined
          const screenRaw = (screenCandidate?.summary_strip || screenCandidate?.priority_preview)
            ? screenCandidate as Record<string, unknown>
            : rawData as Record<string, unknown>
          const screen = {
            ok: screenRaw.ok !== false && !!(screenRaw.summary_strip || screenRaw.priority_preview),
            ...screenRaw,
          } as Parameters<typeof mapOverviewScreen>[0]
          const overviewData = mapOverviewScreen(screen, null)
          // Use analytics_preview embedded in the overview response if available (avoids extra request)
          let analyticsData: AnalyticsData | null = null
          try {
            const embeddedAnalytics = rawData.analytics_preview as Record<string, unknown> | undefined
            if (embeddedAnalytics?.summary || embeddedAnalytics?.charts) {
              analyticsData = mapAnalyticsRow(embeddedAnalytics as Parameters<typeof mapAnalyticsRow>[0])
            } else {
              const aEnv = await runtimeAnalytics({ activeModeCode: mode?.id ?? null })
              if (aEnv.data) analyticsData = mapAnalyticsRow(aEnv.data as Parameters<typeof mapAnalyticsRow>[0])
            }
          } catch { /* optional */ }
          return { overviewData, analyticsData, source: 'runtime' as RuntimeSource }
        }
        console.warn('[overview] runtime returned ok:true but data is null — falling back')
      } catch (e) {
        console.warn('[overview] runtime failed, using legacy fallback:', e)
      }

      // Fallback: direct RPC
      const [overviewScreen, analyticsRow] = await Promise.allSettled([
        rpcOverviewScreen(params),
        rpcAnalyticsScreen(params),
      ])
      const screen      = overviewScreen.status  === 'fulfilled' ? overviewScreen.value  : null
      const analytics   = analyticsRow.status    === 'fulfilled' ? analyticsRow.value    : null
      const analyticsData = analytics ? mapAnalyticsRow(analytics) : null
      return {
        overviewData: mapOverviewScreen(screen, analyticsData),
        analyticsData,
        source: 'legacy_fallback' as RuntimeSource,
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}

// ─── Confirmed leads — dedicated source ───────────────────────────────────────
// Always from public.kz_confirmed_leads — not routed through runtime.

export function useConfirmedLeadsQuery(limit = 10) {
  return useQuery({
    queryKey: ['confirmed_leads', limit],
    queryFn: async () => {
      const envelope = await rpcConfirmedLeads(limit)
      return {
        count: envelope.count,
        items: envelope.items.map(r => mapQueueRow(r as RpcQueueScreenRow)) as Candidate[],
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  })
}
