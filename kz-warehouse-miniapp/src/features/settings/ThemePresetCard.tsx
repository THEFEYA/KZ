import type { Theme } from '@core/types/ui'

interface ThemePresetCardProps {
  theme: Theme
  active: boolean
  onSelect: () => void
}

export function ThemePresetCard({ theme, active, onSelect }: ThemePresetCardProps) {
  return (
    <button
      onClick={onSelect}
      style={{
        width: '100%',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-lg)',
        background: active ? 'var(--color-accent-dim)' : 'var(--color-surface)',
        border: `1px solid ${active ? 'var(--color-accent-glow)' : 'var(--color-border)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        boxShadow: active ? 'var(--glow-accent)' : 'var(--shadow-card)',
        textAlign: 'left',
      }}
    >
      {/* Color preview dots */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {theme.previewColors.map((color, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 6px ${color}60`,
            }}
          />
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-semibold)',
            color: active ? 'var(--color-accent)' : 'var(--color-text-primary)',
            marginBottom: 2,
          }}
        >
          {theme.ruName}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {theme.description}
        </div>
      </div>

      {active && (
        <span
          style={{
            color: 'var(--color-accent)',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          ✓
        </span>
      )}
    </button>
  )
}
