import { SegmentedControl } from '@shared/ui/SegmentedControl'
import type { AnalyticsViewType } from '@core/types/analytics'

interface AnalyticsTypeSwitcherProps {
  value: AnalyticsViewType
  onChange: (v: AnalyticsViewType) => void
}

const SEGMENTS = [
  { value: 'comparison' as AnalyticsViewType, label: 'Сравнение' },
  { value: 'structure'  as AnalyticsViewType, label: 'Структура' },
  { value: 'contacts'   as AnalyticsViewType, label: 'Связи' },
]

export function AnalyticsTypeSwitcher({ value, onChange }: AnalyticsTypeSwitcherProps) {
  return (
    <div style={{ padding: '0 var(--space-4)' }}>
      <SegmentedControl segments={SEGMENTS} value={value} onChange={onChange} />
    </div>
  )
}
