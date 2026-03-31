'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

interface Module {
  id: string
  href: string
  icon: string
  en: { title: string; description: string }
  da: { title: string; description: string }
  duration: string
  sections: number
  extra: string
}

interface Category {
  id: string
  en: { label: string; description: string }
  da: { label: string; description: string }
  color: string
  modules: Module[]
}

const CATEGORIES: Category[] = [
  {
    id: 'basics',
    color: '#E8634A',
    en: {
      label: 'Basics',
      description: 'Essential knowledge every employee in Denmark should have — payslips, taxes, and goal setting.',
    },
    da: {
      label: 'Det grundlæggende',
      description: 'Grundlæggende viden enhver medarbejder i Danmark bør have — lønsedler, skatter og målsætning.',
    },
    modules: [
      {
        id: 'payslip-guide',
        href: '/learning/payslip-guide',
        icon: '📄',
        en: {
          title: 'Understanding Your Danish Payslip',
          description: 'Learn every line of your lønseddel — AM-bidrag, A-skat, pension and more. Includes an interactive payslip and a quiz.',
        },
        da: {
          title: 'Forstå din danske lønseddel',
          description: 'Lær hver linje på din lønseddel — AM-bidrag, A-skat, pension og mere. Inkl. interaktiv lønseddel og quiz.',
        },
        duration: '~8 min',
        sections: 4,
        extra: '4-question quiz',
      },
      {
        id: 'tax-basics',
        href: '/learning/tax-basics',
        icon: '📊',
        en: {
          title: 'Danish Tax Basics 2026',
          description: 'Understand AM-bidrag, bundskat, kommuneskat and the new 2026 brackets. Includes a live tax calculator and a quiz.',
        },
        da: {
          title: 'Danske skatter — det grundlæggende 2026',
          description: 'Forstå AM-bidrag, bundskat, kommuneskat og de nye 2026-trin. Inkl. live skatteberegner og quiz.',
        },
        duration: '~10 min',
        sections: 4,
        extra: 'Live calculator',
      },
      {
        id: 'goal-setting',
        href: '/learning/goal-setting',
        icon: '🎯',
        en: {
          title: 'How to Set Your Financial Goals',
          description: 'Science-backed goal setting using SMART-A, the Three Horizons framework, and a 7-step playbook. Includes a bias check and quiz.',
        },
        da: {
          title: 'Sådan sætter du dine finansielle mål',
          description: 'Videnskabeligt understøttet målsætning med SMART-A, de tre horisonter og en 7-trins plan. Inkl. bias-check og quiz.',
        },
        duration: '~10 min',
        sections: 5,
        extra: '4-question quiz',
      },
    ],
  },
]

export default function LearningPage() {
  const { t, locale } = useLanguage()
  const en = locale === 'en'
  const contentQuery = trpc.learning.list.useQuery()
  const progressQuery = trpc.learning.myProgress.useQuery()
  const markComplete = trpc.learning.markComplete.useMutation({
    onSuccess: () => progressQuery.refetch(),
  })

  const completedIds = new Set(progressQuery.data?.map((p) => p.contentId) ?? [])

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">{t.learning.title}</h1>
      <p className="text-muted-foreground mb-8">{t.learning.subtitle}</p>

      {/* Category sections */}
      {CATEGORIES.map((category) => {
        const cd = en ? category.en : category.da
        const completedCount = category.modules.filter((m) => completedIds.has(m.id)).length
        const total = category.modules.length
        const pct = Math.round((completedCount / total) * 100)
        const sectionDone = completedCount === total

        return (
          <div key={category.id} className="mb-10">
            {/* Section header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-bold">{cd.label}</h2>
                  {sectionDone && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#16A34A15', color: '#16A34A' }}
                    >
                      ✓ {en ? 'Complete' : 'Fuldført'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{cd.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-sm font-semibold" style={{ color: sectionDone ? '#16A34A' : category.color }}>
                  {completedCount}/{total}
                </span>
                <p className="text-xs text-muted-foreground">{en ? 'completed' : 'fuldført'}</p>
              </div>
            </div>

            {/* Section progress bar */}
            <div className="h-1.5 bg-muted rounded-full mb-5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: sectionDone ? '#16A34A' : category.color,
                }}
              />
            </div>

            {/* Module cards */}
            <div className="space-y-3">
              {category.modules.map((module) => {
                const md = en ? module.en : module.da
                const done = completedIds.has(module.id)
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    className="flex items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:shadow-sm hover:border-foreground/20"
                    style={{ opacity: done ? 0.75 : 1 }}
                  >
                    {/* Completion indicator */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 mt-0.5"
                      style={{
                        background: done ? '#16A34A15' : `${category.color}15`,
                        border: `2px solid ${done ? '#16A34A40' : `${category.color}40`}`,
                      }}
                    >
                      {done ? '✓' : module.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-sm leading-snug">{md.title}</h3>
                        {done && (
                          <span
                            className="text-xs font-medium shrink-0"
                            style={{ color: '#16A34A' }}
                          >
                            {en ? 'Done' : 'Færdig'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{md.description}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>📚 {module.sections} {en ? 'sections' : 'sektioner'}</span>
                        <span>⏱ {module.duration}</span>
                        <span style={{ color: category.color }}>→ {module.extra}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* CMS-managed content (future Sanity content) */}
      {contentQuery.isLoading && (
        <div className="text-center py-12 text-muted-foreground">{t.learning.loading}</div>
      )}

      {contentQuery.data && contentQuery.data.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-lg font-bold">{en ? 'More Resources' : 'Flere ressourcer'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentQuery.data.map((item) => {
              const done = completedIds.has(item.id)
              const moduleLabel = t.learning.modules[item.module as keyof typeof t.learning.modules] ?? item.module
              return (
                <div
                  key={item.id}
                  className={`rounded-xl border bg-card p-5 flex flex-col gap-3 ${done ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-bullaris-blue uppercase tracking-wide">
                        {moduleLabel}
                      </span>
                      <h3 className="font-semibold mt-1">{item.title}</h3>
                    </div>
                    <span className="text-lg">{item.type === 'video' ? '🎥' : '📄'}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    {done ? (
                      <span className="text-xs text-bullaris-teal font-medium">✓ {t.learning.completed}</span>
                    ) : (
                      <button
                        onClick={() => markComplete.mutate({ content_id: item.id })}
                        className="text-xs text-bullaris-blue hover:underline"
                      >
                        {t.learning.markComplete}
                      </button>
                    )}
                    <a
                      href={`/learning/${item.id}`}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      {t.learning.viewContent}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
