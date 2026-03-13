import type { ReactNode, CSSProperties } from 'react'

interface PageProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
  scrollable?: boolean
}

export function Page({ children, style, className = '', scrollable = true }: PageProps) {
  return (
    <div
      className={`page ${scrollable ? 'scroll-y' : ''} ${className}`}
      style={{
        flex: 1,
        paddingBottom: `calc(var(--bottom-nav-height) + var(--safe-bottom) + 16px)`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
