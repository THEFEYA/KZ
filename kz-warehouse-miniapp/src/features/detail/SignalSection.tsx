import type { ReactNode } from 'react'
import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import { Chip } from '@shared/ui/Chip'
import type { CandidateDetail } from '@core/types/candidate'

interface SignalSectionProps {
  detail: CandidateDetail
}

export function SignalSection({ detail }: SignalSectionProps) {
  return (
    <Section title="Сигнал">
      <Panel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Тип сигнала">
            <Chip variant="accent">{detail.normalizedSignalType}</Chip>
          </Field>

          {detail.objectAnchor && (
            <Field label="Объект">
              <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
                {detail.objectAnchor}
              </span>
            </Field>
          )}

          {detail.demandHint && (
            <Field label="Подсказка спроса">
              <span
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                {detail.demandHint}
              </span>
            </Field>
          )}

          {detail.sourceLabel && (
            <Field label="Источник">
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                {detail.sourceLabel}
              </span>
            </Field>
          )}
        </div>
      </Panel>
    </Section>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-tertiary)',
          fontWeight: 'var(--fw-medium)',
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
