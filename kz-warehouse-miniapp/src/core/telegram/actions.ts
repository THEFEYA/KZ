// Action adapter layer — entry points for operational actions
// Wire to real Telegram bot flow or backend mutations when available

import { hapticLight, hapticSuccess } from './haptics'
import { getTgApp } from './init'
import type { Candidate, CandidateDetail, ContactInfo } from '@core/types/candidate'

/** Open first available contact channel */
export function openContact(contacts: ContactInfo[]): boolean {
  const first = contacts.find(c => c.phone || c.telegram || c.email)
  if (!first) return false
  hapticLight()
  if (first.telegram) {
    const handle = first.telegram.replace('@', '')
    window.open(`https://t.me/${handle}`, '_blank')
    return true
  }
  if (first.phone) {
    window.open(`tel:${first.phone}`, '_self')
    return true
  }
  if (first.email) {
    window.open(`mailto:${first.email}`, '_self')
    return true
  }
  return false
}

/** Open the candidate's primary source URL */
export function openSource(candidate: Pick<Candidate, 'sourceUrl' | 'sourceLabel'>): boolean {
  if (!candidate.sourceUrl) return false
  hapticLight()
  window.open(candidate.sourceUrl, '_blank')
  return true
}

/** Forward candidate to manager via Telegram share
 *  TODO: replace with real bot deep-link when available */
export function forwardToManager(candidate: Candidate): void {
  hapticSuccess()
  const tg = getTgApp()
  const text = `KZ Warehouse — кандидат: ${candidate.displayEntity}\nСигнал: ${candidate.normalizedSignalType}\nРегион: ${candidate.region ?? '—'}`
  if (tg) {
    // Use Telegram share if bot deep-link is configured
    // tg.sendData(JSON.stringify({ action: 'forward', candidate_id: candidate.id }))
    tg.showPopup({
      title: 'Передать менеджеру',
      message: `${candidate.displayEntity} — будет передано менеджеру через бот (функция в разработке).`,
      buttons: [{ id: 'ok', type: 'ok' }],
    })
  } else {
    const shareUrl = `https://t.me/share/url?text=${encodeURIComponent(text)}`
    window.open(shareUrl, '_blank')
  }
}

/** Mark candidate as needing review
 *  TODO: wire to backend mutation RPC when available */
export function markNeedsReview(candidate: Candidate): void {
  hapticLight()
  const tg = getTgApp()
  if (tg) {
    tg.showPopup({
      title: 'Нужна проверка',
      message: `${candidate.displayEntity} — будет отправлен в очередь проверки (функция в разработке).`,
      buttons: [{ id: 'ok', type: 'ok' }],
    })
  }
}
