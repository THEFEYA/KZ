import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Page } from '@shared/ui/Page'
import { QueueTabs } from '@features/queues/QueueTabs'
import { QueueToolbar } from '@features/queues/QueueToolbar'
import { QueueList } from '@features/queues/QueueList'
import { ActiveFiltersBar } from '@features/filters/ActiveFiltersBar'
import { SourceBadge } from '@shared/ui/SourceBadge'
import { useQueueQuery, useAnalyticsQuery, useConfirmedLeadsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'
import type { QueueBucket } from '@core/types/candidate'

const VALID_BUCKETS: QueueBucket[] = ['action_queue', 'review_queue', 'confirmed_leads']

export function QueuesPage() {
  const [searchParams] = useSearchParams()
  const bucketParam = searchParams.get('bucket') as QueueBucket | null
  const initialBucket: QueueBucket =
    bucketParam && VALID_BUCKETS.includes(bucketParam) ? bucketParam : 'action_queue'
  const [activeBucket, setActiveBucket] = useState<QueueBucket>(initialBucket)
  const filters = useFilters()
  const mode = useActiveMode()

  const isConfirmedTab = activeBucket === 'confirmed_leads'

  // Primary: runtime action "queue" (with priority+card_reason)
  // Fallback: kz_miniapp_queue_v2
  const {
    data: queueData,
    isLoading: queueLoading,
    error: queueError,
    refetch: queueRefetch,
  } = useQueueQuery(
    isConfirmedTab ? 'action_queue' : activeBucket,
    filters,
    mode,
    !isConfirmedTab,
  )

  const {
    data: confirmedLeadsData,
    isLoading: confirmedLoading,
    error: confirmedError,
    refetch: confirmedRefetch,
  } = useConfirmedLeadsQuery(filters.limit || 10)

  const { data: analyticsData } = useAnalyticsQuery(filters, mode)
  const analytics = analyticsData?.analytics ?? null

  const candidates  = isConfirmedTab ? (confirmedLeadsData?.items ?? []) : (queueData?.items ?? [])
  const isLoading   = isConfirmedTab ? confirmedLoading : queueLoading
  const error       = isConfirmedTab ? confirmedError   : queueError
  const refetch     = isConfirmedTab ? confirmedRefetch : queueRefetch
  const source      = isConfirmedTab ? null : (queueData?.source ?? null)

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

      {/* [DEBUG] QUEUE V2 + source marker */}
      <div style={{ display: 'flex', gap: 6, padding: '6px var(--space-4) 0' }}>
        <span style={{ padding: '3px 9px', background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: 5, fontSize: 11, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em' }}>
          [QUEUE V2]
        </span>
        {source && <SourceBadge source={source} />}
      </div>

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
