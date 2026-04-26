'use client'

import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import type { PodcastLesson as PodcastLessonData } from '@/lib/curriculum-types'

interface PodcastLessonProps {
  lesson: PodcastLessonData
  isCompleted: boolean
  onComplete: () => void
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = Math.floor(secs % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PodcastLesson({ lesson, isCompleted, onComplete }: PodcastLessonProps) {
  const { locale } = useLanguage()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const title = locale === 'da' ? lesson.titleDa : lesson.titleEn

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => setDuration(el.duration)
    const onEnded = () => {
      setPlaying(false)
      if (!isCompleted) onComplete()
    }
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('ended', onEnded)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('ended', onEnded)
    }
  }, [isCompleted, onComplete])

  function togglePlay() {
    const el = audioRef.current
    if (!el) return
    if (playing) { el.pause(); setPlaying(false) }
    else { el.play(); setPlaying(true) }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const el = audioRef.current
    if (!el || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    el.currentTime = pct * duration
  }

  const audioSrc = lesson.muxAudioPlaybackId
    ? `https://stream.mux.com/${lesson.muxAudioPlaybackId}/audio.m4a`
    : null

  if (!audioSrc) {
    return (
      <div
        className="rounded-xl border p-6 flex flex-col gap-2"
        style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
      >
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
          {locale === 'da' ? 'Podcast' : 'Podcast'}
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

  const pct = duration ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="rounded-xl border p-5 flex flex-col gap-4"
      style={{ background: '#FFF8F3', borderColor: '#EDE0D4' }}
    >
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#E8634A' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9B8B7E' }}>
            {locale === 'da' ? 'Podcast' : 'Podcast'}
          </p>
          <p className="font-serif text-base truncate" style={{ color: '#1E0F00' }}>
            {title}
          </p>
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

      {/* Progress bar */}
      <div
        className="w-full h-2 rounded-full cursor-pointer"
        style={{ background: '#EDE0D4' }}
        onClick={seek}
      >
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, background: '#E8634A' }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs tabular-nums" style={{ color: '#9B8B7E' }}>
          {formatTime(currentTime)}
        </span>
        <button
          onClick={togglePlay}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-80"
          style={{ background: '#E8634A', color: '#fff' }}
        >
          {playing ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="2" y="1" width="3" height="10" rx="1" />
                <rect x="7" y="1" width="3" height="10" rx="1" />
              </svg>
              {locale === 'da' ? 'Pause' : 'Pause'}
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 2l7 4-7 4V2z" />
              </svg>
              {locale === 'da' ? 'Afspil' : 'Play'}
            </>
          )}
        </button>
        <span className="text-xs tabular-nums" style={{ color: '#9B8B7E' }}>
          {duration ? formatTime(duration) : '--:--'}
        </span>
      </div>
    </div>
  )
}
