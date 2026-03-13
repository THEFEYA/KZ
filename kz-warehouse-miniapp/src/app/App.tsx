import { RouterProvider } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import { TelegramProvider } from './providers/TelegramProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { router } from './routes'

export function App() {
  return (
    <QueryProvider>
      <TelegramProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </TelegramProvider>
    </QueryProvider>
  )
}
