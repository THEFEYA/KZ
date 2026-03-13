// Raw RPC response types — exact contract from Supabase

export interface RpcQueueParams {
  p_bucket?: string        // 'action_queue' | 'review_queue' | 'confirmed_leads'
  p_region?: string        // 'Алматы' | 'Астана' | ...
  p_heat?: string          // 'hot' | 'warm' | 'cold'
  p_freshness?: string     // 'fresh' | 'actual' | 'stale'
  p_role?: string          // buyer/seller role
  p_contact_type?: string  // 'direct' | 'path' | 'none'
  p_limit?: number
  p_tier?: string          // 'tier_1' | 'tier_2' | 'all_active'
}

export interface RpcQueueRow {
  candidate_id: string
  display_entity: string
  entity_type: string        // 'company' | 'object'
  market_role: string        // raw code
  normalized_signal_type: string
  object_anchor: string | null
  region: string | null
  source_label: string | null
  evidence_count: number
  priority_rank: number
  contact_status: string     // 'direct_contact_found' | 'indirect_contact_path_found' | 'no_contact_found'
  heat_label: string         // 'hot' | 'warm' | 'cold' or ru label
  freshness_label: string
  queue_bucket: string
  demand_hint: string | null
  quality_score: number | null
}

export interface RpcDetailParams {
  p_candidate_id: string
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

export interface RpcAnalyticsParams {
  p_region?: string
  p_tier?: string
  p_heat?: string
  p_freshness?: string
  p_limit?: number
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
