import { create } from 'zustand'
import { localGet, localSet } from '@core/telegram/storage'
import { MODE_PRESETS } from '@features/modes/modePresets'
import type { ModeId, ModePreset } from '@core/types/ui'

interface ModeState {
  activeModeId: ModeId
  activeMode: ModePreset
  setMode: (id: ModeId) => void
}

const savedId = localGet<ModeId>('mode_id', 'wide-10')
const initialMode = MODE_PRESETS.find(m => m.id === savedId) ?? MODE_PRESETS[0]

export const useModeStore = create<ModeState>((set) => ({
  activeModeId: initialMode.id,
  activeMode: initialMode,

  setMode: (id) => {
    const mode = MODE_PRESETS.find(m => m.id === id)
    if (!mode) return
    localSet('mode_id', id)
    set({ activeModeId: id, activeMode: mode })
  },
}))
