'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function DownPaymentCalculator({ profile }: CalculatorProps) {
  const defaultSaving = profile?.gross_dkk ? Math.round(profile.gross_dkk * 0.15 / 1000) * 1000 : 5000
  const [homePrice, setHomePrice] = useState(2500000)
  const [downPct, setDownPct] = useState(20)
  const [monthlySaving, setMonthlySaving] = useState(Math.max(1000, Math.min(defaultSaving, 20000)))

  const downPayment = Math.round(homePrice * downPct / 100)
  const transactionCosts = Math.round(homePrice * 0.035) // ~3.5% for tinglysning + fees
  const totalNeeded = downPayment + transactionCosts
  const monthsToSave = Math.ceil(totalNeeded / monthlySaving)
  const yearsToSave = (monthsToSave / 12).toFixed(1)

  const realkreditLoan = Math.round(homePrice * 0.8)
  const bankLoan = Math.max(0, homePrice - downPayment - realkreditLoan)
  const ownEquity = downPayment

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Home price (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={500000}
            max={8000000}
            step={100000}
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
            className="flex-1 accent-[#ec4899]"
          />
          <span className="text-sm font-semibold w-32 text-right" style={{ color: '#ec4899' }}>
            {fmt(homePrice)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Down payment: <strong>{downPct}%</strong>
        </label>
        <div className="flex gap-2 mb-1">
          {[5, 10, 20, 30].map((p) => (
            <button
              key={p}
              onClick={() => setDownPct(p)}
              className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all"
              style={{
                background: downPct === p ? '#ec4899' : '#F5F0EB',
                color: downPct === p ? '#fff' : '#6B5C52',
              }}
            >
              {p}%{p === 5 ? ' (min)' : p === 20 ? ' (std)' : ''}
            </button>
          ))}
        </div>
        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          5% is legal minimum; 20% gets you the best mortgage terms
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Monthly saving capacity (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={500}
            max={30000}
            step={500}
            value={monthlySaving}
            onChange={(e) => setMonthlySaving(Number(e.target.value))}
            className="flex-1 accent-[#ec4899]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#ec4899' }}>
            {fmt(monthlySaving)}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE0D4' }}>
        <div className="px-5 py-4" style={{ background: '#FFF8F3' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#9B8B7E' }}>HOW THE HOME IS FINANCED</p>
          <div className="flex h-6 rounded-full overflow-hidden gap-0.5 mb-2">
            <div
              className="transition-all flex items-center justify-center text-xs font-bold"
              style={{ width: `${80}%`, background: '#ec489930', color: '#ec4899' }}
            >
              Realkredit 80%
            </div>
            {bankLoan > 0 && (
              <div
                className="transition-all"
                style={{ width: `${Math.round(bankLoan / homePrice * 100)}%`, background: '#f9731640' }}
              />
            )}
            <div
              className="transition-all"
              style={{ width: `${downPct}%`, background: '#ec4899' }}
            />
          </div>
          <div className="flex justify-between text-xs" style={{ color: '#9B8B7E' }}>
            <span>Realkreditlån: {fmt(realkreditLoan)}</span>
            <span style={{ color: '#ec4899' }}>Your equity: {fmt(ownEquity)}</span>
          </div>
        </div>

        <div className="divide-y" style={{ borderTop: '1px solid #EDE0D4' }}>
          {[
            { label: 'Down payment', value: fmt(downPayment), color: '#ec4899' },
            { label: 'Transaction costs (~3.5%)', value: fmt(transactionCosts), color: '#f97316' },
            { label: 'Total needed', value: fmt(totalNeeded), color: '#1E0F00', bold: true },
          ].map((row) => (
            <div key={row.label} className="px-5 py-3 flex justify-between items-center" style={{ background: '#fff' }}>
              <p className="text-sm" style={{ color: '#6B5C52' }}>{row.label}</p>
              <p className="text-sm font-bold" style={{ color: row.color }}>{row.value}</p>
            </div>
          ))}
        </div>

        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-sm" style={{ color: '#FFF8F3' }}>
            Saving {fmt(monthlySaving)}/month
          </p>
          <p className="text-sm font-bold" style={{ color: '#ec4899' }}>
            Ready in ~{yearsToSave} years ({monthsToSave} months)
          </p>
        </div>
      </div>
    </div>
  )
}
