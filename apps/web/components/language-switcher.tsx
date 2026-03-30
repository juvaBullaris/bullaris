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
      className="flex items-center rounded-full p-0.5 text-xs font-semibold"
      style={{ background: '#EDE0D4' }}
      role="group"
      aria-label="Language switcher"
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className="rounded-full px-3 py-1 transition-colors"
          style={{
            background: locale === value ? '#E8634A' : 'transparent',
            color: locale === value ? '#fff' : '#6B5C52',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
