// ─── Analytics domain types ──────────────────────────────────────────────────

export interface AnalyticsSummary {
  total: number
  actionQueue: number
  reviewQueue: number
  confirmedLeads: number
  directContact: number
  contactPath: number
  noContact: number
  withContact: number      // directContact + contactPath
  avgPriority: number
  avgRank: number          // from overview_screen / analytics_screen v1
  avgScore: number         // from overview_screen / analytics_screen v1
  openFirst: number        // open_first count from priority layer
  priorityCount: number    // priority band count
}

export interface PriorityPreviewItem {
  id: string
  displayLabel: string
  signalType: string | null
  objectAnchor: string | null
  priorityBandRu: string | null
  openFirstReasonRu: string | null
}

export interface PriorityPreview {
  openFirst: number
  priorityCount: number
  reviewCount: number
  topCandidate: PriorityPreviewItem | null
}

export interface BreakdownItem {
  label: string
  count: number
  pct?: number
}

export interface AnalyticsData {
  summary: AnalyticsSummary
  bySource: BreakdownItem[]
  byContactType: BreakdownItem[]
  byMarketRole: BreakdownItem[]
  byQueue: BreakdownItem[]
  byHeat: BreakdownItem[]
  byFreshness: BreakdownItem[]
  bySourceTier: BreakdownItem[]  // from analytics_screen_v1
  topInsight: string | null
  priorityPreview: PriorityPreview | null
}

export type AnalyticsViewType = 'comparison' | 'structure' | 'trend' | 'contacts'
export type AnalyticsSlice = 'source' | 'contact_type' | 'market_role' | 'queue' | 'heat' | 'freshness' | 'source_tier'

// ─── Overview screen domain type ─────────────────────────────────────────────

export interface OverviewScreenData {
  activeModeLabel: string | null
  summary: AnalyticsSummary | null
  priorityPreview: PriorityPreview | null
  mainInsight: string | null
  analyticsPreview: {
    bySource: BreakdownItem[]
    byHeat: BreakdownItem[]
  } | null
}
