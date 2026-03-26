import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Oversigt' }

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">God dag</h1>
      <p className="text-muted-foreground mb-8">
        Her er et overblik over din finansielle situation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-1">Nettoløn denne måned</p>
          <p className="text-2xl font-bold">– DKK</p>
          <p className="text-xs text-muted-foreground mt-1">
            <a href="/payslip" className="underline">
              Se lønseddel
            </a>
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-1">Aktive mål</p>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-muted-foreground mt-1">
            <a href="/goals" className="underline">
              Opret mål
            </a>
          </p>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground mb-1">Formue (netto)</p>
          <p className="text-2xl font-bold">– DKK</p>
          <p className="text-xs text-muted-foreground mt-1">Opdater formue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Hurtige handlinger</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="/payslip" className="flex items-center gap-2 text-bullaris-blue hover:underline">
                📄 Forstå din lønseddel
              </a>
            </li>
            <li>
              <a href="/tax-planner" className="flex items-center gap-2 text-bullaris-blue hover:underline">
                🧮 Beregn dine fradrag
              </a>
            </li>
            <li>
              <a href="/chat" className="flex items-center gap-2 text-bullaris-blue hover:underline">
                💬 Spørg AI-assistenten
              </a>
            </li>
            <li>
              <a href="/learning" className="flex items-center gap-2 text-bullaris-blue hover:underline">
                📚 Lær om pensionsopsparing
              </a>
            </li>
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-6">
          <h2 className="font-semibold mb-4">Seneste aktivitet</h2>
          <p className="text-sm text-muted-foreground">Ingen aktivitet endnu.</p>
        </div>
      </div>
    </div>
  )
}
