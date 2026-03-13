// Raw RPC types — aligned to real Supabase function signatures
// Field names reflect actual backend v2 response shape

// ─── kz_miniapp_queue_v2 ────────────────────────────────────────────────────
// Returns envelope: { ok, items, total, bucket }
// NOT a raw array — must read .items
export interface RpcQueueParams {
  p_bucket: string | null
  p_region: string | null
  p_market_role: string | null
  p_heat_label_ru: string | null       // 'Горячий' | 'Тёплый' | 'Холодный'
  p_freshness_label_ru: string | null  // 'Свежий' | 'Актуальный' | 'Устаревший'
  p_has_contact: boolean | null
  p_contact_path_status_v2: string | null
  p_limit: number
  p_offset: number
}

export interface RpcQueueEnvelope {
  ok: boolean
  items: RpcQueueRow[]
  total: number
  bucket: string
}

// Real field names from kz_miniapp_queue_v2 response items
export interface RpcQueueRow {
  candidate_id: string
  display_label_v2: string
  entity_type_ru: string               // e.g. 'компания' | 'объект'
  market_role_label_ru: string         // already Russian, e.g. 'Конечный покупатель'
  signal_type: string                  // already Russian, e.g. 'закупка техники'
  normalized_signal_type_v2: string | null  // internal code
  object_anchor_label_v2: string | null
  region: string | null
  source_name: string | null
  source_url: string | null
  evidence_count: number
  rank_total_v2: number
  heat_label_ru: string                // already Russian, e.g. 'Горячий'
  freshness_label_ru: string           // already Russian, e.g. 'Свежий'
  contact_path_label_ru_v2: string     // already Russian, e.g. 'Есть путь связи'
  actionable_bucket_ru: string         // already Russian, e.g. 'Рабочая очередь'
  demand_hint: string | null
  quality_score: number | null
}

// ─── kz_miniapp_record_detail_v1 ────────────────────────────────────────────
// (p_candidate_id uuid, p_lead_id uuid)
// Returns single object or wrapped { ok, item }
export interface RpcDetailParams {
  p_candidate_id: string
  p_lead_id: string | null
}

// Real field names from kz_miniapp_record_detail_v1 response
export interface RpcDetailRow {
  candidate_id: string
  display_label_v2: string
  entity_type_ru: string
  market_role_label_ru: string
  signal_type: string
  normalized_signal_type_v2: string | null
  object_anchor_label_v2: string | null
  heat_label_ru: string
  freshness_label_ru: string
  rank_total_v2: number
  score_total: number | null
  actionable_bucket_ru: string
  contact_path_label_ru_v2: string
  has_direct_contact: boolean
  has_indirect_path: boolean
  company_website: string | null
  proof_url: string | null
  evidence_count: number
  // Evidence arrives nested: evidence.items
  evidence: { items: RpcEvidence[] } | null
  contacts: RpcContact[] | null
  contact_path: RpcContactPath[] | null
  source_links: RpcSourceLink[] | null
  region: string | null
  source_name: string | null
  source_url: string | null
  demand_hint: string | null
  quality_score: number | null         // fallback alias
}

export interface RpcContact {
  name: string | null
  role: string | null
  phone: string | null
  email: string | null
  telegram: string | null
}

export interface RpcContactPath {
  step: number
  description: string
  entity: string | null
}

export interface RpcEvidence {
  type: string
  text: string
  date: string | null
  source: string | null
  url: string | null
}

export interface RpcSourceLink {
  label: string
  url: string
}

// ─── kz_miniapp_analytics_v2 ────────────────────────────────────────────────
// Returns single object (NOT an array): { ok, summary, charts }
// NOT supported: p_limit, p_offset, p_tier
export interface RpcAnalyticsParams {
  p_region: string | null
  p_bucket: string | null
  p_market_role: string | null
  p_heat_label_ru: string | null
  p_freshness_label_ru: string | null
  p_has_contact: boolean | null
  p_contact_path_status_v2: string | null
}

export interface RpcAnalyticsRow {
  ok: boolean
  summary: RpcAnalyticsSummary
  charts: RpcAnalyticsCharts
  top_insight?: string | null
}

export interface RpcAnalyticsSummary {
  total: number
  buyers?: number           // maps to action_queue count
  potential_buyers?: number // maps to review_queue count
  confirmed_leads?: number
  direct_contact?: number
  indirect_contact_path?: number
  without_contact?: number
  action_queue?: number
  review_queue?: number
  contact_path?: number
  no_contact?: number
  avg_priority?: number
}

export interface RpcAnalyticsCharts {
  by_source?: RpcBreakdownItem[]
  by_contact?: RpcBreakdownItem[]
  by_role?: RpcBreakdownItem[]
  by_queue?: RpcBreakdownItem[]
  by_heat?: RpcBreakdownItem[]
  by_freshness?: RpcBreakdownItem[]
  by_contact_type?: RpcBreakdownItem[]
  by_market_role?: RpcBreakdownItem[]
}

export interface RpcBreakdownItem {
  label: string
  value?: number    // primary field name from backend
  count?: number    // fallback alias
  pct?: number
}
