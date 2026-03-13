import { IconButton } from '@shared/ui/IconButton'
import { useToggleFilterSheet, useActiveFilterCount } from '@core/state/selectors'
import type { Candidate } from '@core/types/candidate'
import { exportCandidatesCsv } from '@core/utils/exportCsv'
import { hapticSuccess } from '@core/telegram/haptics'

interface QueueToolbarProps {
  candidates: Candidate[]
  total: number
}

export function QueueToolbar({ candidates, total }: QueueToolbarProps) {
  const toggle = useToggleFilterSheet()
  const filterCount = useActiveFilterCount()

  const handleExport = () => {
    hapticSuccess()
    exportCandidatesCsv(candidates)
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px var(--space-4)',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--color-text-tertiary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {total} {total === 1 ? 'запись' : total < 5 ? 'записи' : 'записей'}
      </span>

      <div style={{ display: 'flex', gap: 6 }}>
        {candidates.length > 0 && (
          <IconButton label="Экспорт CSV" onClick={handleExport}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </IconButton>
        )}
        <IconButton
          label="Фильтры"
          onClick={toggle}
          badge={filterCount > 0 ? filterCount : undefined}
          active={filterCount > 0}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M5 8h6M7 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </IconButton>
      </div>
    </div>
  )
}
