interface Segment<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  segments: Segment<T>[]
  value: T
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--color-bg-raised)',
        borderRadius: 'var(--radius-md)',
        padding: 3,
        gap: 2,
        border: '1px solid var(--color-border)',
      }}
    >
      {segments.map((seg) => {
        const isActive = seg.value === value
        return (
          <button
            key={seg.value}
            onClick={() => onChange(seg.value)}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: 'calc(var(--radius-md) - 2px)',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
              background: isActive ? 'var(--color-surface)' : 'transparent',
              border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: isActive ? 'var(--shadow-card)' : 'none',
            }}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
