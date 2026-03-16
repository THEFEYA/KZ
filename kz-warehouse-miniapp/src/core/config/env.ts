export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
  TELEGRAM_BOT_NAME: import.meta.env.VITE_TELEGRAM_BOT_NAME as string | undefined,
  APP_TITLE: (import.meta.env.VITE_APP_TITLE as string) ?? 'KZ Warehouse',
  DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  // Debug Telegram identity for browser preview outside Telegram
  // Set in .env.local: VITE_DEBUG_TELEGRAM_USER_ID=123456789
  DEBUG_TELEGRAM_USER_ID: import.meta.env.VITE_DEBUG_TELEGRAM_USER_ID ?? null,
  DEBUG_TELEGRAM_CHAT_ID: import.meta.env.VITE_DEBUG_TELEGRAM_CHAT_ID ?? null,
} as const

if (!ENV.SUPABASE_URL || !ENV.SUPABASE_KEY) {
  console.warn('[KZ] VITE_SUPABASE_URL или VITE_SUPABASE_PUBLISHABLE_KEY не заданы')
}
