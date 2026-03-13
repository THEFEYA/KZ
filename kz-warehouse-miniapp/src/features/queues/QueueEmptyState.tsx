import { EmptyState } from '@shared/ui/EmptyState'
import { useResetFilters, useActiveFilterCount } from '@core/state/selectors'

interface QueueEmptyStateProps {
  hasFilters: boolean
}

export function QueueEmptyState({ hasFilters }: QueueEmptyStateProps) {
  const resetFilters = useResetFilters()
  const count = useActiveFilterCount()

  if (hasFilters && count > 0) {
    return (
      <EmptyState
        icon="◌"
        title="По выбранным фильтрам ничего не найдено"
        description="Попробуйте изменить или сбросить фильтры"
        action={{ label: 'Сбросить фильтры', onClick: resetFilters }}
      />
    )
  }

  return (
    <EmptyState
      icon="◌"
      title="Нет данных для отображения"
      description="В этой очереди пока нет записей"
    />
  )
}
