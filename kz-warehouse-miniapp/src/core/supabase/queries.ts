import { useQuery } from '@tanstack/react-query'
import { rpcQueue, rpcDetail, rpcAnalytics } from './rpc'
import { mapQueueRow, mapDetailRow, mapAnalyticsRow } from './mappers'
import type { ActiveFilters } from '@core/types/ui'
import type { ModePreset } from '@core/types/ui'

export function useQueueQuery(
  bucket: 'action_queue' | 'review_queue' | 'confirmed_leads',
  filters: ActiveFilters,
  mode: ModePreset | null,
) {
  const params = {
    p_bucket: bucket,
    p_region: filters.region ?? mode?.params.region ?? undefined,
    p_heat: filters.heat ?? mode?.params.heat ?? undefined,
    p_freshness: filters.freshness ?? mode?.params.freshness ?? undefined,
    p_role: filters.marketRole ?? undefined,
    p_contact_type: filters.contactType ?? undefined,
    p_limit: filters.limit || mode?.params.limit || 10,
    p_tier: mode?.params.tier ?? undefined,
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
      const row = await rpcDetail({ p_candidate_id: candidateId })
      if (!row) return null
      return mapDetailRow(row)
    },
    enabled: !!candidateId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAnalyticsQuery(filters: ActiveFilters, mode: ModePreset | null) {
  const params = {
    p_region: filters.region ?? mode?.params.region ?? undefined,
    p_heat: filters.heat ?? mode?.params.heat ?? undefined,
    p_freshness: filters.freshness ?? mode?.params.freshness ?? undefined,
    p_tier: mode?.params.tier ?? undefined,
    p_limit: filters.limit || mode?.params.limit || undefined,
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
