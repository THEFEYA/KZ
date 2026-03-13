import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { MainButtonBridge } from './MainButtonBridge'
import { FilterSheet } from '@features/filters/FilterSheet'
import { useFilterSheetOpen, useCloseFilterSheet } from '@core/state/selectors'
import { useSyncModeFilters } from '@features/modes/useSyncModeFilters'

export function RootLayout() {
  const filterOpen = useFilterSheetOpen()
  const closeFilter = useCloseFilterSheet()
  useSyncModeFilters()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      <TopBar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <BottomNav />
      <MainButtonBridge />
      <FilterSheet open={filterOpen} onClose={closeFilter} />
    </div>
  )
}
