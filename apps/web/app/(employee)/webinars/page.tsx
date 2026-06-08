'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { WEBINARS, type WebinarCategory } from '@/lib/webinar-data'

const CATEGORIES: { id: WebinarCategory | 'all'; en: string; da: string; icon: string }[] = [
  { id: 'all',          en: 'All',           da: 'Alle',                icon: '📅' },
  { id: 'investments',  en: 'Investments',   da: 'Investering',         icon: '📈' },
  { id: 'pension',      en: 'Pension',       da: 'Pension',             icon: '🏦' },
  { id: 'real-estate',  en: 'Real estate',   da: 'Bolig',               icon: '🏠' },
  { id: 'tax',          en: 'Tax & payslip', da: 'Skat og lønseddel',   icon: '📊' },
  { id: 'savings',      en: 'Savings & debt', da: 'Opsparing og gæld', icon: '🛡️' },
]

function WebinarCard({
  webinar,
  isRegistered,
  isPending,
  highlighted,
  en,
  onRegister,
}: {
  webinar: typeof WEBINARS[0]
  isRegistered: boolean
  isPending: boolean
  highlighted: boolean
  en: boolean
  onRegister: () => void
}) {
  const now = new Date()
  const dateObj = new Date(webinar.date)
  const formattedDate = dateObj.toLocaleDateString(en ? 'en-GB' : 'da-DK', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  const formattedTime = dateObj.toLocaleTimeString(en ? 'en-GB' : 'da-DK', {
    hour: '2-digit', minute: '2-digit',
  })
  const daysUntil = Math.ceil((dateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  const isSoon = daysUntil <= 14

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{
        background: highlighted ? '#FFF8F3' : '#fff',
        border: isRegistered
          ? '1.5px solid #22c55e'
          : highlighted
          ? '1.5px solid #E8634A'
          : '1px solid #EDE0D4',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
          >
            {webinar.icon}
          </span>
          <div>
            <div className="text-xs font-medium mb-0.5" style={{ color: '#A0917F' }}>
              {formattedDate} · {formattedTime}
            </div>
            <div className="text-xs" style={{ color: '#C8BDB5' }}>
              ⏱ {webinar.duration} · {webinar.speaker}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          {isRegistered && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: '#F0FDF4', color: '#16A34A' }}>
              {en ? 'Registered ✓' : 'Tilmeldt ✓'}
            </span>
          )}
          {isSoon && !isRegistered && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: '#FFF3E0', color: '#E8634A' }}>
              {en ? `${daysUntil} days` : `${daysUntil} dage`}
            </span>
          )}
          {highlighted && !isRegistered && (
            <span className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ background: 'rgba(232,99,74,0.12)', color: '#E8634A' }}>
              {en ? 'Matches your goals' : 'Passer til dine mål'}
            </span>
          )}
        </div>
      </div>

      <div>
        <p className="font-semibold leading-snug mb-1.5" style={{ color: '#1E0F00' }}>
          {en ? webinar.en.title : webinar.da.title}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#6B5C52' }}>
          {en ? webinar.en.description : webinar.da.description}
        </p>
      </div>

      <div className="mt-auto pt-1">
        {isRegistered ? (
          <p className="text-sm font-medium" style={{ color: '#16A34A' }}>
            {en
              ? 'You will receive a Zoom link by email before the session.'
              : 'Du modtager et Zoom-link på e-mail inden sessionen.'}
          </p>
        ) : (
          <button
            onClick={onRegister}
            disabled={isPending}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #E8634A, #D4503A)' }}
          >
            {isPending
              ? (en ? 'Registering…' : 'Tilmelder…')
              : (en ? 'Register — Free' : 'Tilmeld — Gratis')}
          </button>
        )}
      </div>
    </div>
  )
}

