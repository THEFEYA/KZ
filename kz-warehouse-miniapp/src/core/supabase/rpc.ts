import { supabase } from './client'
import type {
  RpcQueueParams, RpcQueueRow,
  RpcDetailParams, RpcDetailRow,
  RpcAnalyticsParams, RpcAnalyticsRow,
} from '@core/types/rpc'

export async function rpcQueue(params: RpcQueueParams): Promise<RpcQueueRow[]> {
  const { data, error } = await supabase.rpc('kz_miniapp_queue_v2', {
    p_bucket:               params.p_bucket,
    p_region:               params.p_region,
    p_market_role:          params.p_market_role,
    p_heat_label_ru:        params.p_heat_label_ru,
    p_freshness_label_ru:   params.p_freshness_label_ru,
    p_has_contact:          params.p_has_contact,
    p_contact_path_status_v2: params.p_contact_path_status_v2,
    p_limit:                params.p_limit,
    p_offset:               params.p_offset,
  })
  if (error) throw new Error(error.message)
  return (data as RpcQueueRow[]) ?? []
}

export async function rpcDetail(params: RpcDetailParams): Promise<RpcDetailRow | null> {
  const { data, error } = await supabase.rpc('kz_miniapp_record_detail_v1', {
    p_candidate_id: params.p_candidate_id,
    p_lead_id:      params.p_lead_id,
  })
  if (error) throw new Error(error.message)
  const rows = data as RpcDetailRow[]
  return rows?.[0] ?? null
}

export async function rpcAnalytics(params: RpcAnalyticsParams): Promise<RpcAnalyticsRow | null> {
  const { data, error } = await supabase.rpc('kz_miniapp_analytics_v2', {
    p_region:               params.p_region,
    p_bucket:               params.p_bucket,
    p_market_role:          params.p_market_role,
    p_heat_label_ru:        params.p_heat_label_ru,
    p_freshness_label_ru:   params.p_freshness_label_ru,
    p_has_contact:          params.p_has_contact,
    p_contact_path_status_v2: params.p_contact_path_status_v2,
    // p_limit, p_offset, p_tier intentionally omitted — not in RPC signature
  })
  if (error) throw new Error(error.message)
  const rows = data as RpcAnalyticsRow[]
  return rows?.[0] ?? null
}
