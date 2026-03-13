import { useState } from 'react'
import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'
import { AnalyticsTypeSwitcher } from '@features/analytics/AnalyticsTypeSwitcher'
import { AnalyticsSliceTabs } from '@features/analytics/AnalyticsSliceTabs'
import { SourceChart } from '@features/analytics/SourceChart'
import { ContactChart } from '@features/analytics/ContactChart'
import { RoleChart } from '@features/analytics/RoleChart'
import { QueueChart } from '@features/analytics/QueueChart'
import { HeatChart } from '@features/analytics/HeatChart'
import { FreshnessChart } from '@features/analytics/FreshnessChart'
import { CardSkeleton } from '@shared/ui/Skeleton'
import { ErrorState } from '@shared/ui/ErrorState'
import { EmptyState } from '@shared/ui/EmptyState'
import { useAnalyticsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'
import type { AnalyticsViewType, AnalyticsSlice } from '@core/types/analytics'

export function AnalyticsPage() {
  const [viewType, setViewType] = useState<AnalyticsViewType>('comparison')
  const [slice, setSlice] = useState<AnalyticsSlice>('source')

  const filters = useFilters()
  const mode = useActiveMode()
  const { data: analytics, isLoading, error, refetch } = useAnalyticsQuery(filters, mode)

  const renderChart = () => {
    if (!analytics) return null
    switch (slice) {
      case 'source':      return <SourceChart data={analytics} viewType={viewType} />
      case 'contact_type':return <ContactChart data={analytics} viewType={viewType} />
      case 'market_role': return <RoleChart data={analytics} />
      case 'queue':       return <QueueChart data={analytics} />
      case 'heat':        return <HeatChart data={analytics} />
      case 'freshness':   return <FreshnessChart data={analytics} />
    }
  }

  return (
    <Page>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
        }}
      >
        {/* Summary strip */}
        {analytics && (
          <Section title="Сводка" noPadding>
            <div
              className="scroll-x"
              style={{ display: 'flex', gap: 8, padding: '0 var(--space-4)' }}
            >
              {[
                { label: 'Всего', value: analytics.summary.total },
                { label: 'Рабочая', value: analytics.summary.actionQueue, color: 'var(--color-action)' },
                { label: 'Проверка', value: analytics.summary.reviewQueue, color: 'var(--color-review)' },
                { label: 'Подтверждённые', value: analytics.summary.confirmedLeads, color: 'var(--color-confirmed)' },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    flexShrink: 0,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 14px',
                    minWidth: 80,
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--text-xl)',
                      fontWeight: 'var(--fw-bold)',
                      color: m.color ?? 'var(--color-text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {m.value}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* View type switcher */}
        <AnalyticsTypeSwitcher value={viewType} onChange={setViewType} />

        {/* Slice tabs */}
        <AnalyticsSliceTabs value={slice} onChange={setSlice} />

        {/* Chart */}
        {isLoading && (
          <div style={{ padding: '0 var(--space-4)' }}>
            <CardSkeleton />
          </div>
        )}
        {error && (
          <ErrorState
            title="Ошибка загрузки аналитики"
            message={(error as Error).message}
            onRetry={() => refetch()}
          />
        )}
        {!isLoading && !error && !analytics && (
          <EmptyState icon="◌" title="Нет данных для анализа" />
        )}
        {!isLoading && analytics && renderChart()}
      </div>
    </Page>
  )
}
