import {
  ScatterChart as ReScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ChartDatum } from '@core/utils/chartTransforms'

interface ScatterChartProps {
  data: ChartDatum[]
  height?: number
}

export function ScatterChart({ data, height = 200 }: ScatterChartProps) {
  if (!data.length) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReScatterChart margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        <XAxis dataKey="value" hide />
        <YAxis dataKey="pct" hide />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload as ChartDatum
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
                <div style={{ color: 'var(--color-text-primary)', fontWeight: 'var(--fw-semibold)' }}>{d.name}</div>
                <div style={{ color: 'var(--color-text-secondary)' }}>{d.value}</div>
              </div>
            )
          }}
        />
        <Scatter data={data}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill ?? 'var(--color-accent)'} />
          ))}
        </Scatter>
      </ReScatterChart>
    </ResponsiveContainer>
  )
}
