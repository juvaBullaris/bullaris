'use client'

import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export default function LearningPage() {
  const { t } = useLanguage()
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

      {contentQuery.isLoading && (
        <div className="text-center py-12 text-muted-foreground">{t.learning.loading}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentQuery.data?.map((item) => {
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
  )
}
