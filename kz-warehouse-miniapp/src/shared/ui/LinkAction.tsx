import type { ReactNode } from 'react'

interface LinkActionProps {
  href: string
  children: ReactNode
  label?: string
  icon?: string
}

export function LinkAction({ href, children, icon }: LinkActionProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-accent-dim)',
        color: 'var(--color-accent)',
        border: '1px solid var(--color-accent-glow)',
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--fw-medium)',
        textDecoration: 'none',
        transition: 'background var(--transition-fast)',
        cursor: 'pointer',
      }}
    >
      {icon && <span>{icon}</span>}
      {children}
      <span style={{ opacity: 0.6, fontSize: 10 }}>↗</span>
    </a>
  )
}
