import { useNavigate } from 'react-router-dom'
import { Chip } from '@shared/ui/Chip'
import type { Candidate } from '@core/types/candidate'
import { buildDetailRoute } from '@core/config/routes'
import { hapticLight } from '@core/telegram/haptics'
import { plural } from '@core/utils/format'

interface CandidateCardProps {
  candidate: Candidate
}

export function CandidateCard({ candidate: c }: CandidateCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    hapticLight()
    navigate(buildDetailRoute(c.id))
  }

  const heatVariant = c.heatLevel === 'hot' ? 'hot' : c.heatLevel === 'warm' ? 'warm' : 'cold'
  const contactVariant = c.contactStatus === 'direct' ? 'direct' : c.contactStatus === 'path' ? 'path' : 'none'
  const contactLabel =
    c.contactStatus === 'direct'
      ? 'Прямой контакт'
      : c.contactStatus === 'path'
        ? 'Путь связи'
        : 'Нет контакта'

  return (
    <div
      onClick={handleClick}
      className="animate-fade-in"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast), border-color var(--transition-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      {/* Row 1: Name + heat + priority */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, justifyContent: 'space-between' }}>
        <h3
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-text-primary)',
            lineHeight: 1.3,
            flex: 1,
            minWidth: 0,
          }}
          className="truncate"
        >
          {c.displayEntity}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Chip variant={heatVariant} dot size="sm">
            {c.heatLevel === 'hot' ? 'Горячий' : c.heatLevel === 'warm' ? 'Тёплый' : 'Холодный'}
          </Chip>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--fw-bold)',
              color: 'var(--color-text-tertiary)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            #{c.priorityRank}
          </span>
        </div>
      </div>

      {/* Row 2: signal + object */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Chip variant="accent" size="sm">{c.normalizedSignalType}</Chip>
        {c.objectAnchor && (
          <Chip variant="default" size="sm">{c.objectAnchor}</Chip>
        )}
      </div>

      {/* Row 3: entity type + role + region */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-tertiary)',
            background: 'var(--color-bg-elevated)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {c.entityType === 'company' ? 'Компания' : 'Объект'}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
          {c.marketRole}
        </span>
        {c.region && (
          <>
            <span style={{ color: 'var(--color-border-strong)', fontSize: 10 }}>·</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {c.region}
            </span>
          </>
        )}
      </div>

      {/* Row 4: source + evidence + contact */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 6,
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {c.sourceLabel && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {c.sourceLabel}
            </span>
          )}
          {c.evidenceCount > 0 && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {plural(c.evidenceCount, 'довод', 'довода', 'доводов')}
            </span>
          )}
        </div>
        <Chip variant={contactVariant} size="sm" dot>
          {contactLabel}
        </Chip>
      </div>
    </div>
  )
}
