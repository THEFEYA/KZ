import { useEffect, type ReactNode } from 'react'
import { useThemeId } from '@core/state/selectors'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeId = useThemeId()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
  }, [themeId])

  return <>{children}</>
}
