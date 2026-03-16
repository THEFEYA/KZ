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
    const userId  = String((unsafe.user as Record<string, unknown>)?.id ?? '')
    const chatObj = unsafe.chat as Record<string, unknown> | undefined
    const chatId  = String(chatObj?.id ?? userId) // fallback: user_id in direct chats
    return { telegramUserId: userId, telegramChatId: chatId }
  }

  // Debug fallback: ?tgUserId / ?tgChatId query params → env vars
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('tgUserId') ?? ENV.DEBUG_TELEGRAM_USER_ID ?? ''
  const chatId = params.get('tgChatId') ?? ENV.DEBUG_TELEGRAM_CHAT_ID ?? userId
  return { telegramUserId: userId, telegramChatId: chatId }
}

// ─── Core invoke ─────────────────────────────────────────────────────────────

export async function invokeRuntime<T = unknown>(
  payload: Record<string, unknown>,
): Promise<RuntimeEnvelope<T>> {
  const { data, error } = await supabase.functions.invoke<RuntimeEnvelope<T>>(RUNTIME_FN, {
    body: payload,
  })
  if (error) throw new Error(`[runtime] ${error.message}`)
  if (!data)  throw new Error('[runtime] no response body')
  if (!data.ok) throw new Error(`[runtime] action failed: ${data.error ?? 'unknown'}`)
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
