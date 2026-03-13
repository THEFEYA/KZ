import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { initTelegramApp, isTelegramEnv } from '@core/telegram/init'
import { setSafeAreaVars } from '@core/telegram/viewport'

interface TelegramContextValue {
  isTelegram: boolean
}

const TelegramContext = createContext<TelegramContextValue>({ isTelegram: false })

export function useTelegram() {
  return useContext(TelegramContext)
}

export function TelegramProvider({ children }: { children: ReactNode }) {
  const isTelegram = isTelegramEnv()

  useEffect(() => {
    initTelegramApp()
    setSafeAreaVars()
  }, [])

  return (
    <TelegramContext.Provider value={{ isTelegram }}>
      {children}
    </TelegramContext.Provider>
  )
}

export { isTelegramEnv }
