import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'HR Portal' }

export default async function PortalPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== 'hr_admin') redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">HR Portal</h1>
      <p className="text-muted-foreground mb-8">
        Alle tal er anonymiserede aggregater. Minimum 5 medarbejdere per gruppe.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-1">Aktive medarbejdere</p>
          <p className="text-2xl font-bold">–</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-1">Onboarding-rate</p>
          <p className="text-2xl font-bold">–%</p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-1">Mål oprettet (total)</p>
          <p className="text-2xl font-bold">–</p>
        </div>
      </div>

      <div className="rounded-xl border bg-amber-50 border-amber-200 p-4 text-sm text-amber-800">
        <strong>Privatlivsgaranti:</strong> Bullaris viser aldrig individuelle medarbejderdata i HR
        portalen. Alle aggregater kræver minimum 5 medarbejdere. Datasæt med under 5 personer vises
        som &quot;Utilstrækkelige data&quot;.
      </div>
    </div>
  )
}
