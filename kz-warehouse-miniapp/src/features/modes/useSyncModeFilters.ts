import { useEffect } from 'react'
import { useActiveMode } from '@core/state/selectors'
import { useFilterStore } from '@core/state/useFilterStore'
import type { ActiveFilters } from '@core/types/ui'

/**
 * Syncs filter store with the active mode preset on app mount.
 * Prevents stale persisted filters from overriding the current mode.
 * Mode changes during the session are already handled by useApplyMode.
 */
export function useSyncModeFilters() {
  const activeMode = useActiveMode()
  const setFilters = useFilterStore((s) => s.setFilters)

  useEffect(() => {
    const nextFilters: ActiveFilters = {
      region: null,
      marketRole: null,
      heat: null,
      freshness: null,
      contactType: null,
      bucket: null,
      limit: 10,
    }
    if (activeMode.params.region !== undefined) nextFilters.region = activeMode.params.region
    if (activeMode.params.limit !== undefined) nextFilters.limit = activeMode.params.limit
    if (activeMode.params.heat !== undefined) nextFilters.heat = activeMode.params.heat
    if (activeMode.params.freshness !== undefined) nextFilters.freshness = activeMode.params.freshness
    if (activeMode.params.bucket !== undefined) nextFilters.bucket = activeMode.params.bucket
    setFilters(nextFilters)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // mount only — activeMode is stable at boot, changes handled by useApplyMode
}
