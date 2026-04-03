'use client'

import { useState, useEffect } from 'react'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export function PulseSurveyCard() {
  const { t } = useLanguage()
  const [dismissed, setDismissed] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const period = new Date().toISOString().slice(0, 7)
  const dismissKey = `pulse_dismissed_${period}`

  const currentPeriodQuery = trpc.pulse.myCurrentPeriod.useQuery()
  const submitMutation = trpc.pulse.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true)
      currentPeriodQuery.refetch()
    },
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDismissed(localStorage.getItem(dismissKey) === '1')
    }
  }, [dismissKey])

  function handleDismiss() {
    localStorage.setItem(dismissKey, '1')
    setDismissed(true)
  }

  // Hide if: dismissed, loading, already submitted this month, or just submitted
  if (dismissed) return null
  if (currentPeriodQuery.isLoading) return null
  if (currentPeriodQuery.data !== null) return null

  if (submitted) {
    return (
      <div className="rounded-2xl p-5 mb-4 text-center" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
        <p className="text-sm font-medium" style={{ color: '#166534' }}>✓ {t.pulse.thankYou}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-5 mb-4" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>
          💬 {t.pulse.question}
        </p>
        <button
          onClick={handleDismiss}
          className="text-xs px-2 py-0.5 rounded"
          style={{ color: '#A0917F' }}
        >
          {t.pulse.dismiss}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
            style={{
              background: selected === n ? '#E8634A' : '#FDF6EE',
              color: selected === n ? '#fff' : '#6B5C52',
              border: selected === n ? '2px solid #E8634A' : '1.5px solid #EDE0D4',
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs mb-3" style={{ color: '#A0917F' }}>
        <span>Slet ikke tryg</span>
        <span>Meget tryg</span>
      </div>

      <button
        disabled={selected === null || submitMutation.isPending}
        onClick={() => selected && submitMutation.mutate({ score: selected })}
        className="w-full rounded-lg py-2 text-sm font-semibold text-white disabled:opacity-50 transition"
        style={{ background: '#E8634A' }}
      >
        {submitMutation.isPending ? '...' : t.pulse.submit}
      </button>
    </div>
  )
}
