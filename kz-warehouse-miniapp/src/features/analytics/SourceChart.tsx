import { BarChart } from '@shared/charts/BarChart'
import { DonutChart } from '@shared/charts/DonutChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData, AnalyticsViewType } from '@core/types/analytics'

interface SourceChartProps {
  data: AnalyticsData
  viewType: AnalyticsViewType
}

export function SourceChart({ data, viewType }: SourceChartProps) {
  const chartData = toChartData(data.bySource)
  if (!chartData.length) return <EmptyState icon="◌" title="Нет данных по источникам" />

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        По источникам
      </div>
      {viewType === 'structure' ? (
        <DonutChart data={chartData} height={200} showLegend />
      ) : (
        <BarChart data={chartData} horizontal height={Math.max(160, chartData.length * 36)} />
      )}
    </Panel>
  )
}
