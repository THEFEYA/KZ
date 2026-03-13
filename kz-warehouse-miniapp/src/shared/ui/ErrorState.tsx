interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Ошибка загрузки',
  message = 'Не удалось загрузить данные. Проверьте соединение.',
  onRetry,
}: ErrorStateProps) {
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
      <span style={{ fontSize: 36, marginBottom: 4 }}>⚡</span>
      <h3
        style={{
          fontSize: 'var(--text-md)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--color-error)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-tertiary)',
          maxWidth: 240,
          lineHeight: 'var(--lh-relaxed)',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: 'var(--space-2)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.08)',
            color: 'var(--color-error)',
            border: '1px solid rgba(239,68,68,0.2)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--fw-medium)',
            cursor: 'pointer',
          }}
        >
          Попробовать снова
        </button>
      )}
    </div>
  )
}
