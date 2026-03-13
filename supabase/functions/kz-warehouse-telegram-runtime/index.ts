// kz-warehouse-telegram-runtime — Supabase Edge Function
// Telegram webhook controller for the KZ Warehouse bot.
//
// Environment variables required:
//   SUPABASE_URL               — project URL
//   SUPABASE_SERVICE_ROLE_KEY  — service role key (not anon)
//   TELEGRAM_BOT_TOKEN         — bot token from BotFather
//   MINIAPP_URL                — deployed Vercel Mini App URL
//
// Callback routing:
//   menu:main          → main menu
//   menu:miniapp       → Mini App inline-button message
//   menu:modes         → real preset list via kz_mode_run_telegram_payload_v1
//   menu:start_search  → real preview run via kz_process_telegram_preview
//   mode:<id>          → preset-targeted preview run
//   candidate:<uuid>   → candidate detail card via kz_miniapp_record_detail_v1
//   details:<uuid>     → same as candidate:

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL       = Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY       = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const BOT_TOKEN          = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const MINIAPP_URL        = Deno.env.get('MINIAPP_URL') ?? 'https://kz-warehouse.vercel.app'

const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`

// ─── Telegram helpers ────────────────────────────────────────────────────────

async function tgCall(method: string, body: unknown): Promise<unknown> {
  const res = await fetch(`${TG_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

async function answerCallback(id: string, text?: string): Promise<void> {
  await tgCall('answerCallbackQuery', {
    callback_query_id: id,
    text,
    show_alert: false,
  })
}

async function sendMessage(
  chatId: string | number,
  text: string,
  extra?: Record<string, unknown>,
): Promise<unknown> {
  return tgCall('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...extra,
  })
}

async function editMessage(
  chatId: string | number,
  messageId: number,
  text: string,
  extra?: Record<string, unknown>,
): Promise<unknown> {
  return tgCall('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: 'HTML',
    ...extra,
  })
}

async function reply(
  chatId: string | number,
  messageId: number | null,
  text: string,
  extra?: Record<string, unknown>,
): Promise<unknown> {
  if (messageId) return editMessage(chatId, messageId, text, extra)
  return sendMessage(chatId, text, extra)
}

// ─── Keyboards ───────────────────────────────────────────────────────────────

function backToMenu() {
  return { inline_keyboard: [[{ text: '← Меню', callback_data: 'menu:main' }]] }
}

function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📋 Мини-приложение', callback_data: 'menu:miniapp' },
        { text: '🔍 Запустить поиск', callback_data: 'menu:start_search' },
      ],
      [
        { text: '⚙️ Режимы', callback_data: 'menu:modes' },
      ],
    ],
  }
}

// ─── Supabase client factory ──────────────────────────────────────────────────

function db() {
  return createClient(SUPABASE_URL, SUPABASE_KEY)
}

// ─── Handler: menu:main ───────────────────────────────────────────────────────

async function handleMain(
  chatId: string | number,
  messageId: number | null,
  cqId: string,
) {
  await answerCallback(cqId)
  await reply(chatId, messageId, '🏭 <b>KZ Warehouse</b>\n\nВыбери действие:', {
    reply_markup: mainMenuKeyboard(),
  })
}

// ─── Handler: menu:miniapp ────────────────────────────────────────────────────

async function handleMiniapp(
  chatId: string | number,
  messageId: number | null,
  cqId: string,
) {
  await answerCallback(cqId)
  await reply(
    chatId,
    messageId,
    '📊 <b>KZ Warehouse — визуальная доска лидов</b>\n\n' +
      'Рабочая очередь, проверка, аналитика и карточки кандидатов в одном интерфейсе.',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Открыть Mini App', web_app: { url: MINIAPP_URL } }],
          [{ text: '← Меню', callback_data: 'menu:main' }],
        ],
      },
    },
  )
}

// ─── Handler: menu:modes ──────────────────────────────────────────────────────
// Primary: kz_mode_run_telegram_payload_v1 — returns a pre-built TG payload.
// Fallback: local preset definitions mirrored from modePresets.ts.

