'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Metadata } from 'next'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm border border-white/80 p-8">
        <h1 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
          Log ind på Bullaris
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Skriv din e-mail — vi sender dig et link til at logge ind.
        </p>

        {status === 'sent' ? (
          <div className="rounded-xl bg-[#F0FBF5] border border-[#5B8A6B]/30 p-5 text-center">
            <div className="text-3xl mb-3">📬</div>
            <p className="font-semibold text-[#1E0F00] mb-1">Tjek din e-mail</p>
            <p className="text-sm text-muted-foreground">
              Vi har sendt et login-link til <strong>{email}</strong>.<br />
              Linket udløber om 10 minutter.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1E0F00] mb-1.5"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dit@firma.dk"
                className="w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30 focus:border-bullaris-blue transition"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-60 transition"
            >
              {status === 'loading' ? 'Sender…' : 'Send login-link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-xs text-center text-muted-foreground">
          Har du ikke en konto?{' '}
          <a href="mailto:hello@bullaris.dk" className="underline hover:text-foreground">
            Kontakt os
          </a>
        </p>
      </div>
    </div>
  )
}
