// Raw RPC types — aligned to real Supabase function signatures

// ─── kz_miniapp_queue_v2 ────────────────────────────────────────────────────
// Overload 1: (p_bucket, p_region, p_market_role, p_heat_label_ru,
//              p_freshness_label_ru, p_has_contact, p_limit, p_offset)
// Overload 2: adds p_contact_path_status_v2
// NOT supported: p_tier, p_role, p_heat, p_freshness, p_contact_type
export interface RpcQueueParams {
  p_bucket: string | null              // 'action_queue' | 'review_queue' | 'confirmed_leads'
  p_region: string | null              // 'Алматы' | 'Астана' | ...
  p_market_role: string | null         // role label
  p_heat_label_ru: string | null       // 'Горячий' | 'Тёплый' | 'Холодный'
  p_freshness_label_ru: string | null  // 'Свежий' | 'Актуальный' | 'Устаревший'
  p_has_contact: boolean | null        // true = direct only, false = no direct, null = any
  p_contact_path_status_v2: string | null
  p_limit: number
  p_offset: number
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
// Overload 1: (p_region, p_bucket, p_market_role, p_heat_label_ru,
//              p_freshness_label_ru, p_has_contact)
// Overload 2: adds p_contact_path_status_v2
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
  summary: RpcAnalyticsSummary
  by_source: RpcBreakdownItem[]
  by_contact_type: RpcBreakdownItem[]
  by_market_role: RpcBreakdownItem[]
  by_queue: RpcBreakdownItem[]
  by_heat: RpcBreakdownItem[]
  by_freshness: RpcBreakdownItem[]
  top_insight: string | null
}

export interface RpcAnalyticsSummary {
  total: number
  action_queue: number
  review_queue: number
  confirmed_leads: number
  direct_contact: number
  contact_path: number
  no_contact: number
  avg_priority: number
}

export interface RpcBreakdownItem {
  label: string
  count: number
  pct?: number
}
