import { useState } from 'react'
import { Page } from '@shared/ui/Page'
import { Section } from '@shared/ui/Section'
import { Panel } from '@shared/ui/Panel'
import { ThemeSheet } from '@features/settings/ThemeSheet'
import { ThemePresetCard } from '@features/settings/ThemePresetCard'
import { useThemeId, useSetTheme } from '@core/state/selectors'
import { hapticSelect } from '@core/telegram/haptics'
import type { ThemeId, Theme } from '@core/types/ui'

const THEMES: Theme[] = [
  {
    id: 'night-ops',
    ruName: 'Ночной режим',
    description: 'Тёмный синий, cyan-акценты',
    previewColors: ['#0a0d14', '#00d4ff', '#0066ff'],
  },
  {
    id: 'acid-pulse',
    ruName: 'Кислотный импульс',
    description: 'Кислотные green/yellow акценты',
    previewColors: ['#060803', '#a3e635', '#facc15'],
  },
  {
    id: 'violet-glass',
    ruName: 'Фиолетовое стекло',
    description: 'Violet/pink акценты',
    previewColors: ['#08060f', '#a78bfa', '#ec4899'],
  },
]

export function SettingsPage() {
  const [themeSheetOpen, setThemeSheetOpen] = useState(false)
  const themeId = useThemeId()
  const setTheme = useSetTheme()

  const currentTheme = THEMES.find(t => t.id === themeId) ?? THEMES[0]

  return (
    <>
      <Page>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-5)',
            paddingTop: 'var(--space-4)',
          }}
        >
          {/* Theme selection */}
          <Section title="Оформление">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {THEMES.map((theme) => (
                <ThemePresetCard
                  key={theme.id}
                  theme={theme}
                  active={themeId === theme.id}
                  onSelect={() => {
                    hapticSelect()
                    setTheme(theme.id as ThemeId)
                  }}
                />
              ))}
            </div>
          </Section>

          {/* About */}
          <Section title="О приложении">
            <Panel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoRow label="Продукт" value="KZ Warehouse" />
                <InfoRow label="Версия" value="1.0.0" />
                <InfoRow label="Тема" value={currentTheme.ruName} />
                <InfoRow label="Платформа" value="Telegram Mini App" />
                <InfoRow label="Backend" value="Supabase" />
              </div>
            </Panel>
          </Section>

          {/* Signal model reminder */}
          <Section title="Модель данных">
            <Panel>
              <div
                style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 'var(--lh-relaxed)',
                }}
              >
                <p style={{ marginBottom: 8 }}>
                  Центр модели — <span style={{ color: 'var(--color-accent)' }}>сигнал спроса</span>, а не компания или контакт.
                </p>
                <p style={{ marginBottom: 8 }}>
                  Лид = подтверждённая возможность продажи. Контакт — это слой достижимости.
                </p>
                <p>
                  Сильный сигнал без прямого контакта остаётся важным.
                </p>
              </div>
            </Panel>
          </Section>
        </div>
      </Page>

      <ThemeSheet open={themeSheetOpen} onClose={() => setThemeSheetOpen(false)} />
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 8,
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{label}</span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', fontWeight: 'var(--fw-medium)' }}>
        {value}
      </span>
    </div>
  )
}
