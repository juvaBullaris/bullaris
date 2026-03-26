'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import da from '@/locales/da.json'
import en from '@/locales/en.json'

export type Locale = 'da' | 'en'

// Use da as the canonical shape
type Translations = typeof da

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('da')

  useEffect(() => {
    const stored = localStorage.getItem('bullaris-locale') as Locale | null
    if (stored === 'da' || stored === 'en') setLocaleState(stored)
  }, [])

  function setLocale(next: Locale) {
    setLocaleState(next)
    localStorage.setItem('bullaris-locale', next)
  }

  const t = (locale === 'en' ? en : da) as Translations

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
