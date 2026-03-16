import { useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { TopBar } from './TopBar'
import { BottomNav } from './BottomNav'
import { MainButtonBridge } from './MainButtonBridge'
import { FilterSheet } from '@features/filters/FilterSheet'
import { useFilterSheetOpen, useCloseFilterSheet } from '@core/state/selectors'
import { useSyncModeFilters } from '@features/modes/useSyncModeFilters'
import { getTelegramCtx } from '@core/runtime/client'
import { isTelegramEnv } from '@core/telegram/init'

// ─── Temporary TG context diagnostic bar ─────────────────────────────────────
function TgContextBar() {
  const ctx = useMemo(() => getTelegramCtx(), [])
  const isTg = isTelegramEnv()
  const hasIds = !!(ctx.telegramUserId && ctx.telegramChatId)
  const color  = hasIds ? '#22c55e' : '#ef4444'
  const label  = isTg ? 'TG' : 'DEBUG'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '3px 12px',
      background: hasIds ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.10)',
      borderBottom: `1px solid ${hasIds ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.3)'}`,
      fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.05em', flexShrink: 0,
    }}>
      <span style={{ color, fontWeight: 700 }}>[{label}]</span>
      <span style={{ color: 'var(--color-text-tertiary)' }}>
        uid=<span style={{ color }}>{ctx.telegramUserId || '(empty!)'}</span>
        {' '}chat=<span style={{ color }}>{ctx.telegramChatId || '(empty!)'}</span>
      </span>
      {!hasIds && (
        <span style={{ color: '#ef4444', fontWeight: 700 }}>
          ← добавь ?tgUserId=XXX&tgChatId=YYY
        </span>
      )}
    </div>
  )
}

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
      <TgContextBar />
      <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <BottomNav />
      <MainButtonBridge />
      <FilterSheet open={filterOpen} onClose={closeFilter} />
    </div>
  )
}
