import type { ComponentType } from 'react'
import type { QuizQuestion } from './curriculum-types'

export interface PersonalProfile {
  gross_dkk: number | null
  age: number | null
  municipality: string | null
  employment_type: string | null
  childrenInDaycare: number | null
}

export interface CalculatorProps {
  profile: PersonalProfile | null
}

export interface WhyCard {
  icon: string
  title: { en: string; da: string }
  body: { en: string; da: string }
}

/** A short (~1 min) video for a practical topic. muxPlaybackId is optional — absence shows the placeholder. */
export interface TopicVideo {
  slug: string
  title: { en: string; da: string }
  /** One-sentence teaser shown below the video card */
  hook: { en: string; da: string }
  durationSecs: number
  muxPlaybackId?: string
}

/** Punchy written lesson shown above the calculator */
export interface TopicLesson {
  headline: { en: string; da: string }
  paragraphs: Array<{ en: string; da: string }>
  /** Optional stat callout — big number + short label */
  highlight?: {
    stat: string
    label: { en: string; da: string }
  }
}

export interface PracticalTopic {
  id: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  mins: string
  question: { en: string; da: string }
  tldrFn: (profile: PersonalProfile | null) => { en: string; da: string }
  /** 1–3 short videos. Renders Mux player when muxPlaybackId is set, placeholder otherwise. */
  videos?: TopicVideo[]
  /** Short written lesson displayed between videos and calculator */
  lesson?: TopicLesson
  whyCards: WhyCard[]
  Calculator: ComponentType<CalculatorProps>
  action: {
    icon: string
    cta: { en: string; da: string }
    href?: string
    external?: boolean
  }
  quiz: QuizQuestion[]
}
