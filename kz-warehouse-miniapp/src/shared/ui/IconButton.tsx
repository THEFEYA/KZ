import type { ReactNode } from 'react'

interface IconButtonProps {
  children: ReactNode
  onClick?: () => void
  label: string
  badge?: number | string
  active?: boolean
}

export function IconButton({ children, onClick, label, badge, active }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: 'var(--radius-md)',
        background: active ? 'var(--color-accent-dim)' : 'transparent',
        border: active ? '1px solid var(--color-accent-glow)' : '1px solid transparent',
        color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
        transition: 'background var(--transition-fast), color var(--transition-fast)',
        cursor: 'pointer',
      }}
    >
      {children}
      {badge != null && Number(badge) > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            minWidth: 16,
            height: 16,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--color-accent)',
            color: 'var(--color-bg)',
            fontSize: 10,
            fontWeight: 'var(--fw-bold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
          }}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
