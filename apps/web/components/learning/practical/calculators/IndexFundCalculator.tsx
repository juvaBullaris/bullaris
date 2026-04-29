'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

function futureValuePMT(monthlyPMT: number, annualReturnPct: number, years: number): number {
  const r = annualReturnPct / 100 / 12
  const n = years * 12
  if (r === 0) return monthlyPMT * n
  return monthlyPMT * ((Math.pow(1 + r, n) - 1) / r)
}

export function IndexFundCalculator({ profile }: CalculatorProps) {
  const defaultPMT = profile?.gross_dkk ? Math.round(profile.gross_dkk * 0.1 / 100) * 100 : 1000
  const [monthly, setMonthly] = useState(Math.max(500, Math.min(defaultPMT, 10000)))
  const [years, setYears] = useState(20)
  const returnRate = 7 // fixed historical average

  const finalBalance = futureValuePMT(monthly, returnRate, years)
  const contributed = monthly * years * 12
  const gains = finalBalance - contributed
  const multiplier = (finalBalance / contributed).toFixed(1)

  const gainsPct = (gains / finalBalance) * 100

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Monthly investment (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={100}
            max={20000}
            step={100}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="flex-1 accent-[#8b5cf6]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#8b5cf6' }}>
            {fmt(monthly)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Time horizon: <strong>{years} years</strong>
        </label>
        <input
          type="range"
          min={5}
          max={40}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full accent-[#8b5cf6]"
        />
        <div className="flex justify-between text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
          <span>5 years</span>
          <span>40 years</span>
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden text-xs font-medium"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#9B8B7E' }}
      >
        <div className="px-4 py-3">
          <p className="mb-2">
            Annual return assumption: <strong style={{ color: '#1E0F00' }}>7% (MSCI World historical average)</strong>
          </p>
          <div className="w-full h-6 rounded-full overflow-hidden flex" style={{ background: '#EDE0D4' }}>
            <div
              className="h-6 transition-all"
              style={{ width: `${100 - gainsPct}%`, background: '#8b5cf620' }}
            />
            <div
              className="h-6 transition-all"
              style={{ width: `${gainsPct}%`, background: '#8b5cf6' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ color: '#6B5C52' }}>Contributed ({Math.round(100 - gainsPct)}%)</span>
            <span style={{ color: '#8b5cf6' }}>Market gains ({Math.round(gainsPct)}%)</span>
          </div>
        </div>

        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div>
            <p style={{ color: '#9B8B7E' }}>Final balance after {years} years</p>
            <p className="text-xl font-bold font-mono" style={{ color: '#FFF8F3' }}>
              {fmt(finalBalance)}
            </p>
          </div>
          <div className="text-right">
            <p style={{ color: '#9B8B7E' }}>Your money grew</p>
            <p className="text-base font-bold" style={{ color: '#8b5cf6' }}>
              {multiplier}×
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total contributed', value: fmt(contributed), color: '#6B5C52', bg: '#F5F0EB' },
          { label: 'Market gains', value: fmt(gains), color: '#8b5cf6', bg: '#F5F0FF' },
        ].map((c) => (
          <div key={c.label} className="rounded-xl p-3 text-center" style={{ background: c.bg }}>
            <p className="text-xs" style={{ color: '#9B8B7E' }}>{c.label}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
