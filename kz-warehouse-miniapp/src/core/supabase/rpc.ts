import { supabase } from './client'
import type {
  RpcQueueParams, RpcQueueRow, RpcQueueEnvelope,
  RpcDetailParams, RpcDetailRow,
  RpcAnalyticsParams, RpcAnalyticsRow,
} from '@core/types/rpc'

export async function rpcQueue(params: RpcQueueParams): Promise<RpcQueueRow[]> {
  const { data, error } = await supabase.rpc('kz_miniapp_queue_v2', {
    p_bucket:                 params.p_bucket,
    p_region:                 params.p_region,
    p_market_role:            params.p_market_role,
    p_heat_label_ru:          params.p_heat_label_ru,
    p_freshness_label_ru:     params.p_freshness_label_ru,
    p_has_contact:            params.p_has_contact,
    p_contact_path_status_v2: params.p_contact_path_status_v2,
    p_limit:                  params.p_limit,
    p_offset:                 params.p_offset,
  })
  if (error) throw new Error(error.message)

  // Backend returns envelope { ok, items, total, bucket } — NOT a raw array
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const env = data as RpcQueueEnvelope
    return Array.isArray(env.items) ? env.items : []
  }
  // Fallback: if backend ever returns plain array
  return Array.isArray(data) ? (data as RpcQueueRow[]) : []
}

export async function rpcDetail(params: RpcDetailParams): Promise<RpcDetailRow | null> {
  const { data, error } = await supabase.rpc('kz_miniapp_record_detail_v1', {
    p_candidate_id: params.p_candidate_id,
    p_lead_id:      params.p_lead_id,
  })
  if (error) throw new Error(error.message)
  if (!data) return null

  // Handle both array and single-object responses defensively
  if (Array.isArray(data)) {
    return (data as RpcDetailRow[])[0] ?? null
  }
  if (typeof data === 'object') {
    // Wrapped: { ok, item } or direct object
    const d = data as Record<string, unknown>
    if (d.item && typeof d.item === 'object') return d.item as RpcDetailRow
    if (d.candidate_id) return data as RpcDetailRow
  }
  return null
}

export async function rpcAnalytics(params: RpcAnalyticsParams): Promise<RpcAnalyticsRow | null> {
  const { data, error } = await supabase.rpc('kz_miniapp_analytics_v2', {
    p_region:                 params.p_region,
    p_bucket:                 params.p_bucket,
    p_market_role:            params.p_market_role,
    p_heat_label_ru:          params.p_heat_label_ru,
    p_freshness_label_ru:     params.p_freshness_label_ru,
    p_has_contact:            params.p_has_contact,
    p_contact_path_status_v2: params.p_contact_path_status_v2,
    // p_limit, p_offset, p_tier intentionally omitted
  })
  if (error) throw new Error(error.message)
  if (!data) return null

  // Backend returns a single object { ok, summary, charts } — NOT an array
  if (Array.isArray(data)) {
    // Fallback: if backend wraps in array
    return (data as RpcAnalyticsRow[])[0] ?? null
  }
  return data as RpcAnalyticsRow
}
