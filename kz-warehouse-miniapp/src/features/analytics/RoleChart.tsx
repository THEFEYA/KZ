import { BarChart } from '@shared/charts/BarChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData } from '@core/types/analytics'

interface RoleChartProps {
  data: AnalyticsData
}

export function RoleChart({ data }: RoleChartProps) {
  const chartData = toChartData(data.byMarketRole)
  if (!chartData.length) return <EmptyState icon="◌" title="Нет данных по ролям рынка" />

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        По ролям рынка
      </div>
      <BarChart data={chartData} horizontal height={Math.max(160, chartData.length * 36)} />
    </Panel>
  )
}
