import { useQuery } from '@tanstack/react-query'
import {
  rpcQueueScreen, rpcDetail, rpcOpenCandidate,
  rpcAnalyticsScreen, rpcOverviewScreen, rpcConfirmedLeads,
} from './rpc'
import {
  mapQueueRow, mapDetailRow, mapOpenCandidateResult,
  mapAnalyticsRow, mapOverviewScreen,
} from './mappers'
import type { ActiveFilters, ModePreset } from '@core/types/ui'
import type { RpcQueueParams, RpcAnalyticsParams } from '@core/types/rpc'
import type { Candidate } from '@core/types/candidate'

// ─── Filter value mappers ────────────────────────────────────────────────────

const HEAT_TO_RU: Record<string, string> = {
  hot:  'Горячий',
  warm: 'Тёплый',
  cold: 'Холодный',
}

const FRESHNESS_TO_RU: Record<string, string> = {
  fresh:  'Свежий',
  actual: 'Актуальный',
  stale:  'Устаревший',
}

function mapHeat(v: string | null | undefined): string | null {
  if (!v) return null
  return HEAT_TO_RU[v] ?? v
}

function mapFreshness(v: string | null | undefined): string | null {
  if (!v) return null
  return FRESHNESS_TO_RU[v] ?? v
}

function mapContactType(v: string | null | undefined): {
  p_has_contact: boolean | null
  p_contact_path_status_v2: string | null
} {
  if (v === 'direct') return { p_has_contact: true,  p_contact_path_status_v2: null }
  if (v === 'path')   return { p_has_contact: null,   p_contact_path_status_v2: 'indirect_contact_path_found' }
  if (v === 'none')   return { p_has_contact: false,  p_contact_path_status_v2: null }
  return              { p_has_contact: null,  p_contact_path_status_v2: null }
}

function buildQueueParams(
  bucket: string,
  filters: ActiveFilters,
  mode: ModePreset | null,
): RpcQueueParams {
  const contact = mapContactType(filters.contactType)
  return {
    p_bucket:             bucket,
    p_region:             filters.region ?? mode?.params.region ?? null,
    p_market_role:        filters.marketRole ?? null,
    p_heat_label_ru:      mapHeat(filters.heat ?? mode?.params.heat),
    p_freshness_label_ru: mapFreshness(filters.freshness ?? mode?.params.freshness),
    p_has_contact:        contact.p_has_contact,
    p_contact_path_status_v2: contact.p_contact_path_status_v2,
    p_limit:              filters.limit || mode?.params.limit || 10,
    p_offset:             0,
  }
}

function buildAnalyticsParams(
  filters: ActiveFilters,
  mode: ModePreset | null,
): RpcAnalyticsParams {
  const contact = mapContactType(filters.contactType)
  return {
    p_region:             filters.region ?? mode?.params.region ?? null,
    p_bucket:             filters.bucket
                            ?? mode?.params.bucket
                            ?? (mode?.params.tier === 'all_active' ? 'all_active' : null),
    p_market_role:        filters.marketRole ?? null,
    p_heat_label_ru:      mapHeat(filters.heat ?? mode?.params.heat),
    p_freshness_label_ru: mapFreshness(filters.freshness ?? mode?.params.freshness),
    p_has_contact:        contact.p_has_contact,
    p_contact_path_status_v2: contact.p_contact_path_status_v2,
  }
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

// Queue — uses kz_miniapp_queue_screen_v1 (with priority/card_reason) + v2 fallback
export function useQueueQuery(
  bucket: 'action_queue' | 'review_queue' | 'confirmed_leads',
  filters: ActiveFilters,
  mode: ModePreset | null,
  enabled = true,
) {
  const params = buildQueueParams(bucket, filters, mode)

  return useQuery({
    queryKey: ['queue_screen', bucket, params],
    queryFn: async () => {
      const rows = await rpcQueueScreen(params)
      return rows.map(mapQueueRow)
    },
    enabled,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  })
}

// Detail — uses kz_miniapp_open_candidate_v1 (priority+explanation) + record_detail_v1 fallback
export function useDetailQuery(candidateId: string | null) {
  return useQuery({
    queryKey: ['detail', candidateId],
    queryFn: async () => {
      if (!candidateId) return null

      // Try open_candidate_v1 first (includes priority + explanation)
      const openResult = await rpcOpenCandidate({
        p_candidate_id: candidateId,
        p_lead_id: null,
      })
      if (openResult) {
        return mapOpenCandidateResult(openResult)
      }

      // Fallback: plain detail
      const row = await rpcDetail({
        p_candidate_id: candidateId,
        p_lead_id: null,
      })
      if (!row) return null
      return mapDetailRow(row)
    },
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000,
  })
}

// Analytics — uses kz_miniapp_analytics_screen_v1 + v2 fallback
export function useAnalyticsQuery(filters: ActiveFilters, mode: ModePreset | null) {
  const params = buildAnalyticsParams(filters, mode)

  return useQuery({
    queryKey: ['analytics_screen', params],
    queryFn: async () => {
      const row = await rpcAnalyticsScreen(params)
      if (!row) return null
      return mapAnalyticsRow(row)
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}

// Overview — uses kz_miniapp_overview_screen_v1 + analytics fallback
export function useOverviewQuery(filters: ActiveFilters, mode: ModePreset | null) {
  const params = buildAnalyticsParams(filters, mode)

  return useQuery({
    queryKey: ['overview_screen', params],
    queryFn: async () => {
      // Run both in parallel — overview screen v1 and analytics (for fallback)
      const [overviewScreen, analyticsRow] = await Promise.allSettled([
        rpcOverviewScreen(params),
        rpcAnalyticsScreen(params),
      ])

      const screen   = overviewScreen.status  === 'fulfilled' ? overviewScreen.value  : null
      const analytics = analyticsRow.status   === 'fulfilled' ? analyticsRow.value    : null
      const analyticsData = analytics ? mapAnalyticsRow(analytics) : null

      return {
        overviewData: mapOverviewScreen(screen, analyticsData),
        analyticsData,
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  })
}

// Confirmed leads — dedicated source: public.kz_confirmed_leads
export function useConfirmedLeadsQuery(limit = 10) {
  return useQuery({
    queryKey: ['confirmed_leads', limit],
    queryFn: async () => {
      const envelope = await rpcConfirmedLeads(limit)
      return {
        count: envelope.count,
        items: envelope.items.map(mapQueueRow) as Candidate[],
      }
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  })
}
