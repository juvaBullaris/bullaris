'use client'

import { motion } from 'framer-motion'
import type { Question } from './types'

interface AuditQuestionProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  onAnswer: (value: string | number) => void
  onBack: () => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function AuditQuestion({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,
  onBack,
}: AuditQuestionProps) {
  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EDE0 40%, #EDE0D4 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: 'rgba(212,184,152,0.35)' }}>
        <motion.div
          className="h-1 rounded-full"
          style={{ background: '#E8634A' }}
          initial={{ width: `${((questionIndex) / totalQuestions) * 100}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          {/* Back + question counter */}
          <div className="mb-8 flex items-center justify-between">
            {questionIndex > 0 ? (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-sm transition-colors hover:text-stone-600"
                style={{ color: '#9B7B5A', fontFamily: "'DM Sans', sans-serif" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}
            <span
              className="text-sm font-medium"
              style={{ color: '#9B7B5A' }}
            >
              Q{questionIndex + 1} of {totalQuestions}
            </span>
          </div>

          {/* Question */}
          <h2
            className="mb-10 leading-tight"
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 'clamp(22px, 4vw, 30px)',
              fontWeight: 700,
              color: '#1E0F00',
              lineHeight: 1.2,
            }}
          >
            {question.question}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <button
                key={String(option.value)}
                onClick={() => onAnswer(option.value)}
                className="group w-full rounded-2xl p-4 text-left transition-all"
                style={{
                  background: 'rgba(255,255,255,0.70)',
                  border: '1.5px solid rgba(255,255,255,0.80)',
                  backdropFilter: 'blur(12px)',
                  minHeight: '56px',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.border = '1.5px solid rgba(232,99,74,0.35)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(232,99,74,0.10)'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.90)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLButtonElement).style.border = '1.5px solid rgba(255,255,255,0.80)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.70)'
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: '#2C1A0E' }}
                >
                  {option.label}
                </span>
              </button>
            ))}

            {/* Q2 sector note */}
            {question.hasSectorNote && (
              <button
                onClick={() => onAnswer('other')}
                className="text-left text-sm transition-colors hover:text-stone-700"
                style={{ color: '#9B7B5A', paddingTop: '4px', paddingLeft: '4px' }}
              >
                My sector isn't listed →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
