import { createClient } from '@supabase/supabase-js'

// Replace with real supabase URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// Replace with real supabase key
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabasePublishableKey)
