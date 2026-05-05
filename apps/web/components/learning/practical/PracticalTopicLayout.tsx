'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import MuxPlayer from '@mux/mux-player-react'
import { useLanguage } from '@/lib/language-context'
import { trpc } from '@/lib/trpc'
import type { PracticalTopic, PersonalProfile, TopicVideo, TopicLesson } from '@/lib/practical-topic-types'

interface Props {
  topic: PracticalTopic
  profile: PersonalProfile | null
}

// ─── Video section ────────────────────────────────────────────────────────────

function VideoCard({ video, en }: { video: TopicVideo; en: boolean }) {
  const mins = Math.floor(video.durationSecs / 60)
  const secs = video.durationSecs % 60
  const duration = mins > 0 ? `${mins}:${String(secs).padStart(2, '0')}` : `0:${String(secs).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-3 w-full" style={{ maxWidth: 300 }}>
      {video.muxPlaybackId ? (
        /* ── Live video via Mux ── */
        <div className="rounded-2xl overflow-hidden w-full" style={{ aspectRatio: '9/16' }}>
          <MuxPlayer
            playbackId={video.muxPlaybackId}
            streamType="on-demand"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ) : (
        /* ── Coming-soon placeholder ── */
        <div
          className="rounded-2xl w-full relative overflow-hidden flex flex-col items-center justify-center"
          style={{ aspectRatio: '9/16', background: '#1E0F00' }}
        >
          {/* Duration badge */}
          <div
            className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: '#ffffff18', color: '#FFF8F3' }}
          >
            {duration}
          </div>

          {/* Play circle */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: '#ffffff12', border: '2px solid #ffffff22' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5.14v14l11-7-11-7z" fill="#ffffff55" />
            </svg>
          </div>

          {/* Coming soon chip */}
          <div
            className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
            style={{ background: '#E8634A20', color: '#E8634A', border: '1px solid #E8634A40' }}
          >
            {en ? 'Coming soon' : 'Kommer snart'}
          </div>

          {/* Title overlay at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8"
            style={{ background: 'linear-gradient(to top, #1E0F00ee, transparent)' }}
          >
            <p className="text-sm font-semibold leading-snug" style={{ color: '#FFF8F3' }}>
              {en ? video.title.en : video.title.da}
            </p>
          </div>
        </div>
      )}

      {/* Hook text below the card */}
      <p className="text-sm leading-snug" style={{ color: '#6B5C52' }}>
        {en ? video.hook.en : video.hook.da}
      </p>
    </div>
  )
}

function VideosSection({ videos, en }: { videos: TopicVideo[]; en: boolean }) {
  return (
    <section id="videos" className="scroll-mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
        {en ? 'Watch' : 'Se'}
      </p>

      {/* Responsive grid: 1 col mobile → auto-fit on desktop */}
      <div
        className="grid gap-4 justify-items-center"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(200px, ${videos.length === 1 ? '300px' : '260px'}))`,
          justifyContent: videos.length === 1 ? 'start' : 'center',
        }}
      >
        {videos.map((v) => (
          <VideoCard key={v.slug} video={v} en={en} />
        ))}
      </div>
    </section>
  )
}

// ─── Lesson section ───────────────────────────────────────────────────────────

