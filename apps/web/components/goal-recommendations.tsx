'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LearningModule {
  id: string
  href: string
  icon: string
  available: boolean
  goalTypes: string[]
  en: { title: string; desc: string; duration: string }
  da: { title: string; desc: string; duration: string }
}

interface Partner {
  id: string
  name: string
  icon: string
  category: string
  goalTypes: string[]
  url: string
  en: { tagline: string }
  da: { tagline: string }
}

interface Webinar {
  id: string
  icon: string
  date: string
  duration: string
  speaker: string
  goalTypes: string[]
  en: { title: string }
  da: { title: string }
}

// ─── Learning modules ─────────────────────────────────────────────────────────
//
// Includes both available modules and upcoming ones ("coming soon").
// goalTypes lists which goal types make this module relevant.

const MODULES: LearningModule[] = [
  {
    id: 'goal-setting',
    href: '/learning/goal-setting',
    icon: '🎯',
    available: true,
    goalTypes: [
      'emergency_fund', 'debt_payoff', 'vacation', 'car', 'education',
      'house_deposit', 'home_renovation', 'children_savings', 'investment',
      'side_income', 'pension_boost', 'financial_independence', 'passive_income',
      'early_retirement', 'generational_wealth', 'other',
    ],
    en: { title: 'How to Set Your Financial Goals', desc: 'SMART-A, Three Horizons framework and a 7-step playbook', duration: '~10 min' },
    da: { title: 'Sådan sætter du dine finansielle mål', desc: 'SMART-A, tre horisonter og en 7-trins plan', duration: '~10 min' },
  },
  {
    id: 'tax-basics',
    href: '/learning/tax-basics',
    icon: '📊',
    available: true,
    goalTypes: [
      'debt_payoff', 'investment', 'house_deposit', 'pension_boost',
      'financial_independence', 'passive_income', 'early_retirement',
      'side_income', 'home_renovation', 'generational_wealth',
    ],
    en: { title: 'Danish Tax Basics 2026', desc: 'AM-bidrag, bundskat, kommuneskat and 2026 brackets', duration: '~10 min' },
    da: { title: 'Danske skatter 2026', desc: 'AM-bidrag, bundskat, kommuneskat og 2026-trin', duration: '~10 min' },
  },
  {
    id: 'payslip-guide',
    href: '/learning/payslip-guide',
    icon: '📄',
    available: true,
    goalTypes: ['pension_boost', 'debt_payoff', 'side_income', 'emergency_fund'],
    en: { title: 'Understanding Your Danish Payslip', desc: 'Decode every line of your lønseddel', duration: '~8 min' },
    da: { title: 'Forstå din danske lønseddel', desc: 'Afkod hver linje på din lønseddel', duration: '~8 min' },
  },
  {
    id: 'investing-basics',
    href: '/learning/investing-basics',
    icon: '📈',
    available: false,
    goalTypes: ['investment', 'financial_independence', 'passive_income', 'early_retirement', 'children_savings', 'generational_wealth'],
    en: { title: 'Investing Basics: ETFs & Aktiesparekonto', desc: 'Index funds, aktiesparekonto rules and DCA strategy', duration: '~12 min' },
    da: { title: 'Investering for begyndere', desc: 'Indeksfonde, aktiesparekonto-regler og månedlig investering', duration: '~12 min' },
  },
  {
    id: 'pension-deep-dive',
    href: '/learning/pension',
    icon: '🏦',
    available: false,
    goalTypes: ['pension_boost', 'early_retirement', 'generational_wealth', 'financial_independence'],
    en: { title: 'Danish Pension: Your Complete Guide', desc: 'Folkepension, ATP, employer schemes and tax benefits', duration: '~15 min' },
    da: { title: 'Dansk pension: Den komplette guide', desc: 'Folkepension, ATP, arbejdsgiverordninger og skattefordele', duration: '~15 min' },
  },
  {
    id: 'debt-strategy',
    href: '/learning/debt-strategy',
    icon: '🔗',
    available: false,
    goalTypes: ['debt_payoff'],
    en: { title: 'Debt Avalanche vs. Snowball', desc: 'Choose the fastest science-backed path out of debt', duration: '~8 min' },
    da: { title: 'Gældslavine vs. snebold-metoden', desc: 'Vælg den hurtigste videnskabeligt understøttede vej ud af gæld', duration: '~8 min' },
  },
  {
    id: 'house-buying',
    href: '/learning/house-buying',
    icon: '🏠',
    available: false,
    goalTypes: ['house_deposit', 'home_renovation', 'generational_wealth'],
    en: { title: 'Buying Your First Home in Denmark', desc: 'Process, costs, boliglån and bidding strategy', duration: '~15 min' },
    da: { title: 'Køb dit første hjem i Danmark', desc: 'Processen, omkostninger, boliglån og budstrategi', duration: '~15 min' },
  },
  {
    id: 'fire-planning',
    href: '/learning/fire',
    icon: '🌅',
    available: false,
    goalTypes: ['financial_independence', 'early_retirement', 'passive_income'],
    en: { title: 'FIRE in Denmark: The Complete Path', desc: '4% rule, Danish pension interaction and safe withdrawal', duration: '~12 min' },
    da: { title: 'FIRE i Danmark: Den komplette vej', desc: '4%-reglen, dansk pensionsinteraktion og sikre hævningsstrategier', duration: '~12 min' },
  },
]

