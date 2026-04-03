'use client'

import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export default function SeatsPage() {
  const { t } = useLanguage()
  const accountQuery   = trpc.employer.getAccount.useQuery()
  const employeesQuery = trpc.employer.listEmployees.useQuery()

  const seatsPurchased = accountQuery.data?.data?.seatsPurchased ?? 0
  const seatsUsed      = employeesQuery.data?.length ?? 0
  const seatsAvailable = Math.max(0, seatsPurchased - seatsUsed)
  const usedPct        = seatsPurchased > 0 ? (seatsUsed / seatsPurchased) * 100 : 0

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-1" style={{ color: '#1E0F00' }}>
        {t.seats.title}
      </h1>
      <p className="text-sm mb-8" style={{ color: '#A0917F' }}>
        {t.seats.subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: t.seats.purchased, value: seatsPurchased, color: '#1E0F00' },
          { label: t.seats.used,      value: seatsUsed,      color: '#E8634A' },
          { label: t.seats.available, value: seatsAvailable, color: '#16A34A' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#A0917F' }}>{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Usage bar */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
        <div className="flex justify-between text-sm mb-2" style={{ color: '#6B5C52' }}>
          <span>{t.seats.used}: {seatsUsed}</span>
          <span>{t.seats.purchased}: {seatsPurchased}</span>
        </div>
        <div className="h-3 rounded-full" style={{ background: '#EDE0D4' }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${Math.min(usedPct, 100)}%`,
              background: usedPct >= 90 ? '#DC2626' : usedPct >= 70 ? '#E8634A' : '#16A34A',
            }}
          />
        </div>
        {usedPct >= 80 && (
          <p className="text-xs mt-2 font-medium" style={{ color: '#E8634A' }}>
            Du bruger {Math.round(usedPct)}% af dine pladser. Overvej at opgradere snart.
          </p>
        )}
      </div>

      {/* Upgrade CTA */}
      <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <h2 className="font-serif font-semibold text-lg mb-2" style={{ color: '#1E0F00' }}>
          {t.seats.upgrade}
        </h2>
        <p className="text-sm mb-4" style={{ color: '#6B5C52' }}>
          {t.seats.upgradeDesc}
        </p>
        <a
          href="mailto:hello@bullaris.dk?subject=Pladsopgradering"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
          style={{ background: '#E8634A' }}
        >
          Kontakt os →
        </a>
      </div>
    </div>
  )
}
