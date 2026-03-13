import { useState } from 'react'
import { Page } from '@shared/ui/Page'
import { QueueTabs } from '@features/queues/QueueTabs'
import { QueueToolbar } from '@features/queues/QueueToolbar'
import { QueueList } from '@features/queues/QueueList'
import { ActiveFiltersBar } from '@features/filters/ActiveFiltersBar'
import { useQueueQuery, useAnalyticsQuery, useConfirmedLeadsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'
import type { QueueBucket } from '@core/types/candidate'

export function QueuesPage() {
  const [activeBucket, setActiveBucket] = useState<QueueBucket>('action_queue')
  const filters = useFilters()
  const mode = useActiveMode()

  const isConfirmedTab = activeBucket === 'confirmed_leads'

  // action_queue + review_queue → kz_miniapp_queue_v2
  // confirmed tab is disabled here — served by useConfirmedLeadsQuery below
  const {
    data: queueCandidates = [],
    isLoading: queueLoading,
    error: queueError,
    refetch: queueRefetch,
  } = useQueueQuery(
    isConfirmedTab ? 'action_queue' : activeBucket,
    filters,
    mode,
    !isConfirmedTab,  // disabled when on confirmed tab
  )

  // Confirmed leads → public.kz_confirmed_leads (NOT kz_miniapp_queue_v2)
  // kz_confirmed_leads returns { ok, count=3, items=[...] }
  const {
    data: confirmedLeadsData,
    isLoading: confirmedLoading,
    error: confirmedError,
    refetch: confirmedRefetch,
  } = useConfirmedLeadsQuery(filters.limit || 10)

  const { data: analytics } = useAnalyticsQuery(filters, mode)

  // Active tab data
  const candidates = isConfirmedTab ? (confirmedLeadsData?.items ?? []) : queueCandidates
  const isLoading  = isConfirmedTab ? confirmedLoading  : queueLoading
  const error      = isConfirmedTab ? confirmedError    : queueError
  const refetch    = isConfirmedTab ? confirmedRefetch  : queueRefetch

  // Tab badge counts — confirmed from kz_confirmed_leads.count, not analytics
  const counts: Partial<Record<QueueBucket, number>> = {
    action_queue:    analytics?.summary.actionQueue,
    review_queue:    analytics?.summary.reviewQueue,
    confirmed_leads: confirmedLeadsData?.count ?? analytics?.summary.confirmedLeads,
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