// ─── Partners ─────────────────────────────────────────────────────────────────
//
// Partners are selected based on relevance to goal types only.
// Bullaris has no commercial relationship with any of these companies.

const PARTNERS: Partner[] = [
  {
    id: 'lunar',
    name: 'Lunar',
    icon: '🌙',
    category: 'bank',
    goalTypes: ['emergency_fund', 'vacation', 'car', 'children_savings', 'education'],
    url: 'https://www.lunar.app',
    en: { tagline: 'Danish mobile bank with dedicated savings pockets — one per goal' },
    da: { tagline: 'Dansk mobilbank med dedikerede opsparingslommer — én per mål' },
  },
  {
    id: 'nordnet',
    name: 'Nordnet',
    icon: '📈',
    category: 'investment',
    goalTypes: ['investment', 'financial_independence', 'passive_income', 'early_retirement', 'children_savings', 'generational_wealth'],
    url: 'https://www.nordnet.dk',
    en: { tagline: "Nordic investment platform — ETFs, stocks, aktiesparekonto and pension" },
    da: { tagline: 'Nordisk investeringsplatform — ETF\'er, aktier, aktiesparekonto og pension' },
  },
  {
    id: 'saxo',
    name: 'Saxo Bank',
    icon: '💹',
    category: 'investment',
    goalTypes: ['investment', 'passive_income', 'generational_wealth', 'financial_independence'],
    url: 'https://www.home.saxo',
    en: { tagline: 'Advanced investment platform for stocks, ETFs, bonds and CFDs' },
    da: { tagline: 'Avanceret investeringsplatform til aktier, ETF\'er, obligationer og CFD\'er' },
  },
  {
    id: 'pensiondk',
    name: 'PensionDanmark',
    icon: '🏦',
    category: 'pension',
    goalTypes: ['pension_boost', 'early_retirement', 'financial_independence'],
    url: 'https://www.pension.dk',
    en: { tagline: "Denmark's largest labor-market pension fund — strong returns, low cost" },
    da: { tagline: 'Danmarks største arbejdsmarkedspensionskasse — stærkt afkast, lave omkostninger' },
  },
  {
    id: 'velliv',
    name: 'Velliv',
    icon: '🌿',
    category: 'pension',
    goalTypes: ['pension_boost', 'early_retirement', 'generational_wealth'],
    url: 'https://www.velliv.dk',
    en: { tagline: 'Member-owned pension fund focused on long-term wellbeing and returns' },
    da: { tagline: 'Medlemsejet pensionskasse med fokus på langsigtet trivsel og afkast' },
  },
  {
    id: 'mybanker',
    name: 'Mybanker',
    icon: '🔍',
    category: 'comparison',
    goalTypes: ['house_deposit', 'debt_payoff', 'home_renovation'],
    url: 'https://www.mybanker.dk',
    en: { tagline: 'Compare mortgage and loan rates from all Danish banks in minutes' },
    da: { tagline: 'Sammenlign boliglåns- og forbrugslånsrenter fra alle danske banker på minutter' },
  },
  {
    id: 'nykredit',
    name: 'Nykredit',
    icon: '🏠',
    category: 'mortgage',
    goalTypes: ['house_deposit', 'home_renovation', 'generational_wealth'],
    url: 'https://www.nykredit.dk',
    en: { tagline: "Denmark's leading mortgage provider — boliglån, renovation loans" },
    da: { tagline: 'Danmarks ledende realkreditinstitut — boliglån og renoveringslån' },
  },
  {
    id: 'economic',
    name: 'e-conomic',
    icon: '💼',
    category: 'business',
    goalTypes: ['side_income'],
    url: 'https://www.e-conomic.dk',
    en: { tagline: 'Cloud accounting built for Danish freelancers and small businesses' },
    da: { tagline: 'Cloud-regnskab bygget til danske freelancere og mindre virksomheder' },
  },
]

