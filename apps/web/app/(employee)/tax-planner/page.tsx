'use client'

import { useState } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { LearnBanner } from '@/components/learn-banner'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { useConsent } from '@/lib/use-consent'

export default function TaxPlannerPage() {
  const { t, locale } = useLanguage()
  const { hasConsent, isLoading: consentLoading, grant } = useConsent('tax_planner')

  const [kmDaily,      setKmDaily]      = useState('')
  const [workingDays,  setWorkingDays]  = useState('220')
  const [unionContrib, setUnionContrib] = useState('')

  const profileQuery = trpc.employee.getProfile.useQuery(undefined, { enabled: hasConsent })
  const profile = profileQuery.data?.data
  const isOresund = profile?.countryOfResidence === 'SE'
  const childrenCount = profile?.childrenInDaycare ?? 0

  const deductionsQuery = trpc.payslip.getDeductions.useQuery(
    {
      km_daily: Number(kmDaily),
      working_days: Number(workingDays),
      union_contrib_dkk: Number(unionContrib),
    },
    { enabled: hasConsent && kmDaily !== '' && Number(kmDaily) >= 0 }
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

  const fmt = (n: number) => n.toLocaleString(locale === 'da' ? 'da-DK' : 'en-GB') + ' DKK'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{t.taxPlanner.title}</h1>
      <p className="text-muted-foreground mb-6">{t.taxPlanner.subtitle}</p>

      {/* Øresund notice */}
      {isOresund && (
        <div className="rounded-xl p-4 mb-6 flex gap-3" style={{ background: '#FEF3C7', border: '1px solid #FCD34D' }}>
          <span className="text-xl shrink-0">🇸🇪</span>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: '#92400E' }}>
              {t.taxPlanner.oresund.notice}
            </p>
            <p className="text-xs" style={{ color: '#92400E' }}>
              {t.taxPlanner.oresund.rateNote}
            </p>
            <a
              href="https://www.skat.dk/data.aspx?oid=2234788"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline mt-1 inline-block"
              style={{ color: '#92400E' }}
            >
              {t.taxPlanner.oresund.ctaLabel} →
            </a>
          </div>
        </div>
      )}

      {/* Childcare notice (if applicable) */}
      {childrenCount > 0 && (
        <div className="rounded-xl p-4 mb-6 flex gap-3" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
          <span className="text-xl shrink-0">👶</span>
          <p className="text-sm" style={{ color: '#166534' }}>
            {t.taxPlanner.deductions.daycareNotice
              .replace('{count}', String(Math.min(childrenCount, 2)))
              .replace('{amount}', (Math.min(childrenCount, 2) * 6400).toLocaleString(locale === 'da' ? 'da-DK' : 'en-GB'))}
          </p>
        </div>
      )}

      <div className="rounded-xl border bg-card p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t.taxPlanner.kmDaily}</label>
          <input
            type="number"
            value={kmDaily}
            onChange={(e) => setKmDaily(e.target.value)}
            placeholder={locale === 'da' ? 'F.eks. 35' : 'e.g. 35'}
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
            placeholder={locale === 'da' ? 'F.eks. 4.200' : 'e.g. 4,200'}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
      </div>

      {deductionsQuery.data && (
        <div className="rounded-xl border bg-card p-6 space-y-3">
          <h2 className="font-semibold mb-4">{t.taxPlanner.deductions.title}</h2>
          {deductionsQuery.data.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <div>
                <span className="text-muted-foreground">{item.label}</span>
                {item.note && <p className="text-xs text-muted-foreground">{item.note}</p>}
              </div>
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

      <div className="mt-6 space-y-4">
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
        <LearnBanner
          moduleId="tax-return"
          href="/learning/tax-return"
          icon="📋"
          duration="~12 min"
          en={{
            title: 'Annual Tax Return Guide (TastSelv)',
            teaser: 'Step-by-step: how to check and submit your årsopgørelse before May 1.',
            completedTeaser: 'You completed this module. Review it anytime.',
          }}
          da={{
            title: 'Årsopgørelse — trin for trin (TastSelv)',
            teaser: 'Sådan tjekker og indsender du din årsopgørelse inden 1. maj.',
            completedTeaser: 'Du har gennemført dette modul. Gense det når som helst.',
          }}
        />
      </div>
    </div>
  )
}
