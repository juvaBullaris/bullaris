'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function BudgetMethodCalculator({ profile }: CalculatorProps) {
  const defaultTakeHome = profile?.gross_dkk
    ? Math.round(profile.gross_dkk * 0.65)
    : 28000
  const [takeHome, setTakeHome] = useState(defaultTakeHome)

  const needs = Math.round(takeHome * 0.5)
  const wants = Math.round(takeHome * 0.3)
  const savings = Math.round(takeHome * 0.2)

  const segments = [
    { label: 'Needs (50%)', sub: 'Rent, food, transport, bills', value: needs, color: '#1B3B6F', pct: 50 },
    { label: 'Wants (30%)', sub: 'Dining out, hobbies, subscriptions', value: wants, color: '#00B4D8', pct: 30 },
    { label: 'Savings (20%)', sub: 'Investments, emergency fund, pension top-up', value: savings, color: '#E8634A', pct: 20 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Monthly take-home pay (after tax)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={8000}
            max={80000}
            step={1000}
            value={takeHome}
            onChange={(e) => setTakeHome(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(takeHome)}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
          Gross salary × ~65% = estimated take-home
        </p>
      </div>

      <div className="rounded-xl p-5 space-y-4" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>THE 50/30/20 RULE</p>

        {/* Visual bar */}
        <div className="flex h-6 rounded-lg overflow-hidden gap-0.5">
          {segments.map((seg) => (
            <div
              key={seg.label}
              style={{ width: `${seg.pct}%`, background: seg.color }}
            />
          ))}
        </div>

        {/* Segments */}
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>{seg.label}</p>
              <p className="text-xs truncate" style={{ color: '#9B8B7E' }}>{seg.sub}</p>
            </div>
            <p className="text-sm font-bold font-mono" style={{ color: seg.color }}>
              {fmt(seg.value)}
            </p>
          </div>
        ))}

        <div className="my-1" style={{ borderTop: '1px dashed #EDE0D4' }} />

        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>Savings per year</p>
            <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>if savings are actually saved</p>
          </div>
          <p className="text-xl font-bold font-mono" style={{ color: '#FFF8F3' }}>
            {fmt(savings * 12)}
          </p>
        </div>

        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          The 50/30/20 rule is a framework, not a rule. Adapt it — the key is knowing your numbers and having a deliberate plan for the savings slice.
        </p>
      </div>
    </div>
  )
}
