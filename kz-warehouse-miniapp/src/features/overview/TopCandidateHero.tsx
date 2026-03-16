import { useNavigate } from 'react-router-dom'
import { Panel } from '@shared/ui/Panel'
import { Chip } from '@shared/ui/Chip'
import { hapticLight } from '@core/telegram/haptics'
import { buildDetailRoute } from '@core/config/routes'
import type { PriorityPreviewItem } from '@core/types/analytics'

interface TopCandidateHeroProps {
  candidate: PriorityPreviewItem
}

export function TopCandidateHero({ candidate: c }: TopCandidateHeroProps) {
  const navigate = useNavigate()

  const handleOpen = () => {
    hapticLight()
    navigate(buildDetailRoute(c.id))
  }

  const bandColor =
    c.priorityBandRu?.toLowerCase().includes('первым')
      ? 'var(--color-accent)'
      : c.priorityBandRu?.toLowerCase().includes('высок')
        ? 'var(--color-hot)'
        : 'var(--color-text-secondary)'

  return (
    <Panel
      glow
      style={{ margin: '0 var(--space-4)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
    >
      {/* Glow accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: `linear-gradient(90deg, ${bandColor}, transparent)`,
          opacity: 0.7,
        }}
      />

      <div onClick={handleOpen} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {/* Priority band label */}
        {c.priorityBandRu && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: bandColor,
                flexShrink: 0,
                boxShadow: `0 0 6px ${bandColor}`,
              }}
            />
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-semibold)',
                color: bandColor,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {c.priorityBandRu}
            </span>
          </div>
        )}

        {/* Name */}
        <h2
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
          }}
        >
          {c.displayLabel}
        </h2>

        {/* Signal + anchor */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {c.signalType && <Chip variant="accent" size="sm">{c.signalType}</Chip>}
          {c.objectAnchor && <Chip variant="default" size="sm">{c.objectAnchor}</Chip>}
        </div>

        {/* Open-first reason */}
        {c.openFirstReasonRu && (
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--lh-relaxed)',
              marginTop: 2,
            }}
          >
            {c.openFirstReasonRu}
          </p>
        )}

        {/* CTA */}
        <div
          style={{
            marginTop: 'var(--space-2)',
            paddingTop: 'var(--space-2)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
            Открыть первым
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>
            Подробнее →
          </span>
        </div>
      </div>
    </Panel>
  )
}
