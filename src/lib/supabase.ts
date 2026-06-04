import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/* Validate key format — accepts both JWT keys (eyJ...) and publishable keys (sb_publishable_...) */
function isValidKey(key: string | undefined): boolean {
  if (!key) return false
  if (key.startsWith('eyJ') && key.length > 100) return true
  if (key.startsWith('sb_publishable_') && key.length > 20) return true
  return false
}

export const supabase: SupabaseClient | null =
  supabaseUrl && isValidKey(supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
