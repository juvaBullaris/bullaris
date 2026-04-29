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

export interface PracticalTopic {
  id: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  mins: string
  question: { en: string; da: string }
  tldrFn: (profile: PersonalProfile | null) => { en: string; da: string }
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
