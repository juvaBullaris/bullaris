'use client'

import { useState } from 'react'
import { LearnBanner } from '@/components/learn-banner'
import { GoalRecommendations } from '@/components/goal-recommendations'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

type Horizon = 'short' | 'medium' | 'long'
type ActiveTab = 'all' | Horizon

// ─── Goal metadata ────────────────────────────────────────────────────────────

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
  { value: 'other',                  horizon: 'short',  icon: '⭐' },
]

// ─── Horizon styling ──────────────────────────────────────────────────────────

const HORIZON_STYLE: Record<Horizon, { color: string; bg: string; border: string; bar: string; pill: string }> = {
  short:  { color: '#E8634A', bg: '#E8634A08', border: '#E8634A35', bar: '#E8634A', pill: '#E8634A18' },
  medium: { color: '#2563EB', bg: '#2563EB08', border: '#2563EB35', bar: '#2563EB', pill: '#2563EB18' },
  long:   { color: '#16A34A', bg: '#16A34A08', border: '#16A34A35', bar: '#16A34A', pill: '#16A34A18' },
}

const HORIZONS: Horizon[] = ['short', 'medium', 'long']

// ─── Cascade flow data (science-backed) ───────────────────────────────────────
//
// Sources:
//   Vanguard (2020): "Emergency savings: A financial security net"
//   Pfau (2011): Journal of Financial Planning — debt vs. investment tradeoff
//   Psacharopoulos & Patrinos (2018): World Bank — returns to education
//   Bengen (1994): JFPA — safe withdrawal rate (4% rule)
//   Cooley, Hubbard & Walz (1998): "Retirement Savings: Choosing a Withdrawal Rate" (Trinity Study)
//   Scott, Sharpe & Watson (2013): Financial Analysts Journal — savings rate and FIRE
//   Danmarks Statistik (2023): household wealth composition

interface CascadeFlow {
  fromIcon: string
  toIcon: string
  label: { en: string; da: string }
  detail: { en: string; da: string }
  cite: string
}

const SHORT_TO_MEDIUM: CascadeFlow[] = [
  {
    fromIcon: '🛡️',
    toIcon: '📈',
    label: {
      en: 'Shields investment',
      da: 'Beskytter investering',
    },
    detail: {
      en: 'Investors without an emergency fund are 3× more likely to liquidate long-term investments during a financial shock. The fund absorbs volatility so compound growth continues uninterrupted.',
      da: 'Investorer uden nødreserve er 3× mere tilbøjelige til at sælge langsigtede investeringer under et finansielt chok. Fonden absorberer volatilitet så renters rente fortsætter uhindret.',
    },
    cite: 'Vanguard Research (2020)',
  },
  {
    fromIcon: '🔗',
    toIcon: '🏠',
    label: {
      en: 'Frees cash flow',
      da: 'Frigiør pengestrøm',
    },
    detail: {
      en: 'Paying off debt above 7% p.a. is mathematically equivalent to a 7% guaranteed, risk-free return. Every 1,000 DKK freed from debt service becomes capital for house deposits and investment.',
      da: 'At afvikle gæld over 7% p.a. er matematisk ækvivalent med et 7% garanteret, risikofrit afkast. Hver 1.000 DKK frigjort fra gældsservice bliver kapital til boligopsparing og investering.',
    },
    cite: 'Pfau (2011), Journal of Financial Planning',
  },
  {
    fromIcon: '📚',
    toIcon: '💼',
    label: {
      en: 'Opens income streams',
      da: 'Åbner indkomstkilder',
    },
    detail: {
      en: 'Each year of skill-based education raises lifetime earning capacity by 8–10%. Upskilling specifically enables consulting and freelance income, creating a second independent cash flow.',
      da: 'Hvert år med kompetencegivende uddannelse øger den livslange indtjeningsevne med 8–10%. Efteruddannelse muliggør konsulent- og freelanceindtægter og skaber en anden uafhængig pengestrøm.',
    },
    cite: 'Psacharopoulos & Patrinos (2018), World Bank',
  },
]

