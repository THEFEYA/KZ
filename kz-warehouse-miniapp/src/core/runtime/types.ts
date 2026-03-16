export type RuntimeSource = 'runtime' | 'legacy_fallback'

export interface RuntimeEnvelope<T = unknown> {
  ok: boolean
  action: string
  data: T | null
  error?: string | null
}
