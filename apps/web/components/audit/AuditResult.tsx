'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EmailCapture } from './EmailCapture'
import type { ScoredResult } from './types'

interface AuditResultProps {
  result: ScoredResult
  sessionId: string
  onEmailSuccess: (firstName: string) => void
}

const ease = [0.22, 1, 0.36, 1] as const

const TIER_COLORS: Record<string, string> = {
  Low: '#5B8A6B',
  Medium: '#D4993A',
  High: '#E8634A',
  Acute: '#C03030',
}

const COVERAGE_LABELS: Record<string, string> = {
  yes: 'Partial coverage',
  partial: 'Limited coverage',
  no: 'No coverage',
  unsure: 'No coverage',
}

function MetricCard({
  value,
  label,
  delay,
}: {
  value: string
  label: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease }}
      className="flex flex-1 flex-col gap-2 rounded-xl p-5"
      style={{
        background: '#fff',
        boxShadow: '0 2px 16px rgba(92,58,30,0.08)',
        border: '1px solid rgba(212,184,152,0.25)',
      }}
    >
      <div
        className="leading-none"
        style={{
          fontFamily: "'Lora', serif",
          fontSize: '22px',
          fontWeight: 700,
          color: '#1E0F00',
        }}
      >
        {value}
      </div>
      <div className="text-[11px] leading-snug" style={{ color: '#9B7B5A' }}>
        {label}
      </div>
    </motion.div>
  )
}

export function AuditResult({ result, sessionId, onEmailSuccess }: AuditResultProps) {
  const [showEmail, setShowEmail] = useState(false)
  const tierColor = TIER_COLORS[result.riskTier] ?? '#E8634A'

  // Show email capture after 6 seconds
  useEffect(() => {
    const id = setTimeout(() => setShowEmail(true), 6000)
    return () => clearTimeout(id)
  }, [])

  // Cancel the email capture timer and skip straight to bridge on success
  function handleEmailSuccess(firstName: string) {
    setShowEmail(false)
    onEmailSuccess(firstName)
  }

  // Coverage derived from benefits answer — not in ScoredResult directly,
  // so we fall back to the stressEstimate as the third card metric
  // (the result screen spec uses primaryMetricAffected for card 3)

  return (
    <div
      className="flex min-h-screen flex-col items-center px-6 py-16"
      style={{
        background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EDE0 40%, #EDE0D4 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Main result card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        className="w-full max-w-[640px] rounded-2xl p-8"
        style={{
          background: 'rgba(255,255,255,0.70)',
          border: '1.5px solid rgba(255,255,255,0.80)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 40px rgba(92,82,70,0.10)',
        }}
      >
        {/* Risk tier badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className="mb-4"
        >
          <span
            className="inline-block rounded-full px-5 py-1.5 text-sm font-bold text-white"
            style={{ background: tierColor }}
          >
            {result.riskTier} Risk
          </span>
        </motion.div>

        {/* Score */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mb-4 leading-none"
          style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '34px',
            fontWeight: 700,
            color: '#1E0F00',
          }}
        >
          {result.riskScore.toFixed(1)}{' '}
          <span style={{ fontSize: '18px', fontWeight: 400, color: '#9B7B5A' }}>/ 10</span>
        </motion.div>

        {/* Plain readout */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6, ease }}
          className="mb-8 max-w-[420px] text-[15px] leading-relaxed"
          style={{ color: '#5C3D1E' }}
        >
          {result.plainReadout}
        </motion.p>

        {/* 3 metric cards */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <MetricCard
            value={result.stressEstimate}
            label="of employees likely affected by financial stress"
            delay={0.55}
          />
          <MetricCard
            value="No coverage"
            label="current financial wellbeing coverage"
            delay={0.63}
          />
          <MetricCard
            value={result.primaryMetricAffected}
            label="the HR metric most at risk"
            delay={0.71}
          />
        </div>

        {/* Benchmark note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-6 text-[13px] italic leading-relaxed"
          style={{ color: '#9B7B5A' }}
        >
          {result.benchmarkNote}
        </motion.p>

        {/* One action box */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease }}
          className="rounded-xl p-5"
          style={{
            background: '#FFF8F3',
            borderLeft: '3px solid #E8634A',
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#9B7B5A' }}
          >
            One thing you can do this week
          </p>
          <p className="text-[13px] leading-[1.7]" style={{ color: '#5C3D1E' }}>
            {result.oneAction}
          </p>
        </motion.div>
      </motion.div>

      {/* Email capture — appears after 6 seconds */}
      {showEmail && (
        <EmailCapture
          result={result}
          sessionId={sessionId}
          onSuccess={handleEmailSuccess}
        />
      )}
    </div>
  )
}
