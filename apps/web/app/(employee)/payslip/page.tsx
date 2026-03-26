'use client'

import { useState } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { PayslipBreakdown } from '@/components/payslip-breakdown'
import { trpc } from '@/lib/trpc'

export default function PayslipPage() {
  const [consentGiven, setConsentGiven] = useState(false)
  const [showConsent, setShowConsent] = useState(true)
  const [grossInput, setGrossInput] = useState('')

  const logConsent = trpc.employee.logConsent.useMutation()
  const payslipQuery = trpc.payslip.calculate.useQuery(
    { gross_dkk: Number(grossInput) },
    { enabled: consentGiven && Number(grossInput) > 0 }
  )

  function handleAccept() {
    logConsent.mutate({ module: 'payslip_module', action: 'grant' })
    setConsentGiven(true)
    setShowConsent(false)
  }

  function handleDecline() {
    setShowConsent(false)
  }

  if (showConsent && !consentGiven) {
    return (
      <ConsentModal
        module="payslip_module"
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Lønseddel-forklarer</h1>
      <p className="text-muted-foreground mb-8">
        Indtast din bruttoløn og se præcis hvad du får udbetalt — trin for trin.
      </p>

      <div className="rounded-xl border bg-card p-6 mb-6">
        <label className="block text-sm font-medium mb-2">
          Bruttoløn (DKK/måned)
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            placeholder="F.eks. 45000"
            className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
      </div>

      {payslipQuery.data?.data && (
        <PayslipBreakdown result={payslipQuery.data.data} />
      )}

      {payslipQuery.isLoading && (
        <div className="text-center py-8 text-muted-foreground text-sm">Beregner...</div>
      )}
    </div>
  )
}
