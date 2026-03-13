import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ChartDatum } from '@core/utils/chartTransforms'

interface BarChartProps {
  data: ChartDatum[]
  height?: number
  horizontal?: boolean
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDatum }> }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 10px',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-primary)',
      }}
    >
      <div style={{ fontWeight: 'var(--fw-semibold)' }}>{d.name}</div>
      <div style={{ color: 'var(--color-text-secondary)' }}>{d.value}{d.pct != null ? ` (${d.pct}%)` : ''}</div>
    </div>
  )
}

export function BarChart({ data, height = 200, horizontal }: BarChartProps) {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        layout={horizontal ? 'vertical' : 'horizontal'}
        margin={{ top: 4, right: 4, left: horizontal ? 80 : 0, bottom: 4 }}
      >
        {horizontal ? (
          <>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={76}
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis hide />
          </>
        )}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill ?? 'var(--color-accent)'} />
          ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  )
}
