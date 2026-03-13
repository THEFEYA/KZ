// Raw RPC types — aligned to real Supabase function signatures

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

export interface RpcQueueRow {
  candidate_id: string
  display_entity: string
  entity_type: string
  market_role: string
  normalized_signal_type: string
  object_anchor: string | null
  region: string | null
  source_label: string | null
  source_url: string | null
  evidence_count: number
  priority_rank: number
  contact_status: string
  heat_label: string
  freshness_label: string
  queue_bucket: string
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

export interface RpcDetailRow {
  candidate_id: string
  display_entity: string
  entity_type: string
  market_role: string
  normalized_signal_type: string
  object_anchor: string | null
  demand_hint: string | null
  quality_score: number | null
  heat_label: string
  freshness_label: string
  contact_status: string
  contacts: RpcContact[] | null
  contact_path: RpcContactPath[] | null
  evidences: RpcEvidence[] | null
  source_links: RpcSourceLink[] | null
  region: string | null
  source_label: string | null
  source_url: string | null
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
  // queue buckets — real field names from backend
  buyers?: number           // maps to action_queue count
  potential_buyers?: number // maps to review_queue count
  confirmed_leads?: number
  // contact breakdown — real field names
  direct_contact?: number
  indirect_contact_path?: number  // maps to contact_path
  without_contact?: number        // maps to no_contact
  // fallback aliases (in case backend uses these instead)
  action_queue?: number
  review_queue?: number
  contact_path?: number
  no_contact?: number
  avg_priority?: number
}

export interface RpcAnalyticsCharts {
  by_source?: RpcBreakdownItem[]
  by_contact?: RpcBreakdownItem[]      // contact type breakdown
  by_role?: RpcBreakdownItem[]         // market role breakdown
  by_queue?: RpcBreakdownItem[]
  by_heat?: RpcBreakdownItem[]
  by_freshness?: RpcBreakdownItem[]
  // fallback flat aliases
  by_contact_type?: RpcBreakdownItem[]
  by_market_role?: RpcBreakdownItem[]
}

export interface RpcBreakdownItem {
  label: string
  count: number
  pct?: number
}
