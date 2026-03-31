'use client'

import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

interface LearnBannerProps {
  moduleId: string
  href: string
  icon: string
  en: { title: string; teaser: string; completedTeaser: string }
  da: { title: string; teaser: string; completedTeaser: string }
  duration: string
}

export function LearnBanner({ moduleId, href, icon, en: enText, da: daText, duration }: LearnBannerProps) {
  const { locale } = useLanguage()
  const isEn = locale === 'en'
  const progressQuery = trpc.learning.myProgress.useQuery()
  const completed = progressQuery.data?.some((p) => p.contentId === moduleId) ?? false
  const text = isEn ? enText : daText

  if (progressQuery.isLoading) return null

  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-4 rounded-xl px-5 py-4 mt-6 transition-all hover:opacity-90"
      style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{
            background: completed ? '#16A34A15' : '#E8634A15',
            border: `1.5px solid ${completed ? '#16A34A40' : '#E8634A40'}`,
          }}
        >
          {completed ? '✓' : icon}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold truncate" style={{ color: '#1E0F00' }}>
              {text.title}
            </span>
            {completed ? (
              <span
                className="text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0"
                style={{ background: '#16A34A15', color: '#16A34A' }}
              >
                {isEn ? 'Completed' : 'Fuldført'}
              </span>
            ) : (
              <span className="text-xs shrink-0" style={{ color: '#9B8B7E' }}>
                {duration}
              </span>
            )}
          </div>
          <p className="text-xs truncate" style={{ color: '#6B5C52' }}>{text.teaser}</p>
        </div>
      </div>
      <span className="text-sm font-semibold shrink-0" style={{ color: '#E8634A' }}>
        {completed ? (isEn ? 'Review →' : 'Gense →') : (isEn ? 'Learn →' : 'Lær →')}
      </span>
    </Link>
  )
}
