import { Section } from '@shared/ui/Section'
import { LinkAction } from '@shared/ui/LinkAction'
import type { SourceLink } from '@core/types/candidate'

interface SourceLinksSectionProps {
  links: SourceLink[] | null
}

export function SourceLinksSection({ links }: SourceLinksSectionProps) {
  if (!links || links.length === 0) return null

  return (
    <Section title="Источники">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {links.map((link, i) => (
          <LinkAction key={i} href={link.url} icon="⊞">
            {link.label}
          </LinkAction>
        ))}
      </div>
    </Section>
  )
}
