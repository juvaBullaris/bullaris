'use client'

import { useLanguage, type Locale } from '@/lib/language-context'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  const options: { value: Locale; label: string }[] = [
    { value: 'da', label: 'DA' },
    { value: 'en', label: 'EN' },
  ]

  return (
    <div
      className="flex items-center rounded-full border border-stone-200 bg-white p-0.5 text-xs font-semibold"
      role="group"
      aria-label="Language switcher"
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          aria-label={`Switch to ${value === 'da' ? 'Danish' : 'English'}`}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            locale === value
              ? 'bg-bullaris-blue text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
