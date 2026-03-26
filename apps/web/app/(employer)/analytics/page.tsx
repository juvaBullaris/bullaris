'use client'

import { trpc } from '@/lib/trpc'

const PRIVACY_THRESHOLD = 5

export default function AnalyticsPage() {
  const analyticsQuery = trpc.analytics.overview.useQuery()

  const data = analyticsQuery.data

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">Analyser</h1>
      <p className="text-muted-foreground mb-2">
        Anonymiserede aggregater for din organisation.
      </p>
      <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800 mb-8">
        Data vises kun når gruppen har mindst {PRIVACY_THRESHOLD} medarbejdere. Dette sikrer, at
        individuelle medarbejdere ikke kan identificeres.
      </div>

      {analyticsQuery.isLoading && (
        <div className="text-center py-12 text-muted-foreground">Indlæser analyser...</div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Engagement */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Aktive brugere (30 dage)', value: data.activeUsersLast30Days ?? '–' },
              { label: 'Gennemsnitlig onboarding', value: data.avgOnboardingRate != null ? `${data.avgOnboardingRate}%` : '–' },
              { label: 'Mål oprettet i alt', value: data.totalGoalsCreated ?? '–' },
              { label: 'Læringsmoduler gennemført', value: data.learningCompletions ?? '–' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border bg-card p-5">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Goal distribution */}
          {data.goalTypeDistribution && data.goalTypeDistribution.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-semibold mb-4">Fordeling af måltyper</h2>
              <div className="space-y-3">
                {data.goalTypeDistribution.map((item: { type: string; count: number; pct: number }) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.type}</span>
                      <span className="text-muted-foreground">{item.count} mål ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-2 bg-bullaris-blue rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Module adoption */}
          {data.moduleAdoption && (
            <div className="rounded-xl border bg-card p-6">
              <h2 className="font-semibold mb-4">Modul-adoption</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(data.moduleAdoption).map(([module, pct]) => (
                  <div key={module} className="text-center">
                    <p className="text-2xl font-bold text-bullaris-teal">
                      {typeof pct === 'number' ? `${pct}%` : pct}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{module}</p>
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
