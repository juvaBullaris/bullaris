'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

const SECTIONS = [
  {
    id: 'tastselv',
    icon: '🖥️',
    da: {
      title: 'Hvad er TastSelv, og hvornår skal du bruge det?',
      content: [
        'TastSelv er SKATs selvbetjeningsportal på skat.dk, hvor du indberetter din selvangivelse (årsopgørelse) og retter fejl i din forskudsopgørelse. Alle med dansk CPR-nummer har adgang via MitID.',
        'Deadline er 1. maj hvert år — med mindre du er selvstændig, hvor fristen er 1. juli. Overskrides fristen, sender SKAT automatisk en opkrævning baseret på de tal, de allerede kender.',
        'De fleste lønmodtagere behøver faktisk ikke gøre noget: SKAT modtager automatisk løn- og pensionsindberetninger fra arbejdsgiver. Men det er stadig dit ansvar at kontrollere tallene og tilføje fradrag, som SKAT ikke kender til.',
      ],
      source: 'Kilde: SKAT Vejledning 2026 — Årsopgørelse for lønmodtagere',
    },
    en: {
      title: 'What is TastSelv, and when do you use it?',
      content: [
        'TastSelv is the Danish Tax Authority\'s (SKAT) self-service portal at skat.dk. You use it to file your annual tax return (årsopgørelse) and correct your preliminary tax assessment (forskudsopgørelse). Access requires MitID.',
        'The deadline is 1 May each year — 1 July for self-employed. If you miss the deadline, SKAT automatically issues an assessment based on what they already know.',
        'Most employees don\'t need to do anything: SKAT receives salary and pension data directly from employers. But it\'s still your responsibility to verify the numbers and add deductions SKAT doesn\'t know about.',
      ],
      source: 'Source: SKAT Vejledning 2026 — Annual tax return for employees',
    },
  },
  {
    id: 'prefilled',
    icon: '✅',
    da: {
      title: 'Hvad er allerede udfyldt af SKAT?',
      content: [
        'SKAT modtager automatisk følgende fra tredjeparter og udfylder dem i din årsopgørelse:',
        '• AM-bidrag og A-skat — indberettet af din arbejdsgiver',
        '• ATP-bidrag — indberettet af din arbejdsgiver',
        '• Renteudgifter på banklån og realkreditlån — indberettet af din bank',
        '• Pensionsindberetninger — fra pensionsselskabet',
        '• Aktieudbytter — fra dit pengeinstitut',
        'Tip: Selv om SKAT har fået tallene, kan der forekomme fejl — særligt hvis du har skiftet job midt på året, haft to arbejdsgivere eller modtaget engangsudbetalinger.',
      ],
      source: 'Kilde: SKAT.dk — Hvad er fortrykt på årsopgørelsen (2026)',
    },
    en: {
      title: 'What does SKAT pre-fill for you?',
      content: [
        'SKAT automatically receives the following from third parties and pre-fills them in your annual return:',
        '• AM-bidrag and A-skat — reported by your employer',
        '• ATP contributions — reported by your employer',
        '• Interest on bank and mortgage loans — reported by your bank',
        '• Pension contributions — from your pension provider',
        '• Share dividends — from your bank',
        'Tip: Even though SKAT has the data, errors can occur — especially if you changed jobs mid-year, had two employers, or received one-off payments.',
      ],
      source: 'Source: SKAT.dk — Pre-filled items in annual return (2026)',
    },
  },
  {
    id: 'deductions',
    icon: '🧾',
    da: {
      title: 'Hvad skal du selv tjekke og tilføje?',
      content: [
        'Disse fradrag kender SKAT ikke til automatisk — du skal selv indberette dem:',
        '• Befordringsfradrag: Kørsel til/fra arbejde over 24 km pr. dag. Beregnes som antal arbejdsdage × km-sats (2026: 2,23 kr./km for km 25–120, 1,12 kr./km derover).',
        '• Fagforeningskontingent (a-kasse + fagforening): Op til 6.000 kr./år i fradrag (2026).',
        '• Håndværkerfradrag (BoligJobordningen): Udgifter til godkendte håndværkere i din bolig — op til 12.200 kr./person i 2026.',
        '• Dagsinstitution/SFO: Op til 6.400 kr. pr. barn (maks. 2 børn) — se din profil.',
        '• Underholdsbidrag: Betalt bidrag til ekspartner eller børn kan fradrages.',
        'Husk: Du kan gå 3 år tilbage og lave rettelser. Det er aldrig for sent at hente penge du har tabt.',
      ],
      source: 'Kilde: SKAT Vejledning 2026; Finanstilsynet bedste praksis',
    },
    en: {
      title: 'What should you check and add yourself?',
      content: [
        'SKAT doesn\'t automatically know about these deductions — you must declare them yourself:',
        '• Commuting deduction: Driving to/from work over 24 km per day. Calculated as working days × km rate (2026: DKK 2.23/km for km 25–120, DKK 1.12/km beyond).',
        '• Union + unemployment fund fees: Up to DKK 6,000/year deduction (2026).',
        '• Home improvement deduction (BoligJobordningen): Approved craftsman costs — up to DKK 12,200 per person in 2026.',
        '• Daycare/SFO: Up to DKK 6,400 per child (max 2 children) — see your profile.',
        '• Maintenance payments: Paid to an ex-partner or children can be deducted.',
        'Remember: You can go back 3 years to make corrections. It\'s never too late to claim money you\'ve missed.',
      ],
      source: 'Source: SKAT Vejledning 2026; Finanstilsynet best practice',
    },
  },
  {
    id: 'aarsopgoerelse',
    icon: '📬',
    da: {
      title: 'Sådan læser du din årsopgørelse',
      content: [
        'Din årsopgørelse viser det endelige regnskab for skatteåret. Den er tilgængelig i TastSelv fra ca. 15. marts.',
        'De to vigtigste tal:',
        '• Restskat (du skylder penge): Beløbet tilbageholdes i din løn over 10 måneder fra september. Over 23.489 kr. (2026) opkræves renter.',
        '• Overskydende skat (du får penge tilbage): Udbetales automatisk til din NemKonto i april.',
        'Hvad gør du, hvis tallene er forkerte? Log ind på TastSelv → Ret årsopgørelsen → tilføj manglende fradrag eller korriger indkomst. Fristen for rettelser er normalt 1. maj i det efterfølgende år — men du kan altid anmode om ekstraordinær genoptagelse for 3 år tilbage.',
      ],
      source: 'Kilde: SKAT.dk — Årsopgørelse 2026; SKAT Vejledning til lønmodtagere',
    },
    en: {
      title: 'How to read your årsopgørelse (annual tax statement)',
      content: [
        'Your årsopgørelse shows the final settlement for the tax year. It\'s available in TastSelv from around 15 March.',
        'The two key figures:',
        '• Restskat (you owe money): Deducted from your salary over 10 months from September. Amounts above DKK 23,489 (2026) incur interest.',
        '• Overskydende skat (you get money back): Paid automatically to your NemKonto in April.',
        'What if the numbers are wrong? Log in to TastSelv → Edit your årsopgørelse → add missing deductions or correct income. The correction deadline is normally 1 May the following year — but you can always request an extraordinary reopening up to 3 years back.',
      ],
      source: 'Source: SKAT.dk — Annual tax statement 2026; SKAT guide for employees',
    },
  },
]

