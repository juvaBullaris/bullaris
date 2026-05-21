import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { PortalDashboard } from '@/components/portal-dashboard'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'HR Portal' }

export default async function PortalPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'hr_admin') redirect('/login')

  return <PortalDashboard />
}
