'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

const GOAL_TYPES = [
  { value: 'emergency_fund', label: 'Nødreserve' },
  { value: 'house_deposit', label: 'Boligopsparing' },
  { value: 'pension_boost', label: 'Pensionsopsparing' },
  { value: 'debt_payoff', label: 'Gældsafvikling' },
  { value: 'vacation', label: 'Feriekasse' },
  { value: 'other', label: 'Andet' },
]

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false)
  const [goalType, setGoalType] = useState('emergency_fund')
  const [targetDkk, setTargetDkk] = useState('')
  const [deadline, setDeadline] = useState('')

  const goalsQuery = trpc.goals.list.useQuery()
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      goalsQuery.refetch()
      setShowForm(false)
      setTargetDkk('')
      setDeadline('')
    },
  })
  const updateProgress = trpc.goals.updateProgress.useMutation({
    onSuccess: () => goalsQuery.refetch(),
  })

  const fmt = (n: number) => n.toLocaleString('da-DK') + ' DKK'

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Finansielle mål</h1>
          <p className="text-muted-foreground text-sm">Sæt og følg dine mål.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-bullaris-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Nyt mål
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 mb-6 space-y-4">
          <h2 className="font-semibold">Opret nyt mål</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Måltype</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {GOAL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Målbeløb (DKK)</label>
            <input
              type="number"
              value={targetDkk}
              onChange={(e) => setTargetDkk(e.target.value)}
              placeholder="F.eks. 50000"
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() =>
                createGoal.mutate({
                  type: goalType,
                  target_dkk: Number(targetDkk),
                  deadline: deadline ? new Date(deadline) : undefined,
                })
              }
              disabled={!targetDkk || createGoal.isPending}
              className="rounded-md bg-bullaris-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              Gem mål
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              Annuller
            </button>
          </div>
        </div>
      )}

      {goalsQuery.isLoading && (
        <div className="text-center py-12 text-muted-foreground">Indlæser...</div>
      )}

      {goalsQuery.data?.length === 0 && !showForm && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">Du har ingen aktive mål endnu.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-bullaris-blue text-sm underline"
          >
            Opret dit første mål
          </button>
        </div>
      )}

      <div className="space-y-4">
        {goalsQuery.data?.map((goal) => {
          const pct = Math.min(100, Math.round((Number(goal.progress_dkk) / Number(goal.target_dkk)) * 100))
          const typeLabel = GOAL_TYPES.find((t) => t.value === goal.type)?.label ?? goal.type
          return (
            <div key={goal.id} className="rounded-xl border bg-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{typeLabel}</h3>
                  {goal.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(goal.deadline).toLocaleDateString('da-DK')}
                    </p>
                  )}
                </div>
                <span className="text-sm font-medium text-bullaris-teal">{pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full mb-3">
                <div
                  className="h-2 bg-bullaris-teal rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{fmt(Number(goal.progress_dkk))} sparet</span>
                <span>Mål: {fmt(Number(goal.target_dkk))}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
