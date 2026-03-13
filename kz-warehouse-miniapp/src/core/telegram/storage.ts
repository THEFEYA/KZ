// Local storage with prefix isolation

const PREFIX = 'kz_wh_'

export function localGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function localSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // storage may be unavailable in some Telegram contexts
  }
}

export function localRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {}
}
