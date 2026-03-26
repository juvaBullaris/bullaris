import type { Metadata } from 'next'
import { Lora, DM_Sans } from 'next/font/google'
import { TRPCProvider } from '@/lib/providers'
import { LanguageProvider } from '@/lib/language-context'
import './globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Bullaris — Finansiel klarhed til danske medarbejdere',
    template: '%s | Bullaris',
  },
  description:
    'Bullaris hjælper danske medarbejdere med at forstå deres løn, skat og personlige økonomi.',
  metadataBase: new URL('https://bullaris.dk'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="da" className={`${lora.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <TRPCProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </TRPCProvider>
      </body>
    </html>
  )
}
