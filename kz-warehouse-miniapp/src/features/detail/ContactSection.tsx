import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import { Chip } from '@shared/ui/Chip'
import { LinkAction } from '@shared/ui/LinkAction'
import type { CandidateDetail, ContactInfo, ContactPathStep } from '@core/types/candidate'

interface ContactSectionProps {
  detail: CandidateDetail
}

export function ContactSection({ detail }: ContactSectionProps) {
  const hasContacts = !!(detail.contacts && detail.contacts.length > 0)
  const hasPath = !!(detail.contactPath && detail.contactPath.length > 0)

  // Fallback URLs for 'path' state when no explicit contactPath[] steps exist
  const websiteUrl  = detail.sourceLinks?.find(l => l.label === 'Сайт компании')?.url ?? null
  const proofUrl    = detail.sourceLinks?.find(l => l.label === 'Доказательство')?.url ?? null
  const fallbackUrl = websiteUrl ?? proofUrl ?? null

  // Only show "not found" panel when status is explicitly none
  const noContact = detail.contactStatus === 'none' && !hasContacts && !hasPath

  return (
    <Section
      title="Связь"
      subtitle={
        detail.contactStatus === 'direct'
          ? 'Прямой контакт найден'
          : detail.contactStatus === 'path'
            ? 'Есть путь к контакту'
            : 'Контактная информация не найдена'
      }
    >
      {noContact ? (
        <Panel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Chip variant="none" dot>Контакт не найден</Chip>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
              Сильный сигнал сохраняет ценность
            </span>
          </div>
        </Panel>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {hasContacts && detail.contacts!.map((contact, i) => (
            <ContactCard key={i} contact={contact} />
          ))}
          {!hasContacts && hasPath && (
            <Panel>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--color-path-contact)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 10,
                }}
              >
                Путь связи
              </div>
              {detail.contactPath!.map((step) => (
                <PathStep key={step.step} step={step} />
              ))}
            </Panel>
          )}
          {!hasContacts && !hasPath && detail.contactStatus === 'path' && (
            <Panel>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--fw-semibold)',
                  color: 'var(--color-path-contact)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: 8,
                }}
              >
                Есть путь связи
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: fallbackUrl ? 10 : 0 }}>
                Прямого контакта нет, но по источнику или сайту компании можно выйти на нужного человека.
              </p>
              {fallbackUrl && (
                <LinkAction href={fallbackUrl} icon="↗">
                  {websiteUrl ? 'Сайт компании' : 'Доказательство / источник'}
                </LinkAction>
              )}
            </Panel>
          )}
          {!hasContacts && !hasPath && detail.contactStatus === 'direct' && (
            <Panel>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                Данные о контакте уточняются
              </span>
            </Panel>
          )}
        </div>
      )}
    </Section>
  )
}

function ContactCard({ contact }: { contact: ContactInfo }) {
  return (
    <Panel>
      {contact.name && (
        <div
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 'var(--fw-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 8,
          }}
        >
          {contact.name}
        </div>
      )}
      {contact.role && (
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 10 }}>
          {contact.role}
        </div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {contact.phone && (
          <LinkAction href={`tel:${contact.phone}`} icon="📞">{contact.phone}</LinkAction>
        )}
        {contact.email && (
          <LinkAction href={`mailto:${contact.email}`} icon="✉">{contact.email}</LinkAction>
        )}
        {contact.telegram && (
          <LinkAction href={`https://t.me/${contact.telegram.replace('@', '')}`} icon="✈">
            {contact.telegram}
          </LinkAction>
        )}
      </div>
    </Panel>
  )
}

function PathStep({ step }: { step: ContactPathStep }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--color-accent-dim)',
          border: '1px solid var(--color-accent-glow)',
          color: 'var(--color-accent)',
          fontSize: 11,
          fontWeight: 'var(--fw-bold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {step.step}
      </span>
      <div>
        {step.entity && (
          <div
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 2,
            }}
          >
            {step.entity}
          </div>
        )}
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
          {step.description}
        </div>
      </div>
    </div>
  )
}
