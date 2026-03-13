import { useState } from 'react'
import { Page } from '@shared/ui/Page'
import { QueueTabs } from '@features/queues/QueueTabs'
import { QueueToolbar } from '@features/queues/QueueToolbar'
import { QueueList } from '@features/queues/QueueList'
import { ActiveFiltersBar } from '@features/filters/ActiveFiltersBar'
import { useQueueQuery, useAnalyticsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'
import type { QueueBucket } from '@core/types/candidate'

export function QueuesPage() {
  const [activeBucket, setActiveBucket] = useState<QueueBucket>('action_queue')
  const filters = useFilters()
  const mode = useActiveMode()

  const { data: candidates = [], isLoading, error, refetch } = useQueueQuery(activeBucket, filters, mode)
  const { data: analytics } = useAnalyticsQuery(filters, mode)

  const counts: Partial<Record<QueueBucket, number>> = {
    action_queue: analytics?.summary.actionQueue,
    review_queue: analytics?.summary.reviewQueue,
    confirmed_leads: analytics?.summary.confirmedLeads,
  }

  return (
    <>
      <QueueTabs active={activeBucket} onChange={setActiveBucket} counts={counts} />
      <ActiveFiltersBar />
      <QueueToolbar candidates={candidates} total={candidates.length} />
      <Page>
        <div style={{ padding: '0 var(--space-4)', paddingBottom: 'var(--space-4)' }}>
          <QueueList
            candidates={candidates}
            loading={isLoading}
            error={error as Error | null}
            onRetry={() => refetch()}
          />
        </div>
      </Page>
    </>
  )
}
