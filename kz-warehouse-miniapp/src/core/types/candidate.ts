// Normalized domain types used in UI

export type ContactStatus = 'direct' | 'path' | 'none'
export type HeatLevel = 'hot' | 'warm' | 'cold'
export type FreshnessLevel = 'fresh' | 'actual' | 'stale'
export type EntityType = 'company' | 'object'
export type QueueBucket = 'action_queue' | 'review_queue' | 'confirmed_leads'

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
  evidenceCount: number
  priorityRank: number
  contactStatus: ContactStatus
  heatLevel: HeatLevel
  freshnessLevel: FreshnessLevel
  queueBucket: QueueBucket
  demandHint: string | null
  qualityScore: number | null
}

export interface CandidateDetail extends Candidate {
  contacts: ContactInfo[] | null
  contactPath: ContactPathStep[] | null
  evidences: Evidence[] | null
  sourceLinks: SourceLink[] | null
  // Enriched fields from richer backend response sections
  leadStatusRu: string | null
  leadScore: number | null
  relevanceLabelRu: string | null
  sourceTierRu: string | null
  evidenceShort: string | null
  evidenceFull: string | null
  duplicateCount: number | null
}

export interface ContactInfo {
  name: string | null
  role: string | null
  phone: string | null
  email: string | null
  telegram: string | null
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
