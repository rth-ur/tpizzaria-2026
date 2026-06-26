import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_KEY para o modo produção.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
