'use client'

import { useLanguage } from '@/lib/language-context'
import MuxPlayer from '@mux/mux-player-react'
import type { PodcastLesson as PodcastLessonData } from '@/lib/curriculum-types'

interface PodcastLessonProps {
  lesson: PodcastLessonData
  isCompleted: boolean
  onComplete: () => void
}

export function PodcastLesson({ lesson, isCompleted, onComplete }: PodcastLessonProps) {
  const { locale } = useLanguage()
  const title = locale === 'da' ? lesson.titleDa : lesson.titleEn

  if (!lesson.muxAudioPlaybackId) {
    return (
      <div
        className="rounded-xl border p-6 flex flex-col gap-2"
        style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
      >
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
          Podcast
        </p>
        <p className="font-serif text-lg" style={{ color: '#1E0F00', opacity: 0.5 }}>
          {title}
        </p>
        <p className="text-sm" style={{ color: '#9B8B7E' }}>
          {locale === 'da' ? 'Indhold produceres snart' : 'Content coming soon'}
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-4"
      style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: '#E8634A' }}
          >
            🎙
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
              Podcast
            </p>
            <p className="font-serif text-base truncate" style={{ color: '#1E0F00' }}>
              {title}
            </p>
          </div>
        </div>
        {isCompleted && (
          <div
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium flex-shrink-0"
            style={{ background: '#5B8A6B', color: '#fff' }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {locale === 'da' ? 'Gennemført' : 'Done'}
          </div>
        )}
      </div>

      <MuxPlayer
        playbackId={lesson.muxAudioPlaybackId}
        streamType="on-demand"
        audio
        onEnded={() => { if (!isCompleted) onComplete() }}
        style={{ width: '100%' }}
      />
    </div>
  )
}
