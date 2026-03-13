import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartDatum } from '@core/utils/chartTransforms'

interface DonutChartProps {
  data: ChartDatum[]
  height?: number
  innerRadius?: number
  showLegend?: boolean
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
      }}
    >
      <div style={{ fontWeight: 'var(--fw-semibold)', color: 'var(--color-text-primary)' }}>{d.name}</div>
      <div style={{ color: 'var(--color-text-secondary)' }}>{d.value}{d.pct != null ? ` — ${d.pct}%` : ''}</div>
    </div>
  )
}

export function DonutChart({ data, height = 200, innerRadius = 50, showLegend }: DonutChartProps) {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 30}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill ?? 'var(--color-accent)'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {showLegend && (
          <Legend
            iconSize={8}
            iconType="circle"
            formatter={(value) => (
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{value}</span>
            )}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}
