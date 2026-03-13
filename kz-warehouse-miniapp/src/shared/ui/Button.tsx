import type { ReactNode, CSSProperties } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
  style?: CSSProperties
  type?: 'button' | 'submit' | 'reset'
}

const VARIANT_STYLES: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--color-accent)',
    color: 'var(--color-bg)',
    border: 'none',
  },
  secondary: {
    background: 'var(--color-surface)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-strong)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: '1px solid var(--color-border)',
  },
  danger: {
    background: 'rgba(239,68,68,0.1)',
    color: 'var(--color-error)',
    border: '1px solid rgba(239,68,68,0.2)',
  },
}

const SIZE_STYLES: Record<ButtonSize, CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 'var(--text-sm)', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 18px', fontSize: 'var(--text-base)', borderRadius: 'var(--radius-md)' },
  lg: { padding: '14px 24px', fontSize: 'var(--text-md)', borderRadius: 'var(--radius-md)' },
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled,
  fullWidth,
  style,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        fontWeight: 'var(--fw-semibold)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity var(--transition-fast), background var(--transition-fast)',
        width: fullWidth ? '100%' : undefined,
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
