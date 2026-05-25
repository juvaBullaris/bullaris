import { Suspense } from 'react'
import { FinanceClient } from '@/components/finance/finance-client'

export default function FinancePage() {
  return (
    <Suspense fallback={<FinancePageSkeleton />}>
      <FinanceClient />
    </Suspense>
  )
}

function FinancePageSkeleton() {
  return (
    <div className="min-h-screen p-6 animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-64 mb-4" />
      <div className="h-6 bg-gray-100 rounded w-96 mb-8" />
      <div className="h-12 bg-gray-100 rounded mb-8" />
      <div className="rounded-2xl h-96 bg-gray-100" />
    </div>
  )
}
