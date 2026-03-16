import type { RuntimeSource } from '@core/runtime/types'

interface SourceBadgeProps {
  source: RuntimeSource
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const isRuntime = source === 'runtime'
  return (
    <span
      style={{
        padding: '3px 9px',
        background: isRuntime ? 'rgba(34,197,94,0.15)' : 'rgba(251,146,60,0.15)',
        border: `1px solid ${isRuntime ? 'rgba(34,197,94,0.4)' : 'rgba(251,146,60,0.4)'}`,
        borderRadius: 5,
        fontSize: 11,
        fontWeight: 700,
        color: isRuntime ? '#22c55e' : '#fb923c',
        letterSpacing: '0.06em',
      }}
    >
      {isRuntime ? '[SOURCE: runtime]' : '[SOURCE: legacy fallback]'}
    </span>
  )
}
