'use client'

import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

const PRIVACY_THRESHOLD = 5

export default function AnalyticsPage() {
  const { t } = useLanguage()
  const analyticsQuery = trpc.analytics.overview.useQuery()
  const pulseQuery     = trpc.pulse.aggregateForEmployer.useQuery()

  const data = analyticsQuery.data

  function handleExportCsv() {
    if (!data) return
    const rows: string[][] = [
      ['Metrik', 'Værdi'],
      ['Aktive brugere (30 dage)', String(data.activeUsersLast30Days ?? '')],
      ['Gennemsnitlig onboarding', data.avgOnboardingRate != null ? `${data.avgOnboardingRate}%` : ''],
      ['Mål oprettet i alt', String(data.totalGoalsCreated ?? '')],
      ['Læringsmoduler gennemført', String(data.learningCompletions ?? '')],
    ]
    if (pulseQuery.data && pulseQuery.data.length > 0) {
      rows.push(['', ''])
      rows.push(['Periode', 'Gns. trivselsscore', 'Antal svar'])
      for (const p of pulseQuery.data) {
        rows.push([p.period, p.avgScore.toFixed(2), String(p.count)])
      }
    }
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `bullaris-rapport-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#1E0F00' }}>
            {t.analytics?.title ?? 'Analyser'}
          </h1>
          <p className="text-sm mt-1" style={{ color: '#A0917F' }}>
            {t.analytics?.subtitle ?? 'Anonymiserede aggregater for din organisation.'}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          disabled={!data}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40 transition"
          style={{ background: '#E8634A' }}
        >
          {t.analytics?.exportCsv ?? 'Eksporter CSV'}
        </button>
      </div>

      <div className="rounded-lg px-4 py-3 text-sm mb-8"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}>
        Data vises kun når gruppen har mindst {PRIVACY_THRESHOLD} medarbejdere. Dette sikrer, at
        individuelle medarbejdere ikke kan identificeres.
      </div>

      {analyticsQuery.isLoading && (
        <div className="text-center py-12" style={{ color: '#A0917F' }}>Indlæser analyser...</div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Engagement */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Aktive brugere (30 dage)', value: data.activeUsersLast30Days ?? '–' },
              { label: 'Gns. onboarding', value: data.avgOnboardingRate != null ? `${data.avgOnboardingRate}%` : '–' },
              { label: 'Mål oprettet', value: data.totalGoalsCreated ?? '–' },
              { label: 'Moduler gennemført', value: data.learningCompletions ?? '–' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#A0917F' }}>{stat.label}</p>
                <p className="text-2xl font-bold" style={{ color: '#1E0F00' }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Wellbeing trend */}
          <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif font-semibold text-lg mb-1" style={{ color: '#1E0F00' }}>
              {t.analytics?.wellbeingScore ?? 'Trivselsscore'}
            </h2>
            <p className="text-xs mb-4" style={{ color: '#A0917F' }}>
              {t.analytics?.wellbeingTrend ?? 'Månedlig gns. baseret på pulsmåling (1–5). Vises kun ved ≥5 svar.'}
            </p>

            {pulseQuery.isLoading && (
              <p className="text-sm" style={{ color: '#A0917F' }}>Indlæser...</p>
            )}

            {pulseQuery.data && pulseQuery.data.length === 0 && (
              <p className="text-sm" style={{ color: '#A0917F' }}>
                Ingen data endnu — minimum {PRIVACY_THRESHOLD} svar pr. måned kræves.
              </p>
            )}

            {pulseQuery.data && pulseQuery.data.length > 0 && (
              <div className="space-y-3">
                {pulseQuery.data.map((p) => {
                  const pct = ((p.avgScore - 1) / 4) * 100
                  const scoreColor = p.avgScore >= 4 ? '#16A34A' : p.avgScore >= 3 ? '#E8634A' : '#DC2626'
                  return (
                    <div key={p.period}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: '#6B5C52' }}>{p.period}</span>
                        <span className="font-semibold" style={{ color: scoreColor }}>
                          {p.avgScore.toFixed(1)} / 5 &nbsp;·&nbsp; {p.count} svar
                        </span>
                      </div>
                      <div className="h-2.5 rounded-full" style={{ background: '#EDE0D4' }}>
                        <div
                          className="h-2.5 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: scoreColor }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Goal distribution */}
          {data.goalTypeDistribution && data.goalTypeDistribution.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
                Fordeling af måltyper
              </h2>
              <div className="space-y-3">
                {data.goalTypeDistribution.map((item: { type: string; count: number; pct: number }) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: '#6B5C52' }}>{item.type}</span>
                      <span style={{ color: '#A0917F' }}>{item.count} mål ({item.pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: '#EDE0D4' }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${item.pct}%`, background: '#E8634A' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module adoption */}
          {data.moduleAdoption && (
            <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
              <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
                Modul-adoption
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(data.moduleAdoption).map(([module, pct]) => (
                  <div key={module} className="text-center">
                    <p className="text-2xl font-bold" style={{ color: '#E8634A' }}>
                      {typeof pct === 'number' ? `${pct}%` : pct}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#A0917F' }}>{module}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
