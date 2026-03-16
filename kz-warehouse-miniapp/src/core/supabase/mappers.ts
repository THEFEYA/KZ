import type {
  RpcQueueRow, RpcQueueScreenRow,
  RpcDetailRow, RpcAnalyticsRow, RpcBreakdownItem,
  RpcOpenCandidateResult, RpcOverviewScreen,
  RpcPriority, RpcCardReason, RpcExplanation,
} from '@core/types/rpc'
import type {
  Candidate, CandidateDetail, CandidatePriority, CandidateCardReason, CandidateExplanation,
  ContactStatus, HeatLevel, FreshnessLevel, EntityType, QueueBucket, Evidence, SourceLink,
} from '@core/types/candidate'
import type { AnalyticsData, AnalyticsSummary, BreakdownItem, PriorityPreview, OverviewScreenData } from '@core/types/analytics'
import { labelContactStatus, labelHeat, labelFreshness, labelMarketRole, labelQueueBucket } from '@core/utils/labels'

// ─── RU-label → domain enum mappers ─────────────────────────────────────────

function mapContactStatusRu(raw: string | null | undefined): ContactStatus {
  if (!raw) return 'none'
  const r = raw.toLowerCase()
  if (r.includes('прямой')) return 'direct'
  if (r.includes('путь') || r.includes('есть')) return 'path'
  return 'none'
}

function mapHeatRu(raw: string | null | undefined): HeatLevel {
  if (raw === 'Горячий') return 'hot'
  if (raw === 'Тёплый') return 'warm'
  return 'cold'
}

function mapFreshnessRu(raw: string | null | undefined): FreshnessLevel {
  if (raw === 'Свежий') return 'fresh'
  if (raw === 'Актуальный') return 'actual'
  return 'stale'
}

function mapEntityTypeRu(raw: string | null | undefined): EntityType {
  return raw === 'объект' ? 'object' : 'company'
}

function mapBucketRu(raw: string | null | undefined): QueueBucket {
  if (!raw) return 'action_queue'
  const r = raw.toLowerCase()
  if (r.includes('проверк')) return 'review_queue'
  if (r.includes('подтверждённ') || r.includes('лид')) return 'confirmed_leads'
  return 'action_queue'
}

// ─── Priority/CardReason/Explanation mappers ─────────────────────────────────

function mapPriority(raw: RpcPriority | null | undefined): CandidatePriority | null {
  if (!raw) return null
  return {
    priorityScore:     raw.priority_score     ?? null,
    priorityBandRu:    raw.priority_band_ru   ?? null,
    openFirstReasonRu: raw.open_first_reason_ru ?? null,
    priorityLabelRu:   raw.priority_label_ru  ?? null,
  }
}

function mapCardReason(raw: RpcCardReason | null | undefined): CandidateCardReason | null {
  if (!raw) return null
  if (!raw.reason_short_ru && !raw.next_step_ru) return null
  return {
    reasonShortRu: raw.reason_short_ru ?? null,
    nextStepRu:    raw.next_step_ru    ?? null,
  }
}

function mapExplanation(raw: RpcExplanation | null | undefined): CandidateExplanation | null {
  if (!raw) return null
  if (!raw.title_ru && !raw.summary_ru && !raw.bullets_ru?.length) return null
  return {
    titleRu:        raw.title_ru        ?? null,
    summaryRu:      raw.summary_ru      ?? null,
    bulletsRu:      raw.bullets_ru      ?? null,
    priorityLabelRu:raw.priority_label_ru ?? null,
    operatorHintRu: raw.operator_hint_ru ?? null,
  }
}

// ─── Chart item normalizer ───────────────────────────────────────────────────

function normChartItem(i: RpcBreakdownItem): BreakdownItem {
  return {
    label: i.label,
    count: i.value ?? i.count ?? 0,
    pct:   i.pct,
  }
}

