'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'
import { trpc } from '@/lib/trpc'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)

  const profileQuery = trpc.employee.getProfile.useQuery(undefined, { retry: false })

  useEffect(() => {
    if (
      profileQuery.data &&
      profileQuery.data.data.countryOfResidence === null &&
      !pathname.startsWith('/onboarding')
    ) {
      router.push('/onboarding')
    }
  }, [profileQuery.data, pathname, router])

  // Close menu on navigation
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navItems = [
    { href: '/dashboard',   label: t.nav.dashboard,   icon: '🏠' },
    { href: '/payslip',     label: t.nav.payslip,      icon: '📄' },
    { href: '/tax-planner', label: t.nav.taxPlanner,   icon: '🧮' },
    { href: '/goals',       label: t.nav.goals,        icon: '🎯' },
    { href: '/finance',     label: t.nav.finance,      icon: '💰' },
    { href: '/chat',        label: t.nav.chat,         icon: '💬' },
    { href: '/learning',    label: t.nav.learning,     icon: '📚' },
  ]

  // Bottom nav shows the 5 most-used items on mobile; rest in hamburger menu
  const bottomNavItems = navItems.slice(0, 5)

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
          <Link href="/dashboard" className="font-serif text-xl font-bold" style={{ color: '#1E0F00' }}>
            Bullaris
          </Link>
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
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 h-14"
        style={{ background: '#FFF8F3', borderBottom: '1px solid #EDE0D4' }}>
        <Link href="/dashboard" className="font-serif text-lg font-bold" style={{ color: '#1E0F00' }}>
          Bullaris
        </Link>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ color: '#6B5C52' }} />
          <span className={`block w-5 h-0.5 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} style={{ background: '#6B5C52' }} />
          <span className={`block w-5 h-0.5 bg-current transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ color: '#6B5C52' }} />
        </button>
      </div>

      {/* ── Mobile slide-down menu ──────────────────────────────────── */}
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
            <div className="pt-2 pb-1 flex items-center gap-3 px-4">
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
        {/* Spacer for mobile top bar */}
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
        {bottomNavItems.map((item) => {
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
        {/* "More" button opens the hamburger menu */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium"
          style={{ color: menuOpen ? '#E8634A' : '#A0917F' }}
        >
          <span className="text-xl leading-none">⋯</span>
          <span>More</span>
        </button>
      </nav>
    </div>
  )
}
