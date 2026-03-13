export function formatNumber(n: number | null | undefined): string {
  if (n == null) return '—'
  return n.toLocaleString('ru-RU')
}

export function formatPriority(rank: number | null | undefined): string {
  if (rank == null) return '—'
  return `${Math.round(rank)}`
}

export function formatScore(score: number | null | undefined): string {
  if (score == null) return '—'
  return score.toFixed(1)
}

export function formatPct(pct: number | null | undefined): string {
  if (pct == null) return ''
  return `${Math.round(pct)}%`
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function truncate(str: string | null | undefined, maxLen: number): string {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 19) return `${n} ${many}`
  if (mod10 === 1) return `${n} ${one}`
  if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`
  return `${n} ${many}`
}
