import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import type { CandidateExplanation } from '@core/types/candidate'

interface ExplanationBlockProps {
  explanation: CandidateExplanation
}

export function ExplanationBlock({ explanation }: ExplanationBlockProps) {
  const hasBullets = explanation.bulletsRu && explanation.bulletsRu.length > 0
  const hasContent = explanation.titleRu || explanation.summaryRu || hasBullets || explanation.operatorHintRu

  if (!hasContent) return null

  return (
    <Section title={explanation.titleRu ?? 'Почему важен'}>
      <Panel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Priority label */}
          {explanation.priorityLabelRu && (
            <span
              style={{
                display: 'inline-block',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--fw-semibold)',
                color: 'var(--color-accent)',
                background: 'var(--color-accent-dim)',
                border: '1px solid var(--color-accent-glow)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px 8px',
                alignSelf: 'flex-start',
              }}
            >
              {explanation.priorityLabelRu}
            </span>
          )}

          {/* Summary */}
          {explanation.summaryRu && (
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--lh-relaxed)',
                margin: 0,
              }}
            >
              {explanation.summaryRu}
            </p>
          )}

          {/* Bullets */}
          {hasBullets && (
            <ul
              style={{
                margin: 0,
                paddingLeft: 0,
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {explanation.bulletsRu!.map((bullet, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 'var(--lh-relaxed)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      flexShrink: 0,
                      marginTop: 2,
                      fontSize: 10,
                    }}
                  >
                    ◆
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {/* Operator hint */}
          {explanation.operatorHintRu && (
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: 10,
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: 'var(--color-accent)', flexShrink: 0, fontSize: 13 }}>→</span>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-primary)',
                  lineHeight: 'var(--lh-relaxed)',
                  fontWeight: 'var(--fw-medium)',
                  margin: 0,
                }}
              >
                {explanation.operatorHintRu}
              </p>
            </div>
          )}
        </div>
      </Panel>
    </Section>
  )
}
