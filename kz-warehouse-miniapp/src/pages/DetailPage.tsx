import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Page } from '@shared/ui/Page'
import { DetailHeader } from '@features/detail/DetailHeader'
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
        <DetailHeader detail={detail} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            paddingTop: 'var(--space-4)',
          }}
        >
          <SignalSection detail={detail} />
          <QualitySection detail={detail} />
          <ContactSection detail={detail} />
          <EvidenceSection evidences={detail.evidences} />
          <SourceLinksSection links={detail.sourceLinks} />
        </div>
      </div>
    </Page>
  )
}
