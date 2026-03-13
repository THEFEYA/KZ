import { getTgApp } from './init'

export function getViewportHeight(): number {
  return getTgApp()?.viewportStableHeight ?? window.innerHeight
}

export function isExpanded(): boolean {
  return getTgApp()?.isExpanded ?? true
}

export function setSafeAreaVars(): void {
  // Apply Telegram viewport height as CSS variable for safe area handling
  const update = () => {
    const vh = getViewportHeight()
    document.documentElement.style.setProperty('--tg-viewport-height', `${vh}px`)
    document.documentElement.style.setProperty('--tg-viewport-stable-height', `${vh}px`)
  }

  const tg = getTgApp()
  if (tg) {
    tg.onEvent('viewportChanged', update)
  }
  update()
}
