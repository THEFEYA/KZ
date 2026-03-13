import type { RpcQueueRow, RpcDetailRow, RpcAnalyticsRow } from '@core/types/rpc'
import type { Candidate, CandidateDetail, ContactStatus, HeatLevel, FreshnessLevel, EntityType, QueueBucket } from '@core/types/candidate'
import type { AnalyticsData } from '@core/types/analytics'
import { labelContactStatus, labelHeat, labelFreshness, labelMarketRole, labelSignalType } from '@core/utils/labels'

function mapContactStatus(raw: string): ContactStatus {
  if (raw === 'direct_contact_found') return 'direct'
  if (raw === 'indirect_contact_path_found') return 'path'
  return 'none'
}

function mapHeat(raw: string): HeatLevel {
  if (raw === 'hot' || raw === 'Горячий') return 'hot'
  if (raw === 'warm' || raw === 'Тёплый') return 'warm'
  return 'cold'
}

function mapFreshness(raw: string): FreshnessLevel {
  if (raw === 'fresh' || raw === 'Свежий') return 'fresh'
  if (raw === 'actual' || raw === 'Актуальный') return 'actual'
  return 'stale'
}

function mapEntityType(raw: string): EntityType {
  return raw === 'object' ? 'object' : 'company'
}

function mapBucket(raw: string): QueueBucket {
  if (raw === 'review_queue') return 'review_queue'
  if (raw === 'confirmed_leads') return 'confirmed_leads'
  return 'action_queue'
}

export function mapQueueRow(row: RpcQueueRow): Candidate {
  return {
    id: row.candidate_id,
    displayEntity: row.display_entity,
    entityType: mapEntityType(row.entity_type),
    marketRole: labelMarketRole(row.market_role),
    normalizedSignalType: labelSignalType(row.normalized_signal_type),
    objectAnchor: row.object_anchor,
    region: row.region,
    sourceLabel: row.source_label,
    sourceUrl: row.source_url ?? null,
    evidenceCount: row.evidence_count ?? 0,
    priorityRank: row.priority_rank ?? 0,
    contactStatus: mapContactStatus(row.contact_status),
    heatLevel: mapHeat(row.heat_label),
    freshnessLevel: mapFreshness(row.freshness_label),
    queueBucket: mapBucket(row.queue_bucket),
    demandHint: row.demand_hint,
    qualityScore: row.quality_score,
  }
}

export function mapDetailRow(row: RpcDetailRow): CandidateDetail {
  return {
    id: row.candidate_id,
    displayEntity: row.display_entity,
    entityType: mapEntityType(row.entity_type),
    marketRole: labelMarketRole(row.market_role),
    normalizedSignalType: labelSignalType(row.normalized_signal_type),
    objectAnchor: row.object_anchor,
    region: row.region,
    sourceLabel: row.source_label,
    sourceUrl: row.source_url ?? null,
    evidenceCount: row.evidences?.length ?? 0,
    priorityRank: 0,
    contactStatus: mapContactStatus(row.contact_status),
    heatLevel: mapHeat(row.heat_label),
    freshnessLevel: mapFreshness(row.freshness_label),
    queueBucket: 'action_queue',
    demandHint: row.demand_hint,
    qualityScore: row.quality_score,
    contacts: row.contacts ?? null,
    contactPath: row.contact_path ?? null,
    evidences: row.evidences ?? null,
    sourceLinks: row.source_links ?? null,
  }
}

export function mapAnalyticsRow(row: RpcAnalyticsRow): AnalyticsData {
  const s = row.summary ?? {}
  const c = row.charts ?? {}

  // Summary: handle both real field names (buyers/potential_buyers/indirect_contact_path/without_contact)
  // and fallback aliases (action_queue/review_queue/contact_path/no_contact)
  const summary = {
    total:          s.total             ?? 0,
    actionQueue:    s.buyers            ?? s.action_queue   ?? 0,
    reviewQueue:    s.potential_buyers  ?? s.review_queue   ?? 0,
    confirmedLeads: s.confirmed_leads   ?? 0,
    directContact:  s.direct_contact    ?? 0,
    contactPath:    s.indirect_contact_path ?? s.contact_path ?? 0,
    noContact:      s.without_contact   ?? s.no_contact     ?? 0,
    avgPriority:    s.avg_priority      ?? 0,
  }

  // Charts: handle both nested (charts.by_role) and flat (by_market_role) shapes
  const safeArr = (v: unknown) => Array.isArray(v) ? v : []

  const bySource      = safeArr(c.by_source)
  const byContactType = safeArr(c.by_contact ?? c.by_contact_type).map(i => ({
    ...i, label: labelContactStatus(i.label),
  }))
  const byMarketRole  = safeArr(c.by_role ?? c.by_market_role).map(i => ({
    ...i, label: labelMarketRole(i.label),
  }))
  const byQueue       = safeArr(c.by_queue).map(i => ({
    ...i, label: labelQueueBucket(i.label),
  }))
  const byHeat        = safeArr(c.by_heat).map(i => ({
    ...i, label: labelHeat(i.label),
  }))
  const byFreshness   = safeArr(c.by_freshness).map(i => ({
    ...i, label: labelFreshness(i.label),
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

function labelQueueBucket(raw: string): string {
  if (raw === 'action_queue')    return 'Рабочая очередь'
  if (raw === 'review_queue')    return 'Очередь проверки'
  if (raw === 'confirmed_leads') return 'Подтверждённые'
  return raw
}
