interface Option {
  value: string | number
  label: string
}

interface FilterFieldGroupProps {
  label: string
  options: Option[]
  value: string | number | null
  onChange: (value: string | number | null) => void
}

export function FilterFieldGroup({ label, options, value, onChange }: FilterFieldGroupProps) {
  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-2)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(active ? null : opt.value)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--text-sm)',
                fontWeight: active ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                background: active ? 'var(--color-accent-dim)' : 'var(--color-bg-elevated)',
                border: `1px solid ${active ? 'var(--color-accent-glow)' : 'var(--color-border)'}`,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
