import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * Client-side Supabase client (for use in Client Components)
 */
export function createClient() {
  return createClientComponentClient()
}

/**
 * Server-side Supabase client (for use in Server Components)
 * Must be called inside a component or function — not at module level
 */
export function createServerClient() {
  return createServerComponentClient({ cookies })
}
