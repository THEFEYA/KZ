import { BarChart } from '@shared/charts/BarChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData } from '@core/types/analytics'

interface FreshnessChartProps {
  data: AnalyticsData
}

export function FreshnessChart({ data }: FreshnessChartProps) {
  const raw = toChartData(data.byFreshness)
  const chartData = raw.map((d) => ({
    ...d,
    fill:
      d.name === 'Свежий'
        ? 'var(--color-fresh)'
        : d.name === 'Актуальный'
          ? 'var(--color-actual)'
          : 'var(--color-stale)',
  }))

  if (!chartData.length) return <EmptyState icon="◌" title="Нет данных по свежести" />

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        По свежести
      </div>
      <BarChart data={chartData} height={160} />
    </Panel>
  )
}
