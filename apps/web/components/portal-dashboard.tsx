'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { trpc } from '@/lib/trpc'

function StatCard({
  label,
  value,
  suffix = '',
  sub,
}: {
  label: string
  value: string | number | null
  suffix?: string
  sub?: string
}) {
  const { t } = useLanguage()
  return (
    <div className="rounded-xl border p-5 flex flex-col gap-1" style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
        {label}
      </p>
      <p className="text-2xl font-bold" style={{ color: '#1E0F00' }}>
        {value === null ? (
          <span className="text-base font-normal" style={{ color: '#9B8B7E' }}>
            {t.portal.insufficientData}
          </span>
        ) : (
          <>
            {value}
            {suffix && <span className="text-lg ml-0.5">{suffix}</span>}
          </>
        )}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          {sub}
        </p>
      )}
    </div>
  )
}

function RecommendationCard({
  icon,
  title,
  body,
  cta,
  ctaHref,
  variant,
}: {
  icon: string
  title: string
  body: string
  cta?: string
  ctaHref?: string
  variant: 'warning' | 'success'
}) {
  const isSuccess = variant === 'success'
  return (
    <div
      className="rounded-xl border p-4 flex gap-3"
      style={{
        background: isSuccess ? '#f0faf5' : '#FFF8F3',
        borderColor: isSuccess ? '#A3C9B0' : '#F9A87D',
      }}
    >
      <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>
          {title}
        </p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#6B5C52' }}>
          {body}
        </p>
        {cta && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-block text-xs font-medium mt-2 transition-opacity hover:opacity-70"
            style={{ color: '#E8634A' }}
          >
            {cta}
          </Link>
        )}
      </div>
    </div>
  )
}

export function PortalDashboard() {
  const { t } = useLanguage()
  const stats = trpc.employer.getPortalStats.useQuery()
  const account = trpc.employer.getAccount.useQuery()

  if (stats.isLoading || account.isLoading) {
    return (
      <p className="text-sm" style={{ color: '#9B8B7E' }}>
        {t.portal.loading}
      </p>
    )
  }

  const s = stats.data
  const a = account.data?.data

  // Build recommendations
  type Rec = { icon: string; title: string; body: string; cta?: string; ctaHref?: string; variant: 'warning' | 'success' }
  const recs: Rec[] = []

  if (s) {
    const hasEnoughData = s.onboardedCount >= 5

    if (s.onboardingRate !== null && s.onboardingRate < 80) {
      recs.push({
        icon: '⚠️',
        title: t.portal.recommendations.onboardingLow.title,
        body: t.portal.recommendations.onboardingLow.body,
        cta: t.portal.recommendations.onboardingLow.cta,
        ctaHref: '/nudges',
        variant: 'warning',
      })
    }

    if (hasEnoughData && s.learningEngagementRate !== null && s.learningEngagementRate < 50) {
      recs.push({
        icon: '📚',
        title: t.portal.recommendations.learningLow.title,
        body: t.portal.recommendations.learningLow.body,
        cta: t.portal.recommendations.learningLow.cta,
        ctaHref: '/nudges',
        variant: 'warning',
      })
    }

    if (hasEnoughData && s.goalsCount !== null && s.goalsCount === 0) {
      recs.push({
        icon: '🎯',
        title: t.portal.recommendations.noGoals.title,
        body: t.portal.recommendations.noGoals.body,
        cta: t.portal.recommendations.noGoals.cta,
        ctaHref: '/nudges',
        variant: 'warning',
      })
    }

    if (recs.length === 0 && s.totalInvited > 0) {
      recs.push({
        icon: '✓',
        title: t.portal.recommendations.allGood.title,
        body: t.portal.recommendations.allGood.body,
        variant: 'success',
      })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Headline */}
      <div>
        <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E0F00' }}>
          {t.portal.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: '#9B8B7E' }}>
          {t.portal.subtitle}
        </p>
      </div>

      {/* Employees section */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B8B7E' }}>
          {t.portal.stats.activeEmployees}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label={t.portal.stats.invited}
            value={s?.totalInvited ?? '–'}
          />
          <StatCard
            label={t.portal.stats.onboarded}
            value={s?.onboardedCount ?? '–'}
          />
          <StatCard
            label={t.portal.stats.onboardingRate}
            value={s?.onboardingRate ?? null}
            suffix="%"
          />
          <StatCard
            label={t.portal.stats.seatsPurchased}
            value={a?.seatsPurchased ?? '–'}
            sub={a ? `${a.seatsUsed} ${t.portal.stats.seatsUsed.toLowerCase()} · ${a.seatsAvailable} ${t.portal.stats.seatsAvailable.toLowerCase()}` : undefined}
          />
        </div>
      </section>

      {/* Engagement section */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9B8B7E' }}>
          Engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <StatCard
            label={t.portal.stats.learningEngagement}
            value={s?.learningEngagementRate ?? null}
            suffix="%"
            sub={s?.onboardedCount !== undefined && s.onboardedCount < 5 ? t.portal.insufficientData : undefined}
          />
          <StatCard
            label={t.portal.stats.totalGoals}
            value={s?.goalsCount ?? null}
            sub={s?.onboardedCount !== undefined && s.onboardedCount < 5 ? t.portal.insufficientData : undefined}
          />
        </div>
      </section>

      {/* Recommendations */}
      {recs.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#9B8B7E' }}>
            {t.portal.recommendations.title}
          </h2>
          <p className="text-xs mb-3" style={{ color: '#9B8B7E' }}>
            {t.portal.recommendations.subtitle}
          </p>
          <div className="flex flex-col gap-2">
            {recs.map((rec, i) => (
              <RecommendationCard key={i} {...rec} />
            ))}
          </div>
        </section>
      )}

      {/* Privacy guarantee */}
      <div
        className="rounded-xl border px-4 py-3 text-xs leading-relaxed"
        style={{ background: '#FFF8F3', borderColor: '#EDE0D4', color: '#9B8B7E' }}
      >
        🔒 {t.portal.privacyGuarantee}
      </div>
    </div>
  )
}
