'use client'

import { useState } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { trpc } from '@/lib/trpc'

export default function TaxPlannerPage() {
  const [consentGiven, setConsentGiven] = useState(false)
  const [showConsent, setShowConsent] = useState(true)

  // Deduction inputs
  const [kmDaily, setKmDaily] = useState('')
  const [workingDays, setWorkingDays] = useState('220')
  const [unionContrib, setUnionContrib] = useState('')

  const logConsent = trpc.employee.logConsent.useMutation()
  const deductionsQuery = trpc.payslip.getDeductions.useQuery(
    {
      km_daily: Number(kmDaily),
      working_days: Number(workingDays),
      union_contrib_dkk: Number(unionContrib),
    },
    { enabled: consentGiven && Number(kmDaily) >= 0 }
  )

  function handleAccept() {
    logConsent.mutate({ module: 'tax_planner', action: 'grant' })
    setConsentGiven(true)
    setShowConsent(false)
  }

  function handleDecline() {
    setShowConsent(false)
  }

  if (showConsent && !consentGiven) {
    return (
      <ConsentModal
        module="tax_planner"
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    )
  }

  const fmt = (n: number) => n.toLocaleString('da-DK') + ' DKK'

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Skatteplan</h1>
      <p className="text-muted-foreground mb-8">
        Beregn dine fradrag og find ud af, hvad du kan trække fra i skat.
      </p>

      <div className="rounded-xl border bg-card p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Daglig pendlerafstand (km én vej)
          </label>
          <input
            type="number"
            value={kmDaily}
            onChange={(e) => setKmDaily(e.target.value)}
            placeholder="F.eks. 35"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Arbejdsdage per år
          </label>
          <input
            type="number"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            placeholder="220"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Fagforeningskontingent (DKK/år)
          </label>
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
          <h2 className="font-semibold mb-4">Dine fradrag</h2>
          {deductionsQuery.data.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{fmt(item.amount_dkk)}</span>
            </div>
          ))}
          <div className="pt-3 border-t flex justify-between font-semibold">
            <span>Samlede fradrag</span>
            <span className="text-bullaris-teal">
              {fmt(deductionsQuery.data.reduce((s, d) => s + d.amount_dkk, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
