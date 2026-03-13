import { Chip } from '@shared/ui/Chip'
import type { CandidateDetail } from '@core/types/candidate'

interface DetailHeaderProps {
  detail: CandidateDetail
}

export function DetailHeader({ detail }: DetailHeaderProps) {
  const heatVariant = detail.heatLevel === 'hot' ? 'hot' : detail.heatLevel === 'warm' ? 'warm' : 'cold'
  const heatLabel = detail.heatLevel === 'hot' ? 'Горячий' : detail.heatLevel === 'warm' ? 'Тёплый' : 'Холодный'
  const freshnessVariant = detail.freshnessLevel === 'fresh' ? 'fresh' : detail.freshnessLevel === 'actual' ? 'accent' : 'stale'
  const freshnessLabel = detail.freshnessLevel === 'fresh' ? 'Свежий' : detail.freshnessLevel === 'actual' ? 'Актуальный' : 'Устаревший'

  return (
    <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <h1
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            flex: 1,
          }}
        >
          {detail.displayEntity}
        </h1>
        <Chip variant={heatVariant} dot size="md">{heatLabel}</Chip>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Chip variant="default" size="sm">
          {detail.entityType === 'company' ? 'Компания' : 'Объект'}
        </Chip>
        <Chip variant="default" size="sm">{detail.marketRole}</Chip>
        {detail.region && <Chip variant="default" size="sm">{detail.region}</Chip>}
        <Chip variant={freshnessVariant as 'fresh' | 'accent' | 'stale'} size="sm">{freshnessLabel}</Chip>
      </div>
    </div>
  )
}
