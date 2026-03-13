import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'
import { SummaryStrip } from '@features/overview/SummaryStrip'
import { MainInsightCard } from '@features/overview/MainInsightCard'
import { ModeRail } from '@features/overview/ModeRail'
import { QueueEntryCards } from '@features/overview/QueueEntryCards'
import { AnalyticsPreview } from '@features/overview/AnalyticsPreview'
import { ActiveFiltersBar } from '@features/filters/ActiveFiltersBar'
import { useAnalyticsQuery, useConfirmedLeadsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'

export function OverviewPage() {
  const filters = useFilters()
  const mode = useActiveMode()
  const { data: analytics, isLoading, error } = useAnalyticsQuery(filters, mode)

  // Get accurate confirmed leads count from the correct source
  const { data: confirmedLeadsData } = useConfirmedLeadsQuery(5)

  // Merge: override confirmedLeads in summary with value from kz_confirmed_leads
  const mergedSummary = analytics?.summary
    ? {
        ...analytics.summary,
        confirmedLeads: confirmedLeadsData?.count ?? analytics.summary.confirmedLeads,
      }
    : null

  return (
    <>
      <ActiveFiltersBar />
      <Page>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', paddingTop: 'var(--space-4)' }}>

          {/* Summary metrics strip */}
          <Section noPadding>
            <SummaryStrip
              summary={mergedSummary}
              loading={isLoading}
            />
          </Section>

          {/* Key insight */}
          <MainInsightCard
            data={analytics ?? null}
            loading={isLoading}
          />

          {/* Mode selector */}
          <Section noPadding>
            <ModeRail />
          </Section>

          {/* Queue entry cards */}
          <Section title="Быстрый доступ" noPadding>
            <QueueEntryCards summary={mergedSummary} />
          </Section>

          {/* Analytics mini-preview */}
          <Section title="Аналитика среза" noPadding>
            <AnalyticsPreview
              data={analytics ?? null}
              loading={isLoading}
            />
          </Section>

          {error && (
            <div style={{ padding: '0 var(--space-4)' }}>
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-error)',
                }}
              >
                Ошибка загрузки данных: {(error as Error).message}
              </div>
            </div>
          )}
        </div>
      </Page>
    </>
  )
}
