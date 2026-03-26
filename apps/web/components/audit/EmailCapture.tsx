'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { sendReportAction } from '@/app/actions/audit'
import type { ScoredResult } from './types'

interface EmailCaptureProps {
  result: ScoredResult
  sessionId: string
  onSuccess: (firstName: string) => void
}

const ease = [0.22, 1, 0.36, 1] as const

type Status = 'idle' | 'loading' | 'success' | 'error'

export function EmailCapture({ result, sessionId, onSuccess }: EmailCaptureProps) {
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading' || status === 'success') return

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid work email address.')
      return
    }

    setErrorMsg('')
    setStatus('loading')

    try {
      await sendReportAction({ firstName: firstName.trim() || 'there', email, result, sessionId })
      setStatus('success')
      setTimeout(() => onSuccess(firstName.trim() || ''), 1500)
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="mt-6 w-full max-w-[640px] rounded-2xl p-8"
      style={{
        background: 'rgba(255,255,255,0.70)',
        border: '1.5px solid rgba(255,255,255,0.80)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 40px rgba(92,82,70,0.10)',
      }}
    >
      <h3
        className="mb-2 text-xl font-bold"
        style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
      >
        Want the full picture?
      </h3>
      <p className="mb-6 text-sm leading-relaxed" style={{ color: '#5C3D1E' }}>
        We'll send you sector benchmarks, the estimated annual cost for your headcount, and 3
        prioritised actions mapped to your{' '}
        <span className="font-semibold">{result.primaryMetricAffected}</span> goals.
      </p>

      {status === 'success' ? (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium"
          style={{ color: '#5B8A6B' }}
        >
          Report sent to {email} — check your inbox in the next few minutes.
        </motion.p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-stone-300"
              style={{
                background: '#fff',
                borderColor: 'rgba(212,184,152,0.6)',
                color: '#1E0F00',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
            <input
              type="email"
              placeholder="your@company.dk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-stone-300"
              style={{
                background: '#fff',
                borderColor: 'rgba(212,184,152,0.6)',
                color: '#1E0F00',
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          </div>

          {errorMsg && (
            <p className="text-xs" style={{ color: '#C04830' }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #E8634A, #C04830)' }}
          >
            {status === 'loading' ? 'Sending...' : 'Send me the full report'}
            {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="text-center text-[11px]" style={{ color: '#9B7B5A' }}>
            No sales calls unless you ask for one. Unsubscribe anytime.
          </p>
        </form>
      )}
    </motion.div>
  )
}
