'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navItems = [
    { href: '/portal',     label: t.nav.portal,     icon: '🏢' },
    { href: '/employees',  label: t.nav.employees,  icon: '👥' },
    { href: '/analytics',  label: t.nav.analytics,  icon: '📊' },
    { href: '/seats',      label: t.nav.seats,      icon: '🪑' },
    { href: '/nudges',     label: t.nav.nudges,     icon: '📣' },
  ]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FDF6EE' }}>

      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside
        className="hidden md:flex w-60 flex-col shrink-0"
        style={{ background: '#FFF8F3', borderRight: '1px solid #EDE0D4' }}
      >
        <div className="p-6" style={{ borderBottom: '1px solid #EDE0D4' }}>
          <Link href="/portal" className="font-serif text-xl font-bold" style={{ color: '#1E0F00' }}>
            Bullaris HR
          </Link>
          <p className="text-xs mt-1" style={{ color: '#A0917F' }}>HR Portal</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  background: isActive ? '#E8634A' : 'transparent',
                  color: isActive ? '#fff' : '#6B5C52',
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 py-3 text-xs leading-relaxed" style={{ borderTop: '1px solid #EDE0D4', color: '#A0917F' }}>
          {t.portal.privacyNotice}
        </div>
        <div className="p-4 space-y-3" style={{ borderTop: '1px solid #EDE0D4' }}>
          <LanguageSwitcher />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            style={{ color: '#6B5C52' }}
          >
            <span>🚪</span>
            {t.nav.signOut}
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ──────────────────────────────────────────── */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 h-14"
        style={{ background: '#FFF8F3', borderBottom: '1px solid #EDE0D4' }}
      >
        <div>
          <Link href="/portal" className="font-serif text-lg font-bold" style={{ color: '#1E0F00' }}>
            Bullaris HR
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ background: '#6B5C52' }} />
          <span className={`block w-5 h-0.5 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#6B5C52' }} />
          <span className={`block w-5 h-0.5 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ background: '#6B5C52' }} />
        </button>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 pt-14"
          style={{ background: 'rgba(30,15,0,0.4)' }}
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="absolute top-14 inset-x-0 p-3 space-y-0.5"
            style={{ background: '#FFF8F3', borderBottom: '1px solid #EDE0D4' }}
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium"
                  style={{
                    background: isActive ? '#E8634A' : 'transparent',
                    color: isActive ? '#fff' : '#6B5C52',
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
            <div className="px-4 py-2 text-xs leading-relaxed" style={{ color: '#A0917F' }}>
              {t.portal.privacyNotice}
            </div>
            <div className="pt-1 pb-2 flex items-center gap-3 px-4">
              <LanguageSwitcher />
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: '#6B5C52' }}
              >
                <span>🚪</span>
                {t.nav.signOut}
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <div className="md:hidden h-14" />
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* ── Mobile bottom tab bar ───────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 flex"
        style={{ background: '#FFF8F3', borderTop: '1px solid #EDE0D4' }}
      >
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors"
              style={{ color: isActive ? '#E8634A' : '#A0917F' }}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="truncate max-w-[52px] text-center">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
