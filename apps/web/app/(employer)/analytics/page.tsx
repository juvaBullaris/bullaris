'use client'

import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

const PRIVACY_THRESHOLD = 5

// ── Score helpers ─────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 4.2) return '#14b8a6'
  if (s >= 3.5) return '#22c55e'
  if (s >= 2.8) return '#EAB308'
  if (s >= 2.0) return '#f97316'
  return '#E8634A'
}

function scoreLabel(s: number): { en: string; da: string } {
  if (s >= 4.2) return { en: 'Thriving',      da: 'Trives' }
  if (s >= 3.5) return { en: 'Doing well',    da: 'Det går godt' }
  if (s >= 2.8) return { en: 'Managing',      da: 'Klarer sig' }
  if (s >= 2.0) return { en: 'Struggling',    da: 'Kæmper' }
  return           { en: 'Under pressure', da: 'Under pres' }
}

// ── Wellbeing trend SVG ───────────────────────────────────────────────────────

function WellbeingChart({ data }: { data: { period: string; avgScore: number; count: number }[] }) {
  if (data.length < 2) return null
  const W = 520
  const H = 80
  const pad = { x: 8, y: 10 }
  const iW = W - pad.x * 2
  const iH = H - pad.y * 2

  const points = data.map((d, i) => ({
    x: pad.x + (i / (data.length - 1)) * iW,
    y: pad.y + iH - ((d.avgScore - 1) / 4) * iH,
    score: d.avgScore,
    period: d.period,
    count: d.count,
  }))

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${H} L${points[0].x},${H} Z`

  return (
    <div className="w-full overflow-x-auto">
      <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ minWidth: 300, display: 'block' }}>
        <defs>
          <linearGradient id="wb-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8634A" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#E8634A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Horizontal guide lines */}
        {[1, 2, 3, 4, 5].map((v) => {
          const y = pad.y + iH - ((v - 1) / 4) * iH
          return (
            <g key={v}>
              <line x1={pad.x} y1={y} x2={W - pad.x} y2={y} stroke="#EDE0D4" strokeWidth="1" strokeDasharray="3,4" />
              <text x={pad.x - 2} y={y + 3.5} fontSize="8" fill="#C8BDB5" textAnchor="end">{v}</text>
            </g>
          )
        })}
        {/* Area + line */}
        <path d={area} fill="url(#wb-fill)" />
        <path d={line} fill="none" stroke="#E8634A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={scoreColor(p.score)} stroke="#fff" strokeWidth="2" />
        ))}
        {/* Month labels */}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={H + 16} fontSize="9" fill="#9B8B7E" textAnchor="middle">
            {p.period.slice(5)}
          </text>
        ))}
      </svg>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: React.ReactNode; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
      <p className="text-xs font-medium mb-2" style={{ color: '#A0917F' }}>{label}</p>
      <p className="text-2xl font-bold mb-0.5" style={{ color: accent ?? '#1E0F00' }}>{value}</p>
      {sub && <p className="text-xs" style={{ color: '#C8BDB5' }}>{sub}</p>}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const analyticsQuery = trpc.analytics.overview.useQuery()
  const pulseQuery     = trpc.pulse.aggregateForEmployer.useQuery()

  const data   = analyticsQuery.data
  const pulse  = pulseQuery.data ?? []
  const latest = pulse[pulse.length - 1]
  const prev   = pulse[pulse.length - 2]
  const delta  = latest && prev ? latest.avgScore - prev.avgScore : null

  const totalEmployees = data?.totalEmployees ?? 0
  const activeRaw = data?.activeUsersLast30Days
  const activeNum = typeof activeRaw === 'number' ? activeRaw : null
  const activePct = activeNum != null && totalEmployees > 0
    ? Math.round((activeNum / totalEmployees) * 100)
    : null

  const responsePct = latest && totalEmployees > 0
    ? Math.round((latest.count / totalEmployees) * 100)
    : null

  function handleExportCsv() {
    if (!data) return
    const rows: string[][] = [
      ['Metrik', 'Værdi'],
      ['Aktive brugere (30 dage)', String(activeRaw ?? '')],
      ['Aktiv rate (%)', activePct != null ? `${activePct}%` : ''],
      ['Gns. onboarding', data.avgOnboardingRate != null ? `${data.avgOnboardingRate}%` : ''],
      ['Mål oprettet i alt', String(data.totalGoalsCreated ?? '')],
      ['Læringsmoduler gennemført', String(data.learningCompletions ?? '')],
      ...(pulse.length > 0 ? [
        ['', ''],
        ['Periode', 'Gns. trivselsscore', 'Antal svar', 'Svarprocent'],
        ...pulse.map((p) => [
          p.period,
          p.avgScore.toFixed(2),
          String(p.count),
          totalEmployees > 0 ? `${Math.round((p.count / totalEmployees) * 100)}%` : '',
        ]),
      ] : []),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `bullaris-rapport-${new Date().toISOString().slice(0, 10)}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#1E0F00' }}>
            {t.analytics?.title ?? 'Analytics'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#A0917F' }}>
            {t.analytics?.subtitle ?? 'Anonymised aggregates for your organisation.'}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={!data}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 transition"
          style={{ background: '#E8634A' }}
        >
          {t.analytics?.exportCsv ?? 'Export CSV'}
        </button>
      </div>

      {/* Privacy notice */}
      <div className="rounded-xl px-4 py-3 text-sm mb-8 flex items-start gap-2"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}>
        <span>🔒</span>
        <span>
          Data is only shown when the group has at least {PRIVACY_THRESHOLD} employees — individual employees cannot be identified.
        </span>
      </div>

      {(analyticsQuery.isLoading || pulseQuery.isLoading) && (
        <div className="text-center py-16" style={{ color: '#A0917F' }}>Loading analytics…</div>
      )}

      {data && (
        <div className="space-y-8">

          {/* ── Financial wellbeing hero ── */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
              EMPLOYEE FINANCIAL WELLBEING
            </h2>

            {latest ? (
              <>
                {/* Hero score card */}
                <div
                  className="rounded-2xl p-6 mb-4 flex flex-col sm:flex-row sm:items-center gap-6"
                  style={{ background: '#fff', border: `1.5px solid ${scoreColor(latest.avgScore)}30` }}
                >
                  {/* Big score */}
                  <div className="flex items-end gap-3">
                    <span className="text-6xl font-bold leading-none" style={{ color: scoreColor(latest.avgScore), fontFamily: 'Georgia, serif' }}>
                      {latest.avgScore.toFixed(1)}
                    </span>
                    <div className="pb-1">
                      <span className="text-lg" style={{ color: '#C8BDB5' }}>/5</span>
                      <p className="text-sm font-semibold" style={{ color: scoreColor(latest.avgScore) }}>
                        {scoreLabel(latest.avgScore).en}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px self-stretch" style={{ background: '#EDE0D4' }} />

                  {/* Context stats */}
                  <div className="flex gap-8 flex-1">
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#A0917F' }}>vs. last month</p>
                      {delta != null ? (
                        <p className="text-xl font-bold" style={{ color: delta >= 0 ? '#22c55e' : '#E8634A' }}>
                          {delta >= 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}
                        </p>
                      ) : (
                        <p className="text-xl font-bold" style={{ color: '#C8BDB5' }}>—</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#A0917F' }}>Response rate</p>
                      <p className="text-xl font-bold" style={{ color: '#1E0F00' }}>
                        {responsePct != null ? `${responsePct}%` : '—'}
                      </p>
                      <p className="text-xs" style={{ color: '#C8BDB5' }}>{latest.count} of {totalEmployees}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: '#A0917F' }}>Period</p>
                      <p className="text-xl font-bold" style={{ color: '#1E0F00' }}>{latest.period}</p>
                    </div>
                  </div>
                </div>

                {/* Score scale legend */}
                <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: '#9B8B7E' }}>
                  <span>Score guide:</span>
                  {[
                    { range: '1–2', label: 'Stressed', color: '#E8634A' },
                    { range: '2–3', label: 'Struggling', color: '#f97316' },
                    { range: '3–3.5', label: 'Managing', color: '#EAB308' },
                    { range: '3.5–4.2', label: 'Doing well', color: '#22c55e' },
                    { range: '4.2–5', label: 'Thriving', color: '#14b8a6' },
                  ].map((s) => (
                    <span key={s.range} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]"
                      style={{ background: s.color + '18', color: s.color }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                      {s.range} {s.label}
                    </span>
                  ))}
                </div>

                {/* Trend chart */}
                <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold" style={{ color: '#1E0F00' }}>Wellbeing trend</h3>
                      <p className="text-xs" style={{ color: '#A0917F' }}>
                        Monthly average · {pulse.length} months · ≥{PRIVACY_THRESHOLD} responses required per period
                      </p>
                    </div>
                  </div>
                  <WellbeingChart data={pulse} />

                  {/* Monthly breakdown */}
                  <div className="mt-5 space-y-2.5">
                    {[...pulse].reverse().map((p) => {
                      const pct = ((p.avgScore - 1) / 4) * 100
                      const rPct = totalEmployees > 0 ? Math.round((p.count / totalEmployees) * 100) : null
                      const col = scoreColor(p.avgScore)
                      return (
                        <div key={p.period}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium" style={{ color: '#6B5C52' }}>{p.period}</span>
                            <div className="flex items-center gap-3">
                              <span style={{ color: '#9B8B7E' }}>
                                {rPct != null ? `${rPct}% responded` : `${p.count} responses`}
                              </span>
                              <span className="font-bold tabular-nums" style={{ color: col }}>
                                {p.avgScore.toFixed(1)} / 5
                              </span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full" style={{ background: '#EDE0D4' }}>
                            <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: col }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl p-8 text-center" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
                <p className="text-3xl mb-3">📊</p>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1E0F00' }}>No wellbeing data yet</p>
                <p className="text-xs" style={{ color: '#A0917F' }}>
                  Data appears once at least {PRIVACY_THRESHOLD} employees complete the monthly pulse check.
                </p>
              </div>
            )}
          </section>

          {/* ── Platform engagement ── */}
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
              PLATFORM ENGAGEMENT
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                label="Active last 30 days"
                value={activePct != null ? `${activePct}%` : (activeRaw ?? '–')}
                sub={activeNum != null ? `${activeNum} of ${totalEmployees} employees` : undefined}
                accent="#E8634A"
              />
              <StatCard
                label="Onboarding rate"
                value={data.avgOnboardingRate != null ? `${data.avgOnboardingRate}%` : '–'}
                sub="completed setup"
              />
              <StatCard
                label="Goals created"
                value={data.totalGoalsCreated ?? '–'}
                sub="across all employees"
              />
              <StatCard
                label="Learning completions"
                value={data.learningCompletions ?? '–'}
                sub="modules finished"
              />
            </div>
          </section>

          {/* ── What employees are working toward ── */}
          {data.goalTypeDistribution && data.goalTypeDistribution.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
                WHAT EMPLOYEES ARE WORKING TOWARD
              </h2>
              <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
                <div className="space-y-3">
                  {data.goalTypeDistribution.map((item: { type: string; count: number; pct: number }) => (
                    <div key={item.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize" style={{ color: '#1E0F00' }}>
                          {item.type.replace(/_/g, ' ')}
                        </span>
                        <span style={{ color: '#A0917F' }}>{item.count} goals · {item.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: '#EDE0D4' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${item.pct}%`, background: '#E8634A' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Feature adoption ── */}
          {data.moduleAdoption && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
                FEATURE ADOPTION
              </h2>
              <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Object.entries(data.moduleAdoption).map(([module, pct]) => {
                    const label: Record<string, string> = {
                      payslip_module:    'Payslip decoder',
                      tax_planner:       'Tax planner',
                      ai_chat:           'AI chat',
                      spending_tracker:  'Spending tracker',
                    }
                    return (
                      <div key={module} className="text-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 text-lg font-bold"
                          style={{
                            background: '#FFF8F3',
                            border: '2px solid #EDE0D4',
                            color: '#E8634A',
                          }}
                        >
                          {typeof pct === 'number' ? `${pct}%` : pct}
                        </div>
                        <p className="text-xs font-medium" style={{ color: '#6B5C52' }}>
                          {label[module] ?? module.replace(/_/g, ' ')}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

        </div>
      )}
    </div>
  )
}
