import { DonutChart } from '@shared/charts/DonutChart'
import { BarChart } from '@shared/charts/BarChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData, AnalyticsViewType } from '@core/types/analytics'

interface ContactChartProps {
  data: AnalyticsData
  viewType: AnalyticsViewType
}

export function ContactChart({ data, viewType }: ContactChartProps) {
  const raw = toChartData(data.byContactType)

  // Assign semantic colors
  const chartData = raw.map((d) => ({
    ...d,
    fill:
      d.name === 'Прямой контакт'
        ? 'var(--color-direct-contact)'
        : d.name === 'Путь связи'
          ? 'var(--color-path-contact)'
          : 'var(--color-no-contact)',
  }))

  if (!chartData.length) return <EmptyState icon="◌" title="Нет данных по типу связи" />

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        По типу связи
      </div>
      {viewType === 'comparison' ? (
        <BarChart data={chartData} height={160} />
      ) : (
        <DonutChart data={chartData} height={200} showLegend />
      )}
    </Panel>
  )
}
