import type { ReactNode } from 'react'

interface SectionProps {
  title?: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
  className?: string
  noPadding?: boolean
}

export function Section({ title, subtitle, children, action, className = '', noPadding }: SectionProps) {
  return (
    <section
      className={className}
      style={{ padding: noPadding ? 0 : '0 var(--space-4)', marginBottom: 'var(--space-5)' }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-3)',
          }}
        >
          <div>
            {title && (
              <h2
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
