'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function LifeInsuranceCalculator({ profile }: CalculatorProps) {
  const defaultSalary = profile?.gross_dkk ? profile.gross_dkk * 12 : 480000
  const [mortgage, setMortgage] = useState(2000000)
  const [annualSalary, setAnnualSalary] = useState(Math.round(defaultSalary / 100000) * 100000)
  const [incomeYears, setIncomeYears] = useState(5)

  const incomeReplacement = annualSalary * incomeYears
  const totalRecommended = mortgage + incomeReplacement
  const employerCoverage = Math.round(annualSalary * 2) // typical 2× from collective agreement

  const gap = Math.max(0, totalRecommended - employerCoverage)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Outstanding mortgage (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={6000000}
            step={100000}
            value={mortgage}
            onChange={(e) => setMortgage(Number(e.target.value))}
            className="flex-1 accent-[#eab308]"
          />
          <span className="text-sm font-semibold w-32 text-right" style={{ color: '#eab308' }}>
            {fmt(mortgage)}
          </span>
        </div>
        <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
          Set to 0 if you rent or have no mortgage
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Annual gross salary (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={200000}
            max={2000000}
            step={50000}
            value={annualSalary}
            onChange={(e) => setAnnualSalary(Number(e.target.value))}
            className="flex-1 accent-[#eab308]"
          />
          <span className="text-sm font-semibold w-32 text-right" style={{ color: '#eab308' }}>
            {fmt(annualSalary)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Years of income to replace: <strong>{incomeYears}</strong>
        </label>
        <div className="flex gap-2">
          {[3, 5, 7, 10].map((y) => (
            <button
              key={y}
              onClick={() => setIncomeYears(y)}
              className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all"
              style={{
                background: incomeYears === y ? '#eab308' : '#F5F0EB',
                color: incomeYears === y ? '#fff' : '#6B5C52',
              }}
            >
              {y} yrs
            </button>
          ))}
        </div>
        <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
          How long your family would need income support
        </p>
      </div>

      {/* Result */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE0D4' }}>
        <div className="divide-y" style={{ background: '#FFF8F3' }}>
          {[
            { label: 'Mortgage to clear', value: fmt(mortgage), color: '#6B5C52' },
            { label: `${incomeYears} years income (${fmt(annualSalary)}/yr)`, value: fmt(incomeReplacement), color: '#6B5C52' },
            { label: 'Total recommended coverage', value: fmt(totalRecommended), color: '#1E0F00', bold: true },
            { label: 'Typical employer coverage (est. 2×)', value: `−${fmt(employerCoverage)}`, color: '#5B8A6B' },
          ].map((row) => (
            <div key={row.label} className="px-5 py-3 flex justify-between items-center" style={{ borderColor: '#EDE0D4' }}>
              <p className="text-sm" style={{ color: '#6B5C52' }}>{row.label}</p>
              <p className={`text-sm ${row.bold ? 'font-bold' : ''}`} style={{ color: row.color }}>
                {row.value}
              </p>
            </div>
          ))}
        </div>

        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>
            Additional coverage you may need
          </p>
          <p className="text-xl font-bold font-mono" style={{ color: gap === 0 ? '#5B8A6B' : '#eab308' }}>
            {gap === 0 ? 'Covered ✓' : fmt(gap)}
          </p>
        </div>
      </div>

      <div
        className="rounded-xl px-4 py-3 text-xs"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}
      >
        💡 Check your pension statement (pensionsinfo.dk) to see your actual employer coverage before buying more.
        Many Danes are already covered for 2–3× annual salary through their collective agreement.
      </div>
    </div>
  )
}
