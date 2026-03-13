export interface AnalyticsSummary {
  total: number
  actionQueue: number
  reviewQueue: number
  confirmedLeads: number
  directContact: number
  contactPath: number
  noContact: number
  avgPriority: number
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
  topInsight: string | null
}

export type AnalyticsViewType = 'comparison' | 'structure' | 'trend' | 'contacts'
export type AnalyticsSlice = 'source' | 'contact_type' | 'market_role' | 'queue' | 'heat' | 'freshness'
