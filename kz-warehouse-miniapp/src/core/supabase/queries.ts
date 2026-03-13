import { useQuery } from '@tanstack/react-query'
import { rpcQueue, rpcDetail, rpcAnalytics } from './rpc'
import { mapQueueRow, mapDetailRow, mapAnalyticsRow } from './mappers'
import type { ActiveFilters, ModePreset } from '@core/types/ui'
import type { RpcQueueParams, RpcAnalyticsParams } from '@core/types/rpc'

// ─── Filter value mappers ───────────────────────────────────────────────────
// Backend expects Russian labels, not English codes

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

// contactType UI value → p_has_contact + p_contact_path_status_v2
function mapContactType(v: string | null | undefined): {
  p_has_contact: boolean | null
  p_contact_path_status_v2: string | null
} {
  if (v === 'direct') return { p_has_contact: true,  p_contact_path_status_v2: null }
  if (v === 'path')   return { p_has_contact: null,   p_contact_path_status_v2: 'indirect_contact_path_found' }
  if (v === 'none')   return { p_has_contact: false,  p_contact_path_status_v2: null }
  return              { p_has_contact: null,  p_contact_path_status_v2: null }
}

// ─── Hooks ──────────────────────────────────────────────────────────────────

export function useQueueQuery(
  bucket: 'action_queue' | 'review_queue' | 'confirmed_leads',
  filters: ActiveFilters,
  mode: ModePreset | null,
) {
  const contact = mapContactType(filters.contactType)

  const params: RpcQueueParams = {
    p_bucket:             bucket,
    p_region:             filters.region ?? mode?.params.region ?? null,
    p_market_role:        filters.marketRole ?? null,
    p_heat_label_ru:      mapHeat(filters.heat ?? mode?.params.heat),
    p_freshness_label_ru: mapFreshness(filters.freshness ?? mode?.params.freshness),
    p_has_contact:        contact.p_has_contact,
    p_contact_path_status_v2: contact.p_contact_path_status_v2,
    p_limit:              filters.limit || mode?.params.limit || 10,
    p_offset:             0,
    // p_tier intentionally not sent — not in RPC signature
  }

  return useQuery({
    queryKey: ['queue', bucket, params],
    queryFn: async () => {
      const rows = await rpcQueue(params)
      return rows.map(mapQueueRow)
    },
    staleTime: 2 * 60 * 1000,
    retry: 2,
  })
}

export function useDetailQuery(candidateId: string | null) {
  return useQuery({
    queryKey: ['detail', candidateId],
    queryFn: async () => {
      if (!candidateId) return null
      const row = await rpcDetail({
        p_candidate_id: candidateId,
        p_lead_id: null,   // not available from URL — pass null per signature
      })
      if (!row) return null
      return mapDetailRow(row)
    },
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAnalyticsQuery(filters: ActiveFilters, mode: ModePreset | null) {
  const contact = mapContactType(filters.contactType)

  const params: RpcAnalyticsParams = {
    p_region:             filters.region ?? mode?.params.region ?? null,
    p_bucket:             filters.bucket ?? null,
    p_market_role:        filters.marketRole ?? null,
    p_heat_label_ru:      mapHeat(filters.heat ?? mode?.params.heat),
    p_freshness_label_ru: mapFreshness(filters.freshness ?? mode?.params.freshness),
    p_has_contact:        contact.p_has_contact,
    p_contact_path_status_v2: contact.p_contact_path_status_v2,
    // p_limit, p_offset, p_tier intentionally omitted — not in RPC signature
  }

  return useQuery({
    queryKey: ['analytics', params],
    queryFn: async () => {
      const row = await rpcAnalytics(params)
      if (!row) return null
      return mapAnalyticsRow(row)
    },
    staleTime: 3 * 60 * 1000,
    retry: 2,
  })
}
