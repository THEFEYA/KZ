import { useState } from 'react'
import { BottomSheet } from '@shared/ui/BottomSheet'
import { Button } from '@shared/ui/Button'
import { FilterFieldGroup } from './FilterFieldGroup'
import { useFilters, useSetFilters, useResetFilters } from '@core/state/selectors'
import {
  REGION_OPTIONS,
  HEAT_OPTIONS,
  FRESHNESS_OPTIONS,
  CONTACT_TYPE_OPTIONS,
  MARKET_ROLE_OPTIONS,
  BUCKET_OPTIONS,
  LIMIT_OPTIONS,
} from './filterOptions'
import type { ActiveFilters } from '@core/types/ui'
import { hapticLight, hapticSuccess } from '@core/telegram/haptics'

interface FilterSheetProps {
  open: boolean
  onClose: () => void
}

export function FilterSheet({ open, onClose }: FilterSheetProps) {
  const filters = useFilters()
  const setFilters = useSetFilters()
  const resetFilters = useResetFilters()

  const [local, setLocal] = useState<ActiveFilters>(filters)

  const setLocal1 = <K extends keyof ActiveFilters>(key: K, value: ActiveFilters[K]) => {
    hapticLight()
    setLocal((prev) => ({ ...prev, [key]: value }))
  }

  const handleApply = () => {
    hapticSuccess()
    setFilters(local)
    onClose()
  }

  const handleReset = () => {
    hapticLight()
    const def: ActiveFilters = {
      region: null,
      marketRole: null,
      heat: null,
      freshness: null,
      contactType: null,
      limit: 10,
      bucket: null,
    }
    setLocal(def)
    resetFilters()
  }

  // Sync when opening
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) setLocal(filters)
  }
  void handleOpen

  return (
    <BottomSheet open={open} onClose={onClose} title="Фильтры">
      <div style={{ padding: 'var(--space-4)' }}>
        <FilterFieldGroup
          label="Регион"
          options={REGION_OPTIONS}
          value={local.region}
          onChange={(v) => setLocal1('region', v as string | null)}
        />
        <FilterFieldGroup
          label="Горячесть"
          options={HEAT_OPTIONS}
          value={local.heat}
          onChange={(v) => setLocal1('heat', v as string | null)}
        />
        <FilterFieldGroup
          label="Свежесть"
          options={FRESHNESS_OPTIONS}
          value={local.freshness}
          onChange={(v) => setLocal1('freshness', v as string | null)}
        />
        <FilterFieldGroup
          label="Тип связи"
          options={CONTACT_TYPE_OPTIONS}
          value={local.contactType}
          onChange={(v) => setLocal1('contactType', v as string | null)}
        />
        <FilterFieldGroup
          label="Роль рынка"
          options={MARKET_ROLE_OPTIONS}
          value={local.marketRole}
          onChange={(v) => setLocal1('marketRole', v as string | null)}
        />
        <FilterFieldGroup
          label="Очередь"
          options={BUCKET_OPTIONS}
          value={local.bucket}
          onChange={(v) => setLocal1('bucket', v as string | null)}
        />
        <FilterFieldGroup
          label="Количество записей"
          options={LIMIT_OPTIONS}
          value={local.limit}
          onChange={(v) => setLocal1('limit', (v as number | null) ?? 10)}
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 'var(--space-5)' }}>
          <Button variant="ghost" size="md" onClick={handleReset} fullWidth>
            Сбросить всё
          </Button>
          <Button variant="primary" size="md" onClick={handleApply} fullWidth>
            Применить
          </Button>
        </div>
      </div>
    </BottomSheet>
  )
}
