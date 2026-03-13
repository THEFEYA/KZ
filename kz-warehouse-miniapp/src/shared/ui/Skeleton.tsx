import type { CSSProperties } from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 'var(--radius-sm)', style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.4s ease-in-out infinite',
        flexShrink: 0,
        ...style,
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div
      className="glass"
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Skeleton width="60%" height={18} borderRadius="var(--radius-sm)" />
        <Skeleton width={60} height={20} borderRadius="var(--radius-pill)" />
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Skeleton width={80} height={20} borderRadius="var(--radius-pill)" />
        <Skeleton width={100} height={20} borderRadius="var(--radius-pill)" />
      </div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Skeleton width={70} height={16} />
        <Skeleton width={50} height={16} />
        <Skeleton width={90} height={16} />
      </div>
    </div>
  )
}

export function MetricSkeleton() {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        minWidth: 96,
      }}
    >
      <Skeleton width="70%" height={11} />
      <Skeleton width="50%" height={28} />
    </div>
  )
}
