import { useNavigate, useLocation } from 'react-router-dom'
import { IconButton } from '@shared/ui/IconButton'
import { useActiveFilterCount, useToggleFilterSheet, useActiveModeId } from '@core/state/selectors'
import { ROUTES } from '@core/config/routes'
import { MODE_PRESETS } from '@features/modes/modePresets'

const PAGE_TITLES: Record<string, string> = {
  '/': 'KZ Warehouse',
  '/queues': 'Очереди',
  '/analytics': 'Аналитика',
  '/settings': 'Настройки',
}

export function TopBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const filterCount = useActiveFilterCount()
  const toggleFilter = useToggleFilterSheet()
  const modeId = useActiveModeId()

  const isDetail = location.pathname.startsWith('/detail/')
  const title = isDetail ? 'Детали' : (PAGE_TITLES[location.pathname] ?? 'KZ Warehouse')
  const subtitle = isDetail ? null : location.pathname === '/' ? 'Signal-driven leads' : null
  const modeLabel = MODE_PRESETS.find(m => m.id === modeId)?.ruName

  const showBack = isDetail
  const showFilter = ['/', '/queues'].includes(location.pathname)
  const showSettings = location.pathname === '/'

  return (
    <header
      style={{
        height: 'calc(var(--top-bar-height) + var(--safe-top))',
        paddingTop: 'var(--safe-top)',
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 'var(--space-4)',
        paddingRight: 'var(--space-3)',
        gap: 'var(--space-3)',
        flexShrink: 0,
        zIndex: 40,
        position: 'relative',
      }}
    >
      {/* Back button */}
      {showBack && (
        <IconButton label="Назад" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 15L7 10L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </IconButton>
      )}

      {/* Title block */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1
            style={{
              fontSize: location.pathname === '/' ? 'var(--text-lg)' : 'var(--text-md)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-text-primary)',
              truncate: true,
            }}
          >
            {title}
          </h1>
          {location.pathname === '/' && modeLabel && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-medium)',
                color: 'var(--color-accent)',
                background: 'var(--color-accent-dim)',
                border: '1px solid var(--color-accent-glow)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 7px',
                flexShrink: 0,
              }}
            >
              {modeLabel}
            </span>
          )}
        </div>
        {subtitle && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 1 }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        {showFilter && (
          <IconButton
            label="Фильтры"
            onClick={toggleFilter}
            badge={filterCount > 0 ? filterCount : undefined}
            active={filterCount > 0}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M6 9h6M8 13h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </IconButton>
        )}
        {showSettings && (
          <IconButton label="Настройки" onClick={() => navigate(ROUTES.SETTINGS)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 2v2M9 14v2M2 9h2M14 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </IconButton>
        )}
      </div>
    </header>
  )
}
