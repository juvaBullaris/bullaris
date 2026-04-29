'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function InflationCalculator({ profile: _ }: CalculatorProps) {
  const [amount, setAmount] = useState(100000)
  const [rate, setRate] = useState(3)
  const [years, setYears] = useState(10)

  const futureValue = amount * Math.pow(1 - rate / 100, years)
  const loss = amount - futureValue
  const pct = ((loss / amount) * 100).toFixed(1)

  const barWidth = (futureValue / amount) * 100

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Amount today (DKK)
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
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Annual inflation rate: <strong>{rate}%</strong>
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.5}
            max={10}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <div className="flex justify-between text-xs w-28 text-right" style={{ color: '#9B8B7E' }}>
            <span />
            <span>{rate}%</span>
          </div>
        </div>
        <div className="flex justify-between text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
          <span>0.5% (low)</span>
          <span>10% (very high)</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Years: <strong>{years}</strong>
        </label>
        <input
          type="range"
          min={1}
          max={30}
          step={1}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full accent-[#E8634A]"
        />
        <div className="flex justify-between text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
          <span>1 year</span>
          <span>30 years</span>
        </div>
      </div>

      {/* Result card */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE0D4' }}>
        <div className="px-5 py-4" style={{ background: '#FFF8F3' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#9B8B7E' }}>
            PURCHASING POWER AFTER {years} YEAR{years > 1 ? 'S' : ''} AT {rate}% INFLATION
          </p>
          <div className="w-full h-5 rounded-full mb-2" style={{ background: '#EDE0D4' }}>
            <div
              className="h-5 rounded-full transition-all"
              style={{ width: `${barWidth}%`, background: barWidth > 70 ? '#5B8A6B' : barWidth > 40 ? '#f97316' : '#E8634A' }}
            />
          </div>
          <div className="flex justify-between text-xs" style={{ color: '#9B8B7E' }}>
            <span>0</span>
            <span>{fmt(amount)} (today)</span>
          </div>
        </div>

        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div>
            <p className="text-xs" style={{ color: '#9B8B7E' }}>
              Purchasing power in {years} years
            </p>
            <p className="text-xl font-bold font-mono" style={{ color: '#FFF8F3' }}>
              {fmt(futureValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs" style={{ color: '#9B8B7E' }}>Lost to inflation</p>
            <p className="text-base font-bold" style={{ color: '#E8634A' }}>
              −{fmt(loss)} ({pct}%)
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3 text-xs"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}
      >
        💡 Denmark's long-run inflation target is 2%. The 2022–2024 spike reached 6–8%. Assets like index
        funds and property historically outpace inflation over the long term.
      </div>
    </div>
  )
}
