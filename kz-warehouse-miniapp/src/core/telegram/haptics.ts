import { getTgApp } from './init'

export function hapticLight(): void {
  getTgApp()?.HapticFeedback.impactOccurred('light')
}

export function hapticMedium(): void {
  getTgApp()?.HapticFeedback.impactOccurred('medium')
}

export function hapticSuccess(): void {
  getTgApp()?.HapticFeedback.notificationOccurred('success')
}

export function hapticError(): void {
  getTgApp()?.HapticFeedback.notificationOccurred('error')
}

export function hapticSelect(): void {
  getTgApp()?.HapticFeedback.selectionChanged()
}
