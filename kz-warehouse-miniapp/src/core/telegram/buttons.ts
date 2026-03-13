import { getTgApp } from './init'

// Back Button
export function showBackButton(onClick: () => void): () => void {
  const tg = getTgApp()
  if (!tg) return () => {}
  tg.BackButton.show()
  tg.BackButton.onClick(onClick)
  return () => {
    tg.BackButton.offClick(onClick)
    tg.BackButton.hide()
  }
}

export function hideBackButton(): void {
  getTgApp()?.BackButton.hide()
}

// Main Button
export function setMainButton(text: string, onClick: () => void): () => void {
  const tg = getTgApp()
  if (!tg) return () => {}
  tg.MainButton.setText(text)
  tg.MainButton.enable()
  tg.MainButton.show()
  tg.MainButton.onClick(onClick)
  return () => {
    tg.MainButton.offClick(onClick)
    tg.MainButton.hide()
  }
}

export function hideMainButton(): void {
  getTgApp()?.MainButton.hide()
}

export function showMainButtonProgress(): void {
  getTgApp()?.MainButton.showProgress()
}

export function hideMainButtonProgress(): void {
  getTgApp()?.MainButton.hideProgress()
}

// Settings Button
export function showSettingsButton(onClick: () => void): () => void {
  const tg = getTgApp()
  if (!tg) return () => {}
  tg.SettingsButton.show()
  tg.SettingsButton.onClick(onClick)
  return () => {
    tg.SettingsButton.offClick(onClick)
  }
}

// Popup
export function showConfirmPopup(
  message: string,
  onConfirm: () => void,
  title?: string,
): void {
  const tg = getTgApp()
  if (!tg) {
    if (window.confirm(message)) onConfirm()
    return
  }
  tg.showPopup(
    {
      title,
      message,
      buttons: [
        { id: 'ok', type: 'default', text: 'Подтвердить' },
        { id: 'cancel', type: 'cancel', text: 'Отмена' },
      ],
    },
    (id) => {
      if (id === 'ok') onConfirm()
    },
  )
}
