import type { BreakdownItem } from '@core/types/analytics'

export interface ChartDatum {
  name: string
  value: number
  pct?: number
  fill?: string
}

const PALETTE = [
  '#00d4ff',
  '#7c3aed',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
]

export function toChartData(items: BreakdownItem[], maxItems = 8): ChartDatum[] {
  return items
    .slice(0, maxItems)
    .map((item, i) => ({
      name: item.label,
      // count is normalized by mapper from backend's value|count field
      value: item.count ?? (item as BreakdownItem & { value?: number }).value ?? 0,
      pct: item.pct,
      fill: PALETTE[i % PALETTE.length],
    }))
}

export function toMiniBarData(items: BreakdownItem[], maxItems = 5): ChartDatum[] {
  const total = items.reduce((s, i) => s + (i.count ?? (i as BreakdownItem & { value?: number }).value ?? 0), 0)
  return items
    .slice(0, maxItems)
    .map((item, i) => {
      const v = item.count ?? (item as BreakdownItem & { value?: number }).value ?? 0
      return {
        name: item.label,
        value: v,
        pct: total > 0 ? Math.round((v / total) * 100) : 0,
        fill: PALETTE[i % PALETTE.length],
      }
    })
}

export function computeInsight(
  summary: {
    total: number
    actionQueue: number
    reviewQueue: number
    confirmedLeads: number
    directContact: number
    contactPath: number
    noContact: number
  },
  bySource: BreakdownItem[],
  byHeat: BreakdownItem[],
): string {
  if (summary.total === 0) return 'Нет данных для анализа'

  const topSource = bySource[0]
  const hotItem = byHeat.find(i => i.label === 'Горячий')
  const hotCount = hotItem?.count ?? 0
  const noContactPct = summary.total > 0 ? Math.round((summary.noContact / summary.total) * 100) : 0

  if (hotCount > 0 && hotCount / summary.total > 0.4) {
    return `${hotCount} горячих кандидатов — более ${Math.round((hotCount / summary.total) * 100)}% среза. Высокая срочность.`
  }

  if (noContactPct > 50) {
    return `${noContactPct}% кандидатов без прямого контакта — работайте через путь связи.`
  }

  if (topSource && topSource.count > 0) {
    return `Основной источник: ${topSource.label} — ${topSource.count} записей (${Math.round((topSource.count / summary.total) * 100)}%).`
  }

  if (summary.confirmedLeads > 0) {
    return `${summary.confirmedLeads} подтверждённых лидов готовы к работе.`
  }

  return `В срезе ${summary.total} кандидатов. ${summary.directContact} с прямым контактом.`
}
