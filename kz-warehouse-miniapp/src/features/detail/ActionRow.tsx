import type { CandidateDetail } from '@core/types/candidate'
import { openContactOrWebsite, openSource, forwardToManager, markNeedsReview } from '@core/telegram/actions'
import { useNavigate } from 'react-router-dom'
import { hapticLight } from '@core/telegram/haptics'

interface ActionRowProps {
  detail: CandidateDetail
}

interface ActionBtn {
  label: string
  icon: string
  color?: string
  onClick: () => void
  disabled?: boolean
}

export function ActionRow({ detail }: ActionRowProps) {
  const navigate = useNavigate()

  const hasContact = !!(detail.contacts?.length)
  const hasSource  = !!(detail.sourceUrl || detail.sourceLinks?.[0]?.url)

  const sourceUrl = detail.sourceUrl ?? detail.sourceLinks?.[0]?.url ?? null

  const actions: ActionBtn[] = [
    {
      label: 'Связаться',
      icon: '✉',
      color: 'var(--color-direct-contact)',
      disabled: !hasContact,
      onClick: () => {
        openContactOrWebsite(detail.contacts ?? null, null)
      },
    },
    {
      label: 'Источник',
      icon: '↗',
      color: 'var(--color-accent)',
      disabled: !hasSource,
      onClick: () => {
        if (sourceUrl) window.open(sourceUrl, '_blank')
        else openSource(detail)
        hapticLight()
      },
    },
    {
      label: 'Менеджеру',
      icon: '⇒',
      color: 'var(--color-path-contact)',
      onClick: () => forwardToManager(detail),
    },
    {
      label: 'Проверка',
      icon: '◎',
      color: 'var(--color-review)',
      onClick: () => markNeedsReview(detail),
    },
  ]

  return (
    <div
      style={{
        padding: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
      }}
    >
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={a.onClick}
          disabled={a.disabled}
          style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: a.disabled ? 'var(--color-bg-elevated)' : 'var(--color-surface)',
            border: `1px solid ${a.disabled ? 'var(--color-border)' : 'var(--color-border-strong)'}`,
            color: a.disabled ? 'var(--color-text-tertiary)' : (a.color ?? 'var(--color-text-primary)'),
            opacity: a.disabled ? 0.4 : 1,
            cursor: a.disabled ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{a.icon}</span>
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-medium)', whiteSpace: 'nowrap' }}>
            {a.label}
          </span>
        </button>
      ))}
    </div>
  )
}
