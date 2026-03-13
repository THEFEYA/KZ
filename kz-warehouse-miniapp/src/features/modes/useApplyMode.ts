import { useSetMode, useActiveMode } from '@core/state/selectors'
import { useFilterStore } from '@core/state/useFilterStore'
import { MODE_PRESETS } from './modePresets'
import type { ModeId, ActiveFilters } from '@core/types/ui'
import { hapticSelect } from '@core/telegram/haptics'

export function useApplyMode() {
  const setMode = useSetMode()
  const currentMode = useActiveMode()
  const setFilters = useFilterStore((s) => s.setFilters)

  const applyMode = (id: ModeId) => {
    hapticSelect()
    const preset = MODE_PRESETS.find((m) => m.id === id)
    if (!preset) return
    setMode(id)
    const nextFilters: ActiveFilters = {
      region: null,
      marketRole: null,
      heat: null,
      freshness: null,
      contactType: null,
      bucket: null,
      limit: 10,
    }
    if (preset.params.region !== undefined) nextFilters.region = preset.params.region
    if (preset.params.limit !== undefined) nextFilters.limit = preset.params.limit
    if (preset.params.heat !== undefined) nextFilters.heat = preset.params.heat
    if (preset.params.freshness !== undefined) nextFilters.freshness = preset.params.freshness
    if (preset.params.bucket !== undefined) nextFilters.bucket = preset.params.bucket
    setFilters(nextFilters)
  }

  return { applyMode, currentMode, presets: MODE_PRESETS }
}