const safeArr = (v: unknown): RpcBreakdownItem[] =>
  Array.isArray(v) ? (v as RpcBreakdownItem[]) : []

// RPC may return main_insight/top_insight as a rich object {body,title,...} or a plain string
const toInsightStr = (v: unknown): string | null => {
  if (!v) return null
  if (typeof v === 'string') return v
  if (typeof v === 'object') {
    const o = v as Record<string, unknown>
    return (o.body ?? o.title ?? null) as string | null
  }
  return null
}

// ─── Queue row mapper ────────────────────────────────────────────────────────
// Handles both RpcQueueRow (v2) and RpcQueueScreenRow (v1 screen — has priority/card_reason)

export function mapQueueRow(row: RpcQueueRow | RpcQueueScreenRow): Candidate {
  const screenRow = row as RpcQueueScreenRow
  const r = row as unknown as Record<string, unknown>
  const h = (r.header ?? {}) as Record<string, unknown>
  const resolvedId = (r.candidate_id ?? h.candidate_id) as string | undefined
  if (!resolvedId) {
    console.warn('[mapQueueRow] candidate_id missing. Row keys:', Object.keys(r), '| header keys:', Object.keys(h))
  }
  return {
    id:                   resolvedId as string,
    displayEntity:        (r.display_label_v2 ?? h.display_label_v2) as string,
    entityType:           mapEntityTypeRu(row.entity_type_ru),
    marketRole:           row.market_role_label_ru ?? '',
    normalizedSignalType: row.signal_type ?? '',
    objectAnchor:         row.object_anchor_label_v2 ?? null,
    region:               row.region ?? null,
    sourceLabel:          row.source_name ?? null,
    sourceUrl:            row.source_url ?? null,
    sourceTierRu:         row.source_tier_ru ?? null,
    evidenceCount:        row.evidence_count ?? 0,
    priorityRank:         row.rank_total_v2 ?? 0,
    contactStatus:        mapContactStatusRu(row.contact_path_label_ru_v2),
    heatLevel:            mapHeatRu(row.heat_label_ru),
    freshnessLevel:       mapFreshnessRu(row.freshness_label_ru),
    queueBucket:          mapBucketRu(row.actionable_bucket_ru),
    demandHint:           row.demand_hint ?? null,
    qualityScore:         row.quality_score ?? null,
    priority:             mapPriority(screenRow.priority),
    cardReason:           mapCardReason(screenRow.card_reason),
  }
}

// ─── Detail row mapper ───────────────────────────────────────────────────────

