import { create } from 'zustand'
import { localGet, localSet } from '@core/telegram/storage'
import type { ThemeId } from '@core/types/ui'

interface UiState {
  themeId: ThemeId
  filterSheetOpen: boolean
  setTheme: (id: ThemeId) => void
  openFilterSheet: () => void
  closeFilterSheet: () => void
  toggleFilterSheet: () => void
}

const savedTheme = localGet<ThemeId>('theme_id', 'night-ops')

export const useUiStore = create<UiState>((set) => ({
  themeId: savedTheme,
  filterSheetOpen: false,

  setTheme: (id) => {
    localSet('theme_id', id)
    set({ themeId: id })
  },

  openFilterSheet: () => set({ filterSheetOpen: true }),
  closeFilterSheet: () => set({ filterSheetOpen: false }),
  toggleFilterSheet: () => set((s) => ({ filterSheetOpen: !s.filterSheetOpen })),
}))
