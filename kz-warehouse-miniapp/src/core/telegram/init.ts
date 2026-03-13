// Telegram Web App initialization

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export interface TelegramWebApp {
  ready(): void
  expand(): void
  close(): void
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    start_param?: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  viewportHeight: number
  viewportStableHeight: number
  isExpanded: boolean
  BackButton: {
    show(): void
    hide(): void
    onClick(cb: () => void): void
    offClick(cb: () => void): void
    isVisible: boolean
  }
  MainButton: {
    show(): void
    hide(): void
    enable(): void
    disable(): void
    showProgress(leaveActive?: boolean): void
    hideProgress(): void
    onClick(cb: () => void): void
    offClick(cb: () => void): void
    setText(text: string): void
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
  }
  SettingsButton: {
    show(): void
    hide(): void
    onClick(cb: () => void): void
    offClick(cb: () => void): void
  }
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void
    notificationOccurred(type: 'error' | 'success' | 'warning'): void
    selectionChanged(): void
  }
  showPopup(params: {
    title?: string
    message: string
    buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }>
  }, callback?: (buttonId: string) => void): void
  onEvent(eventType: string, callback: () => void): void
  offEvent(eventType: string, callback: () => void): void
  sendData(data: string): void
  platform: string
  version: string
  isVersionAtLeast(version: string): boolean
}

export function getTgApp(): TelegramWebApp | null {
  return window.Telegram?.WebApp ?? null
}

export function initTelegramApp(): void {
  const tg = getTgApp()
  if (!tg) return
  tg.ready()
  tg.expand()
}

export function isTelegramEnv(): boolean {
  return !!(window.Telegram?.WebApp?.initData)
}