// ─── Webinars ─────────────────────────────────────────────────────────────────
//
// Static schedule — in production this would be fetched from Sanity.
// goalTypes lists which goal types make each webinar relevant.

const WEBINARS: Webinar[] = [
  {
    id: 'webinar-tax-2026',
    icon: '📊',
    date: '2026-04-15T17:00:00',
    duration: '45 min',
    speaker: 'Bullaris Tax Team',
    goalTypes: ['debt_payoff', 'investment', 'financial_independence', 'passive_income', 'pension_boost', 'side_income'],
    en: { title: '2026 Tax Changes — What Every Employee Needs to Know' },
    da: { title: '2026 Skatteændringer — hvad enhver medarbejder skal vide' },
  },
  {
    id: 'webinar-fire-dk',
    icon: '🌅',
    date: '2026-04-22T17:00:00',
    duration: '60 min',
    speaker: 'Financial Independence Network DK',
    goalTypes: ['financial_independence', 'early_retirement', 'passive_income', 'investment'],
    en: { title: 'FIRE in Denmark: The Practical Roadmap' },
    da: { title: 'FIRE i Danmark: Det praktiske vejkort' },
  },
  {
    id: 'webinar-house-2026',
    icon: '🏠',
    date: '2026-05-06T17:00:00',
    duration: '45 min',
    speaker: 'Nykredit Advisors',
    goalTypes: ['house_deposit', 'home_renovation', 'generational_wealth'],
    en: { title: 'Buying Your First Home in Denmark in 2026' },
    da: { title: 'Køb dit første hjem i Danmark i 2026' },
  },
  {
    id: 'webinar-aktiesparekonto',
    icon: '📈',
    date: '2026-05-13T18:00:00',
    duration: '45 min',
    speaker: 'Nordnet',
    goalTypes: ['investment', 'financial_independence', 'passive_income', 'early_retirement', 'children_savings'],
    en: { title: 'Aktiesparekonto 2026: Maximize Your Tax-Free Returns' },
    da: { title: 'Aktiesparekonto 2026: Maksimer dit skattefrie afkast' },
  },
  {
    id: 'webinar-pension-boost',
    icon: '🏦',
    date: '2026-05-20T17:00:00',
    duration: '45 min',
    speaker: 'PensionDanmark',
    goalTypes: ['pension_boost', 'early_retirement', 'generational_wealth', 'financial_independence'],
    en: { title: 'Boost Your Pension: Extra Contributions That Compound' },
    da: { title: 'Boost din pension: Ekstra bidrag der giver renters rente' },
  },
  {
    id: 'webinar-debt-free',
    icon: '🔗',
    date: '2026-06-03T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    goalTypes: ['debt_payoff'],
    en: { title: 'Debt-Free Fast: Avalanche vs. Snowball in Danish Context' },
    da: { title: 'Gældfri hurtigt: Lavine vs. snebold i dansk kontekst' },
  },
  {
    id: 'webinar-side-income',
    icon: '💼',
    date: '2026-06-10T17:00:00',
    duration: '45 min',
    speaker: 'e-conomic + Bullaris',
    goalTypes: ['side_income', 'financial_independence', 'passive_income', 'early_retirement'],
    en: { title: 'Building a Side Income in Denmark: Tax, Registration & Growth' },
    da: { title: 'Biindtægt i Danmark: Skat, registrering og vækst' },
  },
  {
    id: 'webinar-children-savings',
    icon: '👶',
    date: '2026-06-17T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    goalTypes: ['children_savings', 'generational_wealth'],
    en: { title: "Children's Savings in Denmark: Børneopsparing & Beyond" },
    da: { title: 'Børneopsparing i Danmark: Børneopsparing og mere' },
  },
]

