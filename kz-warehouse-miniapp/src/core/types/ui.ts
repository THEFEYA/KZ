export type ThemeId = 'night-ops' | 'acid-pulse' | 'violet-glass'

export interface Theme {
  id: ThemeId
  ruName: string
  description: string
  previewColors: string[]
}

export type ModeId = 'wide-10' | 'precise-5' | 'almaty-5' | 'astana-5'

export interface ModePreset {
  id: ModeId
  ruName: string
  description: string
  params: {
    bucket?: string
    region?: string | null
    heat?: string
    freshness?: string
    limit: number
    tier?: string
  }
}

export interface ActiveFilters {
  region: string | null
  marketRole: string | null
  heat: string | null
  freshness: string | null
  contactType: string | null
  limit: number
  bucket: string | null
}
