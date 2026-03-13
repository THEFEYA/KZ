import { create } from 'zustand'
import { localGet, localSet } from '@core/telegram/storage'
import type { ActiveFilters } from '@core/types/ui'

const DEFAULT_FILTERS: ActiveFilters = {
  region: null,
  marketRole: null,
  heat: null,
  freshness: null,
  contactType: null,
  limit: 10,
  bucket: null,
}

interface FilterState {
  filters: ActiveFilters
  activeCount: number
  setFilter: <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => void
  setFilters: (filters: Partial<ActiveFilters>) => void
  resetFilters: () => void
  resetFilter: (key: keyof ActiveFilters) => void
}

function countActive(f: ActiveFilters): number {
  return (
    (f.region != null ? 1 : 0) +
    (f.marketRole != null ? 1 : 0) +
    (f.heat != null ? 1 : 0) +
    (f.freshness != null ? 1 : 0) +
    (f.contactType != null ? 1 : 0) +
    (f.bucket != null ? 1 : 0) +
    (f.limit !== 10 ? 1 : 0)
  )
}

const saved = localGet<ActiveFilters>('filters', DEFAULT_FILTERS)

export const useFilterStore = create<FilterState>((set) => ({
  filters: { ...DEFAULT_FILTERS, ...saved },
  activeCount: countActive({ ...DEFAULT_FILTERS, ...saved }),

  setFilter: (key, value) =>
    set((s) => {
      const next = { ...s.filters, [key]: value }
      localSet('filters', next)
      return { filters: next, activeCount: countActive(next) }
    }),

  setFilters: (partial) =>
    set((s) => {
      const next = { ...s.filters, ...partial }
      localSet('filters', next)
      return { filters: next, activeCount: countActive(next) }
    }),

  resetFilters: () => {
    localSet('filters', DEFAULT_FILTERS)
    set({ filters: { ...DEFAULT_FILTERS }, activeCount: 0 })
  },

  resetFilter: (key) =>
    set((s) => {
      const next = { ...s.filters, [key]: DEFAULT_FILTERS[key] }
      localSet('filters', next)
      return { filters: next, activeCount: countActive(next) }
    }),
}))
