import type { ChartDatum } from '@core/utils/chartTransforms'

interface MiniBarsProps {
  data: ChartDatum[]
  height?: number
}

export function MiniBars({ data, height = 32 }: MiniBarsProps) {
  if (!data.length) return null
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 3,
        height,
      }}
    >
      {data.map((item, i) => (
        <div
          key={i}
          title={`${item.name}: ${item.value}`}
          style={{
            flex: 1,
            height: `${Math.max(4, (item.value / max) * height)}px`,
            background: item.fill ?? 'var(--color-accent)',
            borderRadius: '2px 2px 0 0',
            opacity: 0.85,
            transition: 'height var(--transition-fast)',
          }}
        />
      ))}
    </div>
  )
}