export function mapDetailRow(row: RpcDetailRow): CandidateDetail {
  const evidenceItems: Evidence[] = (() => {
    if (row.evidence && Array.isArray(row.evidence.items)) {
      return row.evidence.items.map(ev => ({
        type:   ev.type,
        text:   ev.text,
        date:   ev.date   ?? null,
        source: ev.source ?? null,
        url:    ev.url    ?? null,
      }))
    }
    return []
  })()

  const rawLinks: SourceLink[] = Array.isArray(row.source_links) ? row.source_links : []
  const extraLinks: SourceLink[] = [
    ...(row.proof_url       ? [{ label: 'Доказательство', url: row.proof_url }]       : []),
    ...(row.company_website ? [{ label: 'Сайт компании',  url: row.company_website }] : []),
  ]
  const sourceLinks = [...rawLinks, ...extraLinks]

  return {
    id:                   row.candidate_id,
    displayEntity:        row.display_label_v2,
    entityType:           mapEntityTypeRu(row.entity_type_ru),
    marketRole:           row.market_role_label_ru ?? '',
    normalizedSignalType: row.signal_type ?? '',
    objectAnchor:         row.object_anchor_label_v2 ?? null,
    region:               row.region ?? null,
    sourceLabel:          row.source_name ?? null,
    sourceUrl:            row.source_url ?? null,
    sourceTierRu:         row.source_tier_ru ?? null,
    evidenceCount:        row.evidence_count ?? evidenceItems.length,
    priorityRank:         row.rank_total_v2 ?? 0,
    contactStatus: row.has_direct_contact
      ? 'direct'
      : row.has_indirect_path
        ? 'path'
        : mapContactStatusRu(row.contact_path_label_ru_v2),
    heatLevel:            mapHeatRu(row.heat_label_ru),
    freshnessLevel:       mapFreshnessRu(row.freshness_label_ru),
    queueBucket:          mapBucketRu(row.actionable_bucket_ru),
    demandHint:           row.demand_hint ?? null,
    demandHintV2:         row.demand_hint_v2 ?? null,
    qualityScore:         row.score_total ?? row.quality_score ?? null,
    contacts:             row.contacts?.map(c => ({ ...c, whatsapp: c.whatsapp ?? null })) ?? null,
    contactPath:          (row.contact_path ?? []).map(p => ({
      step:        p.step,
      description: p.description,
      entity:      p.entity ?? null,
    })),
    evidences:     evidenceItems.length > 0 ? evidenceItems : null,
    sourceLinks:   sourceLinks.length > 0 ? sourceLinks : null,
    leadProfileUrl:   row.lead_profile_url   ?? null,
    leadStatusRu:     row.lead_status_ru     ?? null,
    leadScore:        row.lead_score         ?? null,
    relevanceLabelRu: row.relevance_label_ru ?? null,
    evidenceShort:    row.evidence_short     ?? null,
    evidenceFull:     row.evidence_full      ?? null,
    duplicateCount:   row.duplicate_count    ?? null,
    // No priority/explanation from plain detail — those come from open_candidate_v1
    priority:    null,
    cardReason:  null,
    explanation: null,
  }
}

// ─── Open candidate result mapper ─────────────────────────────────────────────
// Handles RpcOpenCandidateResult — wraps detail with priority + explanation

export function mapOpenCandidateResult(raw: RpcOpenCandidateResult): CandidateDetail {
  // Extract priority and explanation first
  const priority    = mapPriority(raw.priority)
  const explanation = mapExplanation(raw.explanation)

  // Now normalise the detail payload — may be flat or nested
  let detailRow: RpcDetailRow | null = null

  if (raw.candidate_id && raw.display_label_v2) {
    // Flat shape — all detail fields at top level
    detailRow = raw as unknown as RpcDetailRow
  } else if (raw.header || raw.signal || raw.quality || raw.contact) {
    // Nested shape — same as rpcDetail nested normalisation
    const h  = (raw.header      ?? {}) as Record<string, unknown>
    const s  = (raw.signal      ?? {}) as Record<string, unknown>
    const q  = (raw.quality     ?? {}) as Record<string, unknown>
    const c  = (raw.contact     ?? {}) as Record<string, unknown>
    const ev = (raw.evidence    ?? {}) as Record<string, unknown>
    const al = (raw.active_lead ?? {}) as Record<string, unknown>
    const dd = (raw.dedupe      ?? {}) as Record<string, unknown>
    const dupArr = Array.isArray(dd.related_duplicates) ? dd.related_duplicates as unknown[] : null

    detailRow = {
      // candidate_id may be at the top level of the detail object (not inside header)
      candidate_id:             (h.candidate_id  ?? raw.candidate_id ?? '') as string,
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
      lead_profile_url:         (c.lead_profile_url ?? null) as string | null,
      evidence_count: (ev.evidence_count != null
        ? ev.evidence_count
        : Array.isArray(ev.items) ? (ev.items as unknown[]).length : 0) as number,
      evidence:     raw.evidence as { items: import('@core/types/rpc').RpcEvidence[] } | null,
      contacts:     (raw.contacts     ?? null) as import('@core/types/rpc').RpcContact[] | null,
      contact_path: (raw.contact_path ?? null) as import('@core/types/rpc').RpcContactPath[] | null,
      source_links: (raw.source_links ?? null) as import('@core/types/rpc').RpcSourceLink[] | null,
      region:       (h.region      ?? null) as string | null,
      source_name:  (h.source_name  ?? null) as string | null,
      source_url:   (h.source_url   ?? null) as string | null,
      demand_hint:  (h.demand_hint  ?? s.demand_hint  ?? null) as string | null,
      demand_hint_v2: (s.demand_hint_v2 ?? null) as string | null,
      quality_score:(q.quality_score ?? null) as number | null,
      lead_status_ru:     (al.lead_status_ru ?? null) as string | null,
      lead_score:         (al.score_total    ?? null) as number | null,
      relevance_label_ru: (q.relevance_label_ru ?? null) as string | null,
      source_tier_ru:     (h.source_tier_ru  ?? null) as string | null,
      evidence_short:     (ev.evidence_short  ?? null) as string | null,
      evidence_full:      (ev.evidence_full   ?? null) as string | null,
      duplicate_count:    dupArr != null ? dupArr.length : (typeof dd.count === 'number' ? dd.count : null),
    }
  }

  if (!detailRow) {
    // Fallback: treat entire raw as detail row
    detailRow = raw as unknown as RpcDetailRow
  }

  const base = mapDetailRow(detailRow)
  return { ...base, priority, explanation }
}

