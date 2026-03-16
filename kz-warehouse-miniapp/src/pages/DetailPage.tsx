import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Page } from '@shared/ui/Page'
import { DetailHeader } from '@features/detail/DetailHeader'
import { ActionRow } from '@features/detail/ActionRow'
import { PriorityBanner } from '@features/detail/PriorityBanner'
import { ExplanationBlock } from '@features/detail/ExplanationBlock'
import { SignalSection } from '@features/detail/SignalSection'
import { QualitySection } from '@features/detail/QualitySection'
import { ContactSection } from '@features/detail/ContactSection'
import { EvidenceSection } from '@features/detail/EvidenceSection'
import { SourceLinksSection } from '@features/detail/SourceLinksSection'
import { CardSkeleton } from '@shared/ui/Skeleton'
import { ErrorState } from '@shared/ui/ErrorState'
import { EmptyState } from '@shared/ui/EmptyState'
import { useDetailQuery } from '@core/supabase/queries'
import { showBackButton } from '@core/telegram/buttons'

export function DetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: detail, isLoading, error, refetch } = useDetailQuery(id ?? null)

  useEffect(() => {
    return showBackButton(() => navigate(-1))
  }, [navigate])

  if (isLoading) {
    return (
      <Page>
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </Page>
    )
  }

  if (error) {
    return (
      <Page>
        <ErrorState
          title="Не удалось загрузить детали"
          message={(error as Error).message}
          onRetry={() => refetch()}
        />
      </Page>
    )
  }

  if (!detail) {
    return (
      <Page>
        <EmptyState icon="◌" title="Запись не найдена" />
      </Page>
    )
  }

  return (
    <Page>
      <div className="animate-fade-in-up" style={{ paddingTop: 'var(--space-2)' }}>
        {/* Header: name, entity type, region, heat, freshness */}
        <DetailHeader detail={detail} />

        {/* Action buttons: contact, source, manager, review */}
        <ActionRow detail={detail} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, paddingTop: 'var(--space-3)' }}>

          {/* 1. Priority banner — open_first_reason + priority_band + score */}
          {detail.priority && (
            <div style={{ paddingBottom: 'var(--space-3)' }}>
              <PriorityBanner priority={detail.priority} />
            </div>
          )}

          {/* 2. Explanation — why this record is important */}
          {detail.explanation && (
            <ExplanationBlock explanation={detail.explanation} />
          )}

          {/* 3. Signal — signal_type, object_anchor, demand_hint, source */}
          <SignalSection detail={detail} />

          {/* 4. Quality — score, heat, freshness, evidence count */}
          <QualitySection detail={detail} />

          {/* 5. Contact / Path block */}
          <ContactSection detail={detail} />

          {/* 6. Evidence */}
          <EvidenceSection
            evidences={detail.evidences}
            evidenceShort={detail.evidenceShort}
            evidenceFull={detail.evidenceFull}
          />

          {/* Source links (proof_url, company_website) */}
          <SourceLinksSection links={detail.sourceLinks} />

          {/* 7. Active lead alert — only when not null */}
          {detail.leadStatusRu && (
            <div
              style={{
                margin: 'var(--space-3) var(--space-4) 0',
                padding: 'var(--space-3)',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13 }}>✦</span>
              <div>
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--fw-semibold)',
                    color: 'rgba(59,130,246,0.9)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Активный лид
                </span>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {detail.leadStatusRu}
                  {detail.leadScore != null && ` · Оценка: ${detail.leadScore}`}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </Page>
  )
}
