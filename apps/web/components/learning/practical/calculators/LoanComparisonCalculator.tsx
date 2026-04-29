'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

function monthlyPayment(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12)
  const r = annualRate / 100 / 12
  const n = years * 12
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const LOAN_TYPES = [
  {
    id: 'consumer',
    label: 'Consumer loan',
    labelDa: 'Forbrugslån',
    rate: 14.9,
    years: 5,
    color: '#E8634A',
    note: 'Unsecured — no collateral needed',
    noteDa: 'Usikret — ingen sikkerhed krævet',
  },
  {
    id: 'car',
    label: 'Car loan',
    labelDa: 'Billån',
    rate: 6.5,
    years: 5,
    color: '#f97316',
    note: 'Secured on the car',
    noteDa: 'Sikret i bilen',
  },
  {
    id: 'mortgage',
    label: 'Mortgage (realkreditlån)',
    labelDa: 'Boliglån (realkreditlån)',
    rate: 4.5,
    years: 20,
    color: '#22c55e',
    note: 'Secured on property — lowest rate',
    noteDa: 'Sikret i ejendommen — laveste rente',
  },
]

export function LoanComparisonCalculator({ profile: _ }: CalculatorProps) {
  const [amount, setAmount] = useState(100000)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Loan amount (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={10000}
            max={500000}
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

      <div className="space-y-3">
        {LOAN_TYPES.map((loan) => {
          const mp = monthlyPayment(amount, loan.rate, loan.years)
          const total = mp * loan.years * 12
          const interest = total - amount

          return (
            <div
              key={loan.id}
              className="rounded-xl p-4"
              style={{ background: '#FFF8F3', border: `1.5px solid ${loan.color}30` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>
                    {loan.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
                    {loan.note}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: loan.color + '20', color: loan.color }}
                >
                  {loan.rate}% APR
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Monthly', value: fmt(mp) },
                  { label: `Total (${loan.years}y)`, value: fmt(total) },
                  { label: 'Interest paid', value: fmt(interest) },
                ].map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-lg py-2"
                    style={{ background: loan.color + '10' }}
                  >
                    <p className="text-xs" style={{ color: '#9B8B7E' }}>
                      {cell.label}
                    </p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: loan.color }}>
                      {cell.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div
        className="rounded-xl px-4 py-3 text-xs"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}
      >
        💡 Rates are typical 2026 market averages — your actual rate depends on your credit score and bank.
        A mortgage requires property as collateral and is not available for general purchases.
      </div>
    </div>
  )
}
