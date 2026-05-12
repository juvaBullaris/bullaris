'use client'

import Link from 'next/link'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/language-context'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage()
  const en = locale === 'en'

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FDF6EE' }}>
      {/* Minimal learning top bar */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-5 h-14 shrink-0"
        style={{ background: '#FFF8F3', borderBottom: '1px solid #EDE0D4' }}
      >
        <Link
          href="/learning"
          className="flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#1E0F00' }}
        >
          <span className="font-serif">Bullaris</span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/learning"
            className="text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: '#9B8B7E' }}
          >
            {en ? 'All topics' : 'Alle emner'}
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