async function handleModes(
  chatId: string | number,
  messageId: number | null,
  cqId: string,
  userId: string,
) {
  await answerCallback(cqId)

  const { data: payload, error } = await db().rpc('kz_mode_run_telegram_payload_v1', {
    p_telegram_user_id: userId,
    p_telegram_chat_id: String(chatId),
  })

  if (!error && payload) {
    // Function returned a pre-built payload — trust it
    const p = typeof payload === 'object' ? payload as Record<string, unknown> : {}
    const text    = (p.text ?? p.message ?? JSON.stringify(payload)) as string
    const keyboard = p.reply_markup ?? backToMenu()
    await reply(chatId, messageId, text, { reply_markup: keyboard })
    return
  }

  // Fallback: static preset list (mirrors modePresets.ts)
  const presets = [
    { id: 'wide-10',   name: 'Широкий 10',  desc: 'Широкий срез, все активные, 10 записей' },
    { id: 'precise-5', name: 'Точный 5',    desc: 'Горячие + свежие, рабочая очередь, tier 1' },
    { id: 'almaty-5',  name: 'Алматы 5',    desc: 'Регион Алматы, рабочая очередь, 5 записей' },
    { id: 'astana-5',  name: 'Астана 5',    desc: 'Регион Астана, рабочая очередь, 5 записей' },
  ]
  const lines = presets.map(p => `• <b>${p.name}</b> — ${p.desc}`).join('\n')
  await reply(
    chatId,
    messageId,
    `⚙️ <b>Рабочие режимы / пресеты</b>\n\n${lines}\n\nВыбери режим для запуска:`,
    {
      reply_markup: {
        inline_keyboard: [
          ...presets.map(p => [{ text: p.name, callback_data: `mode:${p.id}` }]),
          [{ text: '← Меню', callback_data: 'menu:main' }],
        ],
      },
    },
  )
}

// ─── Handler: menu:start_search ───────────────────────────────────────────────
// Uses kz_process_telegram_preview — the Telegram-integrated entry point.
// It sends its own messages to the chat and returns run metadata.
// If that fails, falls back to kz_preview_telegram_message (read-only preview).

async function handleStartSearch(
  chatId: string | number,
  messageId: number | null,
  cqId: string,
  userId: string,
) {
  await answerCallback(cqId, 'Запускаю предпросмотр...')

  const { data, error } = await db().rpc('kz_process_telegram_preview', {
    p_telegram_chat_id:  String(chatId),
    p_telegram_user_id:  String(userId),
    p_region:            null,
    p_batch_size:        5,
    p_bot_token:         BOT_TOKEN,
  })

  if (!error) {
    // Success — function sends its own results to the chat
    await reply(chatId, messageId, buildRunConfirmText(data, 'Поиск запущен'), {
      reply_markup: backToMenu(),
    })
    return
  }

  // Fallback: read-only preview message (no run created)
  const { data: previewText, error: previewErr } = await db().rpc('kz_preview_telegram_message', {
    p_batch_size:  5,
    p_region:      null,
    p_only_active: true,
  })

  if (!previewErr && previewText) {
    const preview = typeof previewText === 'string'
      ? previewText
      : (previewText as Record<string, unknown>).message ?? JSON.stringify(previewText)
    await reply(
      chatId,
      messageId,
      `🔍 <b>Предпросмотр (без запуска):</b>\n\n${preview}`,
      { reply_markup: backToMenu() },
    )
    return
  }

  // Both paths failed — honest error
  await reply(
    chatId,
    messageId,
    `⚠️ <b>Не удалось запустить поиск</b>\n\n<code>${error.message}</code>`,
    { reply_markup: backToMenu() },
  )
}

// ─── Handler: mode:<id> ───────────────────────────────────────────────────────
// Runs kz_process_telegram_preview scoped to the selected preset's region/size.

const PRESET_CONFIG: Record<string, { region: string | null; batchSize: number }> = {
  'wide-10':   { region: null,      batchSize: 10 },
  'precise-5': { region: null,      batchSize: 5  },
  'almaty-5':  { region: 'Алматы', batchSize: 5  },
  'astana-5':  { region: 'Астана', batchSize: 5  },
}

