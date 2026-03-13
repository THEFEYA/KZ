import { DonutChart } from '@shared/charts/DonutChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData } from '@core/types/analytics'

interface QueueChartProps {
  data: AnalyticsData
}

export function QueueChart({ data }: QueueChartProps) {
  const raw = toChartData(data.byQueue)
  const chartData = raw.map((d) => ({
    ...d,
    fill:
      d.name === 'Рабочая очередь'
        ? 'var(--color-action)'
        : d.name === 'Очередь проверки'
          ? 'var(--color-review)'
          : 'var(--color-confirmed)',
  }))

  if (!chartData.length) return <EmptyState icon="◌" title="Нет данных по очередям" />

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        Распределение по очередям
      </div>
      <DonutChart data={chartData} height={180} showLegend />
    </Panel>
  )
}
