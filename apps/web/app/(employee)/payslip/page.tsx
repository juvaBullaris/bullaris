'use client'

import { useState } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { PayslipBreakdown } from '@/components/payslip-breakdown'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { useConsent } from '@/lib/use-consent'

export default function PayslipPage() {
  const { t } = useLanguage()
  const { hasConsent, isLoading: consentLoading, grant } = useConsent('payslip_module')
  const [grossInput, setGrossInput] = useState('')

  const payslipQuery = trpc.payslip.calculate.useQuery(
    { gross_dkk: Number(grossInput) },
    { enabled: hasConsent && Number(grossInput) > 0 }
  )

  if (consentLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">{t.common.loading}</div>
  }

  if (!hasConsent) {
    return (
      <ConsentModal
        module="payslip_module"
        onAccept={grant}
        onDecline={() => window.history.back()}
      />
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">{t.payslip.title}</h1>
      <p className="text-muted-foreground mb-8">{t.payslip.subtitle}</p>

      <div className="rounded-xl border bg-card p-6 mb-6">
        <label className="block text-sm font-medium mb-2">{t.payslip.grossInput}</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={grossInput}
            onChange={(e) => setGrossInput(e.target.value)}
            placeholder={t.payslip.grossPlaceholder}
            className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullaris-blue"
          />
        </div>
      </div>

      {payslipQuery.data?.data && (
        <PayslipBreakdown result={payslipQuery.data.data} />
      )}

      {payslipQuery.isLoading && (
        <div className="text-center py-8 text-muted-foreground text-sm">{t.payslip.calculating}</div>
      )}
    </div>
  )
}
