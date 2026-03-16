import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'
import { SummaryStrip } from '@features/overview/SummaryStrip'
import { MainInsightCard } from '@features/overview/MainInsightCard'
import { ModeRail } from '@features/overview/ModeRail'
import { QueueEntryCards } from '@features/overview/QueueEntryCards'
import { AnalyticsPreview } from '@features/overview/AnalyticsPreview'
import { TopCandidateHero } from '@features/overview/TopCandidateHero'
import { PriorityPreviewBlock } from '@features/overview/PriorityPreviewBlock'
import { ActiveFiltersBar } from '@features/filters/ActiveFiltersBar'
import { useOverviewQuery, useConfirmedLeadsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'
import { SourceBadge } from '@shared/ui/SourceBadge'

export function OverviewPage() {
  const filters = useFilters()
  const mode = useActiveMode()
  const { data, isLoading, error } = useOverviewQuery(filters, mode)

  const { data: confirmedLeadsData } = useConfirmedLeadsQuery(5)

  const overviewData  = data?.overviewData  ?? null
  const analyticsData = data?.analyticsData ?? null
  const source        = data?.source        ?? null

  const summary = overviewData?.summary
    ? { ...overviewData.summary, confirmedLeads: confirmedLeadsData?.count ?? overviewData.summary.confirmedLeads }
    : null

  const priorityPreview = overviewData?.priorityPreview ?? null
  const topCandidate    = priorityPreview?.topCandidate  ?? null

  return (
    <>
      <ActiveFiltersBar />
      <Page>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', paddingTop: 'var(--space-4)' }}>

          {/* [DEBUG] V2 + source markers */}
          <div style={{ display: 'flex', gap: 6, padding: '0 var(--space-4)' }}>
            <span style={{ padding: '3px 9px', background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: 5, fontSize: 11, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em' }}>
              [LIVE V2]
            </span>
            {source && <SourceBadge source={source} />}
          </div>

          <Section noPadding>
            <SummaryStrip summary={summary} loading={isLoading} />
          </Section>

          {(priorityPreview && (priorityPreview.openFirst > 0 || priorityPreview.priorityCount > 0)) && (
            <Section title="Приоритет" noPadding>
              <PriorityPreviewBlock preview={priorityPreview} />
            </Section>
          )}

          {topCandidate && (
            <Section title="Открыть первым" noPadding>
              <TopCandidateHero candidate={topCandidate} />
            </Section>
          )}

          {!topCandidate && (
            <MainInsightCard data={analyticsData} loading={isLoading} mainInsight={overviewData?.mainInsight ?? null} />
          )}
          {topCandidate && (overviewData?.mainInsight || analyticsData?.topInsight) && (
            <MainInsightCard data={analyticsData} loading={false} mainInsight={overviewData?.mainInsight ?? null} />
          )}

          <Section noPadding><ModeRail /></Section>

          <Section title="Быстрый доступ" noPadding>
            <QueueEntryCards summary={summary} />
          </Section>

          <Section title="Аналитика среза" noPadding>
            <AnalyticsPreview
              data={analyticsData}
              loading={isLoading}
              analyticsPreview={overviewData?.analyticsPreview ?? null}
            />
          </Section>

          {error && (
            <div style={{ padding: '0 var(--space-4)' }}>
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--color-error)' }}>
                Ошибка загрузки: {(error as Error).message}
              </div>
            </div>
          )}
        </div>
      </Page>
    </>
  )
}
