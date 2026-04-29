'use client'

import { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '@/lib/language-context'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { VideoLesson } from './VideoLesson'
import { PodcastLesson } from './PodcastLesson'
import { QuizLesson } from './QuizLesson'
import { buildContentId, isModuleEmpty } from '@/lib/curriculum-types'
import type { CourseModule } from '@/lib/curriculum-types'
import { getVideoId, getPodcastId, getQuizQuestions } from '@/lib/curriculum-content'

type LessonRef =
  | { type: 'video'; index: number }
  | { type: 'podcast' }
  | { type: 'quiz' }

interface LessonSequenceProps {
  courseSlug: string
  levelSlug: string
  module: CourseModule
  completedIds: Set<string>
  onModuleComplete?: () => void
}

function lessonKey(courseSlug: string, levelSlug: string, moduleSlug: string, ref: LessonRef): string {
  if (ref.type === 'video') return buildContentId(courseSlug, levelSlug, moduleSlug, 'video', ref.index)
  if (ref.type === 'podcast') return buildContentId(courseSlug, levelSlug, moduleSlug, 'podcast', 0)
  return buildContentId(courseSlug, levelSlug, moduleSlug, 'quiz', 0)
}

function lessonLabel(ref: LessonRef, locale: string, module: CourseModule): string {
  if (ref.type === 'video') {
    const v = module.videos[ref.index]
    return locale === 'da' ? v.titleDa : v.titleEn
  }
  if (ref.type === 'podcast') {
    return locale === 'da' ? module.podcast.titleDa : module.podcast.titleEn
  }
  return locale === 'da' ? 'Quiz' : 'Quiz'
}

export function LessonSequence({
  courseSlug,
  levelSlug,
  module,
  completedIds,
  onModuleComplete,
}: LessonSequenceProps) {
  const { locale } = useLanguage()
  const utils = trpc.useUtils()

  const markComplete = trpc.learning.markComplete.useMutation({
    onSuccess: () => utils.learning.myProgress.invalidate(),
  })

  // Build the ordered list of all lessons in this module
  const allLessons = useMemo<LessonRef[]>(() => {
    const refs: LessonRef[] = module.videos.map((v) => ({ type: 'video' as const, index: v.index }))
    refs.push({ type: 'podcast' })
    refs.push({ type: 'quiz' })
    return refs
  }, [module])

  // Auto-select first incomplete lesson on mount
  const [active, setActive] = useState<LessonRef>(() => {
    const firstIncomplete = allLessons.find(
      (ref) => !completedIds.has(lessonKey(courseSlug, levelSlug, module.slug, ref)),
    )
    return firstIncomplete ?? allLessons[0]
  })

  const [moduleJustCompleted, setModuleJustCompleted] = useState(false)

  // Check module completion after each mark
  const completedCount = allLessons.filter((ref) =>
    completedIds.has(lessonKey(courseSlug, levelSlug, module.slug, ref)),
  ).length

  useEffect(() => {
    if (completedCount === allLessons.length && !moduleJustCompleted) {
      setModuleJustCompleted(true)
      onModuleComplete?.()
    }
  }, [completedCount, allLessons.length, moduleJustCompleted, onModuleComplete])

  function handleLessonComplete(ref: LessonRef) {
    const contentId = lessonKey(courseSlug, levelSlug, module.slug, ref)
    markComplete.mutate({ content_id: contentId })

    // Auto-advance to next lesson
    const currentIdx = allLessons.findIndex(
      (r) => r.type === ref.type && (r.type === 'video' ? (r as { type: 'video'; index: number }).index === (ref as { type: 'video'; index: number }).index : true),
    )
    if (currentIdx !== -1 && currentIdx < allLessons.length - 1) {
      setActive(allLessons[currentIdx + 1])
    }
  }

  if (isModuleEmpty(module)) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
      >
        <p className="font-serif text-xl mb-2" style={{ color: '#1E0F00', opacity: 0.5 }}>
          {locale === 'da' ? module.titleDa : module.titleEn}
        </p>
        <p className="text-sm" style={{ color: '#9B8B7E' }}>
          {locale === 'da' ? 'Indhold produceres snart.' : 'Content coming soon.'}
        </p>
      </div>
    )
  }

  function renderActive() {
    if (active.type === 'video') {
      const v = module.videos[active.index]
      const key = lessonKey(courseSlug, levelSlug, module.slug, active)
      return (
        <VideoLesson
          key={key}
          lesson={{ ...v, muxPlaybackId: getVideoId(key) }}
          isCompleted={completedIds.has(key)}
          onComplete={() => handleLessonComplete(active)}
        />
      )
    }
    if (active.type === 'podcast') {
      const key = lessonKey(courseSlug, levelSlug, module.slug, active)
      return (
        <PodcastLesson
          key={key}
          lesson={{ ...module.podcast, muxAudioPlaybackId: getPodcastId(key) }}
          isCompleted={completedIds.has(key)}
          onComplete={() => handleLessonComplete(active)}
        />
      )
    }
    // quiz
    const key = lessonKey(courseSlug, levelSlug, module.slug, active)
    return (
      <QuizLesson
        key={key}
        quiz={{ questions: getQuizQuestions(courseSlug, levelSlug, module.slug) }}
        isCompleted={completedIds.has(key)}
        onComplete={(score) => handleLessonComplete(active)}
      />
    )
  }

  const lessonTypeIcon = (ref: LessonRef) => {
    if (ref.type === 'video') return '▶'
    if (ref.type === 'podcast') return '🎙'
    return '✏️'
  }

  const isActiveRef = (ref: LessonRef) => {
    if (ref.type !== active.type) return false
    if (ref.type === 'video' && active.type === 'video') return ref.index === active.index
    return true
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Sidebar */}
      <div className="lg:w-56 flex-shrink-0">
        {/* Mobile: horizontal scrollable strip */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
          {allLessons.map((ref, i) => {
            const key = lessonKey(courseSlug, levelSlug, module.slug, ref)
            const done = completedIds.has(key)
            const isAct = isActiveRef(ref)
            return (
              <button
                key={i}
                onClick={() => setActive(ref)}
                className={cn(
                  'flex-shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                  isAct ? 'border-orange-400' : 'border-transparent',
                )}
                style={{
                  background: isAct ? '#FFF0EB' : done ? '#f0faf5' : '#f5f5f4',
                  color: isAct ? '#E8634A' : done ? '#5B8A6B' : '#9B8B7E',
                }}
              >
                {done ? '✓ ' : ''}{lessonTypeIcon(ref)}{' '}
                {ref.type === 'video' ? `V${ref.index + 1}` : ref.type === 'podcast' ? 'Pod' : 'Quiz'}
              </button>
            )
          })}
        </div>

        {/* Desktop: vertical list */}
        <div className="hidden lg:flex flex-col gap-1">
          {allLessons.map((ref, i) => {
            const key = lessonKey(courseSlug, levelSlug, module.slug, ref)
            const done = completedIds.has(key)
            const isAct = isActiveRef(ref)
            const label = lessonLabel(ref, locale, module)
            const typeLabel =
              ref.type === 'video'
                ? locale === 'da' ? 'Video' : 'Video'
                : ref.type === 'podcast'
                  ? 'Podcast'
                  : 'Quiz'

            return (
              <button
                key={i}
                onClick={() => setActive(ref)}
                className={cn(
                  'w-full text-left rounded-lg px-3 py-2.5 flex items-start gap-2.5 transition-colors',
                  isAct ? 'bg-orange-50' : 'hover:bg-gray-50',
                )}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{
                    background: done ? '#5B8A6B' : isAct ? '#E8634A' : '#EDE0D4',
                    color: done || isAct ? '#fff' : '#9B8B7E',
                  }}
                >
                  {done ? '✓' : i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium" style={{ color: '#9B8B7E' }}>
                    {typeLabel}
                  </p>
                  <p
                    className="text-xs leading-tight mt-0.5 truncate max-w-[160px]"
                    style={{ color: isAct ? '#E8634A' : '#1E0F00' }}
                  >
                    {label}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Progress summary */}
        <div className="mt-4 px-3">
          <div className="w-full h-1.5 rounded-full" style={{ background: '#EDE0D4' }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${(completedCount / allLessons.length) * 100}%`,
                background: '#5B8A6B',
              }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
            {completedCount} / {allLessons.length}{' '}
            {locale === 'da' ? 'gennemført' : 'completed'}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {moduleJustCompleted && (
          <div
            className="mb-4 rounded-xl border px-4 py-3 flex items-center gap-2"
            style={{ background: '#f0faf5', borderColor: '#A3C9B0' }}
          >
            <span style={{ color: '#5B8A6B' }}>✓</span>
            <p className="text-sm font-medium" style={{ color: '#5B8A6B' }}>
              {locale === 'da' ? 'Modul gennemført!' : 'Module complete!'}
            </p>
          </div>
        )}
        {renderActive()}
      </div>
    </div>
  )
}
