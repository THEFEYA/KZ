import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import { LinkAction } from '@shared/ui/LinkAction'
import type { Evidence } from '@core/types/candidate'
import { formatDate } from '@core/utils/format'

interface EvidenceSectionProps {
  evidences: Evidence[] | null
  evidenceShort?: string | null
  evidenceFull?: string | null
}

export function EvidenceSection({ evidences, evidenceShort, evidenceFull }: EvidenceSectionProps) {
  const hasItems = evidences && evidences.length > 0
  const hasSummary = !!(evidenceShort || evidenceFull)
  if (!hasItems && !hasSummary) return null

  return (
    <Section title={hasItems ? `Доказательства · ${evidences!.length}` : 'Доказательства'}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {!hasItems && hasSummary && (
          <Panel>
            {evidenceShort && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: evidenceFull ? 10 : 0 }}>
                {evidenceShort}
              </p>
            )}
            {evidenceFull && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--lh-relaxed)', opacity: 0.85 }}>
                {evidenceFull}
              </p>
            )}
          </Panel>
        )}
        {hasItems && evidences!.map((ev, i) => (
          <EvidenceCard key={i} evidence={ev} />
        ))}
      </div>
    </Section>
  )
}

function EvidenceCard({ evidence: ev }: { evidence: Evidence }) {
  return (
    <Panel>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {ev.type}
        </span>
        {ev.date && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', flexShrink: 0 }}>
            {formatDate(ev.date)}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: 'var(--lh-relaxed)',
          marginBottom: ev.url || ev.source ? 10 : 0,
        }}
      >
        {ev.text}
      </p>

      {(ev.url || ev.source) && (
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 8 }}>
          {ev.url ? (
            <LinkAction href={ev.url}>{ev.source ?? 'Источник'}</LinkAction>
          ) : (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
              {ev.source}
            </span>
          )}
        </div>
      )}
    </Panel>
  )
}
