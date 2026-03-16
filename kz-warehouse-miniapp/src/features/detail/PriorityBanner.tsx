import type { CandidatePriority } from '@core/types/candidate'

interface PriorityBannerProps {
  priority: CandidatePriority
}

export function PriorityBanner({ priority }: PriorityBannerProps) {
  if (!priority.priorityBandRu && !priority.priorityScore) return null

  const isOpenFirst = priority.priorityBandRu?.toLowerCase().includes('первым')
  const isHigh = priority.priorityBandRu?.toLowerCase().includes('высок')

  const accentColor = isOpenFirst
    ? 'var(--color-accent)'
    : isHigh
      ? 'var(--color-hot)'
      : 'var(--color-text-secondary)'

  const bgColor = isOpenFirst
    ? 'var(--color-accent-dim)'
    : isHigh
      ? 'rgba(239,68,68,0.06)'
      : 'var(--color-surface)'

  const borderColor = isOpenFirst
    ? 'var(--color-accent-glow)'
    : isHigh
      ? 'rgba(239,68,68,0.2)'
      : 'var(--color-border)'

  return (
    <div
      style={{
        margin: '0 var(--space-4)',
        padding: 'var(--space-3) var(--space-4)',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
        }}
      />

      {/* Band label + score */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: accentColor,
              flexShrink: 0,
              boxShadow: isOpenFirst ? `0 0 8px ${accentColor}` : undefined,
            }}
          />
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-bold)',
              color: accentColor,
              letterSpacing: '0.01em',
            }}
          >
            {priority.priorityBandRu ?? 'Приоритет'}
          </span>
        </div>
        {priority.priorityScore != null && (
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--color-text-tertiary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {Math.round(priority.priorityScore)} баллов
          </span>
        )}
      </div>

      {/* Open-first reason */}
      {priority.openFirstReasonRu && (
        <p
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-secondary)',
            lineHeight: 'var(--lh-relaxed)',
            margin: 0,
          }}
        >
          {priority.openFirstReasonRu}
        </p>
      )}
    </div>
  )
}