export default function TaxReturnPage() {
  const { t, locale } = useLanguage()
  const en = locale === 'en'
  const [expandedId, setExpandedId] = useState<string | null>('tastselv')

  const progressQuery = trpc.learning.myProgress.useQuery()
  const markComplete  = trpc.learning.markComplete.useMutation({
    onSuccess: () => progressQuery.refetch(),
  })

  const isDone = progressQuery.data?.some((p) => p.contentId === 'tax-return') ?? false

  return (
    <div className="max-w-2xl">
      {/* Back */}
      <Link href="/learning" className="text-sm mb-6 inline-block" style={{ color: '#A0917F' }}>
        ← {en ? 'Back to Learning Hub' : 'Tilbage til læringsbiblioteket'}
      </Link>

      {/* Hero */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <div className="flex items-start gap-4">
          <span className="text-4xl">📬</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#E8634A' }}>
              {en ? 'Learning module · ~12 min' : 'Læringsmodul · ~12 min'}
            </p>
            <h1 className="font-serif text-2xl font-bold mb-1" style={{ color: '#1E0F00' }}>
              {en ? 'TastSelv & Your Annual Tax Return' : 'TastSelv og din årsopgørelse'}
            </h1>
            <p className="text-sm" style={{ color: '#6B5C52' }}>
              {en
                ? 'Learn how to use TastSelv, what SKAT pre-fills, which deductions you must add yourself, and how to read your annual tax statement.'
                : 'Lær at bruge TastSelv, hvad SKAT udfylder for dig, hvilke fradrag du selv skal tilføje, og hvordan du læser din årsopgørelse.'}
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3 mb-8">
        {SECTIONS.map((section, idx) => {
          const sd = en ? section.en : section.da
          const isOpen = expandedId === section.id
          return (
            <div
              key={section.id}
              className="rounded-2xl overflow-hidden"
              style={{ border: '1px solid #EDE0D4' }}
            >
              <button
                onClick={() => setExpandedId(isOpen ? null : section.id)}
                className="w-full flex items-center gap-4 p-5 text-left transition-colors"
                style={{ background: isOpen ? '#FFF8F3' : '#fff' }}
              >
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: '#FDF6EE', border: '1.5px solid #EDE0D4' }}
                >
                  {section.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium mb-0.5" style={{ color: '#A0917F' }}>
                    {en ? `Section ${idx + 1}` : `Afsnit ${idx + 1}`}
                  </p>
                  <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>{sd.title}</p>
                </div>
                <span style={{ color: '#A0917F', fontSize: 18 }}>{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5" style={{ background: '#fff' }}>
                  <div className="space-y-3 mt-2">
                    {sd.content.map((line, i) => (
                      <p key={i} className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs mt-4 italic" style={{ color: '#A0917F' }}>{sd.source}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
        <p className="text-sm font-semibold mb-1" style={{ color: '#1E0F00' }}>
          {en ? 'Put it into practice' : 'Sæt det i praksis'}
        </p>
        <p className="text-sm mb-4" style={{ color: '#6B5C52' }}>
          {en
            ? 'Use the Tax Planner to model your deductions and see how they affect your net pay.'
            : 'Brug skatteberegneren til at modellere dine fradrag og se, hvordan de påvirker din nettoudbetaling.'}
        </p>
        <Link
          href="/tax-planner"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition"
          style={{ background: '#E8634A' }}
        >
          {en ? 'Open Tax Planner →' : 'Åbn skatteberegner →'}
        </Link>
      </div>

      {/* Mark complete */}
      {!isDone ? (
        <button
          onClick={() => markComplete.mutate({ content_id: 'tax-return' })}
          disabled={markComplete.isPending}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-50 transition"
          style={{ background: '#16A34A' }}
        >
          {markComplete.isPending ? '...' : (en ? '✓ Mark as complete' : '✓ Markér som fuldført')}
        </button>
      ) : (
        <div className="rounded-xl py-3 text-center text-sm font-semibold" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #86EFAC' }}>
          ✓ {en ? 'Module completed' : 'Modul fuldført'}
        </div>
      )}
    </div>
  )
}
