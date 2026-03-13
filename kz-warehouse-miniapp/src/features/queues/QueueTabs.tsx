import type { QueueBucket } from '@core/types/candidate'

interface QueueTabsProps {
  active: QueueBucket
  onChange: (bucket: QueueBucket) => void
  counts: Partial<Record<QueueBucket, number>>
}

const TABS: { bucket: QueueBucket; label: string; color: string }[] = [
  { bucket: 'action_queue',    label: 'Рабочая',      color: 'var(--color-action)' },
  { bucket: 'review_queue',    label: 'Проверка',     color: 'var(--color-review)' },
  { bucket: 'confirmed_leads', label: 'Подтверждённые', color: 'var(--color-confirmed)' },
]

export function QueueTabs({ active, onChange, counts }: QueueTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        flexShrink: 0,
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.bucket
        const count = counts[tab.bucket]
        return (
          <button
            key={tab.bucket}
            onClick={() => onChange(tab.bucket)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 6px',
              borderRadius: 'var(--radius-md)',
              background: isActive ? 'var(--color-surface)' : 'transparent',
              border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: isActive ? 'var(--fw-semibold)' : 'var(--fw-medium)',
                color: isActive ? tab.color : 'var(--color-text-tertiary)',
                lineHeight: 1.3,
              }}
            >
              {tab.label}
            </span>
            {count != null && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 'var(--fw-bold)',
                  color: isActive ? tab.color : 'var(--color-text-tertiary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {count}
              </span>
            )}
            {isActive && (
              <div
                style={{
                  width: 20,
                  height: 2,
                  borderRadius: 1,
                  background: tab.color,
                  marginTop: 2,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
