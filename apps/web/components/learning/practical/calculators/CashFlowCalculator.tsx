'use client'

import { useState } from 'react'
import type { CalculatorProps } from '@/lib/practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export function CashFlowCalculator({ profile }: CalculatorProps) {
  const defaultGross = profile?.gross_dkk ?? 45000
  const defaultTakeHome = Math.round(defaultGross * 0.65)
  const defaultFixed = Math.round(defaultTakeHome * 0.50)
  const defaultVariable = Math.round(defaultTakeHome * 0.20)

  const [gross, setGross] = useState(defaultGross)
  const [fixedCosts, setFixedCosts] = useState(defaultFixed)
  const [variableCosts, setVariableCosts] = useState(defaultVariable)

  const takeHome = Math.round(gross * 0.65)
  const surplus = takeHome - fixedCosts - variableCosts
  const savingsRate = takeHome > 0 ? Math.max(0, Math.round((surplus / takeHome) * 100)) : 0
  const isPositive = surplus >= 0

  const rows = [
    { label: 'Gross salary', da: '', value: gross, color: '#00B4D8', sign: '' },
    { label: 'Taxes & AM-bidrag (~35%)', da: '', value: -(gross - takeHome), color: '#E8634A', sign: '−' },
    { label: 'Take-home pay', da: '', value: takeHome, color: '#1E0F00', sign: '', bold: true },
    { label: 'Fixed costs (rent, subscriptions)', da: '', value: -fixedCosts, color: '#E8634A', sign: '−' },
    { label: 'Variable spending (food, going out)', da: '', value: -variableCosts, color: '#E8634A', sign: '−' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Gross monthly salary (DKK)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={15000}
            max={120000}
            step={1000}
            value={gross}
            onChange={(e) => setGross(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(gross)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Fixed monthly costs (rent, transport, subscriptions)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(takeHome, 5000)}
            step={500}
            value={Math.min(fixedCosts, Math.max(takeHome, 5000))}
            onChange={(e) => setFixedCosts(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(fixedCosts)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>
          Variable monthly spending (food, entertainment, clothes)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(takeHome, 5000)}
            step={500}
            value={Math.min(variableCosts, Math.max(takeHome, 5000))}
            onChange={(e) => setVariableCosts(Number(e.target.value))}
            className="flex-1 accent-[#E8634A]"
          />
          <span className="text-sm font-semibold w-28 text-right" style={{ color: '#E8634A' }}>
            {fmt(variableCosts)}
          </span>
        </div>
      </div>

      {/* Waterfall */}
      <div className="rounded-xl p-5 space-y-3" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>MONTHLY CASH FLOW</p>
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span style={{ color: row.bold ? '#1E0F00' : '#6B5C52', fontWeight: row.bold ? 600 : 400 }}>
              {row.label}
            </span>
            <span
              className="font-mono font-semibold"
              style={{ color: row.color }}
            >
              {row.sign}{fmt(Math.abs(row.value))}
            </span>
          </div>
        ))}

        <div className="my-1" style={{ borderTop: '1px dashed #EDE0D4' }} />

        <div
          className="rounded-xl px-5 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: '#FFF8F3' }}>Monthly surplus</p>
            <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
              Savings rate: {savingsRate}% of take-home
            </p>
          </div>
          <p
            className="text-xl font-bold font-mono"
            style={{ color: isPositive ? '#00B4D8' : '#E8634A' }}
          >
            {isPositive ? '' : '−'}{fmt(Math.abs(surplus))}
          </p>
        </div>

        {!isPositive && (
          <p className="text-xs" style={{ color: '#E8634A' }}>
            Your costs exceed take-home pay. Reducing fixed costs has the biggest long-term impact.
          </p>
        )}
        {isPositive && savingsRate < 10 && (
          <p className="text-xs" style={{ color: '#9B8B7E' }}>
            A savings rate below 10% leaves little margin. Even automating 500 kr/month makes a difference over time.
          </p>
        )}
        {savingsRate >= 20 && (
          <p className="text-xs" style={{ color: '#00B4D8' }}>
            A {savingsRate}% savings rate is strong. Automate this surplus directly on payday.
          </p>
        )}
      </div>
    </div>
  )
}
