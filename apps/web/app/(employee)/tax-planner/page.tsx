'use client'

import { useState } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { LearnBanner } from '@/components/learn-banner'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { useConsent } from '@/lib/use-consent'

export default function TaxPlannerPage() {
  const { t } = useLanguage()
  const { hasConsent, isLoading: consentLoading, grant } = useConsent('tax_planner')

  const [kmDaily, setKmDaily] = useState('')
  const [workingDays, setWorkingDays] = useState('220')
  const [unionContrib, setUnionContrib] = useState('')

  const deductionsQuery = trpc.payslip.getDeductions.useQuery(
    {
      km_daily: Number(kmDaily),
      working_days: Number(workingDays),
      union_contrib_dkk: Number(unionContrib),
    },
    { enabled: hasConsent && Number(kmDaily) >= 0 }
  )

  if (consentLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">{t.common.loading}</div>
  }

  if (!hasConsent) {
    return (
      <ConsentModal
        module="tax_planner"
        onAccept={grant}
        onDecline={() => window.history.back()}
      />
    )
  }

  const fmt = (n: number) => n.toLocaleString('da-DK') + ' DKK'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{t.taxPlanner.title}</h1>
      <p className="text-muted-foreground mb-8">{t.taxPlanner.subtitle}</p>

      <div className="rounded-xl border bg-card p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.taxPlanner.kmDaily}</label>
          <input
            type="number"
            value={kmDaily}
            onChange={(e) => setKmDaily(e.target.value)}
            placeholder="F.eks. 35"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.taxPlanner.workingDays}</label>
          <input
            type="number"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            placeholder="220"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.taxPlanner.unionContrib}</label>
          <input
            type="number"
            value={unionContrib}
            onChange={(e) => setUnionContrib(e.target.value)}
            placeholder="F.eks. 4200"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
      </div>

      {deductionsQuery.data && (
        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h2 className="font-semibold mb-4">{t.taxPlanner.deductions.title}</h2>
          {deductionsQuery.data.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{fmt(item.amount_dkk)}</span>
            </div>
          ))}
          <div className="pt-3 border-t flex justify-between font-semibold">
            <span>{t.taxPlanner.deductions.total}</span>
            <span className="text-bullaris-teal">
              {fmt(deductionsQuery.data.reduce((s, d) => s + d.amount_dkk, 0))}
            </span>
          </div>
        </div>
      )}

      <LearnBanner
        moduleId="tax-basics"
        href="/learning/tax-basics"
        icon="📊"
        duration="~10 min"
        en={{
          title: 'Danish Tax Basics 2026',
          teaser: 'Understand AM-bidrag, bundskat, kommuneskat and the new 2026 brackets.',
          completedTeaser: 'You completed this module. Review it anytime.',
        }}
        da={{
          title: 'Danske skatter — det grundlæggende 2026',
          teaser: 'Forstå AM-bidrag, bundskat, kommuneskat og de nye 2026-trin.',
          completedTeaser: 'Du har gennemført dette modul. Gense det når som helst.',
        }}
      />
    </div>
  )
}
