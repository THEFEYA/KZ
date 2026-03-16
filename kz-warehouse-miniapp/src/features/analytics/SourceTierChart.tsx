import { BarChart } from '@shared/charts/BarChart'
import { Panel } from '@shared/ui/Panel'
import { EmptyState } from '@shared/ui/EmptyState'
import { toChartData } from '@core/utils/chartTransforms'
import type { AnalyticsData } from '@core/types/analytics'

interface SourceTierChartProps {
  data: AnalyticsData
}

export function SourceTierChart({ data }: SourceTierChartProps) {
  if (!data.bySourceTier || data.bySourceTier.length === 0) {
    return <EmptyState icon="◌" title="Данные по тирам источников недоступны" description="Появятся после обновления аналитики" />
  }

  const chartData = toChartData(data.bySourceTier)

  return (
    <Panel style={{ margin: '0 var(--space-4)' }}>
      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', marginBottom: 14 }}>
        По тиру источника
      </div>
      <BarChart data={chartData} height={160} />
    </Panel>
  )
}
