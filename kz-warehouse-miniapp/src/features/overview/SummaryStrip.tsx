import { MetricCard } from '@shared/ui/MetricCard'
import { MetricSkeleton } from '@shared/ui/Skeleton'
import type { AnalyticsSummary } from '@core/types/analytics'
import { useNavigate } from 'react-router-dom'

interface SummaryStripProps {
  summary: AnalyticsSummary | null
  loading?: boolean
}

export function SummaryStrip({ summary, loading }: SummaryStripProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div
        className="scroll-x"
        style={{ display: 'flex', gap: 8, padding: '0 var(--space-4)', paddingBottom: 4 }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!summary) return null

  const metrics = [
    {
      label: 'Всего в срезе',
      value: summary.total,
      accent: true,
    },
    {
      label: 'Рабочая очередь',
      value: summary.actionQueue,
      color: 'var(--color-action)',
      onClick: () => navigate('/queues'),
    },
    {
      label: 'На проверке',
      value: summary.reviewQueue,
      color: 'var(--color-review)',
      onClick: () => navigate('/queues'),
    },
    {
      label: 'Подтверждённые',
      value: summary.confirmedLeads,
      color: 'var(--color-confirmed)',
      onClick: () => navigate('/queues'),
    },
    {
      label: 'Прямой контакт',
      value: summary.directContact,
      color: 'var(--color-direct-contact)',
    },
    {
      label: 'Путь связи',
      value: summary.contactPath,
      color: 'var(--color-path-contact)',
    },
    {
      label: 'Без контакта',
      value: summary.noContact,
      color: 'var(--color-no-contact)',
    },
    {
      label: 'Средний приоритет',
      value: summary.avgPriority ? summary.avgPriority.toFixed(0) : '—',
      subtitle: 'баллов',
    },
  ]

  return (
    <div
      className="scroll-x"
      style={{ display: 'flex', gap: 8, padding: '0 var(--space-4)', paddingBottom: 4 }}
    >
      {metrics.map((m) => (
        <MetricCard
          key={m.label}
          label={m.label}
          value={m.value}
          subtitle={m.subtitle}
          accent={m.accent}
          color={m.color}
          onClick={m.onClick}
        />
      ))}
    </div>
  )
}
