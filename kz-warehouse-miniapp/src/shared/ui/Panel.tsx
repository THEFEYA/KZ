import type { ReactNode, CSSProperties } from 'react'

interface PanelProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  glow?: boolean
  onClick?: () => void
}

export function Panel({ children, className = '', style, glow, onClick }: PanelProps) {
  return (
    <div
      className={`glass ${className}`}
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        boxShadow: glow ? 'var(--shadow-card), var(--glow-accent)' : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'background var(--transition-fast), box-shadow var(--transition-fast)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
