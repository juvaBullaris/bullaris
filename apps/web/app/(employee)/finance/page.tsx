'use client'

import { useState } from 'react'
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

const BUCKET_LABELS_5030: Record<string, string> = {
  needs: 'Behov (50%)',
  wants: 'Ønsker (30%)',
  savings: 'Opsparing (20%)',
}

const BUCKET_LABELS_60: Record<string, string> = {
  committed: 'Faste udgifter (60%)',
  retirement: 'Pension (10%)',
  longterm: 'Langsigtede opsparing (10%)',
  shortterm: 'Kortsigtede opsparing (10%)',
  fun: 'Frihed (10%)',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('da-DK', { maximumFractionDigits: 0 }) + ' kr.'
}

function healthRating(score: number) {
  if (score >= 80) return { label: 'Fremragende', color: '#16A34A' }
  if (score >= 60) return { label: 'God', color: '#2563EB' }
  if (score >= 40) return { label: 'Fair', color: '#E8634A' }
  return { label: 'Behøver fokus', color: '#DC2626' }
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function FinancePage() {
  const { t } = useLanguage()
  const [tab, setTab] = useState<Tab>('overview')
  const [framework, setFramework] = useState<Framework>('503020')

  // Queries
  const profileQuery   = trpc.employee.getProfile.useQuery()
  const goalsQuery     = trpc.goals.list.useQuery()
  const debtQuery      = trpc.debt.list.useQuery()
  const progressQuery  = trpc.learning.myProgress.useQuery()
  const budgetQuery    = trpc.budget.list.useQuery()
  const netWorthQuery  = trpc.netWorth.list.useQuery()

  const profile = profileQuery.data?.data
  const grossDkk = profile?.gross_dkk ? Number(profile.gross_dkk) : null

  const estimateNetQuery = trpc.payslip.estimateNet.useQuery(
    { gross_dkk: grossDkk ?? 0 },
    { enabled: (grossDkk ?? 0) > 0 }
  )
  const netDkk = estimateNetQuery.data?.net_dkk ?? null

  // Mutations
  const createBudget  = trpc.budget.create.useMutation({ onSuccess: () => budgetQuery.refetch() })
  const updateBudget  = trpc.budget.update.useMutation({ onSuccess: () => budgetQuery.refetch() })
  const deleteBudget  = trpc.budget.delete.useMutation({ onSuccess: () => budgetQuery.refetch() })
  const createDebt    = trpc.debt.create.useMutation({ onSuccess: () => debtQuery.refetch() })
  const updateDebt    = trpc.debt.update.useMutation({ onSuccess: () => debtQuery.refetch() })
  const deleteDebt    = trpc.debt.delete.useMutation({ onSuccess: () => debtQuery.refetch() })
  const addNetWorth   = trpc.netWorth.add.useMutation({ onSuccess: () => netWorthQuery.refetch() })
  const deleteNW      = trpc.netWorth.delete.useMutation({ onSuccess: () => netWorthQuery.refetch() })

  // Form states — Budget tracker
  const [newBudgetLabel, setNewBudgetLabel]   = useState('')
  const [newBudgetLimit, setNewBudgetLimit]   = useState('')
  const [newBudgetPeriod, setNewBudgetPeriod] = useState<'monthly' | 'annual'>('monthly')

  // Form states — Debt
  const [newDebtLabel,    setNewDebtLabel]    = useState('')
  const [newDebtBalance,  setNewDebtBalance]  = useState('')
  const [newDebtRate,     setNewDebtRate]     = useState('')
  const [newDebtStrategy, setNewDebtStrategy] = useState<'avalanche' | 'snowball'>('avalanche')

  // Form states — Net Worth
  const [nwAssets,      setNwAssets]      = useState('')
  const [nwLiabilities, setNwLiabilities] = useState('')

  // ── Financial Health Score ─────────────────────────────────────────────────
  const goals = goalsQuery.data ?? []
  const debts = debtQuery.data ?? []
  const completions = progressQuery.data?.length ?? 0

  const efGoal = goals.find((g) => g.type === 'emergency_fund')
  const efPct  = efGoal ? Math.min(Number(efGoal.progress_dkk) / Number(efGoal.target_dkk), 1) : 0
  const efScore = efPct * 30

  const totalDebt = debts.reduce((s, d) => s + Number(d.balance_dkk), 0)
  const annualNet = (netDkk ?? 0) * 12
  const debtRatio = annualNet > 0 ? totalDebt / annualNet : 0
  const debtScore = Math.max(0, 25 - debtRatio * 25)

  const learningScore = Math.min(completions / 5, 1) * 20

  const hasShort = goals.some((g) => ['emergency_fund','debt_payoff','vacation','car','education'].includes(g.type))
  const hasLong  = goals.some((g) => ['pension_boost','financial_independence','passive_income','early_retirement','generational_wealth'].includes(g.type))
  const goalScore = (hasShort ? 12 : 0) + (hasLong ? 13 : 0)

  const totalScore = Math.round(efScore + debtScore + learningScore + goalScore)
  const rating = healthRating(totalScore)

  const savingsRate = netDkk && netDkk > 0
    ? goals.reduce((s, g) => s + Number(g.target_dkk), 0) / netDkk * 100
    : null

  // ── Tabs ───────────────────────────────────────────────────────────────────
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview',      label: 'Overblik' },
    { key: 'budgetplan',    label: 'Budgetplan' },
    { key: 'budgettracker', label: 'Budgetsporing' },
    { key: 'debt',          label: 'Gæld' },
    { key: 'networth',      label: 'Formue' },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-1" style={{ color: '#1E0F00' }}>
        {t.finance.title}
      </h1>
      <p className="text-sm mb-6" style={{ color: '#A0917F' }}>
        {t.finance.subtitle}
      </p>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: '#EDE0D4' }}>
        {tabs.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            style={{
              background: tab === tb.key ? '#fff' : 'transparent',
              color: tab === tb.key ? '#1E0F00' : '#6B5C52',
              boxShadow: tab === tb.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Score card */}
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
              {t.finance.score.title}
            </h2>
            <div className="flex items-center gap-8">
              {/* Circular gauge */}
              <div className="relative shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#EDE0D4" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={rating.color} strokeWidth="10"
                    strokeDasharray={`${(totalScore / 100) * 251.2} 251.2`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: '#1E0F00' }}>{totalScore}</span>
                  <span className="text-xs" style={{ color: '#A0917F' }}>/100</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold mb-1" style={{ color: rating.color }}>{rating.label}</p>
                {/* Score breakdown bars */}
                {[
                  { label: t.finance.score.emergency, score: efScore, max: 30 },
                  { label: t.finance.score.debt,      score: debtScore, max: 25 },
                  { label: t.finance.score.learning,  score: learningScore, max: 20 },
                  { label: t.finance.score.goals,     score: goalScore, max: 25 },
                ].map((row) => (
                  <div key={row.label} className="mb-2">
                    <div className="flex justify-between text-xs mb-0.5" style={{ color: '#6B5C52' }}>
                      <span>{row.label}</span>
                      <span>{Math.round(row.score)}/{row.max}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#EDE0D4' }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${(row.score / row.max) * 100}%`, background: '#E8634A' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Savings rate */}
          {grossDkk && (
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <h2 className="font-serif font-semibold text-lg mb-2" style={{ color: '#1E0F00' }}>
                {t.finance.savingsRate.title}
              </h2>
              {netDkk ? (
                <>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-3xl font-bold" style={{ color: (savingsRate ?? 0) >= 10 ? '#16A34A' : '#E8634A' }}>
                      {savingsRate?.toFixed(1) ?? '–'}%
                    </span>
                    <span className="text-sm mb-1" style={{ color: '#A0917F' }}>
                      {t.finance.savingsRate.yourRate}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: '#A0917F' }}>
                    {t.finance.savingsRate.benchmark} — Bengen (1994); Vanguard Target Retirement Research (2020)
                  </p>
                </>
              ) : (
                <p className="text-sm" style={{ color: '#A0917F' }}>Udfyld din løn i profilen for at se din opsparingsrate.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Budget Plan ──────────────────────────────────────────────────────── */}
      {tab === 'budgetplan' && (
        <div className="space-y-4">
          {/* Framework toggle */}
          <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#EDE0D4' }}>
            {([
              { key: '503020', label: t.finance.budgetPlan.toggle5030 },
              { key: '60solution', label: t.finance.budgetPlan.toggle60 },
            ] as { key: Framework; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFramework(key)}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: framework === key ? '#fff' : 'transparent',
                  color: framework === key ? '#1E0F00' : '#6B5C52',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {!grossDkk ? (
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <p className="text-sm" style={{ color: '#A0917F' }}>
                Tilføj din bruttoløn i profilen for at se din personlige budgetplan.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #EDE0D4' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#FFF8F3' }}>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1E0F00' }}>Kategori</th>
                    <th className="px-4 py-3 text-right font-semibold" style={{ color: '#1E0F00' }}>%</th>
                    <th className="px-4 py-3 text-right font-semibold" style={{ color: '#1E0F00' }}>{t.finance.budgetPlan.recommended}</th>
                    <th className="px-4 py-3 text-right font-semibold" style={{ color: '#A0917F', fontSize: '0.7rem' }}>Kilde</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const bucketMap = framework === '503020' ? BUCKET_LABELS_5030 : BUCKET_LABELS_60
                    const buckets = framework === '503020'
                      ? ['needs', 'wants', 'savings']
                      : ['committed', 'retirement', 'longterm', 'shortterm', 'fun']

                    return buckets.map((bucket) => {
                      const rows = BUDGET_ROWS.filter((r) =>
                        framework === '503020' ? r.bucket5030 === bucket : r.bucket60 === bucket
                      )
                      if (rows.length === 0) return null
                      const bucketPct = rows.reduce((s, r) => s + (framework === '503020' ? r.pct5030 : r.pct60), 0)
                      return (
                        <>
                          <tr key={`bucket-${bucket}`} style={{ background: '#FDF6EE' }}>
                            <td colSpan={4} className="px-4 py-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#A0917F' }}>
                              {bucketMap[bucket]}
                            </td>
                          </tr>
                          {rows.map((row) => {
                            const pct = framework === '503020' ? row.pct5030 : row.pct60
                            const recommended = Math.round((netDkk ?? 0) * pct / 100)
                            const catLabel = t.finance.budgetPlan.categories[row.key as keyof typeof t.finance.budgetPlan.categories] ?? row.key
                            return (
                              <tr key={row.key} style={{ borderTop: '1px solid #EDE0D4' }}>
                                <td className="px-4 py-3" style={{ color: '#1E0F00' }}>{catLabel}</td>
                                <td className="px-4 py-3 text-right" style={{ color: '#6B5C52' }}>{pct}%</td>
                                <td className="px-4 py-3 text-right font-medium" style={{ color: '#1E0F00' }}>{fmt(recommended)}</td>
                                <td className="px-4 py-3 text-right" style={{ color: '#A0917F', fontSize: '0.65rem' }}>{row.source}</td>
                              </tr>
                            )
                          })}
                          <tr style={{ borderTop: '1px solid #EDE0D4', background: '#FFF8F3' }}>
                            <td className="px-4 py-2 font-semibold text-xs" style={{ color: '#6B5C52' }}>Subtotal</td>
                            <td className="px-4 py-2 text-right font-semibold text-xs" style={{ color: '#6B5C52' }}>{bucketPct}%</td>
                            <td className="px-4 py-2 text-right font-semibold text-xs" style={{ color: '#6B5C52' }}>
                              {fmt(Math.round((netDkk ?? 0) * bucketPct / 100))}
                            </td>
                            <td />
                          </tr>
                        </>
                      )
                    })
                  })()}
                </tbody>
              </table>
              <div className="px-4 py-3" style={{ background: '#FFF8F3', borderTop: '1px solid #EDE0D4' }}>
                <p className="text-xs" style={{ color: '#A0917F' }}>
                  {framework === '503020'
                    ? 'Baseret på Warren & Tyagi (2005) "All Your Worth". Beregnet ud fra din estimerede nettoløn.'
                    : 'Baseret på Richard Jenkins (2003) "The 60% Solution". Beregnet ud fra din estimerede nettoløn.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Budget Tracker ───────────────────────────────────────────────────── */}
      {tab === 'budgettracker' && (
        <div className="space-y-4">
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
              {t.finance.budgetTracker.add}
            </h2>
            {budgetQuery.data?.length === 0 && (
              <p className="text-sm mb-4" style={{ color: '#A0917F' }}>{t.finance.budgetTracker.noCategories}</p>
            )}
            {budgetQuery.data?.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid #EDE0D4' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1E0F00' }}>{cat.label}</p>
                  <p className="text-xs" style={{ color: '#A0917F' }}>
                    {fmt(Number(cat.limit_dkk))} / {cat.period === 'monthly' ? t.common.month : t.common.annual}
                  </p>
                </div>
                <button
                  onClick={() => deleteBudget.mutate({ id: cat.id })}
                  className="text-xs px-2 py-1 rounded"
                  style={{ color: '#DC2626' }}
                >
                  {t.common.delete}
                </button>
              </div>
            ))}

            {/* Add form */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #EDE0D4' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#1E0F00' }}>{t.finance.budgetTracker.add}</p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  placeholder={t.finance.budgetTracker.label}
                  value={newBudgetLabel}
                  onChange={(e) => setNewBudgetLabel(e.target.value)}
                  className="flex-1 min-w-[140px] rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30"
                />
                <input
                  type="number"
                  placeholder={t.finance.budgetTracker.limit}
                  value={newBudgetLimit}
                  onChange={(e) => setNewBudgetLimit(e.target.value)}
                  className="w-28 rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30"
                />
                <div className="flex rounded-lg border border-input overflow-hidden text-sm">
                  {(['monthly', 'annual'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewBudgetPeriod(p)}
                      className="px-3 py-2 transition"
                      style={{
                        background: newBudgetPeriod === p ? '#E8634A' : '#fff',
                        color: newBudgetPeriod === p ? '#fff' : '#6B5C52',
                      }}
                    >
                      {p === 'monthly' ? t.common.month : t.common.annual}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!newBudgetLabel || !newBudgetLimit || createBudget.isPending}
                  onClick={() => {
                    createBudget.mutate({ label: newBudgetLabel, limit_dkk: Number(newBudgetLimit), period: newBudgetPeriod })
                    setNewBudgetLabel(''); setNewBudgetLimit('')
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition"
                  style={{ background: '#E8634A' }}
                >
                  {t.common.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Debt ─────────────────────────────────────────────────────────────── */}
      {tab === 'debt' && (
        <div className="space-y-4">
          {/* Strategy explanation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'avalanche', label: t.finance.debt.avalanche, desc: t.finance.debt.avalancheDesc, color: '#2563EB' },
              { key: 'snowball',  label: t.finance.debt.snowball,  desc: t.finance.debt.snowballDesc,  color: '#16A34A' },
            ].map((s) => (
              <div key={s.key} className="rounded-2xl p-4" style={{ background: '#fff', border: `1px solid ${s.color}30` }}>
                <p className="text-sm font-semibold mb-1" style={{ color: s.color }}>{s.label}</p>
                <p className="text-xs" style={{ color: '#6B5C52' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
              {t.finance.tabs.debt}
            </h2>
            {debtQuery.data?.length === 0 && (
              <p className="text-sm mb-4" style={{ color: '#A0917F' }}>{t.finance.debt.noDebts}</p>
            )}
            {/* Sort by strategy */}
            {(debtQuery.data ?? [])
              .slice()
              .sort((a, b) => {
                const strat = a.strategy ?? 'avalanche'
                if (strat === 'avalanche') return Number(b.interestRate) - Number(a.interestRate)
                return Number(a.balance_dkk) - Number(b.balance_dkk)
              })
              .map((debt, i) => (
                <div key={debt.id} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #EDE0D4' }}>
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                      style={{ background: '#E8634A' }}>{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1E0F00' }}>{debt.label}</p>
                      <p className="text-xs" style={{ color: '#A0917F' }}>
                        {fmt(Number(debt.balance_dkk))} · {(Number(debt.interestRate) * 100).toFixed(1)}% rente
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: debt.strategy === 'snowball' ? '#16A34A18' : '#2563EB18',
                               color: debt.strategy === 'snowball' ? '#16A34A' : '#2563EB' }}>
                      {debt.strategy === 'snowball' ? 'Snebold' : 'Lavine'}
                    </span>
                    <button onClick={() => deleteDebt.mutate({ id: debt.id })} className="text-xs px-2 py-1 rounded" style={{ color: '#DC2626' }}>
                      {t.common.delete}
                    </button>
                  </div>
                </div>
              ))}

            {/* Add debt form */}
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #EDE0D4' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#1E0F00' }}>{t.finance.debt.add}</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input type="text" placeholder={t.finance.debt.label} value={newDebtLabel}
                  onChange={(e) => setNewDebtLabel(e.target.value)}
                  className="rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30" />
                <input type="number" placeholder={t.finance.debt.balance + ' (DKK)'} value={newDebtBalance}
                  onChange={(e) => setNewDebtBalance(e.target.value)}
                  className="rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30" />
                <input type="number" step="0.1" placeholder={t.finance.debt.interest + ' (%)'} value={newDebtRate}
                  onChange={(e) => setNewDebtRate(e.target.value)}
                  className="rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30" />
                <div className="flex rounded-lg border border-input overflow-hidden text-sm">
                  {(['avalanche', 'snowball'] as const).map((s) => (
                    <button key={s} onClick={() => setNewDebtStrategy(s)}
                      className="flex-1 px-2 py-2 transition text-xs"
                      style={{ background: newDebtStrategy === s ? '#E8634A' : '#fff', color: newDebtStrategy === s ? '#fff' : '#6B5C52' }}>
                      {s === 'avalanche' ? 'Lavine' : 'Snebold'}
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={!newDebtLabel || !newDebtBalance || !newDebtRate || createDebt.isPending}
                onClick={() => {
                  createDebt.mutate({ label: newDebtLabel, balance_dkk: Number(newDebtBalance), interestRate: Number(newDebtRate) / 100, strategy: newDebtStrategy })
                  setNewDebtLabel(''); setNewDebtBalance(''); setNewDebtRate('')
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition"
                style={{ background: '#E8634A' }}
              >
                {t.common.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Net Worth ────────────────────────────────────────────────────────── */}
      {tab === 'networth' && (
        <div className="space-y-4">
          {/* Latest value */}
          {netWorthQuery.data && netWorthQuery.data.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#A0917F' }}>Nuværende formue (netto)</p>
              <p className="text-3xl font-bold" style={{ color: '#1E0F00' }}>
                {fmt(Number(netWorthQuery.data[0].assets_dkk) - Number(netWorthQuery.data[0].liabilities_dkk))}
              </p>
            </div>
          )}

          {/* Chart */}
          {netWorthQuery.data && netWorthQuery.data.length > 1 && (
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <NetWorthChart data={netWorthQuery.data.map((e) => ({ ...e, recorded_at: e.recordedAt }))} />
            </div>
          )}

          {/* Add snapshot */}
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif font-semibold text-lg mb-1" style={{ color: '#1E0F00' }}>
              {t.finance.netWorth.add}
            </h2>
            <p className="text-xs mb-4" style={{ color: '#A0917F' }}>{t.finance.netWorth.privacy}</p>
            <div className="flex gap-2 flex-wrap">
              <input type="number" placeholder={t.finance.netWorth.assets + ' (DKK)'} value={nwAssets}
                onChange={(e) => setNwAssets(e.target.value)}
                className="flex-1 min-w-[140px] rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30" />
              <input type="number" placeholder={t.finance.netWorth.liabilities + ' (DKK)'} value={nwLiabilities}
                onChange={(e) => setNwLiabilities(e.target.value)}
                className="flex-1 min-w-[140px] rounded-lg border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30" />
              <button
                disabled={!nwAssets || addNetWorth.isPending}
                onClick={() => {
                  addNetWorth.mutate({ assets_dkk: Number(nwAssets), liabilities_dkk: Number(nwLiabilities || 0) })
                  setNwAssets(''); setNwLiabilities('')
                }}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition"
                style={{ background: '#E8634A' }}
              >
                {t.common.save}
              </button>
            </div>
          </div>

          {/* History list */}
          {(netWorthQuery.data ?? []).length === 0 && (
            <p className="text-sm" style={{ color: '#A0917F' }}>{t.finance.netWorth.noSnapshots}</p>
          )}
          {(netWorthQuery.data ?? []).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl p-4"
              style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <div>
                <p className="text-xs" style={{ color: '#A0917F' }}>
                  {new Date(entry.recordedAt).toLocaleDateString('da-DK', { month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm font-medium" style={{ color: '#1E0F00' }}>
                  {t.finance.netWorth.assets}: {fmt(Number(entry.assets_dkk))} · {t.finance.netWorth.liabilities}: {fmt(Number(entry.liabilities_dkk))}
                </p>
              </div>
              <button onClick={() => deleteNW.mutate({ id: entry.id })} className="text-xs px-2 py-1 rounded" style={{ color: '#DC2626' }}>
                {t.common.delete}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
