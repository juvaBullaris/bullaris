'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { trpc } from '@/lib/trpc'
import type { PracticalTopic, PersonalProfile } from '@/lib/practical-topic-types'

const STEP_LABELS_EN = ['The answer', 'Your numbers', 'Check yourself']
const STEP_LABELS_DA = ['Svaret', 'Dine tal', 'Test dig selv']

interface PracticalTopicLayoutProps {
  topic: PracticalTopic
  profile: PersonalProfile | null
}

export function PracticalTopicLayout({ topic, profile }: PracticalTopicLayoutProps) {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [step, setStep] = useState(0) // 0=answer+why, 1=calculator, 2=quiz, 3=done
  const [openCard, setOpenCard] = useState<number | null>(null)
  const [quizIdx, setQuizIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(topic.quiz.length).fill(null))

  const utils = trpc.useUtils()
  const markComplete = trpc.learning.markComplete.useMutation({
    onSuccess: () => utils.learning.myProgress.invalidate(),
  })

  const steps = en ? STEP_LABELS_EN : STEP_LABELS_DA
  const tldr = topic.tldrFn(profile)
  const score = answers.filter((a, i) => a === topic.quiz[i]?.correct).length

  function answerQuiz(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    const next = [...answers]
    next[quizIdx] = idx
    setAnswers(next)
  }

  function nextQuestion() {
    if (quizIdx < topic.quiz.length - 1) {
      setQuizIdx(quizIdx + 1)
      setSelected(null)
    } else {
      markComplete.mutate({ content_id: `practical-${topic.id}` })
      setStep(3)
    }
  }

  const Calculator = topic.Calculator

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/learning"
          className="text-sm flex items-center gap-1 mb-4 hover:underline"
          style={{ color: '#9B8B7E' }}
        >
          ← {en ? 'Back to Learning' : 'Tilbage til Læring'}
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">{topic.icon}</span>
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E0F00' }}>
            {en ? topic.question.en : topic.question.da}
          </h1>
        </div>
        <p className="text-sm ml-10" style={{ color: '#9B8B7E' }}>
          {topic.mins} · {en ? 'Interactive' : 'Interaktiv'}
        </p>
      </div>

      {/* Progress bar */}
      {step < 3 && (
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ background: i <= step ? '#E8634A' : '#EDE0D4' }}
              />
              <p
                className="text-xs mt-1.5 font-medium truncate"
                style={{ color: i === step ? '#E8634A' : '#9B8B7E' }}
              >
                {s}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 0: TL;DR + Why Cards ─────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5">
          {/* TL;DR */}
          <div
            className="rounded-2xl p-6"
            style={{ background: '#FFF8F3', border: '2px solid #E8634A30' }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ color: '#E8634A' }}
            >
              {en ? 'The short answer' : 'Det korte svar'}
            </p>
            <p className="text-base leading-relaxed font-medium" style={{ color: '#1E0F00' }}>
              {en ? tldr.en : tldr.da}
            </p>
            {profile && (
              <p className="text-xs mt-2" style={{ color: '#9B8B7E' }}>
                {en ? '✦ Based on your profile' : '✦ Baseret på din profil'}
              </p>
            )}
          </div>

          {/* Why cards */}
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: '#1E0F00' }}>
              {en ? 'How it works' : 'Sådan fungerer det'}
            </p>
            <div className="space-y-2">
              {topic.whyCards.map((card, i) => {
                const isOpen = openCard === i
                return (
                  <button
                    key={i}
                    onClick={() => setOpenCard(isOpen ? null : i)}
                    className="w-full text-left rounded-xl overflow-hidden transition-all"
                    style={{
                      border: `1px solid ${isOpen ? '#E8634A40' : '#EDE0D4'}`,
                      background: isOpen ? '#FFF8F3' : '#fff',
                    }}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="text-xl flex-shrink-0">{card.icon}</span>
                      <p className="text-sm font-medium flex-1 text-left" style={{ color: '#1E0F00' }}>
                        {en ? card.title.en : card.title.da}
                      </p>
                      <span
                        className="text-sm transition-transform flex-shrink-0"
                        style={{
                          color: '#9B8B7E',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        ▾
                      </span>
                    </div>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1">
                        <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
                          {en ? card.body.en : card.body.da}
                        </p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Calculator ───────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm mb-2" style={{ color: '#6B5C52' }}>
            {en
              ? 'Adjust the inputs to see your personalised numbers.'
              : 'Juster inputfelterne for at se dine personlige tal.'}
          </p>
          <Calculator profile={profile} />
        </div>
      )}

      {/* ── STEP 2: Quiz ─────────────────────────────────────────────────────── */}
      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold" style={{ color: '#1E0F00' }}>
              {en
                ? `Question ${quizIdx + 1} / ${topic.quiz.length}`
                : `Spørgsmål ${quizIdx + 1} / ${topic.quiz.length}`}
            </h2>
            <div className="flex gap-2">
              {topic.quiz.map((q, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    background:
                      answers[i] !== null
                        ? answers[i] === q.correct ? '#5B8A6B' : '#E8634A'
                        : i === quizIdx ? '#1E0F00' : '#EDE0D4',
                  }}
                />
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 mb-5"
            style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
          >
            <p className="font-medium" style={{ color: '#1E0F00' }}>
              {en ? topic.quiz[quizIdx].en : topic.quiz[quizIdx].da}
            </p>
          </div>

          <div className="space-y-3 mb-5">
            {topic.quiz[quizIdx].options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === topic.quiz[quizIdx].correct
              let bg = '#FFF8F3', border = '#EDE0D4', color = '#1E0F00'
              if (selected !== null) {
                if (isCorrect) { bg = '#F0FBF5'; border = '#5B8A6B'; color = '#2D5C3E' }
                else if (isSelected && !isCorrect) { bg = '#FFF0EC'; border = '#E8634A'; color = '#C0392B' }
              }
              return (
                <button
                  key={i}
                  onClick={() => answerQuiz(i)}
                  disabled={selected !== null}
                  className="w-full text-left rounded-xl px-5 py-4 text-sm font-medium transition-all"
                  style={{ background: bg, border: `2px solid ${border}`, color }}
                >
                  <span className="mr-3 font-bold opacity-40">{String.fromCharCode(65 + i)}.</span>
                  {en ? opt.en : opt.da}
                  {selected !== null && isCorrect && <span className="float-right">✓</span>}
                  {selected !== null && isSelected && !isCorrect && <span className="float-right">✗</span>}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <>
              <div
                className="rounded-xl p-4 text-sm mb-4"
                style={{
                  background: selected === topic.quiz[quizIdx].correct ? '#F0FBF5' : '#FFF0EC',
                  border: `1px solid ${selected === topic.quiz[quizIdx].correct ? '#5B8A6B' : '#E8634A'}`,
                  color: selected === topic.quiz[quizIdx].correct ? '#2D5C3E' : '#C0392B',
                }}
              >
                {selected === topic.quiz[quizIdx].correct ? '✓ ' : '✗ '}
                {en ? topic.quiz[quizIdx].explanationEn : topic.quiz[quizIdx].explanationDa}
              </div>
              <button
                onClick={nextQuestion}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white"
                style={{ background: '#E8634A' }}
              >
                {quizIdx < topic.quiz.length - 1
                  ? (en ? 'Next question →' : 'Næste spørgsmål →')
                  : (en ? 'See my score →' : 'Se min score →')}
              </button>
            </>
          )}

          {selected === null && (
            <p className="text-xs text-center" style={{ color: '#9B8B7E' }}>
              {en ? 'Select an answer to continue' : 'Vælg et svar for at fortsætte'}
            </p>
          )}
        </div>
      )}

      {/* ── STEP 3: Done ─────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="text-center py-10">
          <div className="text-6xl mb-5">
            {score === topic.quiz.length ? '🎉' : score >= 2 ? '👍' : '📚'}
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#1E0F00' }}>
            {en ? `${score} / ${topic.quiz.length} correct` : `${score} / ${topic.quiz.length} rigtige`}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6B5C52' }}>
            {score === topic.quiz.length
              ? (en ? 'Perfect score!' : 'Perfekt score!')
              : score >= 2
              ? (en ? 'Well done — you got the key points.' : 'Godt gået — du fangede de vigtigste pointer.')
              : (en ? 'Review the explanations above and try again.' : 'Gennemgå forklaringerne ovenfor og prøv igen.')}
          </p>

          {/* Score breakdown */}
          <div
            className="rounded-2xl p-5 mb-8 text-left space-y-2 max-w-sm mx-auto"
            style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
          >
            {topic.quiz.map((q, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: answers[i] === q.correct ? '#5B8A6B' : '#E8634A' }}
                >
                  {answers[i] === q.correct ? '✓' : '✗'}
                </span>
                <span style={{ color: '#3D2B1F' }}>{en ? q.en : q.da}</span>
              </div>
            ))}
          </div>

          {/* Action CTA */}
          <div className="max-w-sm mx-auto mb-6">
            <p className="text-xs font-medium mb-2" style={{ color: '#9B8B7E' }}>
              {en ? 'PUT IT INTO PRACTICE' : 'BRUG DET I PRAKSIS'}
            </p>
            {topic.action.external ? (
              <a
                href={topic.action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:opacity-90"
                style={{ background: '#E8634A10', border: '1.5px solid #E8634A40' }}
              >
                <div>
                  <p className="font-semibold text-sm text-left" style={{ color: '#1E0F00' }}>
                    {topic.action.icon} {en ? topic.action.cta.en : topic.action.cta.da}
                  </p>
                </div>
                <span style={{ color: '#E8634A' }}>↗</span>
              </a>
            ) : topic.action.href ? (
              <Link
                href={topic.action.href}
                className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:opacity-90"
                style={{ background: '#E8634A10', border: '1.5px solid #E8634A40' }}
              >
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1E0F00' }}>
                    {topic.action.icon} {en ? topic.action.cta.en : topic.action.cta.da}
                  </p>
                </div>
                <span style={{ color: '#E8634A' }}>→</span>
              </Link>
            ) : null}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setStep(0)
                setQuizIdx(0)
                setSelected(null)
                setAnswers(Array(topic.quiz.length).fill(null))
                setOpenCard(null)
              }}
              className="rounded-xl px-6 py-3 text-sm font-medium border"
              style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
            >
              {en ? 'Start over' : 'Start forfra'}
            </button>
            <Link
              href="/learning"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{ background: '#1E0F00' }}
            >
              {en ? 'Back to Learning →' : 'Tilbage til Læring →'}
            </Link>
          </div>
        </div>
      )}

      {/* ── Bottom navigation ────────────────────────────────────────────────── */}
      {step < 3 && (
        <div
          className="flex justify-between items-center mt-8 pt-6"
          style={{ borderTop: '1px solid #EDE0D4' }}
        >
          <button
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
            className="rounded-xl px-5 py-2.5 text-sm font-medium border disabled:opacity-30"
            style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
          >
            ← {en ? 'Previous' : 'Forrige'}
          </button>

          {step < 2 && (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: '#E8634A' }}
            >
              {step === 1
                ? (en ? 'Take the quiz →' : 'Tag quizzen →')
                : (en ? 'Your numbers →' : 'Dine tal →')}
            </button>
          )}

          {step === 2 && (
            <span className="text-xs" style={{ color: '#9B8B7E' }}>
              {en ? 'Answer to continue' : 'Besvar for at fortsætte'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
