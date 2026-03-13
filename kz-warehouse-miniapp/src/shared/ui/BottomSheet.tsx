import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  fullScreen?: boolean
}

export function BottomSheet({ open, onClose, title, children, fullScreen }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          animation: 'fadeIn var(--transition-base) ease',
        }}
      />

      {/* Sheet */}
      <div
        className="animate-slide-bottom"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 101,
          background: 'var(--color-bg-raised)',
          borderRadius: fullScreen ? 0 : 'var(--radius-xl) var(--radius-xl) 0 0',
          border: '1px solid var(--color-border)',
          borderBottom: 'none',
          maxHeight: fullScreen ? '100dvh' : '90dvh',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'var(--safe-bottom)',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Handle */}
        {!fullScreen && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '12px 0 4px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'var(--color-border-strong)',
              }}
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              borderBottom: '1px solid var(--color-border)',
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--fw-semibold)',
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 20,
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
              }}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}

        {/* Content */}
        <div className="scroll-y" style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </>
  )
}
