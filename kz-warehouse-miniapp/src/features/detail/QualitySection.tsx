import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import type { CandidateDetail } from '@core/types/candidate'

interface QualitySectionProps {
  detail: CandidateDetail
}

export function QualitySection({ detail }: QualitySectionProps) {
  const qualityScore = detail.qualityScore

  return (
    <Section title="Качество сигнала">
      <Panel>
        <div style={{ display: 'flex', gap: 16 }}>
          <QualityItem
            label="Оценка качества"
            value={qualityScore != null ? qualityScore.toFixed(1) : '—'}
            color={
              qualityScore != null && qualityScore >= 7
                ? 'var(--color-success)'
                : qualityScore != null && qualityScore >= 4
                  ? 'var(--color-warm)'
                  : 'var(--color-cold)'
            }
          />
          <QualityItem
            label="Доказательства"
            value={String(detail.evidenceCount)}
            color="var(--color-accent)"
          />
        </div>
      </Panel>
    </Section>
  )
}

function QualityItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div
        style={{
          fontSize: 'var(--text-2xl)',
          fontWeight: 'var(--fw-bold)',
          color,
          lineHeight: 1.1,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          marginTop: 4,
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
    </div>
  )
}
