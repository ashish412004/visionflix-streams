import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Debug: Check environment variables
console.log('Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'NOT FOUND')
console.log('Supabase Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT FOUND')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Referral {
  id: string
  mobile_number: string
  referral_code: string
  referral_count: number
  created_at: string
  updated_at: string
}

export interface ReferralLog {
  id: string
  referrer_mobile: string
  referred_mobile: string
  status: 'pending' | 'completed'
  points_earned: number
  created_at: string
}
