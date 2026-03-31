'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export default function LearningPage() {
  const { t, locale } = useLanguage()
  const en = locale === 'en'
  const contentQuery = trpc.learning.list.useQuery()
  const progressQuery = trpc.learning.myProgress.useQuery()
  const markComplete = trpc.learning.markComplete.useMutation({
    onSuccess: () => progressQuery.refetch(),
  })

  const completedIds = new Set(progressQuery.data?.map((p) => p.contentId) ?? [])
  const payslipDone = completedIds.has('payslip-guide')
  const taxDone = completedIds.has('tax-basics')
  const goalsDone = completedIds.has('goal-setting')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">{t.learning.title}</h1>
      <p className="text-muted-foreground mb-6">{t.learning.subtitle}</p>

      {/* Featured interactive module */}
      <Link
        href="/learning/payslip-guide"
        className="block rounded-2xl p-6 mb-8 transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #1E0F00 0%, #3D2B1F 100%)', color: '#FFF8F3', border: '1px solid #EDE0D4' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: '#E8634A', color: '#fff' }}>
                {en ? 'Interactive' : 'Interaktiv'}
              </span>
              {payslipDone && (
                <span className="text-xs font-medium" style={{ color: '#A3C9B0' }}>✓ {t.learning.completed}</span>
              )}
            </div>
            <h2 className="font-serif text-xl font-bold mb-1" style={{ color: '#FFF8F3' }}>
              📄 {en ? 'Understanding Your Danish Payslip' : 'Forstå din danske lønseddel'}
            </h2>
            <p className="text-sm mb-3" style={{ color: '#B5A89D' }}>
              {en
                ? 'Learn every line of your lønseddel — AM-bidrag, A-skat, pension and more. Includes an interactive payslip and a quiz.'
                : 'Lær hver linje på din lønseddel — AM-bidrag, A-skat, pension og mere. Inkl. interaktiv lønseddel og quiz.'}
            </p>
            <div className="flex gap-4 text-xs" style={{ color: '#9B8B7E' }}>
              <span>📚 {en ? '4 sections' : '4 sektioner'}</span>
              <span>⏱ ~8 min</span>
              <span>❓ {en ? '4-question quiz' : '4-spørgsmåls quiz'}</span>
            </div>
          </div>
          <div className="text-4xl shrink-0">→</div>
        </div>
      </Link>

      {/* Tax basics interactive module */}
      <Link
        href="/learning/tax-basics"
        className="block rounded-2xl p-6 mb-8 transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #0D1F2D 0%, #1A3A4A 100%)', color: '#F0F8FF', border: '1px solid #C8DFE8' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: '#E8634A', color: '#fff' }}>
                {en ? 'Interactive' : 'Interaktiv'}
              </span>
              {taxDone && (
                <span className="text-xs font-medium" style={{ color: '#A3C9B0' }}>✓ {t.learning.completed}</span>
              )}
            </div>
            <h2 className="font-serif text-xl font-bold mb-1" style={{ color: '#F0F8FF' }}>
              📊 {en ? 'Danish Tax Basics 2026' : 'Danske skatter — det grundlæggende 2026'}
            </h2>
            <p className="text-sm mb-3" style={{ color: '#9BB5C2' }}>
              {en
                ? 'Understand AM-bidrag, bundskat, kommuneskat and the new 2026 brackets. Includes a live tax calculator and a quiz.'
                : 'Forstå AM-bidrag, bundskat, kommuneskat og de nye 2026-trin. Inkl. live skatteberegner og quiz.'}
            </p>
            <div className="flex gap-4 text-xs" style={{ color: '#7A9BAA' }}>
              <span>📚 {en ? '4 sections' : '4 sektioner'}</span>
              <span>⏱ ~10 min</span>
              <span>🧮 {en ? 'Live calculator' : 'Live beregner'}</span>
            </div>
          </div>
          <div className="text-4xl shrink-0">→</div>
        </div>
      </Link>

      {/* Goal setting interactive module */}
      <Link
        href="/learning/goal-setting"
        className="block rounded-2xl p-6 mb-8 transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #0A1F0A 0%, #1A3A1A 100%)', color: '#F0FFF0', border: '1px solid #C8E8C8' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: '#E8634A', color: '#fff' }}>
                {en ? 'Interactive' : 'Interaktiv'}
              </span>
              {goalsDone && (
                <span className="text-xs font-medium" style={{ color: '#A3C9B0' }}>✓ {t.learning.completed}</span>
              )}
            </div>
            <h2 className="font-serif text-xl font-bold mb-1" style={{ color: '#F0FFF0' }}>
              🎯 {en ? 'How to Set Your Financial Goals' : 'Sådan sætter du dine finansielle mål'}
            </h2>
            <p className="text-sm mb-3" style={{ color: '#9BB59B' }}>
              {en
                ? 'Science-backed goal setting using SMART-A, the Three Horizons framework, and a 7-step playbook. Includes a bias check and quiz.'
                : 'Videnskabeligt understøttet målsætning med SMART-A, de tre horisonter og en 7-trins plan. Inkl. bias-check og quiz.'}
            </p>
            <div className="flex gap-4 text-xs" style={{ color: '#7A9B7A' }}>
              <span>📚 {en ? '5 sections' : '5 sektioner'}</span>
              <span>⏱ ~10 min</span>
              <span>❓ {en ? '4-question quiz' : '4-spørgsmåls quiz'}</span>
            </div>
          </div>
          <div className="text-4xl shrink-0">→</div>
        </div>
      </Link>

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
