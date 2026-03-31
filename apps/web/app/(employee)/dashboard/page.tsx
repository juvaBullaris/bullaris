'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export default function DashboardPage() {
  const { t } = useLanguage()
  const goalsQuery = trpc.goals.list.useQuery()

  const activeGoalCount = goalsQuery.data?.length ?? '–'

  const cards = [
    {
      label: t.dashboard.netPayThisMonth,
      value: '– DKK',
      link: '/payslip',
      linkLabel: t.nav.payslip,
    },
    {
      label: t.dashboard.activeGoals,
      value: String(activeGoalCount),
      link: '/goals',
      linkLabel: t.nav.goals,
    },
    {
      label: t.dashboard.netWorth,
      value: '– DKK',
      link: null,
      linkLabel: null,
    },
  ]

  const quickActions = [
    { href: '/payslip', icon: '📄', label: t.nav.payslip },
    { href: '/tax-planner', icon: '🧮', label: t.nav.taxPlanner },
    { href: '/chat', icon: '💬', label: t.nav.chat },
    { href: '/learning', icon: '📚', label: t.nav.learning },
  ]

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-1" style={{ color: '#1E0F00' }}>
        {t.dashboard.title}
      </h1>
      <p className="text-sm mb-8" style={{ color: '#A0917F' }}>
        {t.dashboard.subtitle}
      </p>

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
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: '#6B5C52' }}
                >
                  <span>{a.icon}</span>
                  {a.label}
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
