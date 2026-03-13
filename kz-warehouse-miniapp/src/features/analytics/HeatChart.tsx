import { BarChart } from '@shared/charts/BarChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData } from '@core/types/analytics'

interface HeatChartProps {
  data: AnalyticsData
}

export function HeatChart({ data }: HeatChartProps) {
  const raw = toChartData(data.byHeat)
  const chartData = raw.map((d) => ({
    ...d,
    fill:
      d.name === 'Горячий'
        ? 'var(--color-hot)'
        : d.name === 'Тёплый'
          ? 'var(--color-warm)'
          : 'var(--color-cold)',
  }))

  if (!chartData.length) return <EmptyState icon="◌" title="Нет данных по горячести" />

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        По горячести
      </div>
      <BarChart data={chartData} height={160} />
    </Panel>
  )
}
