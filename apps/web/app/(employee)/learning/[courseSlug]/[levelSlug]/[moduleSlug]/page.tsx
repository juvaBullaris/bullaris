'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { getCourse, getCourseModule, getNextModule } from '@/lib/curriculum-data'
import { buildContentId } from '@/lib/curriculum-types'
import { LessonSequence } from '@/components/learning/LessonSequence'

const LEVEL_LABELS: Record<string, { en: string; da: string }> = {
  basics:       { en: 'Basics',       da: 'Begynder' },
  intermediate: { en: 'Intermediate', da: 'Øvet' },
  advanced:     { en: 'Advanced',     da: 'Avanceret' },
}

export default function ModulePage() {
  const params = useParams()
  const courseSlug  = Array.isArray(params.courseSlug)  ? params.courseSlug[0]  : (params.courseSlug  as string)
  const levelSlug   = Array.isArray(params.levelSlug)   ? params.levelSlug[0]   : (params.levelSlug   as string)
  const moduleSlug  = Array.isArray(params.moduleSlug)  ? params.moduleSlug[0]  : (params.moduleSlug  as string)

  const { locale } = useLanguage()

  const course = getCourse(courseSlug)
  const mod    = getCourseModule(courseSlug, levelSlug, moduleSlug)
  const next   = getNextModule(courseSlug, levelSlug, moduleSlug)

  const progressQuery = trpc.learning.myProgress.useQuery()
  const completedIds  = new Set(progressQuery.data?.map((p) => p.contentId) ?? [])

  if (!course || !mod) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="font-serif text-2xl mb-4" style={{ color: '#1E0F00' }}>
          {locale === 'da' ? 'Modul ikke fundet' : 'Module not found'}
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

  const levelLabel = LEVEL_LABELS[levelSlug] ?? { en: levelSlug, da: levelSlug }
  const moduleTitleText  = locale === 'da' ? mod.titleDa  : mod.titleEn
  const courseTitleText  = locale === 'da' ? course.titleDa : course.titleEn
  const nextTitleText    = next ? (locale === 'da' ? next.titleDa : next.titleEn) : null

  // Check if whole module is complete for the "Next module" CTA
  const allModuleIds = [
    ...mod.videos.map((_, i) => buildContentId(courseSlug, levelSlug, moduleSlug, 'video', i)),
    buildContentId(courseSlug, levelSlug, moduleSlug, 'podcast', 0),
    buildContentId(courseSlug, levelSlug, moduleSlug, 'quiz', 0),
  ]
  const moduleComplete = allModuleIds.length > 0 && allModuleIds.every((id) => completedIds.has(id))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: '#9B8B7E' }}>
        <Link
          href="/learning"
          className="transition-opacity hover:opacity-70"
          style={{ color: '#9B8B7E' }}
        >
          {locale === 'da' ? 'Læring' : 'Learning'}
        </Link>
        <span>/</span>
        <Link
          href={`/learning/${courseSlug}`}
          className="transition-opacity hover:opacity-70"
          style={{ color: '#9B8B7E' }}
        >
          {courseTitleText}
        </Link>
        <span>/</span>
        <Link
          href={`/learning/${courseSlug}`}
          className="transition-opacity hover:opacity-70"
          style={{ color: '#9B8B7E' }}
        >
          {locale === 'da' ? levelLabel.da : levelLabel.en}
        </Link>
        <span>/</span>
        <span style={{ color: '#1E0F00' }}>{moduleTitleText}</span>
      </nav>

      {/* Module header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: course.color }} />
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
            {locale === 'da' ? levelLabel.da : levelLabel.en}
          </p>
        </div>
        <h1 className="font-serif text-2xl leading-tight" style={{ color: '#1E0F00' }}>
          {moduleTitleText}
        </h1>
      </div>

      {/* Lesson sequence */}
      <LessonSequence
        courseSlug={courseSlug}
        levelSlug={levelSlug}
        module={mod}
        completedIds={completedIds}
      />

      {/* Next module CTA */}
      {next && (
        <div
          className="rounded-xl border p-4 flex items-center justify-between gap-4 mt-2"
          style={{
            borderColor: moduleComplete ? course.color : '#EDE0D4',
            background: moduleComplete ? '#FFF8F3' : '#fff',
          }}
        >
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-xs" style={{ color: '#9B8B7E' }}>
              {locale === 'da' ? 'Næste modul' : 'Next module'}
            </p>
            <p className="text-sm font-medium truncate" style={{ color: '#1E0F00' }}>
              {nextTitleText}
            </p>
          </div>
          <Link
            href={`/learning/${courseSlug}/${levelSlug}/${next.slug}`}
            className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: course.color, color: '#fff' }}
          >
            {locale === 'da' ? 'Næste' : 'Next'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      )}

      {/* Back to course link */}
      <Link
        href={`/learning/${courseSlug}`}
        className="flex items-center gap-1 text-sm w-fit transition-opacity hover:opacity-70"
        style={{ color: '#9B8B7E' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {locale === 'da' ? `Tilbage til ${courseTitleText}` : `Back to ${courseTitleText}`}
      </Link>
    </div>
  )
}
