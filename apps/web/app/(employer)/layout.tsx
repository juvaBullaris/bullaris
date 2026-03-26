'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { t } = useLanguage()

  const navItems = [
    { href: '/portal', label: t.nav.portal, icon: '🏢' },
    { href: '/employees', label: t.nav.employees, icon: '👥' },
    { href: '/analytics', label: t.nav.analytics, icon: '📊' },
  ]

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="p-6 border-b">
          <Link href="/portal" className="text-xl font-bold text-bullaris-blue">
            Bullaris HR
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-bullaris-blue/10 text-bullaris-blue'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 py-3 border-t text-xs text-muted-foreground leading-relaxed">
          {t.portal.privacyNotice}
        </div>
        <div className="p-4 border-t space-y-3">
          <LanguageSwitcher />
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <span>🚪</span>
            {t.nav.signOut}
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  )
}
