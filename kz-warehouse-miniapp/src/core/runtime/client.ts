// Runtime client — single entry point to kz-warehouse-miniapp-runtime edge function.
// All data actions go through this client; direct Supabase RPC calls are fallback only.

import { supabase } from '@core/supabase/client'
import { getTgApp, isTelegramEnv } from '@core/telegram/init'
import { ENV } from '@core/config/env'
import type { RuntimeEnvelope } from './types'

const RUNTIME_FN = 'kz-warehouse-miniapp-runtime'

// ─── Telegram context ─────────────────────────────────────────────────────────
// Resolves user/chat IDs from live Telegram WebApp or debug fallback.

export interface TelegramCtx {
  telegramUserId: string
  telegramChatId: string
}

export function getTelegramCtx(): TelegramCtx {
  if (isTelegramEnv()) {
    const tg = getTgApp()!
    const unsafe = tg.initDataUnsafe as Record<string, unknown>
    const userObj = unsafe.user as Record<string, unknown> | undefined
    const userId  = String(userObj?.id ?? '')
    const chatObj = unsafe.chat as Record<string, unknown> | undefined
    const chatId  = String(chatObj?.id ?? userId) // fallback: user_id in direct chats

    if (!userId) {
      console.error('[TgCtx] ❌ Telegram env detected but user.id is MISSING', {
        initDataUnsafe: unsafe,
        initData: tg.initData?.slice(0, 80),
      })
    } else {
      console.log('[TgCtx] ✅ Telegram env — userId:', userId, 'chatId:', chatId)
    }
    return { telegramUserId: userId, telegramChatId: chatId }
  }

  // Debug fallback: ?tgUserId / ?tgChatId query params → env vars
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('tgUserId') ?? ENV.DEBUG_TELEGRAM_USER_ID ?? ''
  const chatId = params.get('tgChatId') ?? ENV.DEBUG_TELEGRAM_CHAT_ID ?? userId

  if (!userId) {
    console.error('[TgCtx] ❌ NO Telegram context and no debug IDs set.',
      'Добавь ?tgUserId=XXX&tgChatId=YYY в URL или VITE_DEBUG_TELEGRAM_USER_ID в .env.local')
  } else {
    console.log('[TgCtx] 🔧 Debug env — userId:', userId, 'chatId:', chatId)
  }
  return { telegramUserId: userId, telegramChatId: chatId }
}

// ─── Core invoke ─────────────────────────────────────────────────────────────

export async function invokeRuntime<T = unknown>(
  payload: Record<string, unknown>,
): Promise<RuntimeEnvelope<T>> {
  const action = String(payload.action ?? 'unknown')
  const sentUserId = String(payload.telegram_user_id ?? '')
  const sentChatId = String(payload.telegram_chat_id ?? '')

  console.log(`[runtime→${action}] 📤 userId="${sentUserId || '(empty!)'}" chatId="${sentChatId || '(empty!)'}"`)

  if (!sentUserId || !sentChatId) {
    const msg = `[runtime→${action}] ❌ MISSING Telegram IDs — userId="${sentUserId}" chatId="${sentChatId}" — aborted before sending`
    console.error(msg)
    throw new Error(`No Telegram context for action "${action}" (userId="${sentUserId}", chatId="${sentChatId}")`)
  }

  const { data, error } = await supabase.functions.invoke<RuntimeEnvelope<T>>(RUNTIME_FN, {
    body: payload,
  })
  if (error) {
    console.error(`[runtime→${action}] ❌ invoke error:`, error.message)
    throw new Error(`[runtime] ${error.message}`)
  }
  if (!data) {
    console.error(`[runtime→${action}] ❌ no response body`)
    throw new Error('[runtime] no response body')
  }
  if (!data.ok) {
    console.error(`[runtime→${action}] ❌ server error:`, data.error ?? 'unknown')
    throw new Error(`[runtime] action failed: ${data.error ?? 'unknown'}`)
  }
  console.log(`[runtime→${action}] ✅ ok`)
  return data
}

// ─── Typed action callers ─────────────────────────────────────────────────────

export async function runtimeOverview(opts: {
  activeModeCode: string | null
  limit?: number
  offset?: number
}): Promise<RuntimeEnvelope> {
  const ctx = getTelegramCtx()
  return invokeRuntime({
    action:           'overview',
    telegram_user_id: ctx.telegramUserId,
    telegram_chat_id: ctx.telegramChatId,
    active_mode_code: opts.activeModeCode,
    limit:            opts.limit  ?? 10,
    offset:           opts.offset ?? 0,
    state_patch:      null,
  })
}

export async function runtimeQueue(opts: {
  activeModeCode: string | null
  bucket: string | null
  region: string | null
  marketRole: string | null
  heatLabelRu: string | null
  freshnessLabelRu: string | null
  hasContact: boolean | null
  contactPathStatusV2: string | null
  limit: number
  offset?: number
}): Promise<RuntimeEnvelope> {
  const ctx = getTelegramCtx()
  return invokeRuntime({
    action:                  'queue',
    telegram_user_id:        ctx.telegramUserId,
    telegram_chat_id:        ctx.telegramChatId,
    active_mode_code:        opts.activeModeCode,
    bucket:                  opts.bucket,
    region:                  opts.region,
    market_role:             opts.marketRole,
    heat_label_ru:           opts.heatLabelRu,
    freshness_label_ru:      opts.freshnessLabelRu,
    has_contact:             opts.hasContact,
    contact_path_status_v2:  opts.contactPathStatusV2,
    limit:                   opts.limit,
    offset:                  opts.offset ?? 0,
    state_patch:             null,
  })
}

export async function runtimeOpenCandidate(opts: {
  candidateId: string
  activeModeCode: string | null
  currentQueue?: string | null
  activeModeOffset?: number
}): Promise<RuntimeEnvelope> {
  const ctx = getTelegramCtx()
  return invokeRuntime({
    action:             'open_candidate',
    telegram_user_id:   ctx.telegramUserId,
    telegram_chat_id:   ctx.telegramChatId,
    candidate_id:       opts.candidateId,
    current_queue:      opts.currentQueue      ?? null,
    active_mode_code:   opts.activeModeCode,
    active_mode_offset: opts.activeModeOffset  ?? 0,
    state_patch:        null,
  })
}

export async function runtimeAnalytics(opts: {
  activeModeCode: string | null
}): Promise<RuntimeEnvelope> {
  const ctx = getTelegramCtx()
  return invokeRuntime({
    action:           'analytics',
    telegram_user_id: ctx.telegramUserId,
    telegram_chat_id: ctx.telegramChatId,
    active_mode_code: opts.activeModeCode,
    state_patch:      null,
  })
}
