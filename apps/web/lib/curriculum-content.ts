import type { QuizQuestion } from './curriculum-types'

// Quiz question overrides — keyed by {courseSlug}-{levelSlug}-{moduleSlug}
// Questions defined here take precedence over those in curriculum-data.ts
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {}
