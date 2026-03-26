'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Heart } from 'lucide-react'
import { logPathChosenAction } from '@/app/actions/audit'
import type { ScoredResult } from './types'

interface BridgePageProps {
  firstName: string | null
  result: ScoredResult
  sessionId: string
}

const ease = [0.22, 1, 0.36, 1] as const

const CALENDLY_URL = 'https://calendly.com/bullaris/30min'

export function BridgePage({ firstName, result, sessionId }: BridgePageProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bullaris.dk'
  const employeeAuditUrl = `${siteUrl}/audit?ref=${sessionId}`

  async function handleChoice(path: 'employee-audit' | 'meeting', url: string) {
    await logPathChosenAction({ sessionId, path }).catch(() => {})
    window.location.href = url
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6 py-16"
      style={{
        background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EDE0 40%, #EDE0D4 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="w-full max-w-[560px]">
        {/* Logo mark only */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-12 flex justify-center"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #E8634A, #D4503A)' }}
          >
            <Heart className="h-5 w-5 fill-white text-white" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease }}
          className="mb-3 text-center text-[28px] font-bold leading-tight"
          style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
        >
          {firstName
            ? `${firstName}, here's what to do next.`
            : "Here's what to do next."}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-10 text-center text-sm leading-relaxed"
          style={{ color: '#5C3D1E' }}
        >
          Based on your{' '}
          <span
            className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: result.riskTier === 'Low' ? '#5B8A6B' : result.riskTier === 'Medium' ? '#D4993A' : result.riskTier === 'High' ? '#E8634A' : '#C03030' }}
          >
            {result.riskTier}
          </span>{' '}
          risk score, there are two ways we can help you move forward.
        </motion.p>

        {/* Choice A — Recommended */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease }}
          className="mb-4 rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.75)',
            border: '1.5px solid rgba(255,255,255,0.80)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(92,58,30,0.09)',
          }}
        >
          {/* Badge */}
          <div className="mb-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: '#E8634A' }}
            >
              Recommended next step
            </span>
          </div>

          <h2
            className="mb-3 text-lg font-bold"
            style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
          >
            See how your employees actually feel
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: '#5C3D1E' }}>
            Share a private 3-minute audit with your team. Completely anonymous — you see aggregate
            results only. When 10 or more respond, we'll prepare a full team report for your meeting
            with us.
          </p>

          <button
            onClick={() => handleChoice('employee-audit', employeeAuditUrl)}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #E8634A, #C04830)' }}
          >
            Get the employee audit link
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-3 text-center text-[11px]" style={{ color: '#9B7B5A' }}>
            Takes 30 seconds to set up. Free.
          </p>
        </motion.div>

        {/* Choice B — Talk with us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease }}
          className="mb-8 rounded-2xl p-8"
          style={{
            background: 'rgba(255,255,255,0.55)',
            border: '1.5px solid rgba(212,184,152,0.5)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <h2
            className="mb-3 text-lg font-bold"
            style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
          >
            Talk through your results with us
          </h2>
          <p className="mb-6 text-sm leading-relaxed" style={{ color: '#5C3D1E' }}>
            Book a 30-minute call. We'll walk through your score, what it means for your{' '}
            <span className="font-semibold">{result.primaryMetricAffected}</span> goals, and what a
            pilot would look like at your company size.
          </p>

          <button
            onClick={() => handleChoice('meeting', CALENDLY_URL)}
            className="flex w-full items-center justify-center rounded-xl border py-3.5 text-sm font-semibold transition-all hover:bg-amber-50"
            style={{ borderColor: '#D4B898', color: '#6B4C2A' }}
          >
            Book a conversation
          </button>

          <p className="mt-3 text-center text-[11px]" style={{ color: '#9B7B5A' }}>
            No commitment. No pitch deck.
          </p>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-center text-[12px]"
          style={{ color: '#9B7B5A' }}
        >
          Either path is free. No commitment required at any stage.
        </motion.p>
      </div>
    </div>
  )
}