async function handleModeSelect(
  chatId: string | number,
  messageId: number | null,
  cqId: string,
  modeId: string,
  userId: string,
) {
  await answerCallback(cqId, 'Запускаю...')
  const cfg = PRESET_CONFIG[modeId] ?? { region: null, batchSize: 5 }

  const { data, error } = await db().rpc('kz_process_telegram_preview', {
    p_telegram_chat_id:  String(chatId),
    p_telegram_user_id:  String(userId),
    p_region:            cfg.region,
    p_batch_size:        cfg.batchSize,
    p_bot_token:         BOT_TOKEN,
  })

  if (error) {
    await reply(
      chatId,
      messageId,
      `⚠️ Режим <b>${modeId}</b> — ошибка запуска.\n\n<code>${error.message}</code>`,
      { reply_markup: { inline_keyboard: [[{ text: '← Режимы', callback_data: 'menu:modes' }]] } },
    )
    return
  }

  await reply(chatId, messageId, buildRunConfirmText(data, `Режим «${modeId}» запущен`), {
    reply_markup: backToMenu(),
  })
}

// ─── Handler: candidate:<uuid> / details:<uuid> ───────────────────────────────
// Fetches full detail via kz_miniapp_record_detail_v1 and formats it for Telegram.

async function handleCandidateDetail(
  chatId: string | number,
  messageId: number | null,
  cqId: string,
  candidateId: string,
) {
  await answerCallback(cqId)

  const { data, error } = await db().rpc('kz_miniapp_record_detail_v1', {
    p_candidate_id: candidateId,
    p_lead_id:      null,
  })

  if (error || !data) {
    await reply(
      chatId,
      messageId,
      `⚠️ Карточка не найдена.\n\n<code>${error?.message ?? 'no data'}</code>`,
      { reply_markup: backToMenu() },
    )
    return
  }

  const rec = normaliseDetailRecord(data)

  const label    = (rec.display_label_v2   ?? rec.candidate_id ?? candidateId) as string
  const entity   = (rec.entity_type_ru     ?? '') as string
  const role     = (rec.market_role_label_ru ?? '') as string
  const region   = (rec.region             ?? '') as string
  const signal   = (rec.signal_type        ?? '') as string
  const heat     = (rec.heat_label_ru      ?? '') as string
  const fresh    = (rec.freshness_label_ru ?? '') as string
  const bucket   = (rec.actionable_bucket_ru ?? '') as string
  const score    = (rec.score_total ?? rec.rank_total_v2 ?? null) as number | null
  const contact  = (rec.contact_path_label_ru_v2 ?? '') as string
  const evCount  = (rec.evidence_count ?? 0) as number
  const website  = (rec.company_website ?? rec.proof_url ?? null) as string | null
  const demand   = (rec.demand_hint    ?? null) as string | null

  let text = `📋 <b>${label}</b>\n`
  if (entity || role) text += [entity, role].filter(Boolean).join(' · ') + '\n'
  if (region)         text += `📍 ${region}\n`
  if (signal)         text += `\n📡 <b>Сигнал:</b> ${signal}\n`
  if (heat || fresh)  text += `🌡 ${[heat, fresh].filter(Boolean).join(' · ')}\n`
  if (bucket)         text += `📥 ${bucket}\n`
  if (score != null)  text += `⭐ Оценка: ${score}\n`
  if (contact)        text += `📞 ${contact}\n`
  if (evCount)        text += `🔎 Доказательства: ${evCount}\n`
  if (demand)         text += `\n💡 ${demand}\n`

  await reply(chatId, messageId, text.trim(), {
    reply_markup: {
      inline_keyboard: [
        ...(website ? [[{ text: '🌐 Сайт / источник', url: website }]] : []),
        [{ text: '← Меню', callback_data: 'menu:main' }],
      ],
    },
  })
}

// ─── Utilities ────────────────────────────────────────────────────────────────

// Normalise flat / wrapped-flat / nested detail response shapes
function normaliseDetailRecord(data: unknown): Record<string, unknown> {
  const raw = (Array.isArray(data) ? data[0] : data) as Record<string, unknown>
  if (!raw) return {}

  if (raw.candidate_id && raw.display_label_v2) return raw

  if (raw.item && typeof raw.item === 'object') {
    return raw.item as Record<string, unknown>
  }

  if (raw.header || raw.signal || raw.quality || raw.contact) {
    const h  = (raw.header   ?? {}) as Record<string, unknown>
    const s  = (raw.signal   ?? {}) as Record<string, unknown>
    const q  = (raw.quality  ?? {}) as Record<string, unknown>
    const c  = (raw.contact  ?? {}) as Record<string, unknown>
    const ev = (raw.evidence ?? {}) as Record<string, unknown>
    return {
      candidate_id:             h.candidate_id  ?? raw.candidate_id,
      display_label_v2:         h.display_label_v2,
      entity_type_ru:           h.entity_type_ru,
      market_role_label_ru:     h.market_role_label_ru,
      region:                   h.region ?? raw.region,
      signal_type:              s.signal_type,
      heat_label_ru:            q.heat_label_ru,
      freshness_label_ru:       q.freshness_label_ru,
      rank_total_v2:            q.rank_total_v2,
      score_total:              q.score_total,
      actionable_bucket_ru:     q.actionable_bucket_ru,
      contact_path_label_ru_v2: c.contact_path_label_ru_v2,
      has_direct_contact:       c.has_direct_contact,
      company_website:          c.company_website,
      proof_url:                c.proof_url,
      demand_hint:              h.demand_hint ?? raw.demand_hint,
      evidence_count: ev.evidence_count != null
        ? ev.evidence_count
        : (Array.isArray(ev.items) ? (ev.items as unknown[]).length : 0),
    }
  }

  return raw
}

