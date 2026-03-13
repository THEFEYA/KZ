import { useSetMode, useActiveMode } from '@core/state/selectors'
import { useFilterStore } from '@core/state/useFilterStore'
import { MODE_PRESETS } from './modePresets'
import type { ModeId } from '@core/types/ui'
import { hapticSelect } from '@core/telegram/haptics'

export function useApplyMode() {
  const setMode = useSetMode()
  const currentMode = useActiveMode()
  const setFilters = useFilterStore((s) => s.setFilters)

  const applyMode = (id: ModeId) => {
    hapticSelect()
    const preset = MODE_PRESETS.find(m => m.id === id)
    if (!preset) return
    setMode(id)
    // Apply mode params as filter overrides (but don't clear user filters entirely)
    const overrides: Record<string, unknown> = {}
    if (preset.params.region !== undefined) overrides.region = preset.params.region
    if (preset.params.limit) overrides.limit = preset.params.limit
    if (preset.params.heat) overrides.heat = preset.params.heat
    if (preset.params.freshness) overrides.freshness = preset.params.freshness
    if (preset.params.bucket) overrides.bucket = preset.params.bucket
    setFilters(overrides as Parameters<typeof setFilters>[0])
  }

  return { applyMode, currentMode, presets: MODE_PRESETS }
}
