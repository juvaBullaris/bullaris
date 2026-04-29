'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

// 2026 approximate rates
const GRUNDBELOEB_MONTHLY = 7800
const SUPPLEMENT_SINGLE_MONTHLY = 8400
const PENSION_AGE = 67

export function FolkepensionCalculator({ profile }: CalculatorProps) {
  const defaultAge = profile?.age ?? 35
  const [currentAge, setCurrentAge] = useState(Math.min(Math.max(defaultAge, 18), 65))
  const maxYearsDK = Math.min(currentAge - 15, 40)
  const [yearsDK, setYearsDK] = useState(Math.min(maxYearsDK, currentAge - 15))

  const clampedYears = Math.min(yearsDK, currentAge - 15)
  const fraction = clampedYears / 40
  const grundbeloeb = Math.round(GRUNDBELOEB_MONTHLY * fraction)
  const totalMax = Math.round((GRUNDBELOEB_MONTHLY + SUPPLEMENT_SINGLE_MONTHLY) * fraction)
  const yearsUntilPension = Math.max(0, PENSION_AGE - currentAge)
  const pct = Math.round(fraction * 100)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Your current age: <strong>{currentAge}</strong>
        </label>
        <input
          type="range"
          min={18}
          max={65}
          step={1}
          value={currentAge}
          onChange={(e) => {
            const a = Number(e.target.value)
            setCurrentAge(a)
            setYearsDK(Math.min(yearsDK, a - 15))
          }}
          className="w-full accent-[#14b8a6]"
        />
        <div className="flex justify-between text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
          <span>18</span>
          <span>65</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Years lived in Denmark (age 15+): <strong>{Math.min(yearsDK, currentAge - 15)}</strong>
        </label>
        <input
          type="range"
          min={0}
          max={currentAge - 15}
          step={1}
          value={Math.min(yearsDK, currentAge - 15)}
          onChange={(e) => setYearsDK(Number(e.target.value))}
          className="w-full accent-[#14b8a6]"
        />
        <div className="flex justify-between text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
          <span>0 years</span>
          <span>{currentAge - 15} years (max now)</span>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE0D4' }}>
        <div className="px-5 py-4" style={{ background: '#FFF8F3' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#9B8B7E' }}>
            FOLKEPENSION ELIGIBILITY — {clampedYears} / 40 YEARS ({pct}%)
          </p>
          <div className="w-full h-3 rounded-full mb-1" style={{ background: '#EDE0D4' }}>
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${pct}%`, background: '#14b8a6' }}
            />
          </div>
          <p className="text-xs" style={{ color: '#9B8B7E' }}>
            Need 40 years between age 15 and {PENSION_AGE} for full benefit
          </p>
        </div>

        <div className="grid grid-cols-2 divide-x" style={{ borderTop: '1px solid #EDE0D4' }}>
          <div className="px-4 py-3">
            <p className="text-xs" style={{ color: '#9B8B7E' }}>Basic benefit (grundbeløb)</p>
            <p className="text-lg font-bold font-mono" style={{ color: '#14b8a6' }}>
              {fmt(grundbeloeb)}<span className="text-xs font-normal">/mo</span>
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs" style={{ color: '#9B8B7E' }}>Max with supplement</p>
            <p className="text-lg font-bold font-mono" style={{ color: '#14b8a6' }}>
              {fmt(totalMax)}<span className="text-xs font-normal">/mo</span>
            </p>
          </div>
        </div>

        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>
            Pension age {PENSION_AGE}
          </p>
          <p className="text-sm font-bold" style={{ color: '#14b8a6' }}>
            {yearsUntilPension > 0 ? `${yearsUntilPension} years away` : 'You qualify now'}
          </p>
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3 text-xs"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}
      >
        💡 The supplement (pensionstillæg) is means-tested — it phases out if you have other pension income.
        Folkepension alone is rarely enough to maintain your current lifestyle. Check your full picture at{' '}
        <strong>pensionsinfo.dk</strong>.
      </div>
    </div>
  )
}
