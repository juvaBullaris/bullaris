'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function InflationErosionCalculator({ profile }: CalculatorProps) {
  const defaultAmount = profile?.gross_dkk
    ? Math.round((profile.gross_dkk * 6) / 10000) * 10000
    : 100000
  const [amount, setAmount] = useState(defaultAmount)
  const [years, setYears] = useState(10)

  const INFLATION = 0.03
  const INVEST_REAL = 0.04 // 7% nominal - 3% inflation

  const cashPurchasingPower = Math.round(amount * Math.pow(1 - INFLATION, years))
  const investedRealValue = Math.round(amount * Math.pow(1 + INVEST_REAL, years))

  const cashLoss = amount - cashPurchasingPower
  const investGain = investedRealValue - amount

  const cashPct = Math.round((cashPurchasingPower / amount) * 100)
  const investPct = Math.round((investedRealValue / amount) * 100)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Amount to protect (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(amount)}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
          A savings pot, bonus, or lump sum you want to protect
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#1E0F00' }}>
          Time horizon
        </label>
        <div className="flex gap-2">
          {[5, 10, 20, 30].map((y) => (
            <button
              key={y}
              onClick={() => setYears(y)}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
              style={{
                background: years === y ? '#E8634A' : '#F5F0EB',
                color: years === y ? '#fff' : '#6B5C52',
              }}
            >
              {y}y
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-5 space-y-4" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>
          PURCHASING POWER IN {years} YEARS (TODAY&apos;S MONEY)
        </p>

        {/* Cash bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: '#9B8B7E' }}>
            <span>Cash / savings account at 0%</span>
            <span className="font-medium" style={{ color: '#E8634A' }}>{cashPct}%</span>
          </div>
          <div className="h-7 rounded-lg overflow-hidden" style={{ background: '#EDE0D4' }}>
            <div
              className="h-full rounded-lg flex items-center px-3 transition-all duration-300"
              style={{ width: `${cashPct}%`, background: '#E8634A' }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#E8634A' }}>Lost: {fmt(cashLoss)}</span>
            <span className="font-semibold" style={{ color: '#1E0F00' }}>{fmt(cashPurchasingPower)}</span>
          </div>
        </div>

        {/* Invested bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: '#9B8B7E' }}>
            <span>Invested (index fund, ~7% historical)</span>
            <span className="font-medium" style={{ color: '#00B4D8' }}>{investPct}%</span>
          </div>
          <div className="h-7 rounded-lg overflow-hidden" style={{ background: '#EDE0D4' }}>
            <div
              className="h-full rounded-lg flex items-center px-3 transition-all duration-300"
              style={{ width: `${Math.min(investPct, 100)}%`, minWidth: '8px', background: '#00B4D8' }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#00B4D8' }}>Gained: {fmt(investGain)}</span>
            <span className="font-semibold" style={{ color: '#1E0F00' }}>{fmt(investedRealValue)}</span>
          </div>
        </div>

        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>
            Difference after {years} years
          </p>
          <p className="text-xl font-bold font-mono" style={{ color: '#FFF8F3' }}>
            {fmt(investedRealValue - cashPurchasingPower)}
          </p>
        </div>

        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          Based on 3% average inflation and 7% historical index fund returns. Past returns are not a guarantee.
        </p>
      </div>
    </div>
  )
}
