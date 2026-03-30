'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { t } = useLanguage()

  const navItems = [
    { href: '/dashboard', label: t.nav.dashboard, icon: '🏠' },
    { href: '/payslip', label: t.nav.payslip, icon: '📄' },
    { href: '/tax-planner', label: t.nav.taxPlanner, icon: '🧮' },
    { href: '/goals', label: t.nav.goals, icon: '🎯' },
    { href: '/chat', label: t.nav.chat, icon: '💬' },
    { href: '/learning', label: t.nav.learning, icon: '📚' },
  ]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FDF6EE' }}>
      <aside className="w-60 flex flex-col shrink-0" style={{ background: '#FFF8F3', borderRight: '1px solid #EDE0D4' }}>
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
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
