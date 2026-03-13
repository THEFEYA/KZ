import { useNavigate, useLocation } from 'react-router-dom'
import { ROUTES } from '@core/config/routes'
import { hapticSelect } from '@core/telegram/haptics'

interface NavItem {
  path: string
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { path: ROUTES.OVERVIEW, label: 'Обзор',     icon: '◈' },
  { path: ROUTES.QUEUES,   label: 'Очереди',   icon: '⊞' },
  { path: ROUTES.ANALYTICS,label: 'Аналитика', icon: '⊿' },
  { path: ROUTES.SETTINGS, label: 'Настройки', icon: '⊙' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNav = (path: string) => {
    if (location.pathname === path) return
    hapticSelect()
    navigate(path)
  }

  const isActive = (path: string) => {
    if (path === ROUTES.OVERVIEW) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(var(--bottom-nav-height) + var(--safe-bottom))',
        paddingBottom: 'var(--safe-bottom)',
        background: 'var(--color-bg-raised)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path)
        return (
          <button
            key={item.path}
            onClick={() => handleNav(item.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              height: '100%',
              cursor: 'pointer',
              color: active ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              transition: 'color var(--transition-fast)',
              border: 'none',
              background: 'none',
            }}
          >
            <span
              style={{
                fontSize: 20,
                lineHeight: 1,
                filter: active ? 'drop-shadow(0 0 6px var(--color-accent-glow))' : 'none',
                transition: 'filter var(--transition-base)',
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                lineHeight: 1,
              }}
            >
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
