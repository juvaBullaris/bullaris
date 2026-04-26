'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { CelebrationBurst } from './CelebrationBurst'
import type { QuizLesson as QuizLessonData } from '@/lib/curriculum-types'

interface QuizLessonProps {
  quiz: QuizLessonData
  isCompleted: boolean
  previousScore?: number
  onComplete: (score: number) => void
}

type Phase = 'question' | 'done'

export function QuizLesson({ quiz, isCompleted, previousScore, onComplete }: QuizLessonProps) {
  const { locale } = useLanguage()
  const [phase, setPhase] = useState<Phase>('question')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(quiz.questions.length).fill(null),
  )
  const [score, setScore] = useState<number>(previousScore ?? 0)
  const [showCelebration, setShowCelebration] = useState(false)

  // Reset if quiz changes
  useEffect(() => {
    setPhase('question')
    setIdx(0)
    setAnswers(Array(quiz.questions.length).fill(null))
    setScore(previousScore ?? 0)
    setShowCelebration(false)
  }, [quiz, previousScore])

  if (quiz.questions.length === 0) {
    return (
      <div
        className="rounded-xl border p-6 flex flex-col gap-2"
        style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
      >
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
          {locale === 'da' ? 'Quiz' : 'Quiz'}
        </p>
        <p className="font-serif text-lg" style={{ color: '#1E0F00', opacity: 0.5 }}>
          {locale === 'da' ? 'Quiz — Modul' : 'Quiz — Module'}
        </p>
        <p className="text-sm" style={{ color: '#9B8B7E' }}>
          {locale === 'da' ? 'Indhold produceres snart' : 'Content coming soon'}
        </p>
      </div>
    )
  }

  function handleAnswer(optionIndex: number) {
    const updated = [...answers]
    updated[idx] = optionIndex
    setAnswers(updated)

    if (idx < quiz.questions.length - 1) {
      setTimeout(() => setIdx(idx + 1), 300)
    } else {
      const correct = quiz.questions.filter((q, i) =>
        (i === idx ? optionIndex : updated[i]) === q.correct,
      ).length
      // Count last answer
      const finalAnswers = [...updated]
      finalAnswers[idx] = optionIndex
      const finalScore = quiz.questions.filter((q, i) => finalAnswers[i] === q.correct).length

      setScore(finalScore)
      setTimeout(() => {
        setPhase('done')
        setTimeout(() => setShowCelebration(true), 150)
        onComplete(finalScore)
      }, 300)
    }
  }

  function retake() {
    setPhase('question')
    setIdx(0)
    setAnswers(Array(quiz.questions.length).fill(null))
    setScore(0)
    setShowCelebration(false)
  }

  if (phase === 'done') {
    const total = quiz.questions.length
    const pct = Math.round((score / total) * 100)

    return (
      <div className="flex flex-col gap-6 relative">
        <CelebrationBurst
          active={showCelebration}
          variant="large"
          onComplete={() => setShowCelebration(false)}
        />

        {/* Score card */}
        <div
          className="rounded-xl border p-6 flex flex-col items-center gap-2 text-center"
          style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-1"
            style={{
              background: pct >= 70 ? '#5B8A6B' : '#E8634A',
              color: '#fff',
            }}
          >
            {pct}%
          </div>
          <p className="font-serif text-xl" style={{ color: '#1E0F00' }}>
            {locale === 'da' ? 'Quiz gennemført! Fantastisk!' : 'Quiz complete! Well done!'}
          </p>
          <p className="text-sm" style={{ color: '#9B8B7E' }}>
            {locale === 'da'
              ? `${score} af ${total} rigtige`
              : `${score} of ${total} correct`}
          </p>
        </div>

        {/* Per-question breakdown */}
        <div className="flex flex-col gap-3">
          {quiz.questions.map((q, i) => {
            const userAnswer = answers[i]
            const correct = userAnswer === q.correct
            const qText = locale === 'da' ? q.da : q.en
            const explanation = locale === 'da' ? q.explanationDa : q.explanationEn
            const correctOption = locale === 'da' ? q.options[q.correct]?.da : q.options[q.correct]?.en

            return (
              <div
                key={q.id}
                className="rounded-xl border p-4 flex flex-col gap-2"
                style={{
                  borderColor: correct ? '#A3C9B0' : '#F9A87D',
                  background: correct ? '#f0faf5' : '#fff8f3',
                }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: correct ? '#5B8A6B' : '#E8634A', color: '#fff' }}
                  >
                    {correct ? '✓' : '✗'}
                  </span>
                  <p className="text-sm font-medium" style={{ color: '#1E0F00' }}>
                    {qText}
                  </p>
                </div>
                {!correct && correctOption && (
                  <p className="text-xs ml-7" style={{ color: '#5B8A6B' }}>
                    {locale === 'da' ? 'Korrekt svar:' : 'Correct answer:'}{' '}
                    <span className="font-medium">{correctOption}</span>
                  </p>
                )}
                {explanation && (
                  <p className="text-xs ml-7" style={{ color: '#9B8B7E' }}>
                    {explanation}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={retake}
          className="self-start text-sm font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: '#E8634A' }}
        >
          {locale === 'da' ? 'Tag quizzen igen' : 'Retake quiz'}
        </button>
      </div>
    )
  }

  // Question phase
  const q = quiz.questions[idx]
  const qText = locale === 'da' ? q.da : q.en
  const options = q.options.map((o) => (locale === 'da' ? o.da : o.en))

  return (
    <div className="flex flex-col gap-5">
      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {quiz.questions.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === idx ? 20 : 8,
              height: 8,
              background: i < idx ? '#5B8A6B' : i === idx ? '#E8634A' : '#EDE0D4',
            }}
          />
        ))}
        <span className="text-xs ml-2" style={{ color: '#9B8B7E' }}>
          {idx + 1} / {quiz.questions.length}
        </span>
      </div>

      {/* Question */}
      <p className="font-serif text-lg leading-snug" style={{ color: '#1E0F00' }}>
        {qText}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => {
          const selected = answers[idx] === i
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="w-full text-left rounded-xl border px-4 py-3 text-sm transition-all hover:border-orange-300"
              style={{
                borderColor: selected ? '#E8634A' : '#EDE0D4',
                background: selected ? '#FFF0EB' : '#fff',
                color: '#1E0F00',
              }}
            >
              <span
                className="inline-block w-5 h-5 rounded-full border text-xs font-bold text-center leading-5 mr-2"
                style={{
                  borderColor: selected ? '#E8634A' : '#9B8B7E',
                  color: selected ? '#E8634A' : '#9B8B7E',
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
