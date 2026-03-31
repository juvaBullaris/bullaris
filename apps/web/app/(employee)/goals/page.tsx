'use client'

import { useState } from 'react'
import { LearnBanner } from '@/components/learn-banner'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

type Horizon = 'short' | 'medium' | 'long'

interface GoalMeta {
  value: string
  horizon: Horizon
  icon: string
}

const GOAL_META: GoalMeta[] = [
  // Short-term (0–2 years) — liquidity and debt elimination first
  { value: 'emergency_fund',         horizon: 'short',  icon: '🛡️' },
  { value: 'debt_payoff',            horizon: 'short',  icon: '🔗' },
  { value: 'vacation',               horizon: 'short',  icon: '✈️' },
  { value: 'car',                    horizon: 'short',  icon: '🚗' },
  { value: 'education',              horizon: 'short',  icon: '📚' },
  // Medium-term (2–7 years) — concrete life goals, balanced growth
  { value: 'house_deposit',          horizon: 'medium', icon: '🏠' },
  { value: 'home_renovation',        horizon: 'medium', icon: '🔨' },
  { value: 'children_savings',       horizon: 'medium', icon: '👶' },
  { value: 'investment',             horizon: 'medium', icon: '📈' },
  { value: 'side_income',            horizon: 'medium', icon: '💼' },
  // Long-term (7+ years) — compound growth, financial freedom
  { value: 'pension_boost',          horizon: 'long',   icon: '🏦' },
  { value: 'financial_independence', horizon: 'long',   icon: '🌅' },
  { value: 'passive_income',         horizon: 'long',   icon: '💰' },
  { value: 'early_retirement',       horizon: 'long',   icon: '⛱️' },
  { value: 'generational_wealth',    horizon: 'long',   icon: '🌳' },
  // Other
  { value: 'other',                  horizon: 'short',  icon: '⭐' },
]

const HORIZON_STYLE: Record<Horizon, { color: string; bg: string; border: string; bar: string }> = {
  short:  { color: '#E8634A', bg: '#E8634A08', border: '#E8634A25', bar: '#E8634A' },
  medium: { color: '#2563EB', bg: '#2563EB08', border: '#2563EB25', bar: '#2563EB' },
  long:   { color: '#16A34A', bg: '#16A34A08', border: '#16A34A25', bar: '#16A34A' },
}

const HORIZONS: Horizon[] = ['short', 'medium', 'long']

