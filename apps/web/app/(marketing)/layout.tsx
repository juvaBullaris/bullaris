import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bullaris — Employee Financial Wellness for Danish Workplaces',
  description:
    'Help your employees feel confident about their finances. Bullaris gives HR teams a GDPR-compliant financial wellness platform built for Danish SMEs.',
  alternates: {
    canonical: 'https://bullaris.dk',
  },
  openGraph: {
    title: 'Bullaris — Employee Financial Wellness for Danish Workplaces',
    description:
      'Help your employees feel confident about their finances. Bullaris gives HR teams a GDPR-compliant financial wellness platform built for Danish SMEs.',
    url: 'https://bullaris.dk',
    siteName: 'Bullaris',
    locale: 'da_DK',
    type: 'website',
  },
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
