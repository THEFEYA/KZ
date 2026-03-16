import { useNavigate } from 'react-router-dom'
import type { PriorityPreview } from '@core/types/analytics'

interface PriorityPreviewBlockProps {
  preview: PriorityPreview
}

export function PriorityPreviewBlock({ preview }: PriorityPreviewBlockProps) {
  const navigate = useNavigate()

  const items = [
    {
      label: 'Открыть первым',
      value: preview.openFirst,
      color: 'var(--color-accent)',
      glow: true,
      onClick: () => navigate('/queues?bucket=review_queue'),
    },
    {
      label: 'Высокий приоритет',
      value: preview.priorityCount,
      color: 'var(--color-hot)',
      glow: false,
      onClick: () => navigate('/queues?bucket=review_queue'),
    },
    {
      label: 'На проверке',
      value: preview.reviewCount,
      color: 'var(--color-review)',
      glow: false,
      onClick: () => navigate('/queues?bucket=review_queue'),
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        padding: '0 var(--space-4)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          style={{
            flex: 1,
            minWidth: 80,
            flexShrink: 0,
            background: 'var(--color-surface)',
            border: `1px solid ${item.glow ? 'var(--color-accent-glow)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px 10px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color var(--transition-fast)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--fw-bold)',
              color: item.color,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.1,
              ...(item.glow ? { textShadow: `0 0 12px ${item.color}60` } : {}),
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              marginTop: 4,
              lineHeight: 1.3,
            }}
          >
            {item.label}
          </div>
        </button>
      ))}
    </div>
  )
}
