import { CandidateCard } from './CandidateCard'
import { QueueEmptyState } from './QueueEmptyState'
import { CardSkeleton } from '@shared/ui/Skeleton'
import { ErrorState } from '@shared/ui/ErrorState'
import type { Candidate } from '@core/types/candidate'

interface QueueListProps {
  candidates: Candidate[]
  loading: boolean
  error: Error | null
  onRetry?: () => void
}

export function QueueList({ candidates, loading, error, onRetry }: QueueListProps) {
  if (loading) {
    return (
      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        title="Не удалось загрузить список"
        message={error.message}
        onRetry={onRetry}
      />
    )
  }

  if (!candidates.length) {
    return <QueueEmptyState hasFilters={true} />
  }

  return (
    <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {candidates.map((c) => (
        <CandidateCard key={c.id} candidate={c} />
      ))}
    </div>
  )
}
