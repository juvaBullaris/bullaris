import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="bg-white rounded-2xl shadow-sm border border-white/80 p-8">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
          Ingen adgang
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Du har ikke adgang til denne side. Kontakt din HR-afdeling, hvis du mener dette er en fejl.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 transition"
          >
            Gå til oversigt
          </Link>
          <Link
            href="/login"
            className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition"
          >
            Log ind med en anden konto
          </Link>
        </div>
      </div>
    </div>
  )
}