export default function WebinarsPage() {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [activeCategory, setActiveCategory] = useState<WebinarCategory | 'all'>('all')

  const goalsQuery         = trpc.goals.list.useQuery()
  const registrationsQuery = trpc.webinars.myRegistrations.useQuery()
  const registerMutation   = trpc.webinars.register.useMutation({
    onSuccess: () => registrationsQuery.refetch(),
  })

  const registeredIds = new Set(registrationsQuery.data?.map((r) => r.webinarSanityId) ?? [])

  // Derive goal types from the employee's active goals
  const myGoalTypes = new Set(goalsQuery.data?.map((g) => g.type) ?? [])

  const now = new Date()
  const allUpcoming = WEBINARS
    .filter((w) => new Date(w.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Webinars that match at least one of the employee's goal types
  const forYou = allUpcoming.filter(
    (w) => w.goalTypes.some((gt) => myGoalTypes.has(gt)) && !registeredIds.has(w.id)
  )

  const filtered = activeCategory === 'all'
    ? allUpcoming
    : allUpcoming.filter((w) => w.category === activeCategory)

  function handleRegister(webinar: typeof WEBINARS[0]) {
    registerMutation.mutate({
      webinarSanityId: webinar.id,
      webinarTitle:    en ? webinar.en.title : webinar.da.title,
      webinarDate:     webinar.date,
      zoomJoinUrl:     'https://zoom.bullaris.dk/webinar',
    })
  }

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-1" style={{ color: '#1E0F00' }}>
        {en ? 'Webinars' : 'Webinarer'}
      </h1>
      <p className="text-sm mb-8" style={{ color: '#A0917F' }}>
        {en
          ? 'Free live sessions on the financial topics that matter most. You receive a personal Zoom link by email after registering.'
          : 'Gratis live-sessioner om de finansielle emner der betyder mest. Du modtager et personligt Zoom-link pr. e-mail efter tilmelding.'}
      </p>

      {/* Recommended for you — shown only when employee has goals and matching webinars */}
      {forYou.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif font-semibold text-lg mb-1" style={{ color: '#1E0F00' }}>
            {en ? 'Recommended for you' : 'Anbefalet til dig'}
          </h2>
          <p className="text-xs mb-4" style={{ color: '#A0917F' }}>
            {en
              ? 'Based on the financial goals you have set'
              : 'Baseret på de finansielle mål du har sat'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forYou.map((w) => (
              <WebinarCard
                key={w.id}
                webinar={w}
                isRegistered={registeredIds.has(w.id)}
                isPending={registerMutation.isPending && registerMutation.variables?.webinarSanityId === w.id}
                highlighted={true}
                en={en}
                onRegister={() => handleRegister(w)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All webinars with category filter */}
      <section>
        <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
          {en ? 'All upcoming webinars' : 'Alle kommende webinarer'}
        </h2>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all'
              ? allUpcoming.length
              : allUpcoming.filter((w) => w.category === cat.id).length
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                style={{
                  background: isActive ? '#E8634A' : '#fff',
                  color:      isActive ? '#fff' : '#6B5C52',
                  border:     isActive ? '1.5px solid #E8634A' : '1.5px solid #EDE0D4',
                }}
              >
                <span>{cat.icon}</span>
                {en ? cat.en : cat.da}
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#F5EDE0',
                    color:      isActive ? '#fff' : '#A0917F',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <p className="text-3xl mb-3">📅</p>
            <p className="font-medium mb-1" style={{ color: '#1E0F00' }}>
              {en ? 'No upcoming webinars in this category' : 'Ingen kommende webinarer i denne kategori'}
            </p>
            <p className="text-sm" style={{ color: '#A0917F' }}>
              {en ? 'Check back soon or browse other topics.' : 'Tjek igen snart eller se andre emner.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((w) => (
              <WebinarCard
                key={w.id}
                webinar={w}
                isRegistered={registeredIds.has(w.id)}
                isPending={registerMutation.isPending && registerMutation.variables?.webinarSanityId === w.id}
                highlighted={false}
                en={en}
                onRegister={() => handleRegister(w)}
              />
            ))}
          </div>
        )}
      </section>

      <p className="mt-8 text-xs text-center" style={{ color: '#C8BDB5' }}>
        {en
          ? 'All webinars are free for Bullaris users. Webinars are hosted live — no recordings are shared.'
          : 'Alle webinarer er gratis for Bullaris-brugere. Webinarer afholdes live — ingen optagelser deles.'}
      </p>
    </div>
  )
}
