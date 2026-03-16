import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import { AnalyticsTypeSwitcher } from '@features/analytics/AnalyticsTypeSwitcher'
import { AnalyticsSliceTabs } from '@features/analytics/AnalyticsSliceTabs'
import { SourceChart } from '@features/analytics/SourceChart'
import { ContactChart } from '@features/analytics/ContactChart'
import { RoleChart } from '@features/analytics/RoleChart'
import { QueueChart } from '@features/analytics/QueueChart'
import { HeatChart } from '@features/analytics/HeatChart'
import { FreshnessChart } from '@features/analytics/FreshnessChart'
import { SourceTierChart } from '@features/analytics/SourceTierChart'
import { CardSkeleton } from '@shared/ui/Skeleton'
import { ErrorState } from '@shared/ui/ErrorState'
import { EmptyState } from '@shared/ui/EmptyState'
import { buildDetailRoute } from '@core/config/routes'
import { useAnalyticsQuery, useConfirmedLeadsQuery } from '@core/supabase/queries'
import { useFilters, useActiveMode } from '@core/state/selectors'
import type { AnalyticsViewType, AnalyticsSlice } from '@core/types/analytics'

export function AnalyticsPage() {
  const [viewType, setViewType] = useState<AnalyticsViewType>('comparison')
  const [slice, setSlice] = useState<AnalyticsSlice>('source')

  const navigate = useNavigate()
  const filters = useFilters()
  const mode = useActiveMode()
  const { data: analytics, isLoading, error, refetch } = useAnalyticsQuery(filters, mode)
  const { data: confirmedLeadsData } = useConfirmedLeadsQuery(1)

  const confirmedCount = confirmedLeadsData?.count ?? analytics?.summary.confirmedLeads ?? 0
  const withContact = analytics?.summary.withContact
    ?? (analytics ? analytics.summary.directContact + analytics.summary.contactPath : 0)

  const renderChart = () => {
    if (!analytics) return null
    switch (slice) {
      case 'source':      return <SourceChart data={analytics} viewType={viewType} />
      case 'contact_type':return <ContactChart data={analytics} viewType={viewType} />
      case 'market_role': return <RoleChart data={analytics} />
      case 'queue':       return <QueueChart data={analytics} />
      case 'heat':        return <HeatChart data={analytics} />
      case 'freshness':   return <FreshnessChart data={analytics} />
      case 'source_tier': return <SourceTierChart data={analytics} />
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
        {/* [DEBUG] ANALYTICS V2 marker */}
        <div style={{ margin: '0 var(--space-4)', padding: '4px 10px', background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: 6, fontSize: 11, fontWeight: 700, color: '#00d4ff', letterSpacing: '0.08em' }}>
          [ANALYTICS V2]
        </div>

        {/* 1. Summary */}
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
                { label: 'Подтверждённые', value: confirmedCount, color: 'var(--color-confirmed)', subtitle: 'всего' },
                { label: 'Есть контакт', value: withContact, color: 'var(--color-path-contact)' },
                { label: 'Прямой контакт', value: analytics.summary.directContact, color: 'var(--color-direct-contact)' },
                { label: 'Без контакта', value: analytics.summary.noContact, color: 'var(--color-no-contact)' },
                ...(analytics.summary.avgRank > 0 ? [{ label: 'Средний ранг', value: Math.round(analytics.summary.avgRank), subtitle: 'б' }] : []),
                ...(analytics.summary.avgScore > 0 ? [{ label: 'Средняя оценка', value: Math.round(analytics.summary.avgScore), subtitle: 'б' }] : []),
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
                  {'subtitle' in m && m.subtitle && (
                    <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', marginTop: 1, opacity: 0.7 }}>
                      {m.subtitle}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 2. Priority preview — from analytics_screen_v1 */}
        {analytics?.priorityPreview && (
          <Section title="Приоритет" noPadding>
            <div
              className="scroll-x"
              style={{ display: 'flex', gap: 8, padding: '0 var(--space-4)' }}
            >
              {[
                { label: 'Открыть первым', value: analytics.priorityPreview.openFirst, color: 'var(--color-accent)' },
                { label: 'Высокий приоритет', value: analytics.priorityPreview.priorityCount, color: 'var(--color-hot)' },
                { label: 'На проверке', value: analytics.priorityPreview.reviewCount, color: 'var(--color-review)' },
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
                  <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--fw-bold)', color: m.color, fontVariantNumeric: 'tabular-nums' }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 2 }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Top candidate quick link */}
            {analytics.priorityPreview.topCandidate && (
              <Panel
                style={{ margin: '8px var(--space-4) 0', cursor: 'pointer' }}
                onClick={() => navigate(buildDetailRoute(analytics.priorityPreview!.topCandidate!.id))}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginBottom: 3 }}>
                      Топ-кандидат
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-text-primary)' }}>
                      {analytics.priorityPreview.topCandidate.displayLabel}
                    </div>
                    {analytics.priorityPreview.topCandidate.signalType && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', marginTop: 3 }}>
                        {analytics.priorityPreview.topCandidate.signalType}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>→</span>
                </div>
              </Panel>
            )}
          </Section>
        )}

        {/* View type switcher */}
        <AnalyticsTypeSwitcher value={viewType} onChange={setViewType} />

        {/* 3. Slice tabs — order: by_queue, by_source, by_contact, by_heat, by_freshness, by_source_tier, by_role */}
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