// ─── Analytics row mapper ────────────────────────────────────────────────────
// Handles both kz_miniapp_analytics_v2 and kz_miniapp_analytics_screen_v1 shapes

export function mapAnalyticsRow(row: RpcAnalyticsRow): AnalyticsData {
  const s = row.summary ?? {}
  const c = row.charts  ?? {}

  const directContact  = s.direct_contact         ?? 0
  const contactPath    = s.indirect_contact_path  ?? s.contact_path ?? 0
  const noContact      = s.without_contact        ?? s.no_contact   ?? 0
  const withContact    = s.with_contact           ?? (directContact + contactPath)

  const summary: AnalyticsSummary = {
    total:          s.total                 ?? 0,
    actionQueue:    s.buyers                ?? s.action_queue       ?? 0,
    reviewQueue:    s.potential_buyers      ?? s.review_queue       ?? 0,
    confirmedLeads: s.confirmed_leads       ?? 0,
    directContact,
    contactPath,
    noContact,
    withContact,
    avgPriority:    s.avg_priority          ?? 0,
    avgRank:        s.avg_rank              ?? 0,
    avgScore:       s.avg_score             ?? 0,
    openFirst:      s.open_first            ?? 0,
    priorityCount:  s.priority              ?? 0,
  }

  const bySource      = safeArr(c.by_source).map(normChartItem)
  const byContactType = safeArr(c.by_contact ?? c.by_contact_type).map(i => ({
    ...normChartItem(i), label: labelContactStatus(i.label),
  }))
  const byMarketRole  = safeArr(c.by_role ?? c.by_market_role).map(i => ({
    ...normChartItem(i), label: labelMarketRole(i.label),
  }))
  const byQueue       = safeArr(c.by_queue).map(i => ({
    ...normChartItem(i), label: labelQueueBucket(i.label),
  }))
  const byHeat        = safeArr(c.by_heat).map(i => ({
    ...normChartItem(i), label: labelHeat(i.label),
  }))
  const byFreshness   = safeArr(c.by_freshness).map(i => ({
    ...normChartItem(i), label: labelFreshness(i.label),
  }))
  const bySourceTier  = safeArr(c.by_source_tier).map(normChartItem)

  // Priority preview — from analytics_screen_v1 if available
  let priorityPreview: import('@core/types/analytics').PriorityPreview | null = null
  if (row.priority_preview) {
    const pp = row.priority_preview
    priorityPreview = {
      openFirst:     pp.open_first ?? 0,
      priorityCount: pp.priority   ?? 0,
      reviewCount:   pp.review     ?? 0,
      topCandidate: (pp.top_candidate && pp.top_candidate.candidate_id) ? {
        id:               pp.top_candidate.candidate_id,
        displayLabel:     pp.top_candidate.display_label_v2,
        signalType:       pp.top_candidate.signal_type        ?? null,
        objectAnchor:     pp.top_candidate.object_anchor_label_v2 ?? null,
        priorityBandRu:   pp.top_candidate.priority?.priority_band_ru    ?? null,
        openFirstReasonRu:pp.top_candidate.priority?.open_first_reason_ru ?? null,
      } : null,
    }
  }

  return {
    summary,
    bySource,
    byContactType,
    byMarketRole,
    byQueue,
    byHeat,
    byFreshness,
    bySourceTier,
    topInsight: toInsightStr(row.top_insight),
    priorityPreview,
  }
}

