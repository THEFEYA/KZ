export const ROUTES = {
  OVERVIEW: '/',
  QUEUES: '/queues',
  ANALYTICS: '/analytics',
  DETAIL: '/detail/:id',
  SETTINGS: '/settings',
} as const

export const buildDetailRoute = (id: string) => `/detail/${id}`
