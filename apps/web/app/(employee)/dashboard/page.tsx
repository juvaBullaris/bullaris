'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { PulseModal } from '@/components/pulse-modal'
import { QuarterlyCheckIn } from '@/components/quarterly-checkin'
import { KnowledgePopup } from '@/components/knowledge-popup'

// ── Visit counter (increments once per page load) ─────────────────────────────
function useVisitCounter() {
  useEffect(() => {
    const prev = parseInt(localStorage.getItem('bullaris_visits') ?? '0')
    localStorage.setItem('bullaris_visits', String(prev + 1))
  }, [])
}

// ── Pulse sparkline ───────────────────────────────────────────────────────────
function PulseTrend() {
  const { locale } = useLanguage()
  const en = locale === 'en'
  const historyQuery = trpc.pulse.myHistory.useQuery()
  const data = historyQuery.data ?? []

  if (historyQuery.isLoading) return null
  if (data.length < 2) return null

  const W = 260
  const H = 48
  const pad = 6
  const innerW = W - pad * 2
  const innerH = H - pad * 2

  const points = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * innerW,
    y: pad + innerH - ((d.score - 1) / 4) * innerH,
    score: d.score,
    period: d.period,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const latest = points[points.length - 1]

  const SCORE_COLOR: Record<number, string> = { 1: '#E8634A', 2: '#F97316', 3: '#EAB308', 4: '#22c55e', 5: '#14b8a6' }

  return (
    <div className="rounded-2xl p-5 mb-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9B8B7E' }}>
            {en ? 'Financial wellbeing trend' : 'Finansiel trivselstrend'}
          </p>
          <p className="text-xs" style={{ color: '#C8BDB5' }}>
            {en ? `Last ${data.length} months` : `Seneste ${data.length} måneder`}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
          style={{ background: SCORE_COLOR[latest.score] + '20', color: SCORE_COLOR[latest.score] }}
        >
          {latest.score}
        </div>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible' }}>
        {/* Area fill */}
        <defs>
          <linearGradient id="pulse-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8634A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#E8634A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`}
          fill="url(#pulse-grad)"
        />
        {/* Line */}
        <path d={pathD} fill="none" stroke="#E8634A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={SCORE_COLOR[p.score]} stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>

      <div className="flex justify-between text-[10px] mt-1" style={{ color: '#C8BDB5' }}>
        <span>{data[0]?.period}</span>
        <span>{data[data.length - 1]?.period}</span>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { t } = useLanguage()

  useVisitCounter()

  // Which main modal shows (quarterly takes priority over pulse)
  const [activeModal, setActiveModal] = useState<'quarterly' | 'pulse' | null>(null)

  // Quarterly check-in: show if not done this quarter
  useEffect(() => {
    const m = new Date().getMonth()
    const y = new Date().getFullYear()
    const q = Math.floor(m / 3) + 1
    const key = `${y}-Q${q}`
    if (!localStorage.getItem(`bullaris_quarterly_${key}`)) {
      setActiveModal('quarterly')
    } else {
      setActiveModal('pulse')
    }
  }, [])

  const goalsQuery    = trpc.goals.list.useQuery()
  const netWorthQuery = trpc.netWorth.list.useQuery()

  const activeGoalCount = goalsQuery.data?.length ?? '–'
  const latestNW        = netWorthQuery.data?.[0]
  const netWorthValue   = latestNW
    ? (Number(latestNW.assets_dkk) - Number(latestNW.liabilities_dkk)).toLocaleString('da-DK', { maximumFractionDigits: 0 }) + ' DKK'
    : '– DKK'

  const cards = [
    { label: t.dashboard.netPayThisMonth, value: '– DKK',              link: '/payslip',  linkLabel: t.nav.payslip },
    { label: t.dashboard.activeGoals,     value: String(activeGoalCount), link: '/goals', linkLabel: t.nav.goals },
    { label: t.dashboard.netWorth,        value: netWorthValue,          link: '/finance', linkLabel: t.nav.finance },
  ]

  const quickActions = [
    { href: '/payslip',   icon: '📄', label: t.nav.payslip },
    { href: '/tax-planner', icon: '🧮', label: t.nav.taxPlanner },
    { href: '/chat',      icon: '💬', label: t.nav.chat },
    { href: '/learning',  icon: '📚', label: t.nav.learning, external: true },
  ]

  return (
    <div>
      {/* Modals & popups */}
      {activeModal === 'quarterly' && (
        <QuarterlyCheckIn onComplete={() => setActiveModal('pulse')} />
      )}
      {activeModal === 'pulse' && (
        <PulseModal onComplete={() => setActiveModal(null)} />
      )}
      <KnowledgePopup />

      <h1 className="font-serif text-3xl font-bold mb-1" style={{ color: '#1E0F00' }}>
        {t.dashboard.title}
      </h1>
      <p className="text-sm mb-6" style={{ color: '#A0917F' }}>
        {t.dashboard.subtitle}
      </p>

      {/* Pulse trend chart (shows once user has ≥2 months of data) */}
      <PulseTrend />

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-6"
            style={{ background: '#fff', border: '1px solid #EDE0D4' }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: '#A0917F' }}>{card.label}</p>
            <p className="text-2xl font-bold mb-2" style={{ color: '#1E0F00' }}>{card.value}</p>
            {card.link && (
              <Link href={card.link} className="text-xs underline" style={{ color: '#E8634A' }}>
                {card.linkLabel}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
          <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
            {t.dashboard.quickActions}
          </h2>
          <ul className="space-y-2">
            {quickActions.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  target={a.external ? '_blank' : undefined}
                  rel={a.external ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: '#6B5C52' }}
                >
                  <span>{a.icon}</span>
                  {a.label}
                  {a.external && <span className="text-xs ml-auto" style={{ color: '#C8BDB5' }}>↗</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
          <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
            {t.dashboard.recentActivity}
          </h2>
          <p className="text-sm" style={{ color: '#A0917F' }}>{t.dashboard.noActivity}</p>
        </div>
      </div>
    </div>
  )
}
