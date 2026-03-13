import { supabase } from './client'
import type {
  RpcQueueParams, RpcQueueRow, RpcQueueEnvelope,
  RpcDetailParams, RpcDetailRow, RpcEvidence, RpcContact, RpcContactPath, RpcSourceLink,
  RpcAnalyticsParams, RpcAnalyticsRow,
  RpcConfirmedLeadsEnvelope,
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

  const raw = (Array.isArray(data) ? data[0] : data) as Record<string, unknown>
  if (!raw) return null

  // Flat response: candidate_id AND flat fields present at top level
  if (raw.candidate_id && raw.display_label_v2) return raw as unknown as RpcDetailRow

  // Wrapped flat: { ok, item: { candidate_id, ... } }
  if (raw.item && typeof raw.item === 'object' && (raw.item as Record<string, unknown>).candidate_id) {
    return raw.item as unknown as RpcDetailRow
  }

  // Nested shape: { ok, header:{...}, signal:{...}, quality:{...}, contact:{...}, evidence:{...}, active_lead:{...}, dedupe:{...} }
  if (raw.header || raw.signal || raw.quality || raw.contact) {
    const h  = (raw.header      ?? {}) as Record<string, unknown>
    const s  = (raw.signal      ?? {}) as Record<string, unknown>
    const q  = (raw.quality     ?? {}) as Record<string, unknown>
    const c  = (raw.contact     ?? {}) as Record<string, unknown>
    const ev = (raw.evidence    ?? {}) as Record<string, unknown>
    const al = (raw.active_lead ?? {}) as Record<string, unknown>
    const dd = (raw.dedupe      ?? {}) as Record<string, unknown>

    const dupArr = Array.isArray(dd.related_duplicates) ? dd.related_duplicates as unknown[] : null

    return {
      candidate_id:             (h.candidate_id  ?? raw.candidate_id  ?? '') as string,
      display_label_v2:         (h.display_label_v2 ?? '') as string,
      entity_type_ru:           (h.entity_type_ru   ?? '') as string,
      market_role_label_ru:     (h.market_role_label_ru ?? '') as string,
      signal_type:              (s.signal_type    ?? '') as string,
      normalized_signal_type_v2:(s.normalized_signal_type_v2 ?? null) as string | null,
      object_anchor_label_v2:   (s.object_anchor_label_v2   ?? null) as string | null,
      heat_label_ru:            (q.heat_label_ru      ?? '') as string,
      freshness_label_ru:       (q.freshness_label_ru ?? '') as string,
      rank_total_v2:            (q.rank_total_v2      ?? 0)  as number,
      score_total:              (q.score_total         ?? null) as number | null,
      actionable_bucket_ru:     (q.actionable_bucket_ru ?? '') as string,
      contact_path_label_ru_v2: (c.contact_path_label_ru_v2 ?? '') as string,
      has_direct_contact:       (c.has_direct_contact  ?? false) as boolean,
      has_indirect_path:        (c.has_indirect_path   ?? false) as boolean,
      company_website:          (c.company_website  ?? null) as string | null,
      proof_url:                (c.proof_url        ?? null) as string | null,
      evidence_count: (
        ev.evidence_count != null
          ? ev.evidence_count
          : Array.isArray(ev.items) ? (ev.items as unknown[]).length : 0
      ) as number,
      evidence:     raw.evidence as { items: RpcEvidence[] } | null,
      contacts:     (raw.contacts     ?? null) as RpcContact[]     | null,
      contact_path: (raw.contact_path ?? null) as RpcContactPath[] | null,
      source_links: (raw.source_links ?? null) as RpcSourceLink[]  | null,
      region:       (h.region      ?? raw.region      ?? null) as string | null,
      source_name:  (h.source_name  ?? raw.source_name  ?? null) as string | null,
      source_url:   (h.source_url   ?? raw.source_url   ?? null) as string | null,
      demand_hint:  (h.demand_hint  ?? raw.demand_hint  ?? null) as string | null,
      quality_score:(q.quality_score ?? raw.quality_score ?? null) as number | null,
      // Enriched fields
      lead_status_ru:     (al.lead_status_ru ?? null) as string | null,
      lead_score:         (al.score_total    ?? null) as number | null,
      relevance_label_ru: (q.relevance_label_ru ?? null) as string | null,
      source_tier_ru:     (h.source_tier_ru  ?? null) as string | null,
      evidence_short:     (ev.evidence_short  ?? null) as string | null,
      evidence_full:      (ev.evidence_full   ?? null) as string | null,
      duplicate_count:    dupArr != null ? dupArr.length : (typeof dd.count === 'number' ? dd.count : null),
    }
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

// ─── public.kz_confirmed_leads ──────────────────────────────────────────────
// Separate function for confirmed leads — NOT kz_miniapp_queue_v2
// Returns envelope: { ok, count, items }

export async function rpcConfirmedLeads(
  limit: number,
): Promise<{ count: number; items: RpcQueueRow[] }> {
  const { data, error } = await supabase.rpc('kz_confirmed_leads', {
    p_limit: limit,
  })
  if (error) throw new Error(error.message)
  if (!data) return { count: 0, items: [] }

  // Handle envelope: { ok, count, items }
  if (typeof data === 'object' && !Array.isArray(data)) {
    const env = data as RpcConfirmedLeadsEnvelope
    return {
      count: env.count ?? 0,
      items: Array.isArray(env.items) ? env.items : [],
    }
  }
  // Fallback: plain array
  if (Array.isArray(data)) {
    return { count: data.length, items: data as RpcQueueRow[] }
  }
  return { count: 0, items: [] }
}

// ─── public.kz_assign_lead_to_manager_by_telegram ───────────────────────────
// Assigns a lead/candidate to a manager via Telegram flow
// Expected params: p_candidate_id uuid, p_telegram_user_id bigint

export async function rpcAssignLeadToManager(
  candidateId: string,
  telegramUserId: number | null,
): Promise<{ ok: boolean; message?: string }> {
  const { data, error } = await supabase.rpc('kz_assign_lead_to_manager_by_telegram', {
    p_candidate_id:    candidateId,
    p_telegram_user_id: telegramUserId ?? 0,
  })
  if (error) throw new Error(error.message)
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    return { ok: d.ok !== false, message: d.message as string | undefined }
  }
  return { ok: true }
}

// ─── public.kz_queue_lead_handoff ───────────────────────────────────────────
// Moves a candidate to the review/handoff queue
// Expected params: p_candidate_id uuid, p_target_queue text

export async function rpcQueueLeadHandoff(
  candidateId: string,
  targetQueue = 'review_queue',
): Promise<{ ok: boolean; message?: string }> {
  const { data, error } = await supabase.rpc('kz_queue_lead_handoff', {
    p_candidate_id: candidateId,
    p_target_queue: targetQueue,
  })
  if (error) throw new Error(error.message)
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    return { ok: d.ok !== false, message: d.message as string | undefined }
  }
  return { ok: true }
}
