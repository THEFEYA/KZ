import { BottomSheet } from '@shared/ui/BottomSheet'
import { ThemePresetCard } from './ThemePresetCard'
import { useThemeId, useSetTheme } from '@core/state/selectors'
import { hapticSelect } from '@core/telegram/haptics'
import type { Theme, ThemeId } from '@core/types/ui'

const THEMES: Theme[] = [
  {
    id: 'night-ops',
    ruName: 'Ночной режим',
    description: 'Тёмный синий с cyan-акцентами',
    previewColors: ['#0a0d14', '#00d4ff', '#0066ff'],
  },
  {
    id: 'acid-pulse',
    ruName: 'Кислотный импульс',
    description: 'Тёмный с кислотными green/yellow акцентами',
    previewColors: ['#060803', '#a3e635', '#facc15'],
  },
  {
    id: 'violet-glass',
    ruName: 'Фиолетовое стекло',
    description: 'Тёмный фиолетовый с pink-акцентами',
    previewColors: ['#08060f', '#a78bfa', '#ec4899'],
  },
]

interface ThemeSheetProps {
  open: boolean
  onClose: () => void
}

export function ThemeSheet({ open, onClose }: ThemeSheetProps) {
  const themeId = useThemeId()
  const setTheme = useSetTheme()

  const handleSelect = (id: ThemeId) => {
    hapticSelect()
    setTheme(id)
    setTimeout(onClose, 150)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="Выбор темы">
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {THEMES.map((theme) => (
          <ThemePresetCard
            key={theme.id}
            theme={theme}
            active={themeId === theme.id}
            onSelect={() => handleSelect(theme.id)}
          />
        ))}
      </div>
    </BottomSheet>
  )
}
