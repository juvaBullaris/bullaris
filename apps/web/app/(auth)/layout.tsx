import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bullaris-sand flex flex-col">
      <header className="p-6">
        <Link href="/" className="text-xl font-bold text-bullaris-blue font-serif">
          Bullaris
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        {children}
      </main>
    </div>
  )
}
