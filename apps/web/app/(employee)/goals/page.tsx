'use client'

import { useState } from 'react'
import { LearnBanner } from '@/components/learn-banner'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export default function GoalsPage() {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [goalType, setGoalType] = useState('emergency_fund')
  const [targetDkk, setTargetDkk] = useState('')
  const [deadline, setDeadline] = useState('')

  const GOAL_TYPES = [
    { value: 'emergency_fund', label: t.goals.types.emergency_fund },
    { value: 'house_deposit', label: t.goals.types.house_deposit },
    { value: 'debt_payoff', label: t.goals.types.debt_payoff },
    { value: 'pension_boost', label: t.goals.types.pension_boost },
    { value: 'investment', label: t.goals.types.investment },
    { value: 'home_renovation', label: t.goals.types.home_renovation },
    { value: 'car', label: t.goals.types.car },
    { value: 'education', label: t.goals.types.education },
    { value: 'children_savings', label: t.goals.types.children_savings },
    { value: 'vacation', label: t.goals.types.vacation },
    { value: 'other', label: t.goals.types.other },
  ]

  const goalsQuery = trpc.goals.list.useQuery()
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      goalsQuery.refetch()
      setShowForm(false)
      setTargetDkk('')
      setDeadline('')
    },
  })

  const fmt = (n: number) => n.toLocaleString('da-DK') + ' DKK'

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.goals.title}</h1>
          <p className="text-muted-foreground text-sm">{t.goals.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-bullaris-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {t.goals.newGoal}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 mb-6 space-y-4">
          <h2 className="font-semibold">{t.goals.createGoal}</h2>
          <div>
            <label className="block text-sm font-medium mb-1">{t.goals.goalType}</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {GOAL_TYPES.map((gt) => (
                <option key={gt.value} value={gt.value}>{gt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.goals.targetAmount}</label>
            <input
              type="number"
              value={targetDkk}
              onChange={(e) => setTargetDkk(e.target.value)}
              placeholder={t.goals.targetPlaceholder}
              className="w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.goals.deadline}</label>
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
              {t.goals.save}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              {t.goals.cancel}
            </button>
          </div>
        </div>
      )}

      {goalsQuery.isLoading && (
        <div className="text-center py-12 text-muted-foreground">{t.common.loading}</div>
      )}

      {goalsQuery.data?.length === 0 && !showForm && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">{t.goals.noGoals}</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-bullaris-blue text-sm underline"
          >
            {t.goals.createFirst}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {goalsQuery.data?.map((goal) => {
          const pct = Math.min(100, Math.round((Number(goal.progress_dkk) / Number(goal.target_dkk)) * 100))
          const typeLabel = GOAL_TYPES.find((gt) => gt.value === goal.type)?.label ?? goal.type
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
                <span>{fmt(Number(goal.progress_dkk))} {t.goals.saved}</span>
                <span>{t.goals.target} {fmt(Number(goal.target_dkk))}</span>
              </div>
            </div>
          )
        })}
      </div>

      <LearnBanner
        moduleId="goal-setting"
        href="/learning/goal-setting"
        icon="🎯"
        duration="~10 min"
        en={{
          title: 'How to Set Your Financial Goals',
          teaser: 'Science-backed goal setting using SMART-A, Three Horizons and a 7-step playbook.',
          completedTeaser: 'You completed this module. Review it anytime.',
        }}
        da={{
          title: 'Sådan sætter du dine finansielle mål',
          teaser: 'Videnskabeligt understøttet målsætning med SMART-A, de tre horisonter og en 7-trins plan.',
          completedTeaser: 'Du har gennemført dette modul. Gense det når som helst.',
        }}
      />
    </div>
  )
}
