'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function EmergencyFundCalculator({ profile }: CalculatorProps) {
  const defaultExpenses = profile?.gross_dkk ? Math.round(profile.gross_dkk * 0.65) : 28000
  const [monthlyExpenses, setMonthlyExpenses] = useState(defaultExpenses)
  const [months, setMonths] = useState(3)

  const target = monthlyExpenses * months
  const segments = Array.from({ length: months }, (_, i) => i)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Monthly expenses (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5000}
            max={80000}
            step={1000}
            value={monthlyExpenses}
            onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span
            className="text-sm font-semibold w-28 text-right"
            style={{ color: '#E8634A' }}
          >
            {fmt(monthlyExpenses)}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
          Include rent, food, transport, utilities, subscriptions
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#1E0F00' }}>
          Target months of cover
        </label>
        <div className="flex gap-2">
          {[3, 4, 5, 6].map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
              style={{
                background: months === m ? '#E8634A' : '#F5F0EB',
                color: months === m ? '#fff' : '#6B5C52',
              }}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs mt-1" style={{ color: '#9B8B7E' }}>
          <span>Minimum</span>
          <span>Recommended</span>
        </div>
      </div>

      {/* Visual breakdown */}
      <div
        className="rounded-xl p-5"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
      >
        <p className="text-xs font-medium mb-3" style={{ color: '#9B8B7E' }}>
          TARGET BREAKDOWN
        </p>
        <div className="flex gap-1.5 mb-4">
          {segments.map((i) => (
            <div
              key={i}
              className="flex-1 rounded-md flex items-center justify-center py-3 text-xs font-medium"
              style={{ background: '#E8634A20', color: '#E8634A' }}
            >
              Mo. {i + 1}
            </div>
          ))}
        </div>
        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>
            Emergency fund target
          </p>
          <p className="text-xl font-bold font-mono" style={{ color: '#FFF8F3' }}>
            {fmt(target)}
          </p>
        </div>
        <p className="text-xs mt-3" style={{ color: '#9B8B7E' }}>
          {monthlyExpenses.toLocaleString('da-DK')} kr. × {months} months = {fmt(target)}.{' '}
          Keep this in a separate, instant-access savings account.
        </p>
      </div>
    </div>
  )
}
