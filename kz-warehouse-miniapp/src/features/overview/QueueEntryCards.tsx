import { useNavigate } from 'react-router-dom'
import type { AnalyticsSummary } from '@core/types/analytics'

interface QueueEntryCardsProps {
  summary: AnalyticsSummary | null
}

interface EntryItem {
  label: string
  count: number
  href: string
  color: string
  icon: string
}

export function QueueEntryCards({ summary }: QueueEntryCardsProps) {
  const navigate = useNavigate()

  const entries: EntryItem[] = [
    {
      label: 'Рабочая очередь',
      count: summary?.actionQueue ?? 0,
      href: '/queues?bucket=action_queue',
      color: 'var(--color-action)',
      icon: '⊞',
    },
    {
      label: 'Очередь проверки',
      count: summary?.reviewQueue ?? 0,
      href: '/queues?bucket=review_queue',
      color: 'var(--color-review)',
      icon: '◎',
    },
    {
      label: 'Подтверждённые',
      count: summary?.confirmedLeads ?? 0,
      href: '/queues?bucket=confirmed_leads',
      color: 'var(--color-confirmed)',
      icon: '✦',
    },
    {
      label: 'Аналитика',
      count: summary?.total ?? 0,
      href: '/analytics',
      color: 'var(--color-accent)',
      icon: '⊿',
    },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        padding: '0 var(--space-4)',
      }}
    >
      {entries.map((entry) => (
        <button
          key={entry.label}
          onClick={() => navigate(entry.href)}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 6,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: 18, color: entry.color }}>{entry.icon}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              style={{ color: 'var(--color-text-tertiary)' }}
            >
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--fw-bold)',
                color: entry.color,
                lineHeight: 1.1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {entry.count}
            </div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-tertiary)',
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              {entry.label}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
