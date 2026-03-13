import { useApplyMode } from '@features/modes/useApplyMode'
import { MODE_PRESETS } from '@features/modes/modePresets'
import type { ModeId } from '@core/types/ui'

export function ModeRail() {
  const { applyMode, currentMode } = useApplyMode()

  return (
    <div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '0 var(--space-4)',
          marginBottom: 'var(--space-2)',
        }}
      >
        Режимы
      </div>
      <div
        className="scroll-x"
        style={{ display: 'flex', gap: 8, padding: '0 var(--space-4)', paddingBottom: 4 }}
      >
        {MODE_PRESETS.map((preset) => {
          const active = currentMode.id === preset.id
          return (
            <button
              key={preset.id}
              onClick={() => applyMode(preset.id as ModeId)}
              style={{
                flexShrink: 0,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: active ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                border: `1px solid ${active ? 'var(--color-accent-glow)' : 'var(--color-border)'}`,
                color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 3,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                minWidth: 110,
                boxShadow: active ? 'var(--glow-accent)' : 'var(--shadow-card)',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--fw-semibold)',
                  lineHeight: 1.2,
                }}
              >
                {preset.ruName}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: active ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                  lineHeight: 1.3,
                  opacity: active ? 0.8 : 1,
                }}
              >
                {preset.description.split('—')[0].trim().slice(0, 30)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
