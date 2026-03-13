import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { setMainButton, hideMainButton } from '@core/telegram/buttons'
import { useOpenFilterSheet } from '@core/state/selectors'

export function MainButtonBridge() {
  const location = useLocation()
  const openFilter = useOpenFilterSheet()

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (location.pathname === '/') {
      cleanup = setMainButton('Показать горячие', () => {
        openFilter()
      })
    } else if (location.pathname === '/queues') {
      cleanup = setMainButton('Фильтры', () => {
        openFilter()
      })
    } else {
      hideMainButton()
    }

    return () => {
      cleanup?.()
    }
  }, [location.pathname, openFilter])

  return null
}
