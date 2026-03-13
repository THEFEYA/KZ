import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ChartDatum } from '@core/utils/chartTransforms'

interface LineChartProps {
  data: ChartDatum[]
  height?: number
  color?: string
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
      <div style={{ color: 'var(--color-text-secondary)' }}>{d.value}</div>
    </div>
  )
}

export function LineChart({ data, height = 160, color }: LineChartProps) {
  const c = color ?? 'var(--color-accent)'
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity={0.3} />
            <stop offset="100%" stopColor={c} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: c, strokeWidth: 1, strokeDasharray: '4 2' }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={c}
          strokeWidth={2}
          fill="url(#lineGrad)"
          dot={{ fill: c, r: 3, strokeWidth: 0 }}
          activeDot={{ fill: c, r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
