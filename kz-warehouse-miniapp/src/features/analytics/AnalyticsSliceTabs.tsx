import type { AnalyticsSlice } from '@core/types/analytics'

interface AnalyticsSliceTabsProps {
  value: AnalyticsSlice
  onChange: (v: AnalyticsSlice) => void
}

const SLICES: { value: AnalyticsSlice; label: string }[] = [
  { value: 'source',      label: 'По источникам' },
  { value: 'contact_type',label: 'По связи' },
  { value: 'market_role', label: 'По ролям' },
  { value: 'queue',       label: 'По очередям' },
  { value: 'heat',        label: 'По горячести' },
  { value: 'freshness',   label: 'По свежести' },
]

export function AnalyticsSliceTabs({ value, onChange }: AnalyticsSliceTabsProps) {
  return (
    <div className="scroll-x" style={{ padding: '0 var(--space-4)', display: 'flex', gap: 6 }}>
      {SLICES.map((slice) => {
        const active = slice.value === value
        return (
          <button
            key={slice.value}
            onClick={() => onChange(slice.value)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--text-sm)',
              fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
              color: active ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              background: active ? 'var(--color-accent-dim)' : 'transparent',
              border: `1px solid ${active ? 'var(--color-accent-glow)' : 'var(--color-border)'}`,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            {slice.label}
          </button>
        )
      })}
    </div>
  )
}
