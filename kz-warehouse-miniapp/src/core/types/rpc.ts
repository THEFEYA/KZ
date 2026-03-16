// Raw RPC types — aligned to real Supabase function signatures
// Field names reflect actual backend v2/v1 screen contract response shapes

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
  // Source tier enrichment
  source_tier_ru: string | null
}

// ─── kz_miniapp_queue_screen_v1 (new live screen contract) ──────────────────
// Extends queue rows with priority + card_reason layers.
// Falls back gracefully if these fields are absent.
export interface RpcPriority {
  priority_score: number | null
  priority_band_ru: string | null
  open_first_reason_ru: string | null
  priority_label_ru?: string | null
}

export interface RpcCardReason {
  reason_short_ru: string | null
  next_step_ru: string | null
}

export interface RpcQueueScreenRow extends RpcQueueRow {
  priority: RpcPriority | null
  card_reason: RpcCardReason | null
}

export interface RpcQueueScreenEnvelope {
  ok: boolean
  items: RpcQueueScreenRow[]
  total: number
  bucket: string
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
  lead_profile_url: string | null
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
  demand_hint_v2: string | null
  quality_score: number | null         // fallback alias
  // Enriched fields — from nested active_lead / quality / header / evidence / dedupe sections
  lead_status_ru: string | null
  lead_score: number | null
  relevance_label_ru: string | null
  source_tier_ru: string | null
  evidence_short: string | null
  evidence_full: string | null
  duplicate_count: number | null
}

export interface RpcContact {
  name: string | null
  role: string | null
  phone: string | null
  email: string | null
  telegram: string | null
  whatsapp: string | null
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

// ─── kz_miniapp_open_candidate_v1 ────────────────────────────────────────────
// Wraps record_detail_v1 with priority + explanation layers.
// Returns: { ok, priority, explanation, ...detail_fields }
export interface RpcExplanation {
  title_ru: string | null
  summary_ru: string | null
  bullets_ru: string[] | null
  priority_label_ru: string | null
  operator_hint_ru: string | null
}

export interface RpcOpenCandidateResult {
  ok: boolean
  priority: RpcPriority | null
  explanation: RpcExplanation | null
  // Detail fields — may be nested or flat (same normalisation as record_detail_v1)
  candidate_id?: string
  display_label_v2?: string
  // Nested sections (same as record_detail_v1 nested shape)
  header?: Record<string, unknown>
  signal?: Record<string, unknown>
  quality?: Record<string, unknown>
  contact?: Record<string, unknown>
  evidence?: Record<string, unknown>
  active_lead?: Record<string, unknown>
  dedupe?: Record<string, unknown>
  // Flat top-level detail fields (when returned flat)
  entity_type_ru?: string
  market_role_label_ru?: string
  signal_type?: string
  normalized_signal_type_v2?: string | null
  object_anchor_label_v2?: string | null
  heat_label_ru?: string
  freshness_label_ru?: string
  rank_total_v2?: number
  score_total?: number | null
  actionable_bucket_ru?: string
  contact_path_label_ru_v2?: string
  has_direct_contact?: boolean
  has_indirect_path?: boolean
  company_website?: string | null
  proof_url?: string | null
  lead_profile_url?: string | null
  evidence_count?: number
  contacts?: RpcContact[] | null
  contact_path?: RpcContactPath[] | null
  source_links?: RpcSourceLink[] | null
  region?: string | null
  source_name?: string | null
  source_url?: string | null
  demand_hint?: string | null
  demand_hint_v2?: string | null
  quality_score?: number | null
  lead_status_ru?: string | null
  lead_score?: number | null
  relevance_label_ru?: string | null
  source_tier_ru?: string | null
  evidence_short?: string | null
  evidence_full?: string | null
  duplicate_count?: number | null
}

// ─── kz_miniapp_overview_screen_v1 ───────────────────────────────────────────
// Returns workspace-aware overview payload
export interface RpcTopCandidate {
  candidate_id: string
  display_label_v2: string
  signal_type: string | null
  object_anchor_label_v2: string | null
  priority: RpcPriority | null
}

export interface RpcOverviewSummaryStrip {
  total: number
  review_queue: number
  open_first: number
  priority: number
  with_contact: number
  avg_rank: number
  avg_score: number
  action_queue?: number
  confirmed_leads?: number
  direct_contact?: number
  contact_path?: number
  without_contact?: number
}

export interface RpcOverviewPriorityPreview {
  open_first: number
  priority: number
  review: number
  top_candidate: RpcTopCandidate | null
}

export interface RpcOverviewScreen {
  ok: boolean
  active_mode_label_ru: string | null
  summary_strip: RpcOverviewSummaryStrip | null
  priority_preview: RpcOverviewPriorityPreview | null
  main_insight: string | null
  quick_entries: Array<{ label: string; count: number; route?: string }> | null
  analytics_preview: {
    by_source?: RpcBreakdownItem[]
    by_heat?: RpcBreakdownItem[]
  } | null
  available_modes: Array<{ id: string; label: string }> | null
}

// ─── kz_miniapp_analytics_v2 / kz_miniapp_analytics_screen_v1 ───────────────
// v1 screen may return priority_preview + by_source_tier in addition to v2 fields
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
  priority_preview?: RpcOverviewPriorityPreview | null
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
  with_contact?: number     // v1 screen field
  avg_priority?: number
  avg_rank?: number         // v1 screen field
  avg_score?: number        // v1 screen field
  open_first?: number       // v1 screen field
  priority?: number         // v1 screen field — priority band count
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
  by_source_tier?: RpcBreakdownItem[]  // v1 screen field
}

export interface RpcBreakdownItem {
  label: string
  value?: number    // primary field name from backend
  count?: number    // fallback alias
  pct?: number
}

// ─── public.kz_confirmed_leads ───────────────────────────────────────────────
// Separate function for confirmed leads — NOT kz_miniapp_queue_v2
// Returns: { ok, count, items }
export interface RpcConfirmedLeadsEnvelope {
  ok: boolean
  count: number
  items: RpcQueueRow[]  // same row shape as queue items
}
