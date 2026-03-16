import { Panel } from '@shared/ui/Panel'
import { Skeleton } from '@shared/ui/Skeleton'
import type { AnalyticsData } from '@core/types/analytics'
import { computeInsight } from '@core/utils/chartTransforms'

interface MainInsightCardProps {
  data: AnalyticsData | null
  loading?: boolean
  mainInsight?: string | null  // from overview_screen_v1 — preferred if present
}

export function MainInsightCard({ data, loading, mainInsight }: MainInsightCardProps) {
  if (loading) {
    return (
      <Panel glow style={{ margin: '0 var(--space-4)' }}>
        <Skeleton width="40%" height={12} style={{ marginBottom: 10 }} />
        <Skeleton width="90%" height={20} />
        <Skeleton width="70%" height={16} style={{ marginTop: 6 }} />
      </Panel>
    )
  }

  if (!data && !mainInsight) return null

  const insight =
    mainInsight ??
    data?.topInsight ??
    (data ? computeInsight(data.summary, data.bySource, data.byHeat) : null)

  if (!insight) return null

  return (
    <Panel
      glow
      className="animate-fade-in-up"
      style={{ margin: '0 var(--space-4)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          ◈ Ключевой вывод
        </span>
      </div>

      <p
        style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--fw-medium)',
          color: 'var(--color-text-primary)',
          lineHeight: 'var(--lh-relaxed)',
        }}
      >
        {insight}
      </p>

      {data && data.summary.confirmedLeads > 0 && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ color: 'var(--color-confirmed)', fontSize: 'var(--text-sm)' }}>
            ✦ {data.summary.confirmedLeads} подтверждённых лидов
          </span>
        </div>
      )}
    </Panel>
  )
}
