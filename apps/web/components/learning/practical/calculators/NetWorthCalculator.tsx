'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

interface AssetRow { label: string; value: number; setter: (v: number) => void; max: number; step: number }

export function NetWorthCalculator({ profile: _ }: CalculatorProps) {
  const [savings, setSavings] = useState(50000)
  const [pension, setPension] = useState(150000)
  const [property, setProperty] = useState(0)
  const [investments, setInvestments] = useState(0)

  const [mortgage, setMortgage] = useState(0)
  const [studentLoan, setStudentLoan] = useState(0)
  const [consumerDebt, setConsumerDebt] = useState(0)

  const totalAssets = savings + pension + property + investments
  const totalLiabilities = mortgage + studentLoan + consumerDebt
  const netWorth = totalAssets - totalLiabilities
  const isPositive = netWorth >= 0

  const assetRows: AssetRow[] = [
    { label: 'Cash & savings', value: savings, setter: setSavings, max: 500000, step: 5000 },
    { label: 'Pension (current value)', value: pension, setter: setPension, max: 2000000, step: 10000 },
    { label: 'Property value (home)', value: property, setter: setProperty, max: 8000000, step: 50000 },
    { label: 'Investments (stocks/funds)', value: investments, setter: setInvestments, max: 2000000, step: 10000 },
  ]

  const liabilityRows: AssetRow[] = [
    { label: 'Mortgage balance', value: mortgage, setter: setMortgage, max: 8000000, step: 50000 },
    { label: 'Student loan (SU-lån)', value: studentLoan, setter: setStudentLoan, max: 500000, step: 5000 },
    { label: 'Consumer loans & credit', value: consumerDebt, setter: setConsumerDebt, max: 500000, step: 5000 },
  ]

  return (
    <div className="space-y-6">
      {/* Assets */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: '#1E0F00' }}>What you own (Assets)</p>
        <div className="space-y-4">
          {assetRows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm" style={{ color: '#6B5C52' }}>{row.label}</label>
                <span className="text-sm font-semibold font-mono" style={{ color: '#00B4D8' }}>
                  {fmt(row.value)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={row.max}
                step={row.step}
                value={row.value}
                onChange={(e) => row.setter(Number(e.target.value))}
                className="w-full accent-[#00B4D8]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Liabilities */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: '#1E0F00' }}>What you owe (Liabilities)</p>
        <div className="space-y-4">
          {liabilityRows.map((row) => (
            <div key={row.label}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm" style={{ color: '#6B5C52' }}>{row.label}</label>
                <span className="text-sm font-semibold font-mono" style={{ color: '#E8634A' }}>
                  {fmt(row.value)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={row.max}
                step={row.step}
                value={row.value}
                onChange={(e) => row.setter(Number(e.target.value))}
                className="w-full accent-[#E8634A]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>NET WORTH SNAPSHOT</p>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: '#6B5C52' }}>Total assets</span>
          <span className="font-mono font-semibold" style={{ color: '#00B4D8' }}>{fmt(totalAssets)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span style={{ color: '#6B5C52' }}>Total liabilities</span>
          <span className="font-mono font-semibold" style={{ color: '#E8634A' }}>−{fmt(totalLiabilities)}</span>
        </div>

        <div className="my-1" style={{ borderTop: '1px dashed #EDE0D4' }} />

        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>Net worth</p>
          <p
            className="text-xl font-bold font-mono"
            style={{ color: isPositive ? '#00B4D8' : '#E8634A' }}
          >
            {isPositive ? '' : '−'}{fmt(Math.abs(netWorth))}
          </p>
        </div>

        <p className="text-xs" style={{ color: '#9B8B7E' }}>
          Tip: track this number once a quarter. Consistent positive cash flow makes it grow automatically.
        </p>
      </div>
    </div>
  )
}
