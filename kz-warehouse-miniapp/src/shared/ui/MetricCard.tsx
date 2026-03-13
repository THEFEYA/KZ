interface MetricCardProps {
  label: string
  value: string | number
  subtitle?: string
  accent?: boolean
  color?: string
  onClick?: () => void
}

export function MetricCard({ label, value, subtitle, accent, color, onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        background: accent ? 'var(--color-accent-dim)' : 'var(--color-surface)',
        border: `1px solid ${accent ? 'var(--color-accent-glow)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'background var(--transition-fast)',
        minWidth: 96,
        boxShadow: accent ? 'var(--glow-accent)' : 'var(--shadow-card)',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          fontWeight: 'var(--fw-medium)',
          lineHeight: 1.3,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--fw-bold)',
          color: color ?? (accent ? 'var(--color-accent)' : 'var(--color-text-primary)'),
          lineHeight: 1.1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
      {subtitle && (
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}