// Build a consistent run-confirmation message from kz_process_telegram_preview response
function buildRunConfirmText(data: unknown, heading: string): string {
  const d = (data && typeof data === 'object' && !Array.isArray(data))
    ? data as Record<string, unknown>
    : {}
  const runId  = d.run_id  ?? d.id     ?? null
  const mode   = d.mode    ?? d.preset  ?? null
  const status = d.status  ?? (d.ok !== undefined ? (d.ok ? 'ok' : 'error') : null)
  const count  = d.count   ?? d.total   ?? null
  const msg    = d.message ?? null

  let text = `✅ <b>${heading}</b>\n`
  if (runId)       text += `🔑 Run: <code>${runId}</code>\n`
  if (mode)        text += `📌 Режим: ${mode}\n`
  if (count != null) text += `📦 Найдено: ${count}\n`
  if (status)      text += `⚡ Статус: ${status}\n`
  if (msg)         text += `\n${msg}`
  return text.trim()
}

// ─── Main Deno serve ──────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('ok', { status: 200 })

  let update: Record<string, unknown>
  try {
    update = await req.json()
  } catch {
    return new Response('bad json', { status: 400 })
  }

  // ── callback_query ──────────────────────────────────────────────────────────
  if (update.callback_query) {
    const cq      = update.callback_query as Record<string, unknown>
    const cqId    = String(cq.id)
    const from    = (cq.from ?? {}) as Record<string, unknown>
    const userId  = String(from.id ?? '')
    const message = (cq.message ?? {}) as Record<string, unknown>
    const chatId  = ((message.chat ?? {}) as Record<string, unknown>).id ?? from.id
    const msgId   = (message.message_id ?? null) as number | null
    const data    = String(cq.data ?? '')

    try {
      if (data === 'menu:main') {
        await handleMain(chatId as string, msgId, cqId)
      } else if (data === 'menu:miniapp') {
        await handleMiniapp(chatId as string, msgId, cqId)
      } else if (data === 'menu:modes') {
        await handleModes(chatId as string, msgId, cqId, userId)
      } else if (data === 'menu:start_search') {
        await handleStartSearch(chatId as string, msgId, cqId, userId)
      } else if (data.startsWith('mode:')) {
        await handleModeSelect(chatId as string, msgId, cqId, data.slice(5), userId)
      } else if (data.startsWith('candidate:')) {
        await handleCandidateDetail(chatId as string, msgId, cqId, data.slice(10))
      } else if (data.startsWith('details:')) {
        await handleCandidateDetail(chatId as string, msgId, cqId, data.slice(8))
      } else {
        await answerCallback(cqId)
      }
    } catch (err) {
      console.error('[kz-runtime] callback error', err)
      try { await answerCallback(cqId, '⚠️ Ошибка обработки') } catch { /* ignore */ }
    }
  }

  // ── /start command ──────────────────────────────────────────────────────────
  if (update.message) {
    const msg    = update.message as Record<string, unknown>
    const chatId = ((msg.chat ?? {}) as Record<string, unknown>).id
    const text   = (msg.text ?? '') as string

    if (text.startsWith('/start')) {
      try {
        await sendMessage(
          chatId as string,
          '🏭 <b>KZ Warehouse</b>\n\nВыбери действие:',
          { reply_markup: mainMenuKeyboard() },
        )
      } catch (err) {
        console.error('[kz-runtime] /start error', err)
      }
    }
  }

  return new Response('ok', { status: 200 })
})
