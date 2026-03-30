'use client'

import { trpc } from '@/lib/trpc'

type ConsentModule = 'payslip_module' | 'tax_planner' | 'ai_chat' | 'spending_tracker' | 'profile'

export function useConsent(module: ConsentModule) {
  const statusQuery = trpc.employee.getConsentStatus.useQuery()
  const logConsent = trpc.employee.logConsent.useMutation({
    onSuccess: () => statusQuery.refetch(),
  })

  const latest = statusQuery.data?.data?.[module]
  const hasConsent = latest?.action === 'grant'

  function grant() {
    logConsent.mutate({ module, action: 'grant' })
  }

  return {
    hasConsent,
    isLoading: statusQuery.isLoading,
    grant,
  }
}
