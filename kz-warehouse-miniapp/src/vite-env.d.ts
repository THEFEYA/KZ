/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_TELEGRAM_BOT_NAME: string | undefined
  readonly VITE_APP_TITLE: string | undefined
  readonly VITE_ENABLE_DEBUG: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
