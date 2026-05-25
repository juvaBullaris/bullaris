'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { NetWorthChart } from '@/components/net-worth-chart'

type Tab = 'overview' | 'budgetplan' | 'budgettracker' | 'debt' | 'networth'

// ─── Budget plan data ──────────────────────────────────────────────────────────

type Framework = '503020' | '60solution'

interface BudgetRow {
  key: string
  pct5030: number   // % of net pay (50/30/20)
  pct60: number     // % of net pay (60% solution)
  bucket5030: 'needs' | 'wants' | 'savings'
  bucket60: 'committed' | 'retirement' | 'longterm' | 'shortterm' | 'fun'
  source?: string
}

const BUDGET_ROWS: BudgetRow[] = [
  // 50/30/20 — Needs (50%)
  { key: 'housing',     pct5030: 30, pct60: 30, bucket5030: 'needs',   bucket60: 'committed', source: 'Linneman & Wachter (1989)' },
  { key: 'food',        pct5030: 10, pct60: 12, bucket5030: 'needs',   bucket60: 'committed', source: 'Danmarks Statistik (2023)' },
  { key: 'transport',   pct5030: 10, pct60: 10, bucket5030: 'needs',   bucket60: 'committed', source: 'DST transport survey' },
  { key: 'utilities',   pct5030: 5,  pct60: 8,  bucket5030: 'needs',   bucket60: 'committed', source: 'DST (2023)' },
  // 50/30/20 — Wants (30%)
  { key: 'entertainment', pct5030: 10, pct60: 0, bucket5030: 'wants', bucket60: 'fun', source: 'Warren & Tyagi (2005)' },
  { key: 'clothing',    pct5030: 10, pct60: 0,  bucket5030: 'wants',   bucket60: 'fun', source: '' },
  { key: 'misc',        pct5030: 10, pct60: 0,  bucket5030: 'wants',   bucket60: 'fun', source: '' },
  // 50/30/20 — Savings (20%)
  { key: 'pension',     pct5030: 12, pct60: 10, bucket5030: 'savings', bucket60: 'retirement', source: 'Bengen (1994); Vanguard (2020)' },
  { key: 'emergency',   pct5030: 5,  pct60: 10, bucket5030: 'savings', bucket60: 'longterm',   source: 'Lusardi & Mitchell (2011)' },
  { key: 'investments', pct5030: 3,  pct60: 10, bucket5030: 'savings', bucket60: 'shortterm',  source: 'Trinity Study, Cooley et al. (1998)' },
]

const BUCKET_LABELS_5030: Record<string, { en: string; da: string }> = {
  needs:   { en: 'Needs (50%)',    da: 'Behov (50%)' },
  wants:   { en: 'Wants (30%)',    da: 'Ønsker (30%)' },
  savings: { en: 'Savings (20%)', da: 'Opsparing (20%)' },
}

const BUCKET_LABELS_60: Record<string, { en: string; da: string }> = {
  committed:  { en: 'Fixed costs (60%)',        da: 'Faste udgifter (60%)' },
  retirement: { en: 'Pension (10%)',             da: 'Pension (10%)' },
  longterm:   { en: 'Long-term savings (10%)',   da: 'Langsigtede opsparing (10%)' },
  shortterm:  { en: 'Short-term savings (10%)',  da: 'Kortsigtede opsparing (10%)' },
  fun:        { en: 'Freedom (10%)',             da: 'Frihed (10%)' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type RatingLabels = { excellent: string; good: string; fair: string; needsWork: string }
function healthRating(score: number, labels: RatingLabels) {
  if (score >= 80) return { label: labels.excellent, color: '#16A34A' }
  if (score >= 60) return { label: labels.good,      color: '#2563EB' }
  if (score >= 40) return { label: labels.fair,      color: '#E8634A' }
  return            { label: labels.needsWork,   color: '#DC2626' }
}

// ─── Main component ────────────────────────────────────────────────────────────

export function FinanceClient() {
  const { t, locale } = useLanguage()
  const fmt = (n: number) => n.toLocaleString(locale === 'da' ? 'da-DK' : 'en-GB', { maximumFractionDigits: 0 }) + ' kr.'

  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(() => {
    const t = searchParams.get('tab') as Tab | null
    const valid: Tab[] = ['overview', 'budgetplan', 'budgettracker', 'debt', 'networth']
    return t && valid.includes(t) ? t : 'overview'
  })

  useEffect(() => {
    const t = searchParams.get('tab') as Tab | null
    const valid: Tab[] = ['overview', 'budgetplan', 'budgettracker', 'debt', 'networth']
    if (t && valid.includes(t)) setTab(t)
  }, [searchParams])

  const { data: profile } = trpc.employee.getProfile.useQuery()
  const { data: netWorth } = trpc.netWorth.getOverview.useQuery()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t.finance?.title || 'Finance Dashboard'}
          </h1>
          <p className="text-gray-600">
            {t.finance?.subtitle || 'Understand your financial health'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {(['overview', 'budgetplan', 'budgettracker', 'debt', 'networth'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                tab === t
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {t === 'overview' && (t.finance?.tabs?.overview || 'Overview')}
              {t === 'budgetplan' && (t.finance?.tabs?.budgetplan || 'Budget Plan')}
              {t === 'budgettracker' && (t.finance?.tabs?.budgettracker || 'Budget Tracker')}
              {t === 'debt' && (t.finance?.tabs?.debt || 'Debt')}
              {t === 'networth' && (t.finance?.tabs?.networth || 'Net Worth')}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {tab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              {/* Placeholder content */}
              <p className="text-gray-600">Overview content goes here</p>
            </div>
          )}

          {tab === 'budgetplan' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Budget Plan</h2>
              {/* Placeholder content */}
              <p className="text-gray-600">Budget plan content goes here</p>
            </div>
          )}

          {tab === 'budgettracker' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Budget Tracker</h2>
              {/* Placeholder content */}
              <p className="text-gray-600">Budget tracker content goes here</p>
            </div>
          )}

          {tab === 'debt' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Debt</h2>
              {/* Placeholder content */}
              <p className="text-gray-600">Debt content goes here</p>
            </div>
          )}

          {tab === 'networth' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Net Worth</h2>
              {netWorth && <NetWorthChart data={netWorth} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