function LessonSection({ lesson, en }: { lesson: TopicLesson; en: boolean }) {
  return (
    <section id="lesson" className="scroll-mt-6">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
        {en ? 'The lesson' : 'Lektionen'}
      </p>

      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
      >
        {/* Headline */}
        <h2 className="text-lg font-bold leading-snug" style={{ color: '#1E0F00' }}>
          {en ? lesson.headline.en : lesson.headline.da}
        </h2>

        {/* Paragraphs — optionally split around the highlight */}
        {lesson.paragraphs.map((p, i) => (
          <div key={i}>
            {/* Insert highlight stat after the first paragraph */}
            {i === 1 && lesson.highlight && (
              <div
                className="rounded-xl px-5 py-4 my-4 flex items-center gap-4"
                style={{ background: '#1E0F00' }}
              >
                <p className="text-3xl font-black font-mono leading-none" style={{ color: '#E8634A' }}>
                  {lesson.highlight.stat}
                </p>
                <p className="text-xs leading-snug flex-1" style={{ color: '#9B8B7E' }}>
                  {en ? lesson.highlight.label.en : lesson.highlight.label.da}
                </p>
              </div>
            )}
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en ? p.en : p.da}
            </p>
          </div>
        ))}

        {/* Highlight at the end if only 1 paragraph */}
        {lesson.paragraphs.length === 1 && lesson.highlight && (
          <div
            className="rounded-xl px-5 py-4 flex items-center gap-4"
            style={{ background: '#1E0F00' }}
          >
            <p className="text-3xl font-black font-mono leading-none" style={{ color: '#E8634A' }}>
              {lesson.highlight.stat}
            </p>
            <p className="text-xs leading-snug flex-1" style={{ color: '#9B8B7E' }}>
              {en ? lesson.highlight.label.en : lesson.highlight.label.da}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Main layout ──────────────────────────────────────────────────────────────

export function PracticalTopicLayout({ topic, profile }: Props) {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [openCard, setOpenCard] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(
    Array(topic.quiz.length).fill(null)
  )
  const [quizSelections, setQuizSelections] = useState<(number | null)[]>(
    Array(topic.quiz.length).fill(null)
  )
  const [quizDone, setQuizDone] = useState(false)
  const quizRef = useRef<HTMLDivElement>(null)

  const utils = trpc.useUtils()
  const markComplete = trpc.learning.markComplete.useMutation({
    onSuccess: () => utils.learning.myProgress.invalidate(),
  })

  const tldr = topic.tldrFn(profile)
  const Calculator = topic.Calculator

  function answerQuestion(qIdx: number, optIdx: number) {
    if (quizSelections[qIdx] !== null) return
    const newSelections = [...quizSelections]
    newSelections[qIdx] = optIdx
    const newAnswers = [...quizAnswers]
    newAnswers[qIdx] = optIdx
    setQuizSelections(newSelections)
    setQuizAnswers(newAnswers)

    // All answered → mark complete
    if (newAnswers.every((a) => a !== null)) {
      setTimeout(() => {
        setQuizDone(true)
        markComplete.mutate({ content_id: `practical-${topic.id}` })
      }, 600)
    }
  }

  const score = quizAnswers.filter((a, i) => a === topic.quiz[i]?.correct).length
  const visibleQuestions = quizSelections.findIndex((s) => s === null)
  const lastVisibleIdx = visibleQuestions === -1 ? topic.quiz.length - 1 : visibleQuestions

  const sectionIds = [
    ...(topic.videos ? ['videos'] : []),
    ...(topic.lesson ? ['lesson'] : []),
    'answer',
    'calculator',
    'understand',
    'quiz',
  ]

  const sectionLabels: Record<string, { en: string; da: string }> = {
    videos:     { en: 'Watch', da: 'Se' },
    lesson:     { en: 'Read', da: 'Læs' },
    answer:     { en: 'Answer', da: 'Svar' },
    calculator: { en: 'Calculate', da: 'Beregn' },
    understand: { en: 'Understand', da: 'Forstå' },
    quiz:       { en: 'Quiz', da: 'Quiz' },
  }

  return (
    <div className="max-w-2xl space-y-10">
      {/* ── Back link ── */}
      <div>
        <Link
          href="/learning"
          className="text-sm flex items-center gap-1 mb-5 hover:underline"
          style={{ color: '#9B8B7E' }}
        >
          ← {en ? 'Back to Learning' : 'Tilbage til Læring'}
        </Link>

        {/* Title */}
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">{topic.icon}</span>
          <div>
            <h1 className="font-serif text-2xl font-bold leading-tight" style={{ color: '#1E0F00' }}>
              {en ? topic.question.en : topic.question.da}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#9B8B7E' }}>
              {topic.mins} · {en ? 'Scroll to learn' : 'Scroll for at lære'}
            </p>
          </div>
        </div>

        {/* Jump nav */}
        <div className="flex gap-2 flex-wrap mt-5">
          {sectionIds.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-3 py-1 text-xs font-medium transition-all hover:opacity-80"
              style={{ background: '#F5F0EB', color: '#6B5C52' }}
            >
              {en ? sectionLabels[id].en : sectionLabels[id].da}
            </a>
          ))}
        </div>
      </div>

      {/* ── Videos ── */}
      {topic.videos && topic.videos.length > 0 && (
        <VideosSection videos={topic.videos} en={en} />
      )}

      {/* ── Written lesson ── */}
      {topic.lesson && (
        <LessonSection lesson={topic.lesson} en={en} />
      )}

      {/* ── TL;DR ── */}
      <section id="answer" className="scroll-mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
          {en ? 'The short answer' : 'Det korte svar'}
        </p>
        <div
          className="rounded-2xl p-6"
          style={{ background: '#FFF8F3', border: '2px solid #E8634A30' }}
        >
          <p className="text-base leading-relaxed font-medium" style={{ color: '#1E0F00' }}>
            {en ? tldr.en : tldr.da}
          </p>
          {profile && (
            <p className="text-xs mt-3" style={{ color: '#9B8B7E' }}>
              ✦ {en ? 'Based on your profile' : 'Baseret på din profil'}
            </p>
          )}
        </div>
      </section>

      {/* ── Calculator ── */}
      <section id="calculator" className="scroll-mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
          {en ? 'Your numbers' : 'Dine tal'}
        </p>
        <p className="text-sm mb-4" style={{ color: '#6B5C52' }}>
          {en
            ? 'Adjust the inputs — numbers update live.'
            : 'Juster inputfelterne — tallene opdateres live.'}
        </p>
        <Calculator profile={profile} />
      </section>

      {/* ── Why cards ── */}
      <section id="understand" className="scroll-mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
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
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <span className="text-xl flex-shrink-0">{card.icon}</span>
                  <p className="text-sm font-medium flex-1 text-left" style={{ color: '#1E0F00' }}>
                    {en ? card.title.en : card.title.da}
                  </p>
                  <span
                    className="text-sm flex-shrink-0 transition-transform duration-200"
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
      </section>

      {/* ── Quiz ── */}
      <section id="quiz" ref={quizRef} className="scroll-mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#9B8B7E' }}>
          {en ? 'Test yourself' : 'Test dig selv'}
        </p>

        <div className="space-y-5">
          {topic.quiz.map((q, qIdx) => {
            if (qIdx > lastVisibleIdx) return null
            const selection = quizSelections[qIdx]
            const answered = selection !== null

            return (
              <div
                key={q.id}
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid #EDE0D4' }}
              >
                {/* Question */}
                <div className="px-5 py-4" style={{ background: '#FFF8F3' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                      style={{ background: '#1E0F00', color: '#FFF8F3' }}
                    >
                      {qIdx + 1}
                    </span>
                    <p className="text-sm font-medium" style={{ color: '#1E0F00' }}>
                      {en ? q.en : q.da}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div className="p-3 space-y-2" style={{ background: '#fff' }}>
                  {q.options.map((opt, oIdx) => {
                    const isSelected = selection === oIdx
                    const isCorrect = oIdx === q.correct
                    let bg = '#FFF8F3', border = '#EDE0D4', color = '#1E0F00'
                    if (answered) {
                      if (isCorrect) { bg = '#F0FBF5'; border = '#5B8A6B'; color = '#2D5C3E' }
                      else if (isSelected) { bg = '#FFF0EC'; border = '#E8634A'; color = '#9B2D20' }
                    } else if (isSelected) {
                      bg = '#FFF0EC'; border = '#E8634A'
                    }
                    return (
                      <button
                        key={oIdx}
                        onClick={() => answerQuestion(qIdx, oIdx)}
                        disabled={answered}
                        className="w-full text-left rounded-xl px-4 py-3 text-sm transition-all flex items-center gap-3"
                        style={{ background: bg, border: `1.5px solid ${border}`, color }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                          style={{
                            background: answered && isCorrect ? '#5B8A6B' : answered && isSelected ? '#E8634A' : '#EDE0D4',
                            color: (answered && (isCorrect || isSelected)) ? '#fff' : '#9B8B7E',
                          }}
                        >
                          {answered && isCorrect ? '✓' : answered && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1">{en ? opt.en : opt.da}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                {answered && (
                  <div
                    className="px-5 py-3 text-sm"
                    style={{
                      background: selection === q.correct ? '#F0FBF5' : '#FFF0EC',
                      color: selection === q.correct ? '#2D5C3E' : '#9B2D20',
                      borderTop: `1px solid ${selection === q.correct ? '#C8E6D2' : '#F5C6BB'}`,
                    }}
                  >
                    {selection === q.correct ? '✓ ' : '✗ '}
                    {en ? q.explanationEn : q.explanationDa}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Done state ── */}
      {quizDone && (
        <section className="rounded-2xl p-8 text-center" style={{ background: '#FFF8F3', border: '2px solid #E8634A30' }}>
          <div className="text-5xl mb-4">
            {score === topic.quiz.length ? '🎉' : score >= 2 ? '👍' : '📚'}
          </div>
          <h2 className="font-serif text-xl font-bold mb-1" style={{ color: '#1E0F00' }}>
            {en ? `${score} / ${topic.quiz.length} correct` : `${score} / ${topic.quiz.length} rigtige`}
          </h2>
          <p className="text-sm mb-6" style={{ color: '#6B5C52' }}>
            {score === topic.quiz.length
              ? (en ? 'Perfect. You got it.' : 'Perfekt. Du forstod det.')
              : score >= 2
              ? (en ? 'Solid — you have the key points.' : 'Godt — du har de vigtigste pointer.')
              : (en ? 'Scroll back up and re-read the lesson, then try again.' : 'Scroll op og læs lektionen igen, og prøv så igen.')}
          </p>

          {/* CTA */}
          <div className="max-w-xs mx-auto">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9B8B7E' }}>
              {en ? 'Put it into practice' : 'Brug det i praksis'}
            </p>
            {topic.action.external ? (
              <a
                href={topic.action.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl px-5 py-4 hover:opacity-90 transition-all"
                style={{ background: '#E8634A', color: '#fff' }}
              >
                <span className="font-semibold text-sm">
                  {topic.action.icon} {en ? topic.action.cta.en : topic.action.cta.da}
                </span>
                <span>↗</span>
              </a>
            ) : topic.action.href ? (
              <Link
                href={topic.action.href}
                className="flex items-center justify-between rounded-xl px-5 py-4 hover:opacity-90 transition-all"
                style={{ background: '#E8634A', color: '#fff' }}
              >
                <span className="font-semibold text-sm">
                  {topic.action.icon} {en ? topic.action.cta.en : topic.action.cta.da}
                </span>
                <span>→</span>
              </Link>
            ) : null}
          </div>

          <div className="mt-5 flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setQuizAnswers(Array(topic.quiz.length).fill(null))
                setQuizSelections(Array(topic.quiz.length).fill(null))
                setQuizDone(false)
              }}
              className="rounded-xl px-5 py-2.5 text-sm font-medium border"
              style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
            >
              {en ? 'Retake quiz' : 'Tag quizzen igen'}
            </button>
            <Link
              href="/learning"
              className="rounded-xl px-5 py-2.5 text-sm font-semibold"
              style={{ background: '#1E0F00', color: '#FFF8F3' }}
            >
              {en ? 'Back to Learning →' : 'Tilbage til Læring →'}
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