export default function GoalsPage() {
  const { t, locale } = useLanguage()
  const en = locale === 'en'
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

  const fmt = (n: number) => n.toLocaleString('da-DK') + ' DKK'
  const getMeta = (type: string) => GOAL_META.find((m) => m.value === type)
  const getLabel = (type: string) =>
    (t.goals.types as Record<string, string>)[type] ?? type

  const horizonInfo = {
    short:  { label: t.goals.horizons.short,  range: t.goals.horizons.shortRange,  desc: t.goals.horizons.shortDesc  },
    medium: { label: t.goals.horizons.medium, range: t.goals.horizons.mediumRange, desc: t.goals.horizons.mediumDesc },
    long:   { label: t.goals.horizons.long,   range: t.goals.horizons.longRange,   desc: t.goals.horizons.longDesc   },
  }

  const goalsByHorizon = (h: Horizon) =>
    goalsQuery.data?.filter((g) => (getMeta(g.type)?.horizon ?? 'short') === h) ?? []

  const typesByHorizon = (h: Horizon) => GOAL_META.filter((m) => m.horizon === h)

  const selectedMeta = getMeta(goalType)

  return (
    <div className="max-w-2xl">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
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

      {/* ── Create form ─────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-xl border bg-card p-6 mb-8 space-y-4">
          <h2 className="font-semibold">{t.goals.createGoal}</h2>

          {/* Goal type with optgroup horizon structure */}
          <div>
            <label className="block text-sm font-medium mb-1">{t.goals.goalType}</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {HORIZONS.map((h) => (
                <optgroup
                  key={h}
                  label={`${horizonInfo[h].label} · ${horizonInfo[h].range}`}
                >
                  {typesByHorizon(h).map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.icon} {getLabel(m.value)}
                    </option>
                  ))}
                </optgroup>
              ))}
              <optgroup label={en ? 'Other' : 'Andet'}>
                <option value="other">⭐ {getLabel('other')}</option>
              </optgroup>
            </select>

            {/* Horizon hint — shown for all specific types */}
            {selectedMeta && selectedMeta.value !== 'other' && (
              <div
                className="mt-2 rounded-lg px-3 py-2 text-xs"
                style={{
                  background: HORIZON_STYLE[selectedMeta.horizon].bg,
                  border: `1px solid ${HORIZON_STYLE[selectedMeta.horizon].border}`,
                  color: HORIZON_STYLE[selectedMeta.horizon].color,
                }}
              >
                <span className="font-semibold">
                  {horizonInfo[selectedMeta.horizon].label} · {horizonInfo[selectedMeta.horizon].range}
                </span>
                {' — '}
                {horizonInfo[selectedMeta.horizon].desc}
              </div>
            )}
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

      {/* ── Loading ─────────────────────────────────────────────────────────── */}
      {goalsQuery.isLoading && (
        <div className="text-center py-12 text-muted-foreground">{t.common.loading}</div>
      )}

      {/* ── Empty state ─────────────────────────────────────────────────────── */}
      {!goalsQuery.isLoading && (goalsQuery.data?.length ?? 0) === 0 && !showForm && (
        <div className="rounded-xl border bg-card p-10 text-center mb-8">
          <p className="text-muted-foreground mb-4">{t.goals.noGoals}</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-bullaris-blue text-sm underline"
          >
            {t.goals.createFirst}
          </button>
        </div>
      )}

      {/* ── Horizon sections ────────────────────────────────────────────────── */}
      {!goalsQuery.isLoading && (
        <div className="space-y-10">
          {HORIZONS.map((h) => {
            const goals = goalsByHorizon(h)
            const info = horizonInfo[h]
            const style = HORIZON_STYLE[h]

            // Only render sections that have goals (keep it clean)
            if (goals.length === 0) return null

            return (
              <div key={h}>
                {/* Section header */}
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: style.color }}
                  />
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: style.color }}>
                    {info.label}
                  </h2>
                  <span className="text-xs font-medium" style={{ color: style.color }}>
                    · {info.range}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 ml-4">{info.desc}</p>

                {/* Goal cards */}
                <div className="space-y-3">
                  {goals.map((goal) => {
                    const pct = Math.min(
                      100,
                      Math.round((Number(goal.progress_dkk) / Number(goal.target_dkk)) * 100)
                    )
                    const meta = getMeta(goal.type)
                    const label = getLabel(goal.type)

                    return (
                      <div key={goal.id} className="rounded-xl border bg-card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                              style={{ background: style.bg, border: `1.5px solid ${style.border}` }}
                            >
                              {meta?.icon ?? '⭐'}
                            </span>
                            <div>
                              <h3 className="font-semibold text-sm leading-tight">{label}</h3>
                              {goal.deadline && (
                                <p className="text-xs text-muted-foreground">
                                  {en ? 'Deadline' : 'Deadline'}:{' '}
                                  {new Date(goal.deadline).toLocaleDateString('da-DK')}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className="text-sm font-bold shrink-0"
                            style={{ color: pct === 100 ? '#16A34A' : style.color }}
                          >
                            {pct === 100 ? '✓ 100%' : `${pct}%`}
                          </span>
                        </div>

                        <div className="h-1.5 bg-muted rounded-full mb-3">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              background: pct === 100 ? '#16A34A' : style.bar,
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {fmt(Number(goal.progress_dkk))} {t.goals.saved}
                          </span>
                          <span>
                            {t.goals.target} {fmt(Number(goal.target_dkk))}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

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
