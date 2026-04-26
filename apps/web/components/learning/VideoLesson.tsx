'use client'

import { useState } from 'react'
import MuxPlayer from '@mux/mux-player-react'
import { useLanguage } from '@/lib/language-context'
import { CelebrationBurst } from './CelebrationBurst'
import type { VideoLesson as VideoLessonData } from '@/lib/curriculum-types'

interface VideoLessonProps {
  lesson: VideoLessonData
  isCompleted: boolean
  onComplete: () => void
}

export function VideoLesson({ lesson, isCompleted, onComplete }: VideoLessonProps) {
  const { locale } = useLanguage()
  const [showCelebration, setShowCelebration] = useState(false)
  const title = locale === 'da' ? lesson.titleDa : lesson.titleEn

  function handleEnded() {
    if (!isCompleted) {
      onComplete()
      setShowCelebration(true)
    }
  }

  if (!lesson.muxPlaybackId) {
    return (
      <div
        className="rounded-xl border p-6 flex flex-col gap-2"
        style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
      >
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
          {locale === 'da' ? 'Video' : 'Video'}
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
    <div className="flex flex-col gap-3">
      <div className="relative rounded-xl overflow-hidden">
        <MuxPlayer
          playbackId={lesson.muxPlaybackId}
          streamType="on-demand"
          onEnded={handleEnded}
          style={{ width: '100%', aspectRatio: '16/9' }}
        />

        {isCompleted && (
          <div
            className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
            style={{ background: '#5B8A6B', color: '#fff' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {locale === 'da' ? 'Gennemført' : 'Completed'}
          </div>
        )}

        <CelebrationBurst
          active={showCelebration}
          variant="small"
          onComplete={() => setShowCelebration(false)}
        />
      </div>

      <p className="font-serif text-base" style={{ color: '#1E0F00' }}>
        {title}
      </p>
    </div>
  )
}