// ─── Overview screen mapper ───────────────────────────────────────────────────

export function mapOverviewScreen(
  screen: RpcOverviewScreen | null,
  analyticsData: AnalyticsData | null,
): OverviewScreenData {
  if (screen?.ok && (screen.summary_strip || screen.priority_preview)) {
    const ss = screen.summary_strip
    const pp = screen.priority_preview

    const summary: AnalyticsSummary | null = ss ? {
      total:          ss.total            ?? 0,
      actionQueue:    ss.action_queue     ?? 0,
      reviewQueue:    ss.review_queue     ?? 0,
      confirmedLeads: ss.confirmed_leads  ?? (ss as unknown as Record<string, unknown>).confirmed as number ?? 0,
      directContact:  ss.direct_contact   ?? 0,
      contactPath:    ss.contact_path     ?? 0,
      noContact:      ss.without_contact  ?? 0,
      withContact:    ss.with_contact     ?? 0,
      avgPriority:    0,
      avgRank:        ss.avg_rank         ?? 0,
      avgScore:       ss.avg_score        ?? 0,
      openFirst:      ss.open_first       ?? 0,
      priorityCount:  ss.priority         ?? 0,
    } : analyticsData?.summary ?? null

    const priorityPreview: PriorityPreview | null = pp ? {
      openFirst:     pp.open_first ?? 0,
      priorityCount: pp.priority   ?? 0,
      reviewCount:   pp.review     ?? 0,
      topCandidate: (pp.top_candidate && pp.top_candidate.candidate_id) ? {
        id:               pp.top_candidate.candidate_id,
        displayLabel:     pp.top_candidate.display_label_v2,
        signalType:       pp.top_candidate.signal_type ?? null,
        objectAnchor:     pp.top_candidate.object_anchor_label_v2 ?? null,
        priorityBandRu:   pp.top_candidate.priority?.priority_band_ru    ?? null,
        openFirstReasonRu:pp.top_candidate.priority?.open_first_reason_ru ?? null,
      } : null,
    } : analyticsData?.priorityPreview ?? null

    const analyticsPreview = screen.analytics_preview ? {
      bySource:   safeArr(screen.analytics_preview.by_source).map(normChartItem),
      byHeat:     safeArr(screen.analytics_preview.by_heat).map(normChartItem),
    } : (analyticsData ? {
      bySource: analyticsData.bySource,
      byHeat:   analyticsData.byHeat,
    } : null)

    return {
      activeModeLabel: screen.active_mode_label_ru ?? null,
      summary,
      priorityPreview,
      mainInsight:     toInsightStr(screen.main_insight) ?? analyticsData?.topInsight ?? null,
      analyticsPreview,
    }
  }

  // Fallback: derive from analytics data
  return {
    activeModeLabel: null,
    summary:         analyticsData?.summary ?? null,
    priorityPreview: analyticsData?.priorityPreview ?? null,
    mainInsight:     analyticsData?.topInsight ?? null,
    analyticsPreview: analyticsData ? {
      bySource: analyticsData.bySource,
      byHeat:   analyticsData.byHeat,
    } : null,
  }
}
