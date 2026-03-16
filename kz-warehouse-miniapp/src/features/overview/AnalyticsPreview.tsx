import { useNavigate } from 'react-router-dom'
import { Panel } from '@shared/ui/Panel'
import { MiniBars } from '@shared/charts/MiniBars'
import { Skeleton } from '@shared/ui/Skeleton'
import { toMiniBarData } from '@core/utils/chartTransforms'
import type { AnalyticsData, BreakdownItem } from '@core/types/analytics'

interface AnalyticsPreviewProps {
  data: AnalyticsData | null
  loading?: boolean
  analyticsPreview?: { bySource: BreakdownItem[]; byHeat: BreakdownItem[] } | null
}

export function AnalyticsPreview({ data, loading, analyticsPreview }: AnalyticsPreviewProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <Panel style={{ margin: '0 var(--space-4)' }}>
        <Skeleton width="50%" height={12} style={{ marginBottom: 12 }} />
        <Skeleton width="100%" height={32} borderRadius="var(--radius-sm)" />
      </Panel>
    )
  }

  if (!data && !analyticsPreview) return null

  // Prefer overview_screen_v1 analytics_preview when available
  const bySource = analyticsPreview?.bySource ?? data?.bySource ?? []
  const byHeat   = analyticsPreview?.byHeat   ?? data?.byHeat   ?? []
  const sourceData = toMiniBarData(bySource, 6)
  const heatData   = toMiniBarData(byHeat,   3)

  return (
    <Panel
      onClick={() => navigate('/analytics')}
      style={{ margin: '0 var(--space-4)' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Обзор срезов
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>
          Детали →
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 8,
            }}
          >
            По источникам
          </div>
          <MiniBars data={sourceData} height={36} />
        </div>
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-tertiary)',
              marginBottom: 8,
            }}
          >
            По горячести
          </div>
          <MiniBars data={heatData} height={36} />
        </div>
      </div>
    </Panel>
  )
}
