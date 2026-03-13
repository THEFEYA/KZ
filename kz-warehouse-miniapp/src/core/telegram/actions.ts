// Action adapter layer — entry points for operational actions

import { hapticLight, hapticSuccess, hapticError } from './haptics'
import { getTgApp } from './init'
import { rpcAssignLeadToManager, rpcQueueLeadHandoff } from '@core/supabase/rpc'
import type { Candidate, ContactInfo } from '@core/types/candidate'

/** Open first available contact channel, falling back to company website */
export function openContactOrWebsite(contacts: ContactInfo[] | null, companyWebsite: string | null): boolean {
  const first = contacts?.find(c => c.phone || c.telegram || c.email)
  if (first) {
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
  }
  if (companyWebsite) {
    hapticLight()
    window.open(companyWebsite, '_blank')
    return true
  }
  return false
}

/** Open first available contact channel (legacy — use openContactOrWebsite when company_website available) */
export function openContact(contacts: ContactInfo[]): boolean {
  return openContactOrWebsite(contacts, null)
}

/** Open the candidate's primary source URL */
export function openSource(candidate: Pick<Candidate, 'sourceUrl' | 'sourceLabel'>): boolean {
  if (!candidate.sourceUrl) return false
  hapticLight()
  window.open(candidate.sourceUrl, '_blank')
  return true
}

/** Forward candidate to manager via kz_assign_lead_to_manager_by_telegram */
export function forwardToManager(candidate: Candidate): void {
  const tg = getTgApp()
  const telegramUserId = tg?.initDataUnsafe?.user?.id ?? null
  rpcAssignLeadToManager(candidate.id, telegramUserId)
    .then((result) => {
      hapticSuccess()
      tg?.showPopup({
        title: 'Передано менеджеру',
        message: result.message ?? `${candidate.displayEntity} — передано менеджеру.`,
        buttons: [{ id: 'ok', type: 'ok' }],
      })
    })
    .catch((err: Error) => {
      hapticError()
      tg?.showPopup({
        title: 'Ошибка',
        message: `Не удалось передать: ${err.message}`,
        buttons: [{ id: 'ok', type: 'ok' }],
      })
    })
}

/** Move candidate to review queue via kz_queue_lead_handoff */
export function markNeedsReview(candidate: Candidate): void {
  const tg = getTgApp()
  rpcQueueLeadHandoff(candidate.id, 'review_queue')
    .then((result) => {
      hapticSuccess()
      tg?.showPopup({
        title: 'Отправлено на проверку',
        message: result.message ?? `${candidate.displayEntity} — отправлен в очередь проверки.`,
        buttons: [{ id: 'ok', type: 'ok' }],
      })
    })
    .catch((err: Error) => {
      hapticError()
      tg?.showPopup({
        title: 'Ошибка',
        message: `Не удалось отправить: ${err.message}`,
        buttons: [{ id: 'ok', type: 'ok' }],
      })
    })
}
