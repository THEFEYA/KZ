import { createClient } from '@supabase/supabase-js'
import { ENV } from '@core/config/env'

export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY, {
  auth: { persistSession: false },
  global: {
    headers: { 'x-app-name': 'kz-warehouse-miniapp' },
  },
})
