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

  const handleCardClick = () => {
    hapticLight()
    navigate(buildDetailRoute(c.id))
  }

  const heatVariant = c.heatLevel === 'hot' ? 'hot' : c.heatLevel === 'warm' ? 'warm' : 'cold'
  const contactVariant = c.contactStatus === 'direct' ? 'direct' : c.contactStatus === 'path' ? 'path' : 'none'
  const contactLabel =
    c.contactStatus === 'direct' ? 'Прямой контакт'
    : c.contactStatus === 'path'  ? 'Путь связи'
    : 'Нет контакта'

  return (
    <div
      className="animate-fade-in"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Main body — tap to open detail */}
      <div
        onClick={handleCardClick}
        style={{
          padding: 'var(--space-4)',
          cursor: 'pointer',
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
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {c.displayEntity}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <Chip variant={heatVariant} dot size="sm">
              {c.heatLevel === 'hot' ? 'Горячий' : c.heatLevel === 'warm' ? 'Тёплый' : 'Холодный'}
            </Chip>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-bold)', color: 'var(--color-text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>
              #{c.priorityRank}
            </span>
          </div>
        </div>

        {/* Row 2: signal + object */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <Chip variant="accent" size="sm">{c.normalizedSignalType}</Chip>
          {c.objectAnchor && <Chip variant="default" size="sm">{c.objectAnchor}</Chip>}
        </div>

        {/* Row 3: entity type + role + region */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', background: 'var(--color-bg-elevated)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
            {c.entityType === 'company' ? 'Компания' : 'Объект'}
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            {c.marketRole}
          </span>
          {c.region && (
            <>
              <span style={{ color: 'var(--color-border-strong)', fontSize: 10 }}>·</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{c.region}</span>
            </>
          )}
        </div>

        {/* Row 4: source + evidence + contact status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {c.sourceLabel && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{c.sourceLabel}</span>
            )}
            {c.evidenceCount > 0 && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                {plural(c.evidenceCount, 'довод', 'довода', 'доводов')}
              </span>
            )}
          </div>
          <Chip variant={contactVariant} size="sm" dot>{contactLabel}</Chip>
        </div>
      </div>

      {/* Action row — inline quick actions */}
      <div style={{ borderTop: '1px solid var(--color-border)', display: 'flex' }}>
        <CardAction
          label="Подробнее"
          icon="◈"
          onClick={handleCardClick}
          accent
        />
        {c.sourceUrl && (
          <CardAction
            label="Источник"
            icon="↗"
            onClick={(e) => {
              e.stopPropagation()
              hapticLight()
              window.open(c.sourceUrl!, '_blank')
            }}
          />
        )}
        <CardAction
          label="Следующий"
          icon="→"
          onClick={(e) => {
            e.stopPropagation()
            // navigate to next card — handled by parent list scroll; tap navigates forward
            hapticLight()
            navigate(buildDetailRoute(c.id))
          }}
        />
      </div>
    </div>
  )
}

function CardAction({
  label, icon, onClick, accent,
}: {
  label: string
  icon: string
  onClick: (e: React.MouseEvent) => void
  accent?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '8px 6px',
        background: 'transparent',
        border: 'none',
        borderRight: '1px solid var(--color-border)',
        color: accent ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--fw-medium)',
        cursor: 'pointer',
        transition: 'background var(--transition-fast)',
      }}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      {label}
    </button>
  )
}
