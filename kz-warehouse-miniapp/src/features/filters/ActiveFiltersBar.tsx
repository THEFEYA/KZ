import { Chip } from '@shared/ui/Chip'
import {
  useFilters,
  useResetFilter,
  useResetFilters,
  useActiveFilterCount,
  useOpenFilterSheet,
} from '@core/state/selectors'
import { labelContactStatus, labelHeat, labelFreshness, labelMarketRole, labelQueueBucket } from '@core/utils/labels'

export function ActiveFiltersBar() {
  const filters = useFilters()
  const resetFilter = useResetFilter()
  const resetFilters = useResetFilters()
  const count = useActiveFilterCount()
  const openFilter = useOpenFilterSheet()

  if (count === 0) return null

  return (
    <div
      className="scroll-x"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px var(--space-4)',
        flexShrink: 0,
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <button
        onClick={openFilter}
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        Фильтры:
      </button>

      {filters.region && (
        <Chip variant="accent" onRemove={() => resetFilter('region')}>
          {filters.region}
        </Chip>
      )}
      {filters.heat && (
        <Chip
          variant={filters.heat === 'hot' ? 'hot' : filters.heat === 'warm' ? 'warm' : 'cold'}
          onRemove={() => resetFilter('heat')}
        >
          {labelHeat(filters.heat)}
        </Chip>
      )}
      {filters.freshness && (
        <Chip variant="fresh" onRemove={() => resetFilter('freshness')}>
          {labelFreshness(filters.freshness)}
        </Chip>
      )}
      {filters.contactType && (
        <Chip
          variant={
            filters.contactType === 'direct' ? 'direct' : filters.contactType === 'path' ? 'path' : 'none'
          }
          onRemove={() => resetFilter('contactType')}
        >
          {labelContactStatus(filters.contactType)}
        </Chip>
      )}
      {filters.marketRole && (
        <Chip variant="default" onRemove={() => resetFilter('marketRole')}>
          {labelMarketRole(filters.marketRole)}
        </Chip>
      )}
      {filters.bucket && (
        <Chip variant="action" onRemove={() => resetFilter('bucket')}>
          {labelQueueBucket(filters.bucket)}
        </Chip>
      )}
      {filters.limit !== 10 && (
        <Chip variant="default" onRemove={() => resetFilter('limit')}>
          {filters.limit} записей
        </Chip>
      )}

      <button
        onClick={resetFilters}
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-error)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          opacity: 0.8,
          cursor: 'pointer',
          marginLeft: 4,
        }}
      >
        Сбросить все
      </button>
    </div>
  )
}
