'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

const SCORE_LABELS: Record<number, { en: string; da: string; emoji: string }> = {
  1: { en: 'Very stressed', da: 'Meget stresset', emoji: '😰' },
  2: { en: 'Struggling',    da: 'Det er svært',   emoji: '😟' },
  3: { en: 'Managing',      da: 'Det går',         emoji: '😐' },
  4: { en: 'Doing well',    da: 'Det går godt',    emoji: '🙂' },
  5: { en: 'Thriving',      da: 'Jeg trives',      emoji: '😄' },
}

export function PulseModal({ onComplete }: { onComplete?: () => void }) {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const currentPeriodQuery = trpc.pulse.myCurrentPeriod.useQuery()
  const submitMutation = trpc.pulse.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true)
      currentPeriodQuery.refetch()
      setTimeout(() => { setOpen(false); onComplete?.() }, 1800)
    },
  })

  useEffect(() => {
    if (currentPeriodQuery.isLoading) return
    if (currentPeriodQuery.data !== null) return  // already submitted this month

    const visits = parseInt(localStorage.getItem('bullaris_visits') ?? '0')
    const today  = new Date()
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const isEndOfMonth = today.getDate() >= lastDay - 2

    const period     = today.toISOString().slice(0, 7)
    const dismissKey = `pulse_modal_dismissed_${period}`
    if (localStorage.getItem(dismissKey) === '1') return

    if (visits === 2 || isEndOfMonth) {
      setTimeout(() => setOpen(true), 600)
    }
  }, [currentPeriodQuery.isLoading, currentPeriodQuery.data])

  function handleDismiss() {
    const period     = new Date().toISOString().slice(0, 7)
    const dismissKey = `pulse_modal_dismissed_${period}`
    localStorage.setItem(dismissKey, '1')
    setOpen(false)
    onComplete?.()
  }

  if (!open) return null

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .pulse-modal-card { animation: modal-in 0.25s ease-out forwards; }
        @keyframes thank-you-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .thank-you { animation: thank-you-pop 0.4s ease-out forwards; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(30,15,0,0.45)' }}
        onClick={handleDismiss}
      >
        <div
          className="pulse-modal-card w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: '#FFF8F3' }}
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="thank-you flex flex-col items-center justify-center gap-3 px-8 py-12 text-center">
              <span className="text-5xl">🌟</span>
              <p className="text-lg font-bold" style={{ color: '#1E0F00', fontFamily: 'Georgia, serif' }}>
                {en ? 'Thanks for checking in' : 'Tak for tilbagemeldingen'}
              </p>
              <p className="text-sm" style={{ color: '#9B8B7E' }}>
                {en ? "We'll track this over time to show you your progress." : 'Vi følger dette over tid for at vise dig din fremgang.'}
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 pt-7 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-2xl">💬</span>
                  <button
                    onClick={handleDismiss}
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ color: '#9B8B7E', background: '#EDE0D4' }}
                  >
                    {en ? 'Skip' : 'Spring over'}
                  </button>
                </div>
                <h2 className="text-lg font-bold mt-3 leading-snug" style={{ color: '#1E0F00', fontFamily: 'Georgia, serif' }}>
                  {en ? 'How financially secure do you feel this month?' : 'Hvor finansielt tryg føler du dig denne måned?'}
                </h2>
                <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
                  {en ? 'Takes 10 seconds · Only you can see this' : 'Tager 10 sekunder · Kun du kan se dette'}
                </p>
              </div>

              {/* Score buttons */}
              <div className="px-6 pb-2">
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = selected === n
                    const label  = SCORE_LABELS[n]
                    return (
                      <button
                        key={n}
                        onClick={() => setSelected(n)}
                        className="flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl transition-all"
                        style={{
                          background: active ? '#1E0F00' : '#F5EFE9',
                          border: active ? '2px solid #1E0F00' : '2px solid transparent',
                        }}
                      >
                        <span className="text-xl">{label.emoji}</span>
                        <span className="text-[10px] font-semibold leading-none" style={{ color: active ? '#FFF8F3' : '#9B8B7E' }}>
                          {n}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <div className="flex justify-between text-[10px] mb-5" style={{ color: '#C8BDB5' }}>
                  <span>{en ? 'Very stressed' : 'Meget stresset'}</span>
                  <span>{en ? 'Thriving' : 'Trives'}</span>
                </div>

                {selected && (
                  <p className="text-sm font-medium text-center mb-4" style={{ color: '#6B5C52' }}>
                    {en ? SCORE_LABELS[selected].en : SCORE_LABELS[selected].da}
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="px-6 pb-7">
                <button
                  disabled={selected === null || submitMutation.isPending}
                  onClick={() => selected && submitMutation.mutate({ score: selected })}
                  className="w-full rounded-2xl py-3.5 text-sm font-bold text-white disabled:opacity-40 transition"
                  style={{ background: '#E8634A' }}
                >
                  {submitMutation.isPending
                    ? '...'
                    : en ? 'Submit →' : 'Send →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
