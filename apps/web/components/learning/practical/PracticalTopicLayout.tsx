'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import MuxPlayer from '@mux/mux-player-react'
import { useLanguage } from '@/lib/language-context'
import { trpc } from '@/lib/trpc'
import type { PracticalTopic, PersonalProfile, TopicVideo } from '@/lib/practical-topic-types'

interface Props {
  topic: PracticalTopic
  profile: PersonalProfile | null
}

// ─── Video Reel (one at a time, TikTok-style) ────────────────────────────────

function VideoReel({
  videos,
  en,
  onAllWatched,
}: {
  videos: TopicVideo[]
  en: boolean
  onAllWatched: () => void
}) {
  const [idx, setIdx] = useState(0)
  const [allDone, setAllDone] = useState(false)
  const vid = videos[idx]
  const isLast = idx === videos.length - 1
  const mins = Math.floor(vid.durationSecs / 60)
  const secs = vid.durationSecs % 60
  const duration = `${mins}:${String(secs).padStart(2, '0')}`

  function advance() {
    if (isLast) {
      setAllDone(true)
      onAllWatched()
    } else {
      setIdx((i) => i + 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Video card — full-width, 9:16 */}
      <div
        className="relative w-full rounded-3xl overflow-hidden"
        style={{ aspectRatio: '9/16', maxHeight: '78vh', background: '#1E0F00' }}
      >
        {vid.muxPlaybackId ? (
          <MuxPlayer
            playbackId={vid.muxPlaybackId}
            streamType="on-demand"
            style={{ width: '100%', height: '100%' }}
          />
        ) : (
          /* ── Placeholder ── */
          <>
            {/* Top bar */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-5">
              <span className="text-xs font-semibold" style={{ color: '#6B5C52' }}>
                {idx + 1} / {videos.length}
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{ background: '#ffffff12', color: '#9B8B7E' }}
              >
                {duration}
              </span>
            </div>

            {/* Center play icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: '#ffffff0c', border: '1.5px solid #ffffff18' }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M7 5l13 7-13 7V5z" fill="#ffffff40" />
                </svg>
              </div>
              <div
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide"
                style={{ background: '#E8634A18', color: '#E8634A', border: '1px solid #E8634A35' }}
              >
                {en ? 'Coming soon' : 'Kommer snart'}
              </div>
            </div>

            {/* Bottom gradient overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-24"
              style={{ background: 'linear-gradient(to top, #1E0F00f5 0%, #1E0F0088 60%, transparent 100%)' }}
            >
              <p className="text-base font-bold leading-snug mb-1.5" style={{ color: '#FFF8F3' }}>
                {en ? vid.title.en : vid.title.da}
              </p>
              <p className="text-sm leading-snug" style={{ color: '#9B8B7E' }}>
                {en ? vid.hook.en : vid.hook.da}
              </p>
            </div>
          </>
        )}

        {/* Navigation overlay — bottom of card */}
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
          {/* Prev arrow */}
          <button
            onClick={() => setIdx((i) => Math.max(0, i - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-opacity"
            style={{
              background: '#ffffff18',
              color: '#FFF8F3',
              opacity: idx === 0 ? 0 : 1,
              pointerEvents: idx === 0 ? 'none' : 'auto',
            }}
            aria-label="Previous video"
          >
            ←
          </button>

          {/* Next / Continue CTA */}
          <button
            onClick={advance}
            className="rounded-2xl px-6 py-3 text-sm font-bold transition-transform active:scale-95"
            style={{ background: '#E8634A', color: '#fff' }}
          >
            {isLast
              ? (en ? 'Continue ↓' : 'Fortsæt ↓')
              : (en ? 'Next →' : 'Næste →')}
          </button>
        </div>
      </div>

      {/* Progress dots */}
      {videos.length > 1 && (
        <div className="flex gap-2 items-center">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all duration-200"
              style={{
                width: i === idx ? 24 : 8,
                height: 8,
                background: i === idx ? '#E8634A' : '#EDE0D4',
              }}
              aria-label={`Video ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Continue gate — only shows after all videos watched */}
      {allDone && (
        <a
          href="#lesson"
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all active:scale-95"
          style={{ background: '#1E0F00', color: '#FFF8F3' }}
        >
          {en ? '↓ Read the lesson' : '↓ Læs lektionen'}
        </a>
      )}
    </div>
  )
}

// ─── Lesson + Key concepts (merged) ──────────────────────────────────────────

function LessonBlock({ topic, en }: { topic: PracticalTopic; en: boolean }) {
  const { lesson, whyCards } = topic
  const [expanded, setExpanded] = useState(false)
  const [openCard, setOpenCard] = useState<number | null>(null)

  if (!lesson) return null

  const firstPara = lesson.paragraphs[0]
  const restParas = lesson.paragraphs.slice(1)

  return (
    <section id="lesson" className="scroll-mt-6 space-y-5">
      {/* Section label */}
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9B8B7E' }}>
        {en ? 'The lesson' : 'Lektionen'}
      </p>

      {/* Headline */}
      <h2 className="text-xl font-bold leading-snug" style={{ color: '#1E0F00', fontFamily: 'Georgia, serif' }}>
        {en ? lesson.headline.en : lesson.headline.da}
      </h2>

      {/* Stat callout — always visible */}
      {lesson.highlight && (
        <div
          className="rounded-2xl px-6 py-5 flex items-center gap-5"
          style={{ background: '#1E0F00' }}
        >
          <p className="text-4xl font-black leading-none shrink-0" style={{ color: '#E8634A', fontVariantNumeric: 'tabular-nums' }}>
            {lesson.highlight.stat}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#9B8B7E' }}>
            {en ? lesson.highlight.label.en : lesson.highlight.label.da}
          </p>
        </div>
      )}

      {/* First paragraph — always visible */}
      <p className="text-base leading-relaxed" style={{ color: '#3D2B1F' }}>
        {en ? firstPara.en : firstPara.da}
      </p>

      {/* Expandable rest */}
      {restParas.length > 0 && (
        <>
          {expanded ? (
            <div className="space-y-4">
              {restParas.map((p, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: '#3D2B1F' }}>
                  {en ? p.en : p.da}
                </p>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="text-sm font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70"
              style={{ color: '#E8634A' }}
            >
              {en ? 'Keep reading ↓' : 'Læs videre ↓'}
            </button>
          )}
        </>
      )}

      {/* Key concepts — the why cards, integrated as expandable FAQ */}
      <div className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9B8B7E' }}>
          {en ? 'Key concepts' : 'Nøglebegreber'}
        </p>
        <div className="space-y-2">
          {whyCards.map((card, i) => {
            const isOpen = openCard === i
            return (
              <button
                key={i}
                onClick={() => setOpenCard(isOpen ? null : i)}
                className="w-full text-left rounded-xl overflow-hidden transition-all"
                style={{
                  border: `1px solid ${isOpen ? '#E8634A50' : '#EDE0D4'}`,
                  background: isOpen ? '#FFF8F3' : '#FDFAF7',
                }}
              >
                <div className="flex items-center gap-3 px-4 py-4">
                  <span className="text-xl shrink-0">{card.icon}</span>
                  <p className="text-sm font-semibold flex-1 leading-snug" style={{ color: '#1E0F00' }}>
                    {en ? card.title.en : card.title.da}
                  </p>
                  <span
                    className="text-xs shrink-0 transition-transform duration-200"
                    style={{
                      color: '#9B8B7E',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      display: 'inline-block',
                    }}
                  >
                    ▾
                  </span>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4" style={{ borderTop: '1px solid #EDE0D4' }}>
                    <p className="text-sm leading-relaxed pt-3" style={{ color: '#3D2B1F' }}>
                      {en ? card.body.en : card.body.da}
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue gate */}
      <a
        href="#calculator"
        className="flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all active:scale-95"
        style={{ background: '#F5F0EB', color: '#1E0F00' }}
      >
        {en ? '↓ Try the calculator' : '↓ Prøv beregneren'}
      </a>
    </section>
  )
}

// ─── Calculator modal ─────────────────────────────────────────────────────────

function CalculatorSection({ topic, profile, en }: { topic: PracticalTopic; profile: PersonalProfile | null; en: boolean }) {
  const [open, setOpen] = useState(false)
  const Calculator = topic.Calculator

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <section id="calculator" className="scroll-mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
        {en ? 'Your numbers' : 'Dine tal'}
      </p>

      {/* Preview card — opens modal on click */}
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl p-6 text-left transition-all hover:opacity-90 active:scale-[0.99] group"
        style={{ background: '#1E0F00', border: '1px solid #2D1B0E' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-bold mb-1.5" style={{ color: '#FFF8F3' }}>
              {en ? 'Open calculator' : 'Åbn beregner'}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#6B5C52' }}>
              {profile
                ? (en ? 'Pre-filled with your profile. Adjust and explore.' : 'Forudfyldt med din profil. Juster og udforsk.')
                : (en ? 'Enter your numbers. See the real impact.' : 'Indtast dine tal. Se den reelle effekt.')}
            </p>
          </div>
          <span
            className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-lg transition-transform group-hover:translate-x-0.5"
            style={{ background: '#E8634A', color: '#fff' }}
          >
            →
          </span>
        </div>
      </button>

      {/* Continue to quiz */}
      <a
        href="#quiz"
        className="mt-3 flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all active:scale-95"
        style={{ background: '#F5F0EB', color: '#1E0F00' }}
      >
        {en ? '↓ Test yourself' : '↓ Test dig selv'}
      </a>

      {/* Full-screen modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: '#FFF8F3' }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid #EDE0D4', background: '#FFF8F3' }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9B8B7E' }}>
                {en ? 'Your numbers' : 'Dine tal'}
              </p>
              <p className="text-sm font-bold" style={{ color: '#1E0F00' }}>
                {en ? topic.question.en : topic.question.da}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-opacity hover:opacity-70"
              style={{ background: '#F5F0EB', color: '#1E0F00' }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Modal content — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <Calculator profile={profile} />
          </div>

          {/* Modal footer */}
          <div className="shrink-0 px-5 py-4" style={{ borderTop: '1px solid #EDE0D4' }}>
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-2xl py-4 text-sm font-bold"
              style={{ background: '#1E0F00', color: '#FFF8F3' }}
            >
              {en ? 'Done — close calculator' : 'Færdig — luk beregner'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

// ─── Quiz — one card at a time ────────────────────────────────────────────────

function QuizSection({
  topic,
  en,
  onComplete,
}: {
  topic: PracticalTopic
  en: boolean
  onComplete: (score: number) => void
}) {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<(number | null)[]>(Array(topic.quiz.length).fill(null))
  const [answered, setAnswered] = useState(false)
  const [done, setDone] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const q = topic.quiz[step]
  const selection = selections[step]
  const isCorrect = selection === q.correct
  const isLast = step === topic.quiz.length - 1

  function pick(optIdx: number) {
    if (selections[step] !== null) return
    const next = [...selections]
    next[step] = optIdx
    setSelections(next)
    setAnswered(true)
  }

  function advance() {
    if (isLast) {
      const score = selections.filter((s, i) => s === topic.quiz[i].correct).length
      setDone(true)
      onComplete(score)
    } else {
      setStep((s) => s + 1)
      setAnswered(false)
      // Scroll card into view
      setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
  }

  if (done) return null

  return (
    <div ref={cardRef} className="space-y-4 scroll-mt-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#EDE0D4' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((step + (answered ? 1 : 0)) / topic.quiz.length) * 100}%`, background: '#E8634A' }}
          />
        </div>
        <span className="text-xs font-semibold shrink-0" style={{ color: '#9B8B7E' }}>
          {step + 1} / {topic.quiz.length}
        </span>
      </div>

      {/* Question card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1.5px solid #EDE0D4' }}
      >
        <div className="px-6 py-5" style={{ background: '#FFF8F3' }}>
          <p className="text-base font-bold leading-snug" style={{ color: '#1E0F00' }}>
            {en ? q.en : q.da}
          </p>
        </div>

        {/* Options */}
        <div className="p-4 space-y-2.5" style={{ background: '#fff' }}>
          {q.options.map((opt, oIdx) => {
            const isSelected = selection === oIdx
            const isAnswer = oIdx === q.correct
            let bg = '#FDFAF7'
            let border = '#EDE0D4'
            let textColor = '#1E0F00'

            if (answered) {
              if (isAnswer) { bg = '#F0FBF5'; border = '#5B8A6B'; textColor = '#1E4530' }
              else if (isSelected) { bg = '#FFF0EC'; border = '#E8634A'; textColor = '#7A1E10' }
            }

            return (
              <button
                key={oIdx}
                onClick={() => pick(oIdx)}
                disabled={answered}
                className="w-full text-left rounded-xl px-4 py-3.5 text-sm font-medium flex items-center gap-3 transition-all"
                style={{ background: bg, border: `1.5px solid ${border}`, color: textColor }}
              >
                <span
                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: answered && isAnswer
                      ? '#5B8A6B'
                      : answered && isSelected
                      ? '#E8634A'
                      : '#EDE0D4',
                    color: answered && (isAnswer || isSelected) ? '#fff' : '#9B8B7E',
                  }}
                >
                  {answered && isAnswer ? '✓' : answered && isSelected && !isAnswer ? '✗' : String.fromCharCode(65 + oIdx)}
                </span>
                <span className="flex-1 leading-snug">{en ? opt.en : opt.da}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation */}
        {answered && (
          <div
            className="px-5 py-4 text-sm leading-relaxed"
            style={{
              background: isCorrect ? '#F0FBF5' : '#FFF5F3',
              color: isCorrect ? '#1E4530' : '#6B1810',
              borderTop: `1px solid ${isCorrect ? '#C8E6D2' : '#F5C6BB'}`,
            }}
          >
            <span className="font-bold">{isCorrect ? (en ? '✓ Correct. ' : '✓ Rigtigt. ') : (en ? '✗ Not quite. ' : '✗ Ikke helt. ')}</span>
            {en ? q.explanationEn : q.explanationDa}
          </div>
        )}
      </div>

      {/* Next button — only shown after answering */}
      {answered && (
        <button
          onClick={advance}
          className="w-full rounded-2xl py-4 text-sm font-bold transition-all active:scale-95"
          style={{ background: '#1E0F00', color: '#FFF8F3' }}
        >
          {isLast
            ? (en ? 'See my results →' : 'Se mine resultater →')
            : (en ? 'Next question →' : 'Næste spørgsmål →')}
        </button>
      )}
    </div>
  )
}

// ─── Done / results ───────────────────────────────────────────────────────────

function DoneCard({ topic, score, en, onRetake }: { topic: PracticalTopic; score: number; en: boolean; onRetake: () => void }) {
  const pct = score / topic.quiz.length

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid #EDE0D4' }}>
      {/* Score header */}
      <div
        className="px-6 py-8 text-center"
        style={{ background: pct === 1 ? '#F0FBF5' : '#FFF8F3' }}
      >
        <div className="text-5xl mb-3">
          {pct === 1 ? '🎉' : pct >= 0.67 ? '👍' : '📚'}
        </div>
        <p className="text-2xl font-black mb-1" style={{ color: '#1E0F00' }}>
          {score} / {topic.quiz.length}
        </p>
        <p className="text-sm" style={{ color: '#6B5C52' }}>
          {pct === 1
            ? (en ? 'Perfect. You got it all.' : 'Perfekt. Du forstod det hele.')
            : pct >= 0.67
            ? (en ? 'Solid — you have the key points.' : 'Godt — du har de vigtigste pointer.')
            : (en ? 'Worth reading the lesson again before you continue.' : 'Værd at læse lektionen igen før du fortsætter.')}
        </p>
      </div>

      {/* Action */}
      <div className="p-5 space-y-3" style={{ background: '#fff' }}>
        {topic.action.href && (
          topic.action.external ? (
            <a
              href={topic.action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl px-5 py-4 hover:opacity-90 transition-all"
              style={{ background: '#E8634A', color: '#fff' }}
            >
              <span className="font-bold text-sm">
                {topic.action.icon} {en ? topic.action.cta.en : topic.action.cta.da}
              </span>
              <span>↗</span>
            </a>
          ) : (
            <Link
              href={topic.action.href}
              className="flex items-center justify-between rounded-xl px-5 py-4 hover:opacity-90 transition-all"
              style={{ background: '#E8634A', color: '#fff' }}
            >
              <span className="font-bold text-sm">
                {topic.action.icon} {en ? topic.action.cta.en : topic.action.cta.da}
              </span>
              <span>→</span>
            </Link>
          )
        )}

        <div className="flex gap-2">
          <button
            onClick={onRetake}
            className="flex-1 rounded-xl py-3 text-sm font-semibold border"
            style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
          >
            {en ? 'Retake quiz' : 'Tag quizzen igen'}
          </button>
          <Link
            href="/learning"
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-center"
            style={{ background: '#1E0F00', color: '#FFF8F3' }}
          >
            {en ? 'All topics →' : 'Alle emner →'}
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function PracticalTopicLayout({ topic, profile }: Props) {
  const { locale } = useLanguage()
  const en = locale === 'en'
  const [quizScore, setQuizScore] = useState<number | null>(null)
  const [quizKey, setQuizKey] = useState(0)

  const utils = trpc.useUtils()
  const markComplete = trpc.learning.markComplete.useMutation({
    onSuccess: () => utils.learning.myProgress.invalidate(),
  })

  const tldr = topic.tldrFn(profile)

  // Persist last-visited topic so the learning hub can show "Continue"
  useEffect(() => {
    localStorage.setItem('bullaris-last-topic', JSON.stringify({
      id: topic.id,
      icon: topic.icon,
      question: topic.question,
      level: topic.level,
      href: `/learning/practical/${topic.id}`,
    }))
  }, [topic.id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleQuizComplete(score: number) {
    setQuizScore(score)
    markComplete.mutate({ content_id: `practical-${topic.id}` })
  }

  function handleRetake() {
    setQuizScore(null)
    setQuizKey((k) => k + 1)
    setTimeout(() => {
      document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  return (
    <div className="max-w-lg mx-auto space-y-10 pb-16">
      {/* ── Header ── */}
      <div>
        <Link
          href="/learning"
          className="text-sm flex items-center gap-1 mb-6 hover:opacity-70 transition-opacity"
          style={{ color: '#9B8B7E' }}
        >
          ← {en ? 'Learning' : 'Læring'}
        </Link>

        <div className="flex items-start gap-3 mb-2">
          <span className="text-3xl mt-0.5 shrink-0">{topic.icon}</span>
          <h1 className="text-xl font-bold leading-snug" style={{ color: '#1E0F00', fontFamily: 'Georgia, serif' }}>
            {en ? topic.question.en : topic.question.da}
          </h1>
        </div>
        <p className="text-sm ml-10" style={{ color: '#9B8B7E' }}>
          {topic.mins} · {topic.level}
        </p>
      </div>

      {/* ── TL;DR answer — shown first ── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#9B8B7E' }}>
          {en ? 'Short answer' : 'Kort svar'}
        </p>
        <div
          className="rounded-2xl p-5"
          style={{ background: '#FFF8F3', border: '1.5px solid #E8634A25' }}
        >
          <p className="text-base leading-relaxed font-medium" style={{ color: '#1E0F00' }}>
            {en ? tldr.en : tldr.da}
          </p>
          {profile && (
            <p className="text-xs mt-2.5 flex items-center gap-1" style={{ color: '#9B8B7E' }}>
              <span>✦</span>
              <span>{en ? 'Personalised to your profile' : 'Tilpasset din profil'}</span>
            </p>
          )}
        </div>
      </section>

      {/* ── Video reel ── */}
      {topic.videos && topic.videos.length > 0 && (
        <section id="videos" className="scroll-mt-6">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
            {en ? 'Watch' : 'Se'}
          </p>
          <VideoReel
            videos={topic.videos}
            en={en}
            onAllWatched={() => {}}
          />
        </section>
      )}

      {/* ── Lesson + key concepts ── */}
      {topic.lesson && (
        <LessonBlock topic={topic} en={en} />
      )}

      {/* ── Calculator ── */}
      <CalculatorSection topic={topic} profile={profile} en={en} />

      {/* ── Quiz ── */}
      <section id="quiz" className="scroll-mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
          {en ? 'Test yourself' : 'Test dig selv'}
        </p>

        {quizScore === null ? (
          <QuizSection
            key={quizKey}
            topic={topic}
            en={en}
            onComplete={handleQuizComplete}
          />
        ) : (
          <DoneCard
            topic={topic}
            score={quizScore}
            en={en}
            onRetake={handleRetake}
          />
        )}
      </section>

      {/* ── Further reading ── */}
      {topic.blogReads && topic.blogReads.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
            {en ? 'Further reading' : 'Videre læsning'}
          </p>
          <div className="space-y-2">
            {topic.blogReads.map((blog, i) => (
              <a
                key={i}
                href={blog.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl p-4 flex items-start gap-3 transition-opacity hover:opacity-90 active:scale-[0.99]"
                style={{ background: '#FFF8F3', border: '1.5px solid #EDE0D4' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: '#E8634A18', color: '#E8634A' }}
                    >
                      {blog.source}
                    </span>
                    <span className="text-xs" style={{ color: '#9B8B7E' }}>
                      {blog.estimatedMins} min
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug" style={{ color: '#1E0F00' }}>
                    {en ? blog.title.en : blog.title.da}
                  </p>
                  {blog.description && (
                    <p className="text-xs mt-1 leading-snug line-clamp-2" style={{ color: '#6B5C52' }}>
                      {en ? blog.description.en : blog.description.da}
                    </p>
                  )}
                </div>
                <span className="shrink-0 mt-1 text-sm" style={{ color: '#9B8B7E' }}>↗</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
