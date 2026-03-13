import type { ModePreset } from '@core/types/ui'

export const MODE_PRESETS: ModePreset[] = [
  {
    id: 'wide-10',
    ruName: 'Широкий 10',
    description: 'Широкий срез без жёсткого сужения по одной горячести, свежести или очереди',
    params: {
      limit: 10,
      tier: 'all_active',
      region: null,
    },
  },
  {
    id: 'precise-5',
    ruName: 'Точный 5',
    description: 'Только горячие, только свежие, рабочая очередь, tier_1',
    params: {
      bucket: 'action_queue',
      limit: 5,
      tier: 'tier_1',
      heat: 'hot',
      freshness: 'fresh',
      region: null,
    },
  },
  {
    id: 'almaty-5',
    ruName: 'Алматы 5',
    description: 'Регион Алматы, рабочая очередь, 5 записей',
    params: {
      bucket: 'action_queue',
      region: 'Алматы',
      limit: 5,
    },
  },
  {
    id: 'astana-5',
    ruName: 'Астана 5',
    description: 'Регион Астана, рабочая очередь, 5 записей',
    params: {
      bucket: 'action_queue',
      region: 'Астана',
      limit: 5,
    },
  },
]
