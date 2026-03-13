import { useFilterStore } from './useFilterStore'
import { useModeStore } from './useModeStore'
import { useUiStore } from './useUiStore'

export const useFilters = () => useFilterStore((s) => s.filters)
export const useActiveFilterCount = () => useFilterStore((s) => s.activeCount)
export const useSetFilter = () => useFilterStore((s) => s.setFilter)
export const useSetFilters = () => useFilterStore((s) => s.setFilters)
export const useResetFilters = () => useFilterStore((s) => s.resetFilters)
export const useResetFilter = () => useFilterStore((s) => s.resetFilter)

export const useActiveMode = () => useModeStore((s) => s.activeMode)
export const useActiveModeId = () => useModeStore((s) => s.activeModeId)
export const useSetMode = () => useModeStore((s) => s.setMode)

export const useThemeId = () => useUiStore((s) => s.themeId)
export const useSetTheme = () => useUiStore((s) => s.setTheme)
export const useFilterSheetOpen = () => useUiStore((s) => s.filterSheetOpen)
export const useOpenFilterSheet = () => useUiStore((s) => s.openFilterSheet)
export const useCloseFilterSheet = () => useUiStore((s) => s.closeFilterSheet)
export const useToggleFilterSheet = () => useUiStore((s) => s.toggleFilterSheet)
