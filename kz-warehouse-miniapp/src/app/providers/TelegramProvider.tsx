import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { initTelegramApp, isTelegramEnv } from '@core/telegram/init'
import { setSafeAreaVars } from '@core/telegram/viewport'
import { ENV } from '@core/config/env'

interface TelegramContextValue {
  isTelegram: boolean
  debugUserId: string | null
  debugChatId: string | null
}

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  debugUserId: null,
  debugChatId: null,
})

export function useTelegram() {
  return useContext(TelegramContext)
}

// Resolve debug Telegram identity: query params take priority over env vars
function resolveDebugIds(): { userId: string | null; chatId: string | null } {
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('tgUserId') ?? ENV.DEBUG_TELEGRAM_USER_ID ?? null
  const chatId = params.get('tgChatId') ?? ENV.DEBUG_TELEGRAM_CHAT_ID ?? null
  return { userId, chatId }
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const isTelegram = isTelegramEnv()
  const debug = !isTelegram ? resolveDebugIds() : { userId: null, chatId: null }

  useEffect(() => {
    initTelegramApp()
    setSafeAreaVars()
  }, [])

  return (
    <TelegramContext.Provider value={{
      isTelegram,
      debugUserId: debug.userId,
      debugChatId: debug.chatId,
    }}>
      {children}
    </TelegramContext.Provider>
  )
}

export { isTelegramEnv }
