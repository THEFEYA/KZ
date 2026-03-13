import type { ReactNode } from 'react'

type ChipVariant = 'default' | 'accent' | 'hot' | 'warm' | 'cold' | 'fresh' | 'stale' | 'direct' | 'path' | 'none' | 'confirmed' | 'action' | 'review'

interface ChipProps {
  children: ReactNode
  variant?: ChipVariant
  size?: 'sm' | 'md'
  dot?: boolean
  onRemove?: () => void
}

const VARIANT_STYLES: Record<ChipVariant, { bg: string; color: string; border: string }> = {
  default:   { bg: 'var(--color-bg-elevated)', color: 'var(--color-text-secondary)', border: 'var(--color-border)' },
  accent:    { bg: 'var(--color-accent-dim)',  color: 'var(--color-accent)',          border: 'var(--color-accent-glow)' },
  hot:       { bg: 'rgba(255,68,68,0.1)',      color: 'var(--color-hot)',             border: 'rgba(255,68,68,0.2)' },
  warm:      { bg: 'rgba(245,158,11,0.1)',     color: 'var(--color-warm)',            border: 'rgba(245,158,11,0.2)' },
  cold:      { bg: 'rgba(100,116,139,0.1)',    color: 'var(--color-cold)',            border: 'rgba(100,116,139,0.2)' },
  fresh:     { bg: 'rgba(16,185,129,0.1)',     color: 'var(--color-fresh)',           border: 'rgba(16,185,129,0.2)' },
  stale:     { bg: 'rgba(100,116,139,0.1)',    color: 'var(--color-stale)',           border: 'rgba(100,116,139,0.2)' },
  direct:    { bg: 'rgba(16,185,129,0.1)',     color: 'var(--color-direct-contact)',  border: 'rgba(16,185,129,0.2)' },
  path:      { bg: 'rgba(124,58,237,0.1)',     color: 'var(--color-path-contact)',    border: 'rgba(124,58,237,0.2)' },
  none:      { bg: 'rgba(71,85,105,0.1)',      color: 'var(--color-no-contact)',      border: 'rgba(71,85,105,0.2)' },
  confirmed: { bg: 'rgba(245,158,11,0.1)',     color: 'var(--color-confirmed)',       border: 'rgba(245,158,11,0.2)' },
  action:    { bg: 'var(--color-accent-dim)',  color: 'var(--color-action)',          border: 'var(--color-accent-glow)' },
  review:    { bg: 'rgba(124,58,237,0.1)',     color: 'var(--color-review)',          border: 'rgba(124,58,237,0.2)' },
}

export function Chip({ children, variant = 'default', size = 'sm', dot, onRemove }: ChipProps) {
  const s = VARIANT_STYLES[variant]
  const pad = size === 'sm' ? '2px 7px' : '4px 10px'
  const fs = size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: pad,
        fontSize: fs,
        fontWeight: 'var(--fw-medium)',
        borderRadius: 'var(--radius-pill)',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        whiteSpace: 'nowrap',
        lineHeight: '1.4',
      }}
    >
      {dot && (
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: s.color,
            flexShrink: 0,
          }}
        />
      )}
      {children}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            color: s.color,
            fontSize: 10,
            lineHeight: 1,
            marginLeft: 2,
          }}
          aria-label="Сбросить"
        >
          ×
        </button>
      )}
    </span>
  )
}
