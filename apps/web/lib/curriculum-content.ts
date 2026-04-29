import type { QuizQuestion } from './curriculum-types'

// ─── Videos ───────────────────────────────────────────────────────────────────
// Key format: {courseSlug}-{levelSlug}-{moduleSlug}-video-{index}
// Value: Mux playback ID

export const VIDEO_IDS: Record<string, string> = {
  // 'money-monetary-systems-basics-what-is-money-video-0': 'abc123xyz',
}

// ─── Podcasts ─────────────────────────────────────────────────────────────────
// Key format: {courseSlug}-{levelSlug}-{moduleSlug}-podcast-0
// Value: Mux audio playback ID

export const PODCAST_IDS: Record<string, string> = {
  // 'money-monetary-systems-basics-what-is-money-podcast-0': 'def456uvw',
}

// ─── Quizzes ──────────────────────────────────────────────────────────────────
// Key format: {courseSlug}-{levelSlug}-{moduleSlug}
// Value: array of quiz questions

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  // 'money-monetary-systems-basics-what-is-money': [
  //   {
  //     id: 'q1',
  //     en: 'What problem does money solve?',
  //     da: 'Hvilket problem løser penge?',
  //     options: [
  //       { en: 'The double coincidence of wants', da: 'Det dobbelte sammenfaldsproblem' },
  //       { en: 'Inflation', da: 'Inflation' },
  //       { en: 'Taxation', da: 'Beskatning' },
  //     ],
  //     correct: 0,
  //     explanationEn: 'Money eliminates the need for both parties to want what the other has.',
  //     explanationDa: 'Penge eliminerer behovet for, at begge parter ønsker det, den anden har.',
  //   },
  // ],
}

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getVideoId(contentId: string): string | null {
  return VIDEO_IDS[contentId] ?? null
}

export function getPodcastId(contentId: string): string | null {
  return PODCAST_IDS[contentId] ?? null
}

export function getQuizQuestions(courseSlug: string, levelSlug: string, moduleSlug: string): QuizQuestion[] {
  return QUIZ_QUESTIONS[`${courseSlug}-${levelSlug}-${moduleSlug}`] ?? []
}