const MEDIUM_TO_LONG: CascadeFlow[] = [
  {
    fromIcon: '📈',
    toIcon: '🌅',
    label: {
      en: '25× rule — FIRE',
      da: '25×-reglen — FIRE',
    },
    detail: {
      en: 'A diversified portfolio equal to 25× your annual expenses supports a 4% annual withdrawal for 30+ years with a 95%+ historical success rate. This is the mathematical foundation of financial independence.',
      da: 'En diversificeret portefølje svarende til 25× dine årlige udgifter understøtter en 4% årlig hævning i 30+ år med en historisk succesrate på 95%+. Dette er det matematiske grundlag for finansiel frihed.',
    },
    cite: 'Bengen (1994) + Trinity Study, Cooley et al. (1998)',
  },
  {
    fromIcon: '🏠',
    toIcon: '🌳',
    label: {
      en: "DK's #1 wealth transfer",
      da: 'DKs #1 formueoverdragelse',
    },
    detail: {
      en: 'Real estate constitutes 52% of Danish household net worth and is the primary mechanism for intergenerational wealth transfer in Denmark. The house deposit unlocks the largest asset most people will ever own.',
      da: 'Fast ejendom udgør 52% af den danske husholdnings nettoformue og er den primære mekanisme for generationsoverdragelse. Boligopsparingen låser op for det største aktiv de fleste nogensinde vil eje.',
    },
    cite: 'Danmarks Statistik (2023)',
  },
  {
    fromIcon: '💼',
    toIcon: '⛱️',
    label: {
      en: 'Compresses FIRE timeline',
      da: 'Fremskynder FIRE-horisonten',
    },
    detail: {
      en: 'Every additional 5% of gross income saved reduces years to financial independence by approximately 3. A side income raises the savings rate directly without reducing your primary lifestyle.',
      da: 'Hver ekstra 5% af bruttoindkomsten sparet reducerer år til finansiel uafhængighed med ca. 3. En biindkomst øger opsparingsraten direkte uden at reducere din primære levestandard.',
    },
    cite: 'Scott, Sharpe & Watson (2013), Financial Analysts Journal',
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { t, locale } = useLanguage()
  const en = locale === 'en'

  const [activeTab, setActiveTab]         = useState<ActiveTab>('all')
  const [showCascade, setShowCascade]     = useState(true)
  const [expandedFlow, setExpandedFlow]   = useState<string | null>(null)
  const [showForm, setShowForm]           = useState(false)
  const [goalType, setGoalType]           = useState('emergency_fund')
  const [targetDkk, setTargetDkk]         = useState('')
  const [deadline, setDeadline]           = useState('')

  const goalsQuery = trpc.goals.list.useQuery()
  const createGoal = trpc.goals.create.useMutation({
    onSuccess: () => {
      goalsQuery.refetch()
      setShowForm(false)
      setTargetDkk('')
      setDeadline('')
    },
    onError: (err) => {
      console.error('createGoal error:', err)
    },
  })

  const fmt       = (n: number) => n.toLocaleString('da-DK') + ' DKK'
  const getMeta   = (type: string) => GOAL_META.find((m) => m.value === type)
  const getLabel  = (type: string) => (t.goals.types as Record<string, string>)[type] ?? type

  const horizonInfo = {
    short:  { label: t.goals.horizons.short,  range: t.goals.horizons.shortRange,  desc: t.goals.horizons.shortDesc  },
    medium: { label: t.goals.horizons.medium, range: t.goals.horizons.mediumRange, desc: t.goals.horizons.mediumDesc },
    long:   { label: t.goals.horizons.long,   range: t.goals.horizons.longRange,   desc: t.goals.horizons.longDesc   },
  }

  const goalsByHorizon = (h: Horizon) =>
    goalsQuery.data?.filter((g) => (getMeta(g.type)?.horizon ?? 'short') === h) ?? []

  const typesByHorizon = (h: Horizon) => GOAL_META.filter((m) => m.horizon === h)
  const selectedMeta = getMeta(goalType)

  const tabs: { id: ActiveTab; label: string; count: number }[] = [
    { id: 'all',    label: en ? 'All goals' : 'Alle mål',          count: goalsQuery.data?.length ?? 0 },
    { id: 'short',  label: horizonInfo.short.label,                 count: goalsByHorizon('short').length },
    { id: 'medium', label: horizonInfo.medium.label,                count: goalsByHorizon('medium').length },
    { id: 'long',   label: horizonInfo.long.label,                  count: goalsByHorizon('long').length },
  ]

  return (
    <div className="max-w-2xl">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.goals.title}</h1>
          <p className="text-muted-foreground text-sm">{t.goals.subtitle}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-bullaris-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shrink-0"
        >
          {t.goals.newGoal}
        </button>
      </div>

      {/* ── Cascade Map ─────────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card mb-8 overflow-hidden">
        {/* Toggle header */}
        <button
          onClick={() => setShowCascade((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-accent/30"
        >
          <span className="text-sm font-semibold" style={{ color: '#1E0F00' }}>
            {en ? '🔗 How your goals build on each other' : '🔗 Sådan bygger dine mål på hinanden'}
          </span>
          <span className="text-xs text-muted-foreground ml-2 shrink-0">
            {showCascade ? '▲' : '▼'}
          </span>
        </button>

        {showCascade && (
          <div className="px-4 pb-5">
            {/* Short-term block */}
            <CascadeBlock
              horizon="short"
              label={`${horizonInfo.short.label} · ${horizonInfo.short.range}`}
              desc={horizonInfo.short.desc}
              icons={typesByHorizon('short').map((m) => m.icon)}
            />

            {/* Short → Medium flows */}
            <FlowRow
              flows={SHORT_TO_MEDIUM}
              fromHorizon="short"
              toHorizon="medium"
              en={en}
              expandedFlow={expandedFlow}
              setExpandedFlow={setExpandedFlow}
            />

            {/* Medium-term block */}
            <CascadeBlock
              horizon="medium"
              label={`${horizonInfo.medium.label} · ${horizonInfo.medium.range}`}
              desc={horizonInfo.medium.desc}
              icons={typesByHorizon('medium').map((m) => m.icon)}
            />

            {/* Medium → Long flows */}
            <FlowRow
              flows={MEDIUM_TO_LONG}
              fromHorizon="medium"
              toHorizon="long"
              en={en}
              expandedFlow={expandedFlow}
              setExpandedFlow={setExpandedFlow}
            />

            {/* Long-term block */}
            <CascadeBlock
              horizon="long"
              label={`${horizonInfo.long.label} · ${horizonInfo.long.range}`}
              desc={horizonInfo.long.desc}
              icons={typesByHorizon('long').map((m) => m.icon)}
            />

            <p className="text-xs text-center mt-4" style={{ color: '#9B8B7E' }}>
              {en
                ? 'Tap any arrow to see the science behind each connection.'
                : 'Tryk på en pil for at se forskningen bag hver forbindelse.'}
            </p>
          </div>
        )}
      </div>

      {/* ── Horizon filter tabs ──────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-muted">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const style    = tab.id !== 'all' ? HORIZON_STYLE[tab.id as Horizon] : null
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-1 text-xs font-medium transition-all"
              style={
                isActive
                  ? {
                      background: style ? style.bg : 'white',
                      color: style ? style.color : '#1E0F00',
                      border: `1.5px solid ${style ? style.border : '#EDE0D4'}`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
                    }
                  : { color: '#9B8B7E' }
              }
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="rounded-full px-1.5 py-px text-xs font-semibold"
                  style={{
                    background: isActive && style ? style.pill : '#EDE0D4',
                    color: isActive && style ? style.color : '#6B5C52',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Create form ─────────────────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-xl border bg-card p-6 mb-8 space-y-4">
          <h2 className="font-semibold">{t.goals.createGoal}</h2>

          <div>
            <label className="block text-sm font-medium mb-1">{t.goals.goalType}</label>
            <select
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {HORIZONS.map((h) => (
                <optgroup key={h} label={`${horizonInfo[h].label} · ${horizonInfo[h].range}`}>
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

          {createGoal.error && (
            <p className="text-xs font-medium" style={{ color: '#E8634A' }}>
              {createGoal.error.message}
            </p>
          )}

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
              {createGoal.isPending ? '...' : t.goals.save}
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

      {/* ── Goals list ──────────────────────────────────────────────────────── */}
      {!goalsQuery.isLoading && (goalsQuery.data?.length ?? 0) > 0 && (
        <div className="space-y-10">
          {(activeTab === 'all' ? HORIZONS : [activeTab as Horizon]).map((h) => {
            const goals = goalsByHorizon(h)
            if (goals.length === 0) return null
            const info  = horizonInfo[h]
            const style = HORIZON_STYLE[h]

            return (
              <div key={h}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: style.color }} />
                  <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: style.color }}>
                    {info.label}
                  </h2>
                  <span className="text-xs font-medium" style={{ color: style.color }}>· {info.range}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 ml-4">{info.desc}</p>

                <div className="space-y-3">
                  {goals.map((goal) => {
                    const pct   = Math.min(100, Math.round((Number(goal.progress_dkk) / Number(goal.target_dkk)) * 100))
                    const meta  = getMeta(goal.type)
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
                            style={{ width: `${pct}%`, background: pct === 100 ? '#16A34A' : style.bar }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{fmt(Number(goal.progress_dkk))} {t.goals.saved}</span>
                          <span>{t.goals.target} {fmt(Number(goal.target_dkk))}</span>
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

      <GoalRecommendations
        goalTypes={Array.from(new Set(goalsQuery.data?.map((g) => g.type) ?? []))}
      />

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

// ─── CascadeBlock ─────────────────────────────────────────────────────────────

function CascadeBlock({
  horizon,
  label,
  desc,
  icons,
}: {
  horizon: Horizon
  label: string
  desc: string
  icons: string[]
}) {
  const style = HORIZON_STYLE[horizon]
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: style.bg, border: `1.5px solid ${style.border}` }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: style.color }} />
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: style.color }}>
          {label}
        </span>
      </div>
      <p className="text-xs mb-3 ml-4" style={{ color: '#6B5C52' }}>{desc}</p>
      <div className="flex gap-1.5 ml-4 flex-wrap">
        {icons.map((icon, i) => (
          <span
            key={i}
            className="text-base rounded-full w-7 h-7 flex items-center justify-center"
            style={{ background: style.pill, border: `1px solid ${style.border}` }}
          >
            {icon}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── FlowRow ──────────────────────────────────────────────────────────────────

function FlowRow({
  flows,
  fromHorizon,
  toHorizon,
  en,
  expandedFlow,
  setExpandedFlow,
}: {
  flows: CascadeFlow[]
  fromHorizon: Horizon
  toHorizon: Horizon
  en: boolean
  expandedFlow: string | null
  setExpandedFlow: (key: string | null) => void
}) {
  const fromStyle = HORIZON_STYLE[fromHorizon]
  const toStyle   = HORIZON_STYLE[toHorizon]

  return (
    <div className="py-2">
      {/* Connector line down */}
      <div className="flex justify-center mb-2">
        <div
          className="w-px h-4"
          style={{ background: `linear-gradient(to bottom, ${fromStyle.border}, ${toStyle.border})` }}
        />
      </div>

      {/* Flow cards — 3 columns */}
      <div className="grid grid-cols-3 gap-2">
        {flows.map((flow, i) => {
          const key      = `${fromHorizon}-${i}`
          const expanded = expandedFlow === key
          return (
            <button
              key={i}
              onClick={() => setExpandedFlow(expanded ? null : key)}
              className="rounded-lg p-2.5 text-left transition-all hover:shadow-sm active:scale-95"
              style={{
                background: expanded ? fromStyle.bg : '#FAFAF9',
                border: `1px solid ${expanded ? fromStyle.color : '#EDE0D4'}`,
              }}
            >
              {/* Arrow icons */}
              <div className="flex items-center gap-0.5 mb-1">
                <span className="text-base leading-none">{flow.fromIcon}</span>
                <span className="text-xs font-bold" style={{ color: fromStyle.color }}>→</span>
                <span className="text-base leading-none">{flow.toIcon}</span>
              </div>

              {/* Label */}
              <p className="text-xs font-semibold leading-tight" style={{ color: fromStyle.color }}>
                {en ? flow.label.en : flow.label.da}
              </p>

              {/* Expanded: science detail */}
              {expanded && (
                <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${fromStyle.border}` }}>
                  <p className="text-xs leading-relaxed mb-1.5" style={{ color: '#3D2B1F' }}>
                    {en ? flow.detail.en : flow.detail.da}
                  </p>
                  <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>
                    — {flow.cite}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Connector line down */}
      <div className="flex justify-center mt-2">
        <div
          className="w-px h-4"
          style={{ background: `linear-gradient(to bottom, ${fromStyle.border}, ${toStyle.border})` }}
        />
      </div>
    </div>
  )
}
