'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { cn } from '@/lib/utils'
import { getCourse } from '@/lib/curriculum-data'
import { isModuleEmpty, buildContentId, getModuleLessonCount } from '@/lib/curriculum-types'
import type { CourseLevelDef, CourseModule } from '@/lib/curriculum-types'

type TabLevel = 'basics' | 'intermediate' | 'advanced'

const LEVEL_LABELS: Record<TabLevel, { en: string; da: string }> = {
  basics: { en: 'Basics', da: 'Begynder' },
  intermediate: { en: 'Intermediate', da: 'Øvet' },
  advanced: { en: 'Advanced', da: 'Avanceret' },
}

function ModuleCard({
  courseSlug,
  level,
  module,
  completedIds,
  color,
}: {
  courseSlug: string
  level: CourseLevelDef
  module: CourseModule
  completedIds: Set<string>
  color: string
}) {
  const { locale } = useLanguage()
  const empty = isModuleEmpty(module)
  const total = getModuleLessonCount(module)

  const completed = [
    ...module.videos.map((_, i) =>
      completedIds.has(buildContentId(courseSlug, level.slug, module.slug, 'video', i)),
    ),
    completedIds.has(buildContentId(courseSlug, level.slug, module.slug, 'podcast', 0)),
    completedIds.has(buildContentId(courseSlug, level.slug, module.slug, 'quiz', 0)),
  ].filter(Boolean).length

  const title = locale === 'da' ? module.titleDa : module.titleEn
  const desc = locale === 'da' ? module.descriptionDa : module.descriptionEn
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  const inner = (
    <div
      className={cn(
        'rounded-xl border p-5 flex flex-col gap-3 transition-all',
        empty ? 'opacity-60' : 'hover:shadow-sm',
      )}
      style={{ borderColor: '#EDE0D4', background: '#fff' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
          <p className="font-serif text-base leading-snug" style={{ color: '#1E0F00' }}>
            {title}
          </p>
        </div>
        {empty ? (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: '#EDE0D4', color: '#9B8B7E' }}
          >
            {locale === 'da' ? 'Snart' : 'Soon'}
          </span>
        ) : completed === total ? (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: '#A3C9B0', color: '#fff' }}
          >
            ✓
          </span>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#9B8B7E' }}>
        {desc}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs" style={{ color: '#9B8B7E' }}>
        <span>{module.videos.length} {locale === 'da' ? 'videoer' : 'videos'}</span>
        <span>·</span>
        <span>Podcast</span>
        <span>·</span>
        <span>Quiz</span>
      </div>

      {/* Progress bar */}
      {!empty && (
        <div>
          <div className="w-full h-1.5 rounded-full" style={{ background: '#EDE0D4' }}>
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct === 100 ? '#5B8A6B' : color }}
            />
          </div>
          <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
            {completed}/{total} {locale === 'da' ? 'gennemført' : 'completed'}
          </p>
        </div>
      )}
    </div>
  )

  if (empty) return inner

  return (
    <Link href={`/learning/${courseSlug}/${level.slug}/${module.slug}`}>
      {inner}
    </Link>
  )
}

export default function CourseOverviewPage() {
  const params = useParams()
  const courseSlug = Array.isArray(params.courseSlug) ? params.courseSlug[0] : (params.courseSlug as string)
  const { locale } = useLanguage()

  const course = getCourse(courseSlug)
  const progressQuery = trpc.learning.myProgress.useQuery()
  const completedIds = new Set(progressQuery.data?.map((p) => p.contentId) ?? [])

  const availableLevels = course?.levels.map((l) => l.slug as TabLevel) ?? []
  const [activeLevel, setActiveLevel] = useState<TabLevel>(availableLevels[0] ?? 'basics')

  if (!course) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-2xl mb-4" style={{ color: '#1E0F00' }}>
          {locale === 'da' ? 'Kursus ikke fundet' : 'Course not found'}
        </p>
        <Link
          href="/learning"
          className="text-sm underline"
          style={{ color: '#E8634A' }}
        >
          {locale === 'da' ? 'Tilbage til læring' : 'Back to Learning'}
        </Link>
      </div>
    )
  }

  const currentLevel = course.levels.find((l) => l.slug === activeLevel)

  // Compute overall course progress
  const allCourseIds = course.levels.flatMap((l) =>
    l.modules.flatMap((m) => [
      ...m.videos.map((_, i) => buildContentId(course.slug, l.slug, m.slug, 'video', i)),
      buildContentId(course.slug, l.slug, m.slug, 'podcast', 0),
      buildContentId(course.slug, l.slug, m.slug, 'quiz', 0),
    ]),
  )
  const totalDone = allCourseIds.filter((id) => completedIds.has(id)).length
  const totalAll = allCourseIds.length

  const titleText = locale === 'da' ? course.titleDa : course.titleEn
  const descText = locale === 'da' ? course.descriptionDa : course.descriptionEn

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Breadcrumb */}
      <Link
        href="/learning"
        className="flex items-center gap-1 text-sm w-fit transition-opacity hover:opacity-70"
        style={{ color: '#9B8B7E' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {locale === 'da' ? 'Tilbage til læring' : 'Back to Learning'}
      </Link>

      {/* Course header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: course.color }} />
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
            {locale === 'da' ? 'Kursus' : 'Course'}
          </p>
        </div>
        <h1 className="font-serif text-3xl leading-tight" style={{ color: '#1E0F00' }}>
          {titleText}
        </h1>
        <p className="text-base leading-relaxed" style={{ color: '#6B5B4E' }}>
          {descText}
        </p>

        {/* Overall progress */}
        {totalAll > 0 && (
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 h-2 rounded-full" style={{ background: '#EDE0D4' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(totalDone / totalAll) * 100}%`,
                  background: course.color,
                }}
              />
            </div>
            <span className="text-xs tabular-nums flex-shrink-0" style={{ color: '#9B8B7E' }}>
              {totalDone}/{totalAll}
            </span>
          </div>
        )}
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: '#EDE0D4' }}>
        {course.levels.map((l) => {
          const label = LEVEL_LABELS[l.slug as TabLevel]
          const isActive = activeLevel === l.slug
          return (
            <button
              key={l.slug}
              onClick={() => setActiveLevel(l.slug as TabLevel)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px',
                isActive ? 'border-current' : 'border-transparent',
              )}
              style={{
                color: isActive ? course.color : '#9B8B7E',
                borderColor: isActive ? course.color : 'transparent',
              }}
            >
              {locale === 'da' ? label.da : label.en}
            </button>
          )
        })}
      </div>

      {/* Module grid */}
      {currentLevel && (
        <div className="flex flex-col gap-3">
          {currentLevel.modules.map((module) => (
            <ModuleCard
              key={module.slug}
              courseSlug={course.slug}
              level={currentLevel}
              module={module}
              completedIds={completedIds}
              color={course.color}
            />
          ))}
        </div>
      )}
    </div>
  )
}