// ─────────────────────────────────────────────────────────────────────────────

export function GoalRecommendations({ goalTypes }: { goalTypes: string[] }) {
  const { t, locale } = useLanguage()
  const en = locale === 'en'
  const r = t.goals.recommendations

  const [activeTab, setActiveTab] = useState<'learning' | 'partners' | 'webinars'>('learning')
  const [userEmail, setUserEmail]   = useState<string | null>(null)

  const progressQuery      = trpc.learning.myProgress.useQuery()
  const registrationsQuery = trpc.webinars.myRegistrations.useQuery()
  const registerMutation   = trpc.webinars.register.useMutation({
    onSuccess: () => registrationsQuery.refetch(),
  })

  // Get Supabase user email client-side for webinar registration emails
  useEffect(() => {
    const supabase = createClientComponentClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email)
    })
  }, [])

  if (goalTypes.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center mt-10">
        <p className="text-sm text-muted-foreground">{r.noGoals}</p>
      </div>
    )
  }

  const completedIds  = new Set(progressQuery.data?.map((p) => p.contentId) ?? [])
  const registeredIds = new Set(registrationsQuery.data?.map((r) => r.webinarSanityId) ?? [])

  // Filter + sort: available first, then incomplete before complete
  const relevantModules = MODULES
    .filter((m) => m.goalTypes.some((gt) => goalTypes.includes(gt)))
    .sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1
      const aDone = completedIds.has(a.id) ? 1 : 0
      const bDone = completedIds.has(b.id) ? 1 : 0
      return aDone - bDone
    })

  const relevantPartners = PARTNERS.filter((p) =>
    p.goalTypes.some((gt) => goalTypes.includes(gt))
  )

  const relevantWebinars = WEBINARS
    .filter((w) => w.goalTypes.some((gt) => goalTypes.includes(gt)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const tabs = [
    { id: 'learning'  as const, label: r.tabs.learning,  count: relevantModules.length  },
    { id: 'partners'  as const, label: r.tabs.partners,  count: relevantPartners.length  },
    { id: 'webinars'  as const, label: r.tabs.webinars,  count: relevantWebinars.length  },
  ]

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold" style={{ color: '#1E0F00' }}>{r.title}</h2>
        <p className="text-sm text-muted-foreground">{r.subtitle}</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-1 rounded-lg py-1.5 px-1 text-xs font-medium transition-all"
            style={
              activeTab === tab.id
                ? { background: 'white', color: '#E8634A', border: '1.5px solid #E8634A35', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }
                : { color: '#9B8B7E' }
            }
          >
            {tab.label}
            <span
              className="rounded-full px-1.5 py-px text-xs font-semibold"
              style={{
                background: activeTab === tab.id ? '#E8634A15' : '#EDE0D4',
                color: activeTab === tab.id ? '#E8634A' : '#6B5C52',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Learning Path ──────────────────────────────────────────────────── */}
      {activeTab === 'learning' && (
        <div className="space-y-3">
          {relevantModules.map((module) => {
            const done = completedIds.has(module.id)
            const text = en ? module.en : module.da
            return (
              <div
                key={module.id}
                className="flex items-center gap-3 rounded-xl border bg-card p-4"
                style={{ opacity: done ? 0.65 : 1 }}
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: done ? '#16A34A12' : module.available ? '#E8634A10' : '#F5F5F5',
                    border: `1.5px solid ${done ? '#16A34A35' : module.available ? '#E8634A35' : '#E5E5E5'}`,
                  }}
                >
                  {done ? '✓' : module.available ? module.icon : '🔒'}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-semibold leading-tight" style={{ color: '#1E0F00' }}>
                      {text.title}
                    </span>
                    {done && (
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: '#16A34A15', color: '#16A34A' }}>
                        {r.learning.completed}
                      </span>
                    )}
                    {!module.available && (
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ background: '#F5F0E8', color: '#9B8B7E' }}>
                        {r.learning.comingSoon}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{text.desc} · {text.duration}</p>
                </div>

                {module.available && (
                  <Link
                    href={module.href}
                    className="text-xs font-semibold shrink-0"
                    style={{ color: '#E8634A' }}
                  >
                    {done ? r.learning.review : r.learning.start}
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Partners ───────────────────────────────────────────────────────── */}
      {activeTab === 'partners' && (
        <div>
          <p className="text-xs text-muted-foreground mb-4">{r.partners.disclaimer}</p>
          <div className="space-y-3">
            {relevantPartners.map((partner) => (
              <div key={partner.id} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                  style={{ background: '#FFF8F3', border: '1.5px solid #EDE0D4' }}
                >
                  {partner.icon}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: '#1E0F00' }}>{partner.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0"
                      style={{ background: '#F5F0E8', color: '#9B8B7E' }}
                    >
                      {(r.partners.categories as Record<string, string>)[partner.category] ?? partner.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{en ? partner.en.tagline : partner.da.tagline}</p>
                </div>

                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold shrink-0"
                  style={{ color: '#E8634A' }}
                >
                  {r.partners.visit}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Webinars ───────────────────────────────────────────────────────── */}
      {activeTab === 'webinars' && (
        <div>
          <p className="text-xs text-muted-foreground mb-4">{r.webinars.disclaimer}</p>
          <div className="space-y-3">
            {relevantWebinars.map((webinar) => {
              const isRegistered = registeredIds.has(webinar.id)
              const isPending    = registerMutation.isPending &&
                                   registerMutation.variables?.webinarSanityId === webinar.id
              const dateObj      = new Date(webinar.date)
              const formattedDate = dateObj.toLocaleDateString(en ? 'en-GB' : 'da-DK', {
                weekday: 'short', day: 'numeric', month: 'short',
              })
              const formattedTime = dateObj.toLocaleTimeString('da-DK', {
                hour: '2-digit', minute: '2-digit',
              })

              return (
                <div key={webinar.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 mt-0.5"
                      style={{ background: '#FFF8F3', border: '1.5px solid #EDE0D4' }}
                    >
                      {webinar.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug mb-1" style={{ color: '#1E0F00' }}>
                        {en ? webinar.en.title : webinar.da.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>📅 {formattedDate} · {formattedTime}</span>
                        <span>⏱ {webinar.duration}</span>
                        <span>{webinar.speaker}</span>
                        <span className="font-medium" style={{ color: '#16A34A' }}>
                          {r.webinars.free}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end">
                    {isRegistered ? (
                      <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>
                        {r.webinars.registered}
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          userEmail &&
                          registerMutation.mutate({
                            webinarSanityId: webinar.id,
                            webinarTitle:    en ? webinar.en.title : webinar.da.title,
                            webinarDate:     webinar.date,
                            zoomJoinUrl:     'https://zoom.bullaris.dk/webinar',
                            userEmail,
                          })
                        }
                        disabled={isPending || !userEmail}
                        className="text-xs font-semibold transition-opacity disabled:opacity-50"
                        style={{ color: '#E8634A' }}
                      >
                        {isPending ? '...' : r.webinars.register}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
