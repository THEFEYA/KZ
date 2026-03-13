import type { Candidate } from '@core/types/candidate'

const CSV_HEADERS = [
  'ID',
  'Сущность',
  'Тип',
  'Роль рынка',
  'Тип сигнала',
  'Объект',
  'Регион',
  'Источник',
  'Доказательства',
  'Приоритет',
  'Статус контакта',
  'Горячесть',
  'Свежесть',
  'Очередь',
]

function escapeCell(value: string | number | null | undefined): string {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function candidateToRow(c: Candidate): string[] {
  return [
    c.id,
    c.displayEntity,
    c.entityType === 'company' ? 'Компания' : 'Объект',
    c.marketRole,
    c.normalizedSignalType,
    c.objectAnchor ?? '',
    c.region ?? '',
    c.sourceLabel ?? '',
    String(c.evidenceCount),
    String(c.priorityRank),
    c.contactStatus === 'direct'
      ? 'Прямой контакт'
      : c.contactStatus === 'path'
        ? 'Путь связи'
        : 'Нет контакта',
    c.heatLevel === 'hot' ? 'Горячий' : c.heatLevel === 'warm' ? 'Тёплый' : 'Холодный',
    c.freshnessLevel === 'fresh'
      ? 'Свежий'
      : c.freshnessLevel === 'actual'
        ? 'Актуальный'
        : 'Устаревший',
    c.queueBucket === 'action_queue'
      ? 'Рабочая'
      : c.queueBucket === 'review_queue'
        ? 'Проверка'
        : 'Подтверждённые',
  ]
}

export function exportCandidatesCsv(candidates: Candidate[], filename = 'kz-warehouse-export.csv'): void {
  const bom = '\uFEFF'
  const header = CSV_HEADERS.map(escapeCell).join(',')
  const rows = candidates.map(c => candidateToRow(c).map(escapeCell).join(','))
  const csv = bom + [header, ...rows].join('\r\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
