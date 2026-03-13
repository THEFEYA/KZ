import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './layout/RootLayout'
import { OverviewPage } from '@pages/OverviewPage'
import { QueuesPage } from '@pages/QueuesPage'
import { AnalyticsPage } from '@pages/AnalyticsPage'
import { DetailPage } from '@pages/DetailPage'
import { SettingsPage } from '@pages/SettingsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'queues', element: <QueuesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'detail/:id', element: <DetailPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
