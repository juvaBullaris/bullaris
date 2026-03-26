import type { Metadata } from 'next'
import { HRAuditFlow } from '@/components/audit/HRAuditFlow'

export const metadata: Metadata = {
  title: 'Financial Stress Audit — Bullaris',
  description:
    'Take the free 5-question HR Financial Stress Audit. Find out where your organisation stands and get a personalised action plan — in under 3 minutes.',
  robots: { index: false, follow: false },
}

export default function AuditPage() {
  return <HRAuditFlow />
}
