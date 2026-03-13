import { supabase } from './client'
import type { RpcQueueParams, RpcQueueRow, RpcDetailParams, RpcDetailRow, RpcAnalyticsParams, RpcAnalyticsRow } from '@core/types/rpc'

export async function rpcQueue(params: RpcQueueParams): Promise<RpcQueueRow[]> {
  const { data, error } = await supabase.rpc('kz_miniapp_queue_v2', {
    p_bucket: params.p_bucket ?? null,
    p_region: params.p_region ?? null,
    p_heat: params.p_heat ?? null,
    p_freshness: params.p_freshness ?? null,
    p_role: params.p_role ?? null,
    p_contact_type: params.p_contact_type ?? null,
    p_limit: params.p_limit ?? 10,
    p_tier: params.p_tier ?? null,
  })
  if (error) throw new Error(error.message)
  return (data as RpcQueueRow[]) ?? []
}

export async function rpcDetail(params: RpcDetailParams): Promise<RpcDetailRow | null> {
  const { data, error } = await supabase.rpc('kz_miniapp_record_detail_v1', {
    p_candidate_id: params.p_candidate_id,
  })
  if (error) throw new Error(error.message)
  const rows = data as RpcDetailRow[]
  return rows?.[0] ?? null
}

export async function rpcAnalytics(params: RpcAnalyticsParams): Promise<RpcAnalyticsRow | null> {
  const { data, error } = await supabase.rpc('kz_miniapp_analytics_v2', {
    p_region: params.p_region ?? null,
    p_tier: params.p_tier ?? null,
    p_heat: params.p_heat ?? null,
    p_freshness: params.p_freshness ?? null,
    p_limit: params.p_limit ?? null,
  })
  if (error) throw new Error(error.message)
  const rows = data as RpcAnalyticsRow[]
  return rows?.[0] ?? null
}
