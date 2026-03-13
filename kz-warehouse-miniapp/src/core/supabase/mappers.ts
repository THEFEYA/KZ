import type { RpcQueueRow, RpcDetailRow, RpcAnalyticsRow, RpcBreakdownItem } from '@core/types/rpc'
import type {
  Candidate, CandidateDetail, ContactStatus, HeatLevel,
  FreshnessLevel, EntityType, QueueBucket, Evidence, SourceLink,
} from '@core/types/candidate'
import type { AnalyticsData, BreakdownItem } from '@core/types/analytics'
import { labelContactStatus, labelHeat, labelFreshness, labelMarketRole, labelQueueBucket } from '@core/utils/labels'

// ─── RU-label → domain enum mappers ─────────────────────────────────────────
// Backend v2 fields return Russian labels directly — map to typed domain enums

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

// ─── Chart item normalizer ───────────────────────────────────────────────────
// Backend returns { label, value } — normalize to BreakdownItem.count for downstream

function normChartItem(i: RpcBreakdownItem): BreakdownItem {
  return {
    label: i.label,
    count: i.value ?? i.count ?? 0,
    pct:   i.pct,
  }
}

const safeArr = (v: unknown): RpcBreakdownItem[] =>
  Array.isArray(v) ? (v as RpcBreakdownItem[]) : []

// ─── Queue row mapper ────────────────────────────────────────────────────────

export function mapQueueRow(row: RpcQueueRow): Candidate {
  return {
    id:                   row.candidate_id,
    displayEntity:        row.display_label_v2,
    // entity_type_ru is already Russian ('компания' / 'объект')
    entityType:           mapEntityTypeRu(row.entity_type_ru),
    // market_role_label_ru and signal_type are already Russian — no translation
    marketRole:           row.market_role_label_ru ?? '',
    normalizedSignalType: row.signal_type ?? '',
    objectAnchor:         row.object_anchor_label_v2 ?? null,
    region:               row.region ?? null,
    sourceLabel:          row.source_name ?? null,
    sourceUrl:            row.source_url ?? null,
    evidenceCount:        row.evidence_count ?? 0,
    priorityRank:         row.rank_total_v2 ?? 0,
    contactStatus:        mapContactStatusRu(row.contact_path_label_ru_v2),
    heatLevel:            mapHeatRu(row.heat_label_ru),
    freshnessLevel:       mapFreshnessRu(row.freshness_label_ru),
    queueBucket:          mapBucketRu(row.actionable_bucket_ru),
    demandHint:           row.demand_hint ?? null,
    qualityScore:         row.quality_score ?? null,
  }
}

// ─── Detail row mapper ───────────────────────────────────────────────────────

export function mapDetailRow(row: RpcDetailRow): CandidateDetail {
  // Evidence arrives nested: row.evidence.items
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

  // Merge source_links + proof_url + company_website into one sourceLinks array
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
    evidenceCount:        row.evidence_count ?? evidenceItems.length,
    priorityRank:         row.rank_total_v2 ?? 0,
    // Prefer boolean flags; fall back to label parsing
    contactStatus: row.has_direct_contact
      ? 'direct'
      : row.has_indirect_path
        ? 'path'
        : mapContactStatusRu(row.contact_path_label_ru_v2),
    heatLevel:            mapHeatRu(row.heat_label_ru),
    freshnessLevel:       mapFreshnessRu(row.freshness_label_ru),
    queueBucket:          mapBucketRu(row.actionable_bucket_ru),
    demandHint:           row.demand_hint ?? null,
    // score_total is the authoritative quality field in detail response
    qualityScore:         row.score_total ?? row.quality_score ?? null,
    contacts:             row.contacts ?? null,
    contactPath:          (row.contact_path ?? []).map(p => ({
      step:        p.step,
      description: p.description,
      entity:      p.entity ?? null,
    })),
    evidences:   evidenceItems.length > 0 ? evidenceItems : null,
    sourceLinks: sourceLinks.length > 0 ? sourceLinks : null,
    leadStatusRu:     row.lead_status_ru     ?? null,
    leadScore:        row.lead_score         ?? null,
    relevanceLabelRu: row.relevance_label_ru ?? null,
    sourceTierRu:     row.source_tier_ru     ?? null,
    evidenceShort:    row.evidence_short     ?? null,
    evidenceFull:     row.evidence_full      ?? null,
    duplicateCount:   row.duplicate_count    ?? null,
  }
}

// ─── Analytics row mapper ────────────────────────────────────────────────────

export function mapAnalyticsRow(row: RpcAnalyticsRow): AnalyticsData {
  const s = row.summary ?? {}
  const c = row.charts  ?? {}

  const summary = {
    total:          s.total                 ?? 0,
    actionQueue:    s.buyers                ?? s.action_queue       ?? 0,
    reviewQueue:    s.potential_buyers      ?? s.review_queue       ?? 0,
    confirmedLeads: s.confirmed_leads       ?? 0,
    directContact:  s.direct_contact        ?? 0,
    contactPath:    s.indirect_contact_path ?? s.contact_path       ?? 0,
    noContact:      s.without_contact       ?? s.no_contact         ?? 0,
    avgPriority:    s.avg_priority          ?? 0,
  }

  // All chart arrays normalized through normChartItem to ensure count is populated
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

  return {
    summary,
    bySource,
    byContactType,
    byMarketRole,
    byQueue,
    byHeat,
    byFreshness,
    topInsight: row.top_insight ?? null,
  }
}
