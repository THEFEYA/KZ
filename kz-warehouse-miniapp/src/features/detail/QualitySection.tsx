import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import { Chip } from '@shared/ui/Chip'
import type { CandidateDetail } from '@core/types/candidate'

interface QualitySectionProps {
  detail: CandidateDetail
}

export function QualitySection({ detail }: QualitySectionProps) {
  const qualityScore = detail.qualityScore
  const leadScore = detail.leadScore

  // Collect enriched meta chips: status, relevance, duplicates
  const metaChips: { label: string; value: string }[] = [
    ...(detail.leadStatusRu     ? [{ label: 'Статус лида',   value: detail.leadStatusRu }]     : []),
    ...(detail.relevanceLabelRu ? [{ label: 'Релевантность', value: detail.relevanceLabelRu }] : []),
    ...(detail.duplicateCount != null && detail.duplicateCount > 0
      ? [{ label: 'Дубликатов', value: String(detail.duplicateCount) }]
      : []),
  ]

  return (
    <Section title="Качество сигнала">
      <Panel>
        <div style={{ display: 'flex', gap: 16, marginBottom: metaChips.length > 0 ? 14 : 0 }}>
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
          {leadScore != null && leadScore !== qualityScore && (
            <QualityItem
              label="Оценка лида"
              value={leadScore.toFixed(1)}
              color={
                leadScore >= 7
                  ? 'var(--color-success)'
                  : leadScore >= 4
                    ? 'var(--color-warm)'
                    : 'var(--color-cold)'
              }
            />
          )}
          <QualityItem
            label="Доказательства"
            value={String(detail.evidenceCount)}
            color="var(--color-accent)"
          />
        </div>

        {metaChips.length > 0 && (
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 10,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
            }}
          >
            {metaChips.map((c) => (
              <div key={c.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {c.label}
                </span>
                <Chip variant="default" size="sm">{c.value}</Chip>
              </div>
            ))}
          </div>
        )}
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
