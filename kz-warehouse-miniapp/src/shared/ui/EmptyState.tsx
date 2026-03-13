interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '⬜', title, description, action }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        gap: 'var(--space-3)',
        textAlign: 'center',
      }}
    >
      <span style={{ fontSize: 40, marginBottom: 4 }}>{icon}</span>
      <h3
        style={{
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--color-text-primary)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-tertiary)',
            maxWidth: 240,
            lineHeight: 'var(--lh-relaxed)',
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            marginTop: 'var(--space-2)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent-dim)',
            color: 'var(--color-accent)',
            border: '1px solid var(--color-accent-glow)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--fw-medium)',
            cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
