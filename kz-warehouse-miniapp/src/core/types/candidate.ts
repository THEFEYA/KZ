// Normalized domain types used in UI

export type ContactStatus = 'direct' | 'path' | 'none'
export type HeatLevel = 'hot' | 'warm' | 'cold'
export type FreshnessLevel = 'fresh' | 'actual' | 'stale'
export type EntityType = 'company' | 'object'
export type QueueBucket = 'action_queue' | 'review_queue' | 'confirmed_leads'

// Priority layer — from kz_miniapp_priority_v1 / queue_screen_v1 / open_candidate_v1
export interface CandidatePriority {
  priorityScore: number | null
  priorityBandRu: string | null
  openFirstReasonRu: string | null
  priorityLabelRu: string | null
}

// Card reason layer — from kz_miniapp_queue_card_reason_v1 / queue_screen_v1
export interface CandidateCardReason {
  reasonShortRu: string | null
  nextStepRu: string | null
}

// Explanation layer — from kz_miniapp_why_this_record_v1 / open_candidate_v1
export interface CandidateExplanation {
  titleRu: string | null
  summaryRu: string | null
  bulletsRu: string[] | null
  priorityLabelRu: string | null
  operatorHintRu: string | null
}

export interface Candidate {
  id: string
  displayEntity: string
  entityType: EntityType
  marketRole: string
  normalizedSignalType: string
  objectAnchor: string | null
  region: string | null
  sourceLabel: string | null
  sourceUrl: string | null
  sourceTierRu: string | null
  evidenceCount: number
  priorityRank: number
  contactStatus: ContactStatus
  heatLevel: HeatLevel
  freshnessLevel: FreshnessLevel
  queueBucket: QueueBucket
  demandHint: string | null
  qualityScore: number | null
  // Live screen contract enrichments
  priority: CandidatePriority | null
  cardReason: CandidateCardReason | null
}

export interface CandidateDetail extends Candidate {
  contacts: ContactInfo[] | null
  contactPath: ContactPathStep[] | null
  evidences: Evidence[] | null
  sourceLinks: SourceLink[] | null
  leadProfileUrl: string | null
  // Enriched fields from richer backend response sections
  leadStatusRu: string | null
  leadScore: number | null
  relevanceLabelRu: string | null
  evidenceShort: string | null
  evidenceFull: string | null
  duplicateCount: number | null
  demandHintV2: string | null
  // Explanation layer from open_candidate_v1
  explanation: CandidateExplanation | null
}

export interface ContactInfo {
  name: string | null
  role: string | null
  phone: string | null
  email: string | null
  telegram: string | null
  whatsapp: string | null
}

export interface ContactPathStep {
  step: number
  description: string
  entity: string | null
}

export interface Evidence {
  type: string
  text: string
  date: string | null
  source: string | null
  url: string | null
}

export interface SourceLink {
  label: string
  url: string
}
