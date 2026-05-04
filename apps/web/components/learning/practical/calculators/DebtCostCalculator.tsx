'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function DebtCostCalculator({ profile: _ }: CalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(50000)
  const [apr, setApr] = useState(15)
  const [years, setYears] = useState(5)

  const monthlyRate = apr / 100 / 12
  const numPayments = years * 12

  const monthlyPayment =
    monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments

  const totalRepaid = monthlyPayment * numPayments
  const totalInterest = totalRepaid - loanAmount

  // Opportunity cost: same monthly payment invested at 7% instead
  const investMonthlyRate = 0.07 / 12
  const investedValue =
    monthlyPayment *
    ((Math.pow(1 + investMonthlyRate, numPayments) - 1) / investMonthlyRate)

  const opportunityCost = Math.max(0, investedValue - loanAmount)

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Loan amount (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5000}
            max={500000}
            step={5000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(loanAmount)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          ÅOP / APR (annual cost, %)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={2}
            max={30}
            step={0.5}
            value={apr}
            onChange={(e) => setApr(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-16 text-right" style={{ color: '#E8634A' }}>
            {apr}%
          </span>
        </div>
        <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
          Mortgage: 3–5% · Car loan: 4–8% · Consumer loan: 8–25%
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#1E0F00' }}>
          Loan term
        </label>
        <div className="flex gap-2">
          {[2, 3, 5, 10].map((y) => (
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

      <div className="rounded-xl p-5 space-y-3" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>TRUE COST OF THIS LOAN</p>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: '#6B5C52' }}>Monthly payment</span>
          <span className="font-mono font-semibold" style={{ color: '#1E0F00' }}>{fmt(monthlyPayment)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: '#6B5C52' }}>Total repaid</span>
          <span className="font-mono font-semibold" style={{ color: '#1E0F00' }}>{fmt(totalRepaid)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: '#6B5C52' }}>Interest paid (cost of borrowing)</span>
          <span className="font-mono font-semibold" style={{ color: '#E8634A' }}>{fmt(totalInterest)}</span>
        </div>

        <div className="my-1" style={{ borderTop: '1px dashed #EDE0D4' }} />

        <div className="flex items-center justify-between text-sm">
          <div>
            <p style={{ color: '#6B5C52' }}>If invested instead</p>
            <p className="text-xs" style={{ color: '#9B8B7E' }}>Same monthly payment at 7% return</p>
          </div>
          <span className="font-mono font-semibold" style={{ color: '#00B4D8' }}>{fmt(investedValue)}</span>
        </div>

        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>Total opportunity cost</p>
            <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>interest paid + foregone investment gains</p>
          </div>
          <p className="text-xl font-bold font-mono" style={{ color: '#E8634A' }}>
            {fmt(totalInterest + opportunityCost)}
          </p>
        </div>

        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          The true cost includes both what you pay in interest and what you don&apos;t earn by not investing.
          Good debt (mortgage, education) can still make sense. Consumer debt rarely does.
        </p>
      </div>
    </div>
  )
}
