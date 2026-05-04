'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'
const RETIREMENT_AGE = 67
const ANNUAL_RETURN = 0.07

function futureValue(monthlyAmount: number, years: number): number {
  if (years <= 0) return 0
  const r = ANNUAL_RETURN / 12
  const n = years * 12
  return monthlyAmount * ((Math.pow(1 + r, n) - 1) / r)
}

export function CompoundGrowthCalculator({ profile }: CalculatorProps) {
  const defaultAge = profile?.age ?? 30
  const clampedAge = Math.min(Math.max(defaultAge, 18), 60)

  const [startAge, setStartAge] = useState(clampedAge)
  const [monthly, setMonthly] = useState(2000)

  const yearsNow = Math.max(0, RETIREMENT_AGE - startAge)
  const yearsLater = Math.max(0, RETIREMENT_AGE - (startAge + 10))

  const valueNow = futureValue(monthly, yearsNow)
  const valueLater = futureValue(monthly, yearsLater)
  const costOfDelay = Math.max(0, valueNow - valueLater)

  const totalContributedNow = monthly * 12 * yearsNow
  const totalContributedLater = monthly * 12 * yearsLater
  const growthNow = Math.max(0, valueNow - totalContributedNow)

  const barMax = Math.max(valueNow, valueLater, 1)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Starting age
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={18}
            max={60}
            step={1}
            value={startAge}
            onChange={(e) => setStartAge(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-16 text-right" style={{ color: '#E8634A' }}>
            age {startAge}
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
          {yearsNow} years until retirement at 67
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Monthly investment (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={500}
            max={15000}
            step={500}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(monthly)}
          </span>
        </div>
      </div>

      <div className="rounded-xl p-5 space-y-5" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>
          AT RETIREMENT (AGE 67) — 7% HISTORICAL RETURN
        </p>

        {/* Starting now */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: '#9B8B7E' }}>
            <span>Starting at age {startAge}</span>
            <span className="font-medium" style={{ color: '#00B4D8' }}>{yearsNow} years invested</span>
          </div>
          <div className="h-7 rounded-lg overflow-hidden" style={{ background: '#EDE0D4' }}>
            <div
              className="h-full rounded-lg transition-all duration-300"
              style={{ width: `${(valueNow / barMax) * 100}%`, background: '#00B4D8', minWidth: '8px' }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#9B8B7E' }}>Invested: {fmt(totalContributedNow)} · Growth: {fmt(growthNow)}</span>
            <span className="font-bold font-mono" style={{ color: '#1E0F00' }}>{fmt(valueNow)}</span>
          </div>
        </div>

        {/* Starting 10 years later */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs" style={{ color: '#9B8B7E' }}>
            <span>Starting at age {startAge + 10}</span>
            <span className="font-medium" style={{ color: '#E8634A' }}>{yearsLater} years invested</span>
          </div>
          <div className="h-7 rounded-lg overflow-hidden" style={{ background: '#EDE0D4' }}>
            <div
              className="h-full rounded-lg transition-all duration-300"
              style={{ width: `${(valueLater / barMax) * 100}%`, background: '#E8634A', minWidth: valueLater > 0 ? '8px' : '0' }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#9B8B7E' }}>Invested: {fmt(totalContributedLater)}</span>
            <span className="font-bold font-mono" style={{ color: '#1E0F00' }}>{fmt(valueLater)}</span>
          </div>
        </div>

        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>Cost of waiting 10 years</p>
            <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
              {fmt(monthly)} × 10 years contributed more
            </p>
          </div>
          <p className="text-xl font-bold font-mono" style={{ color: '#E8634A' }}>
            {fmt(costOfDelay)}
          </p>
        </div>

        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          Based on 7% average annual return (historical global equities). Not a guarantee of future returns.
          The early years compound the longest — that&apos;s why the delay is so expensive.
        </p>
      </div>
    </div>
  )
}
