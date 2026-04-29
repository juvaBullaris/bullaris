# Learning Curriculum — Architecture & Workflows

## Overview

The learning platform is built around a two-layer content system: a **structural skeleton** that never changes, and a **content registry** where all media IDs and quiz questions live. This separation means adding a video or podcast is a one-line change in one file, with no risk of breaking the course structure.

---

## File Roles

### `curriculum-types.ts`
TypeScript interfaces and shared helpers. Defines the shape of every object in the system: `Course`, `CourseLevelDef`, `CourseModule`, `VideoLesson`, `PodcastLesson`, `QuizLesson`, `QuizQuestion`.

Also exports:
- `buildContentId(courseSlug, levelSlug, moduleSlug, type, index)` — generates the opaque string ID stored in the database for progress tracking
- `isModuleEmpty(module)` — returns true if a module has no content yet (used to render "coming soon" state)
- `getModuleLessonCount(module)` — total number of lessons in a module

### `curriculum-data.ts`
The **structural skeleton** of all 7 courses. Defines every course, level, and module with their slugs, titles (EN + DA), and descriptions. All media fields are `null` and all quizzes are empty arrays — this file is the map of the curriculum, not the content itself.

**Never edit this file to add content.** Only edit it to add a new course, level, or module to the structure.

Exports lookup helpers:
- `getCourse(courseSlug)`
- `getCourseLevel(courseSlug, levelSlug)`
- `getCourseModule(courseSlug, levelSlug, moduleSlug)`
- `getNextModule(courseSlug, levelSlug, moduleSlug)`

### `curriculum-content.ts`
The **content registry** — the only file you touch when adding videos, podcasts, or quizzes. Three maps and three lookup helpers.

**This is the file editors work in.**

---

## Content ID Format

Every lesson has a unique opaque ID used both for database progress tracking and content lookups:

```
{courseSlug}-{levelSlug}-{moduleSlug}-{type}-{index}
```

Examples:
```
money-monetary-systems-basics-what-is-money-video-0
money-monetary-systems-basics-what-is-money-video-1
money-monetary-systems-basics-what-is-money-podcast-0
money-monetary-systems-basics-what-is-money-quiz-0
```

The quiz and podcast always use index `0`. Videos are indexed from `0` upward.

---

## How to Add Content

### Add a Video

Open `curriculum-content.ts` and add one line to `VIDEO_IDS`:

```ts
export const VIDEO_IDS: Record<string, string> = {
  'money-monetary-systems-basics-what-is-money-video-0': 'your_mux_playback_id',
}
```

The Mux playback ID comes from the Mux dashboard after uploading the video asset.

### Add a Podcast

Add one line to `PODCAST_IDS`:

```ts
export const PODCAST_IDS: Record<string, string> = {
  'money-monetary-systems-basics-what-is-money-podcast-0': 'your_mux_audio_id',
}
```

Podcasts are hosted on Mux as audio assets. The playback URL is constructed automatically:
`https://stream.mux.com/{playbackId}/audio.m4a`

### Add a Quiz

Add the module key and questions array to `QUIZ_QUESTIONS`:

```ts
export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
  'money-monetary-systems-basics-what-is-money': [
    {
      id: 'q1',
      en: 'What problem does money solve?',
      da: 'Hvilket problem løser penge?',
      options: [
        { en: 'The double coincidence of wants', da: 'Det dobbelte sammenfaldsproblem' },
        { en: 'Inflation',                       da: 'Inflation' },
        { en: 'Taxation',                        da: 'Beskatning' },
      ],
      correct: 0,
      explanationEn: 'Money eliminates the need for both parties to want what the other has.',
      explanationDa: 'Penge eliminerer behovet for at begge parter ønsker det den anden har.',
    },
  ],
}
```

The quiz key is `{courseSlug}-{levelSlug}-{moduleSlug}` (no type or index suffix).

---

## Data Flow

```
curriculum-data.ts          curriculum-content.ts
  (structure, nulls)    +     (Mux IDs, questions)
          │                           │
          └──────────┬────────────────┘
                     │
              LessonSequence.tsx
              (merges at render time)
                     │
          ┌──────────┼────────────────┐
          │          │                │
    VideoLesson  PodcastLesson    QuizLesson
    (Mux player)  (HTML5 audio)  (sequential quiz)
```

`LessonSequence` calls `getVideoId()`, `getPodcastId()`, and `getQuizQuestions()` when rendering the active lesson, merging the null skeleton with the real content ID. If no ID is found, the component renders a "coming soon" card automatically.

---

## Progress Tracking

When a user completes a lesson, `LessonSequence` calls:
```ts
trpc.learning.markComplete.mutate({ content_id: contentId })
```

This upserts a row in `LearningProgress` with the opaque content ID. The `contentId` is a plain string — there is no foreign key constraint to `LearningContent`, so any lesson can be tracked without pre-seeding the database.

Progress is re-fetched via `utils.learning.myProgress.invalidate()` after each completion, so the UI updates immediately.

---

## Course Structure

| Course | Slug | Color |
|---|---|---|
| Money & Monetary Systems | `money-monetary-systems` | `#E8634A` |
| Financial Foundations | `financial-foundations` | `#22c55e` |
| Interest Rates & Credit | `interest-rates-credit` | `#3b82f6` |
| Macroeconomics | `macroeconomics` | `#f97316` |
| Investing & Markets | `investing-markets` | `#8b5cf6` |
| Pension & Retirement | `pension-retirement` | `#14b8a6` |
| Housing & Real Estate | `housing-real-estate` | `#ec4899` |

Each course has 3 levels: `basics`, `intermediate`, `advanced`. Each level has 6–9 modules. Each module has 4 videos, 1 podcast, and 1 quiz.

---

## Routes

| Route | File | Purpose |
|---|---|---|
| `/learning` | `app/(employee)/learning/page.tsx` | Hub — 7 course cards + topic grid |
| `/learning/[courseSlug]` | `app/(employee)/learning/[courseSlug]/page.tsx` | Course overview — level tabs + module cards |
| `/learning/[courseSlug]/[levelSlug]/[moduleSlug]` | `app/(employee)/learning/[courseSlug]/[levelSlug]/[moduleSlug]/page.tsx` | Lesson player — video → podcast → quiz sequence |
