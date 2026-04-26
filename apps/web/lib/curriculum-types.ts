export type LessonType = 'video' | 'podcast' | 'quiz'
export type CourseLevel = 'basics' | 'intermediate' | 'advanced'

export interface VideoLesson {
  index: number
  titleEn: string
  titleDa: string
  muxPlaybackId: string | null
  durationSeconds: number | null
}

export interface PodcastLesson {
  titleEn: string
  titleDa: string
  muxAudioPlaybackId: string | null
  durationSeconds: number | null
}

export interface QuizQuestion {
  id: string
  en: string
  da: string
  options: { en: string; da: string }[]
  correct: number
  explanationEn: string
  explanationDa: string
}

export interface QuizLesson {
  questions: QuizQuestion[]
}

export interface CourseModule {
  slug: string
  titleEn: string
  titleDa: string
  descriptionEn: string
  descriptionDa: string
  videos: VideoLesson[]
  podcast: PodcastLesson
  quiz: QuizLesson
}

export interface CourseLevelDef {
  level: CourseLevel
  slug: string
  titleEn: string
  titleDa: string
  modules: CourseModule[]
}

export interface Course {
  id: number
  slug: string
  color: string
  titleEn: string
  titleDa: string
  descriptionEn: string
  descriptionDa: string
  levels: CourseLevelDef[]
}

export function buildContentId(
  courseSlug: string,
  levelSlug: string,
  moduleSlug: string,
  lessonType: LessonType,
  lessonIndex = 0,
): string {
  return `${courseSlug}-${levelSlug}-${moduleSlug}-${lessonType}-${lessonIndex}`
}

export function isModuleEmpty(mod: CourseModule): boolean {
  return (
    mod.videos.every((v) => v.muxPlaybackId === null) &&
    mod.podcast.muxAudioPlaybackId === null &&
    mod.quiz.questions.length === 0
  )
}

export function getModuleLessonCount(mod: CourseModule): number {
  return mod.videos.length + 1 + 1 // videos + podcast + quiz
}
