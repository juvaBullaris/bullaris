'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS_EN = ['Introduction', 'Payslip Anatomy', 'Tax & Net Pay', 'Quick Quiz']
const STEPS_DA = ['Introduktion', 'Lønseddelens dele', 'Skat & Nettoløn', 'Hurtig quiz']

interface PayslipRow {
  id: string
  kode: string
  label: string
  payment: string
  deduction: string
  titleEn: string
  titleDa: string
  bodyEn: string
  bodyDa: string
  emoji: string
  color: string
  formula?: { en: string; da: string }
}

const ROWS: PayslipRow[] = [
  {
    id: 'gross',
    kode: '2000',
    label: 'Løn',
    payment: '40.000,00',
    deduction: '',
    emoji: '💰',
    color: '#5B8A6B',
    titleEn: 'Bruttoløn — Gross Salary',
    titleDa: 'Bruttoløn',
    bodyEn:
      'This is your agreed gross salary before any deductions. It should match exactly what your employment contract states. Check this every month — if it differs, contact HR immediately. It is your right and responsibility.',
    bodyDa:
      'Dette er din aftalte bruttoløn inden alle fradrag. Det skal stemme præcis overens med din ansættelseskontrakt. Tjek det hver måned — hvis det afviger, kontakt HR straks. Det er din ret og dit ansvar.',
  },
  {
    id: 'pension_total',
    kode: '',
    label: '17,10% Pensionsbidrag',
    payment: '6.840,00',
    deduction: '',
    emoji: '🏦',
    color: '#7B68A0',
    titleEn: 'Total Pension Contribution (17.10%)',
    titleDa: 'Samlet Pensionsbidrag (17,10%)',
    bodyEn:
      'Most Danish employees contribute 17.10% of gross salary to a pension fund. This money is locked until retirement — you cannot access it early. The amount goes to a pension fund (pensionskasse) chosen by your employer or through a collective agreement.',
    bodyDa:
      'De fleste danske medarbejdere indbetaler 17,10% af bruttolønnen til en pensionskasse. Pengene er låst til pensionering — du kan ikke tilgå dem tidligt. Beløbet går til en pensionskasse valgt af din arbejdsgiver eller via en overenskomst.',
  },
  {
    id: 'pension_own',
    kode: '',
    label: 'Heraf 1/3 eget bidrag',
    payment: '',
    deduction: '2.280,00',
    emoji: '👤',
    color: '#7B68A0',
    titleEn: 'Your Own Pension Share (1/3 ≈ 5.7%)',
    titleDa: 'Dit eget pensionsbidrag (1/3 ≈ 5,7%)',
    bodyEn:
      'Of the total 17.10%, you personally pay 1/3 (≈5.7%). Your employer pays the remaining 2/3 (≈11.4%) on top of your salary. This means your total pension benefit is worth more than just your own contribution — your employer is adding significantly more.',
    bodyDa:
      'Af de samlede 17,10% betaler du selv 1/3 (≈5,7%). Din arbejdsgiver betaler de resterende 2/3 (≈11,4%) oveni din løn. Det betyder at din samlede pensionsfordel er mere værd end blot dit eget bidrag — din arbejdsgiver tilføjer markant mere.',
    formula: {
      en: '40,000 × 5.7% = 2,280 DKK (your share)',
      da: '40.000 × 5,7% = 2.280 kr. (din andel)',
    },
  },
  {
    id: 'atp',
    kode: '7048',
    label: 'ATP Pension, sats F',
    payment: '',
    deduction: '99,00',
    emoji: '🔒',
    color: '#B8860B',
    titleEn: 'ATP — Supplementary Labour Market Pension',
    titleDa: 'ATP — Arbejdsmarkedets Tillægspension',
    bodyEn:
      'ATP is a small mandatory pension paid by everyone in Denmark (≈99 DKK/month for full-time). Unlike private pensions, ATP gives a government-backed guaranteed payout at retirement. Your employer also contributes to ATP — you pay roughly 1/3, your employer 2/3.',
    bodyDa:
      'ATP er et lille obligatorisk pensionsbidrag som alle i Danmark betaler (≈99 kr./md ved fuldtid). I modsætning til private pensioner giver ATP en statsgaranteret udbetaling ved pensionsalderen. Din arbejdsgiver bidrager også til ATP — du betaler ca. 1/3, din arbejdsgiver 2/3.',
  },
  {
    id: 'am',
    kode: '9845',
    label: 'AM-bidrag (8%)',
    payment: '',
    deduction: '3.200,00',
    emoji: '📊',
    color: '#E8634A',
    titleEn: 'AM-bidrag — Labour Market Contribution',
    titleDa: 'AM-bidrag — Arbejdsmarkedsbidrag',
    bodyEn:
      'AM-bidrag is a flat 8% tax deducted from your gross salary before income tax is calculated. It funds the Danish labour market system: unemployment benefits (dagpenge), retraining programmes, and more. Everyone pays it — there are no exemptions based on income level.',
    bodyDa:
      'AM-bidrag er en fast skat på 8% af din bruttoløn, der trækkes inden A-skat beregnes. Det finansierer det danske arbejdsmarkedssystem: dagpenge, jobgenoptræning m.m. Alle betaler det — der er ingen undtagelser baseret på indkomstniveau.',
    formula: {
      en: '40,000 × 8% = 3,200 DKK',
      da: '40.000 × 8% = 3.200 kr.',
    },
  },
  {
    id: 'askat',
    kode: '9850',
    label: 'A-skat',
    payment: '',
    deduction: '10.421,00',
    emoji: '🏛️',
    color: '#E8634A',
    titleEn: 'A-skat — Income Tax',
    titleDa: 'A-skat — Indkomstskat',
    bodyEn:
      'A-skat is your main income tax. The rate comes from your tax card (skattekort) issued by SKAT. It is calculated on your taxable income: gross minus AM-bidrag minus your personal allowance (personfradrag ≈4,160 DKK/month). Most Danes pay an effective rate of 32–42%.\n\nCheck or update your skattekort at skat.dk → "Forskudsopgørelse".',
    bodyDa:
      'A-skat er din primære indkomstskat. Satsen kommer fra dit skattekort udstedt af SKAT. Den beregnes af din skattepligtige indkomst: bruttoløn minus AM-bidrag minus dit personfradrag (≈4.160 kr./md). De fleste danskere betaler en effektiv sats på 32–42%.\n\nTjek eller opdater dit skattekort på skat.dk → "Forskudsopgørelse".',
    formula: {
      en: '(40,000 − 3,200 − 4,160) × 38% ≈ 12,393 DKK*\n*simplified — actual depends on your tax card',
      da: '(40.000 − 3.200 − 4.160) × 38% ≈ 12.393 kr.*\n*forenklet — faktisk afhænger af dit skattekort',
    },
  },
]

interface QuizQ {
  en: string
  da: string
  options: { en: string; da: string }[]
  correct: number
  explanationEn: string
  explanationDa: string
}

const QUIZ: QuizQ[] = [
  {
    en: 'What percentage of your gross salary is AM-bidrag?',
    da: 'Hvad er AM-bidrags procentsats af din bruttoløn?',
    options: [
      { en: '6%', da: '6%' },
      { en: '8%', da: '8%' },
      { en: '10%', da: '10%' },
      { en: '15%', da: '15%' },
    ],
    correct: 1,
    explanationEn: 'Correct! AM-bidrag is always 8% of gross salary, deducted before income tax.',
    explanationDa: 'Korrekt! AM-bidrag er altid 8% af bruttolønnen, trukket inden A-skat.',
  },
  {
    en: 'Where do you receive your Danish payslip?',
    da: 'Hvor modtager du din danske lønseddel?',
    options: [
      { en: 'By email from your employer', da: 'Via e-mail fra din arbejdsgiver' },
      { en: 'In your e-Boks digital mailbox', da: 'I din e-Boks digitale postkasse' },
      { en: 'Via your bank', da: 'Via din bank' },
      { en: 'At the tax office', da: 'På skattecenter' },
    ],
    correct: 1,
    explanationEn: "Your payslip arrives in e-Boks — Denmark's official digital mailbox. Set it up at e-boks.dk.",
    explanationDa: 'Din lønseddel ankommer i e-Boks — Danmarks officielle digitale postkasse. Opret det på e-boks.dk.',
  },
  {
    en: 'Of the total 17.10% pension, how much do YOU personally contribute?',
    da: 'Af de samlede 17,10% pension, hvor meget bidrager DU personligt?',
    options: [
      { en: 'All of it (17.10%)', da: 'Det hele (17,10%)' },
      { en: 'Half (8.55%)', da: 'Halvdelen (8,55%)' },
      { en: 'One third (≈5.7%)', da: 'En tredjedel (≈5,7%)' },
      { en: 'Two thirds (≈11.4%)', da: 'To tredjedele (≈11,4%)' },
    ],
    correct: 2,
    explanationEn: 'You pay 1/3 (≈5.7%). Your employer pays 2/3 (≈11.4%) on top of your salary.',
    explanationDa: 'Du betaler 1/3 (≈5,7%). Din arbejdsgiver betaler 2/3 (≈11,4%) oveni din løn.',
  },
  {
    en: 'When is your salary paid in Denmark?',
    da: 'Hvornår udbetales din løn i Danmark?',
    options: [
      { en: '1st of the month', da: 'Den 1. i måneden' },
      { en: '15th of the month', da: 'Den 15. i måneden' },
      { en: 'Last working day of the month', da: 'Sidste arbejdsdag i måneden' },
      { en: 'Every two weeks', da: 'Hver anden uge' },
    ],
    correct: 2,
    explanationEn: 'Salary is paid on the last working day of each month in Denmark.',
    explanationDa: 'Lønnen udbetales den sidste arbejdsdag i hver måned i Danmark.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function PayslipGuidePage() {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [step, setStep] = useState(0) // 0=intro, 1=anatomy, 2=tax, 3=quiz, 4=done
  const [activeRow, setActiveRow] = useState<string | null>(null)
  const [quizIdx, setQuizIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null))

  const markComplete = trpc.learning.markComplete.useMutation()

  const steps = en ? STEPS_EN : STEPS_DA
  const activeRowData = ROWS.find((r) => r.id === activeRow)
  const score = answers.filter((a, i) => a === QUIZ[i].correct).length

  function goNext() {
    setStep((s) => Math.min(s + 1, 4))
  }
  function goPrev() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function answerQuiz(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    const next = [...answers]
    next[quizIdx] = idx
    setAnswers(next)
  }

  function nextQuestion() {
    if (quizIdx < QUIZ.length - 1) {
      setQuizIdx(quizIdx + 1)
      setSelected(null)
    } else {
      markComplete.mutate({ content_id: 'payslip-guide' })
      setStep(4)
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/learning"
          className="text-sm flex items-center gap-1 mb-4 hover:underline"
          style={{ color: '#9B8B7E' }}
        >
          ← {en ? 'Back to Learning' : 'Tilbage til Læring'}
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">📄</span>
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E0F00' }}>
            {en ? 'Understanding Your Danish Payslip' : 'Forstå din danske lønseddel'}
          </h1>
        </div>
        <p className="text-sm ml-10" style={{ color: '#9B8B7E' }}>
          {en ? '4 sections · ~8 min · Interactive' : '4 sektioner · ≈8 min · Interaktiv'}
        </p>
      </div>

      {/* Progress bar */}
      {step < 4 && (
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{ background: i <= step ? '#E8634A' : '#EDE0D4' }}
              />
              <p
                className="text-xs mt-1.5 font-medium truncate"
                style={{ color: i === step ? '#E8634A' : '#9B8B7E' }}
              >
                {s}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 0: Introduction ────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#1E0F00' }}>
              📬 {en ? 'Where is your payslip?' : 'Hvor er din lønseddel?'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? "In Denmark, payslips are not emailed. They go to your e-Boks — a secure, government-run digital mailbox. Every person with a Danish CPR number has one. The payslip is sent at the end of each month by your employer (or Moderniseringsstyrelsen if you work in the public sector)."
                : 'I Danmark sendes lønsedler ikke via e-mail. De går til din e-Boks — en sikker, statslig digital postkasse. Alle med et dansk CPR-nummer har en. Lønsedlen sendes ved udgangen af hver måned af din arbejdsgiver (eller Moderniseringsstyrelsen hvis du arbejder i den offentlige sektor).'}
            </p>
            <a
              href="https://www.e-boks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all hover:opacity-80"
              style={{ background: '#FDF6EE', border: '1px solid #EDE0D4', color: '#6B5C52' }}
            >
              <span>🔗 e-boks.dk — {en ? 'Usually set up automatically when you open a Danish bank account' : 'Oprettes normalt automatisk når du åbner en dansk bankkonto'}</span>
              <span style={{ color: '#E8634A', fontSize: '12px' }}>↗</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '📅',
                titleEn: 'When?',
                titleDa: 'Hvornår?',
                bodyEn: 'Last working day of the month. The money hits your account the same day.',
                bodyDa: 'Sidste arbejdsdag i måneden. Pengene ankommer til din konto samme dag.',
              },
              {
                icon: '✅',
                titleEn: 'What to check?',
                titleDa: 'Hvad tjekker du?',
                bodyEn: 'Gross salary matches your contract. Tax rate matches your tax card. Both every month.',
                bodyDa: 'Bruttolønnen stemmer med din kontrakt. Skattesatsen stemmer med dit skattekort. Begge hver måned.',
              },
              {
                icon: '❗',
                titleEn: 'Something wrong?',
                titleDa: 'Noget forkert?',
                bodyEn: "Contact the HR consultant who issued your contract — it is their job to fix salary errors.",
                bodyDa: 'Kontakt den HR-konsulent, der udstedte din kontrakt — det er deres job at rette løn-fejl.',
              },
            ].map((c) => (
              <div
                key={c.titleEn}
                className="rounded-xl p-5"
                style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
              >
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1E0F00' }}>
                  {en ? c.titleEn : c.titleDa}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B5C52' }}>
                  {en ? c.bodyEn : c.bodyDa}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: Interactive Anatomy ─────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <p className="text-sm mb-5" style={{ color: '#6B5C52' }}>
            👆 {en ? 'Click any row on the payslip to learn what it means.' : 'Klik på en linje på lønsedlen for at se hvad den betyder.'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Mock payslip */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid #EDE0D4', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}
            >
              {/* Header bar */}
              <div
                className="px-4 py-2.5 flex justify-between items-center"
                style={{ background: '#1E0F00', color: '#FFF8F3' }}
              >
                <span className="font-bold text-xs tracking-widest">LØNSEDDEL — NOV. 2024</span>
                <span className="opacity-60 text-xs">EKSEMPEL A/S</span>
              </div>

              {/* Column headers */}
              <div
                className="px-4 py-2 grid grid-cols-12 font-bold border-b"
                style={{ background: '#F5F0EB', color: '#6B5C52', borderColor: '#EDE0D4' }}
              >
                <span className="col-span-2">Kode</span>
                <span className="col-span-6">Art</span>
                <span className="col-span-2 text-right">Ydelse</span>
                <span className="col-span-2 text-right">Fradrag</span>
              </div>

              {/* Rows */}
              {ROWS.map((row) => {
                const active = activeRow === row.id
                return (
                  <button
                    key={row.id}
                    onClick={() => setActiveRow(active ? null : row.id)}
                    className="w-full px-4 py-2 grid grid-cols-12 text-left transition-all"
                    style={{
                      background: active ? row.color : 'transparent',
                      color: active ? '#fff' : '#1E0F00',
                      borderBottom: '1px solid #EDE0D4',
                    }}
                  >
                    <span className="col-span-2 opacity-50">{row.kode}</span>
                    <span className="col-span-6 font-medium">{row.label}</span>
                    <span
                      className="col-span-2 text-right"
                      style={{ color: active ? '#fff' : row.payment ? '#5B8A6B' : 'transparent' }}
                    >
                      {row.payment || '—'}
                    </span>
                    <span
                      className="col-span-2 text-right"
                      style={{ color: active ? '#fff' : row.deduction ? '#C0392B' : 'transparent' }}
                    >
                      {row.deduction || '—'}
                    </span>
                  </button>
                )
              })}

              {/* Totals */}
              <div
                className="px-4 py-2 grid grid-cols-12 font-bold border-t-2 text-xs"
                style={{ borderColor: '#1E0F00', background: '#F5F0EB' }}
              >
                <span className="col-span-8">Ydelser / Fradrag i alt</span>
                <span className="col-span-2 text-right" style={{ color: '#5B8A6B' }}>40.000,00</span>
                <span className="col-span-2 text-right" style={{ color: '#C0392B' }}>16.000,00</span>
              </div>
              <div
                className="px-4 py-3 grid grid-cols-12"
                style={{ background: '#1E0F00', color: '#FFF8F3' }}
              >
                <span className="col-span-7 font-bold text-xs">TIL DISPOSITION (Nettoløn)</span>
                <span className="col-span-5 text-right font-bold text-base">24.000,00 DKK</span>
              </div>

              {/* Skattekort strip */}
              <div
                className="px-4 py-3 text-xs grid grid-cols-3 gap-2"
                style={{ background: '#FDF6EE', borderTop: '1px solid #EDE0D4', color: '#6B5C52' }}
              >
                <div>
                  <div className="font-bold mb-0.5">Skattekort</div>
                  <div>Fradrag: 4.160</div>
                  <div>Trækpct.: 38%</div>
                </div>
                <div>
                  <div className="font-bold mb-0.5">AM-indkomst</div>
                  <div>36.800,00</div>
                </div>
                <div>
                  <div className="font-bold mb-0.5">Aflønningsbrøk</div>
                  <div>1/1 (fuldtid)</div>
                </div>
              </div>
            </div>

            {/* Explanation panel */}
            <div
              className="rounded-xl p-6 flex flex-col"
              style={{
                background: '#FFF8F3',
                border: activeRowData ? `2px solid ${activeRowData.color}` : '1px solid #EDE0D4',
                minHeight: '320px',
                transition: 'border-color 0.2s',
              }}
            >
              {activeRowData ? (
                <div>
                  <div className="text-3xl mb-3">{activeRowData.emoji}</div>
                  <h3 className="font-serif text-lg font-bold mb-3" style={{ color: '#1E0F00' }}>
                    {en ? activeRowData.titleEn : activeRowData.titleDa}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
                    {en ? activeRowData.bodyEn : activeRowData.bodyDa}
                  </p>
                  {activeRowData.formula && (
                    <div
                      className="mt-4 rounded-lg p-3 text-xs font-mono whitespace-pre-line"
                      style={{ background: '#FDF6EE', border: '1px solid #EDE0D4', color: '#3D2B1F' }}
                    >
                      {en ? activeRowData.formula.en : activeRowData.formula.da}
                    </div>
                  )}
                  {activeRowData.id === 'askat' && (
                    <a
                      href="https://www.skat.dk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center gap-1.5 text-xs font-medium hover:underline"
                      style={{ color: '#E8634A' }}
                    >
                      🔗 {en ? 'Update your skattekort at skat.dk ↗' : 'Opdater dit skattekort på skat.dk ↗'}
                    </a>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center gap-3">
                  <div className="text-4xl opacity-30">👈</div>
                  <p className="text-sm" style={{ color: '#9B8B7E' }}>
                    {en
                      ? 'Click any highlighted row on the payslip to see an explanation here.'
                      : 'Klik på en linje på lønsedlen for at se forklaring her.'}
                  </p>
                  <p className="text-xs" style={{ color: '#B5A89D' }}>
                    {en ? `${ROWS.length} rows to explore` : `${ROWS.length} linjer at udforske`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Tax & Net Pay Flow ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm mb-2" style={{ color: '#6B5C52' }}>
            {en
              ? 'Here is exactly how your net pay is calculated from your gross salary — step by step.'
              : 'Sådan beregnes din nettoløn fra din bruttoløn — trin for trin.'}
          </p>

          {[
            {
              labelEn: 'Start: Gross salary',
              labelDa: 'Start: Bruttoløn',
              amount: '+40.000',
              noteEn: 'What your employer agreed to pay',
              noteDa: 'Hvad din arbejdsgiver aftalte at betale',
              fg: '#2D5C3E',
              bg: '#F0FBF5',
              border: '#A3C9B0',
              big: false,
            },
            {
              labelEn: 'AM-bidrag deducted (8%)',
              labelDa: 'AM-bidrag trækkes (8%)',
              amount: '−3.200',
              noteEn: 'Flat rate — funds unemployment & retraining',
              noteDa: 'Fast sats — finansierer dagpenge og jobgenoptræning',
              fg: '#C0392B',
              bg: '#FFF8F3',
              border: '#EDE0D4',
              big: false,
            },
            {
              labelEn: 'A-indkomst (taxable base)',
              labelDa: 'A-indkomst (skattegrundlag)',
              amount: '= 36.800',
              noteEn: 'After AM-bidrag. Your personfradrag (≈4,160/month) is deducted here.',
              noteDa: 'Efter AM-bidrag. Dit personfradrag (≈4.160/md) fradrages her.',
              fg: '#1E0F00',
              bg: '#FDF6EE',
              border: '#EDE0D4',
              big: false,
            },
            {
              labelEn: 'A-skat (income tax at 38%)',
              labelDa: 'A-skat (indkomstskat ved 38%)',
              amount: '−10.421',
              noteEn: '(36,800 − 4,160 personfradrag) × 38% — rate from your tax card',
              noteDa: '(36.800 − 4.160 personfradrag) × 38% — sats fra dit skattekort',
              fg: '#C0392B',
              bg: '#FFF8F3',
              border: '#EDE0D4',
              big: false,
            },
            {
              labelEn: 'ATP deducted',
              labelDa: 'ATP trækkes',
              amount: '−99',
              noteEn: 'Fixed mandatory supplementary pension',
              noteDa: 'Fast obligatorisk tillægspension',
              fg: '#B8860B',
              bg: '#FFFBF0',
              border: '#EDE0D4',
              big: false,
            },
            {
              labelEn: 'Your pension share (5.7%)',
              labelDa: 'Dit pensionsbidrag (5,7%)',
              amount: '−2.280',
              noteEn: '1/3 of 17.10% — goes to your pension fund',
              noteDa: '1/3 af 17,10% — går til din pensionskasse',
              fg: '#7B68A0',
              bg: '#F8F6FD',
              border: '#EDE0D4',
              big: false,
            },
            {
              labelEn: 'Net pay to your Nemkonto',
              labelDa: 'Nettoløn til din Nemkonto',
              amount: '24.000',
              noteEn: 'Transferred on the last working day of the month',
              noteDa: 'Overføres den sidste arbejdsdag i måneden',
              fg: '#FFF8F3',
              bg: '#1E0F00',
              border: '#1E0F00',
              big: true,
            },
          ].map((row, i) => (
            <div
              key={i}
              className="rounded-xl px-5 py-4 flex items-center justify-between"
              style={{ background: row.bg, border: `1px solid ${row.border}` }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: row.fg }}>
                  {en ? row.labelEn : row.labelDa}
                </p>
                <p className="text-xs mt-0.5" style={{ color: row.big ? '#B5A89D' : '#9B8B7E' }}>
                  {en ? row.noteEn : row.noteDa}
                </p>
              </div>
              <span
                className="font-mono font-bold ml-4 shrink-0"
                style={{ fontSize: row.big ? '20px' : '14px', color: row.fg }}
              >
                {row.amount} DKK
              </span>
            </div>
          ))}

          <div
            className="rounded-xl p-4 text-xs leading-relaxed"
            style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#6B5C52' }}
          >
            💡 <strong>{en ? 'Tip:' : 'Tip:'}</strong>{' '}
            {en
              ? "Your employer also pays 2/3 of the pension (≈11.4%) and part of ATP on TOP of your gross. Your real total compensation is 40,000 + 4,560 (employer pension) = ~44,560 DKK — significantly more than your payslip shows."
              : 'Din arbejdsgiver betaler også 2/3 af pensionen (≈11,4%) og en del af ATP OVEN I din bruttoløn. Din reelle totalkompensation er 40.000 + 4.560 (arbejdsgiver pension) = ≈44.560 kr. — markant mere end din lønseddel viser.'}
          </div>
        </div>
      )}

      {/* ── STEP 3: Quiz ────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div>
          {/* Progress dots */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold" style={{ color: '#1E0F00' }}>
              {en ? `Question ${quizIdx + 1} / ${QUIZ.length}` : `Spørgsmål ${quizIdx + 1} / ${QUIZ.length}`}
            </h2>
            <div className="flex gap-2">
              {QUIZ.map((q, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    background:
                      answers[i] !== null
                        ? answers[i] === q.correct ? '#5B8A6B' : '#E8634A'
                        : i === quizIdx ? '#1E0F00' : '#EDE0D4',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <div
            className="rounded-2xl p-6 mb-5"
            style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
          >
            <p className="font-medium" style={{ color: '#1E0F00' }}>
              {en ? QUIZ[quizIdx].en : QUIZ[quizIdx].da}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-5">
            {QUIZ[quizIdx].options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === QUIZ[quizIdx].correct
              let bg = '#FFF8F3'
              let border = '#EDE0D4'
              let color = '#1E0F00'

              if (selected !== null) {
                if (isCorrect) { bg = '#F0FBF5'; border = '#5B8A6B'; color = '#2D5C3E' }
                else if (isSelected && !isCorrect) { bg = '#FFF0EC'; border = '#E8634A'; color = '#C0392B' }
              }

              return (
                <button
                  key={i}
                  onClick={() => answerQuiz(i)}
                  disabled={selected !== null}
                  className="w-full text-left rounded-xl px-5 py-4 text-sm font-medium transition-all"
                  style={{ background: bg, border: `2px solid ${border}`, color }}
                >
                  <span className="mr-3 font-bold opacity-40">{String.fromCharCode(65 + i)}.</span>
                  {en ? opt.en : opt.da}
                  {selected !== null && isCorrect && <span className="float-right">✓</span>}
                  {selected !== null && isSelected && !isCorrect && <span className="float-right">✗</span>}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {selected !== null && (
            <>
              <div
                className="rounded-xl p-4 text-sm mb-4"
                style={{
                  background: selected === QUIZ[quizIdx].correct ? '#F0FBF5' : '#FFF0EC',
                  border: `1px solid ${selected === QUIZ[quizIdx].correct ? '#5B8A6B' : '#E8634A'}`,
                  color: selected === QUIZ[quizIdx].correct ? '#2D5C3E' : '#C0392B',
                }}
              >
                {selected === QUIZ[quizIdx].correct ? '✓ ' : '✗ '}
                {en ? QUIZ[quizIdx].explanationEn : QUIZ[quizIdx].explanationDa}
              </div>
              <button
                onClick={nextQuestion}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white"
                style={{ background: '#E8634A' }}
              >
                {quizIdx < QUIZ.length - 1
                  ? (en ? 'Next question →' : 'Næste spørgsmål →')
                  : (en ? 'See my score →' : 'Se min score →')}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── STEP 4: Done ────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="text-center py-10">
          <div className="text-6xl mb-5">
            {score === QUIZ.length ? '🎉' : score >= 3 ? '👍' : '📚'}
          </div>
          <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#1E0F00' }}>
            {en ? `${score} / ${QUIZ.length} correct` : `${score} / ${QUIZ.length} rigtige`}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6B5C52' }}>
            {score === QUIZ.length
              ? (en ? 'Perfect! You fully understand your Danish payslip.' : 'Perfekt! Du forstår din danske lønseddel fuldt ud.')
              : score >= 3
              ? (en ? 'Well done! Review the sections you missed.' : 'Godt klaret! Gennemgå de sektioner du missede.')
              : (en ? 'Keep going — go back and review the material.' : 'Bliv ved — gå tilbage og gennemgå materialet.')}
          </p>

          {/* Score breakdown */}
          <div className="rounded-2xl p-5 mb-8 text-left space-y-2 max-w-sm mx-auto"
            style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            {QUIZ.map((q, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: answers[i] === q.correct ? '#5B8A6B' : '#E8634A' }}>
                  {answers[i] === q.correct ? '✓' : '✗'}
                </span>
                <span style={{ color: '#3D2B1F' }}>{en ? q.en : q.da}</span>
              </div>
            ))}
          </div>

          {/* Next module */}
          <div className="max-w-sm mx-auto mb-8">
            <p className="text-xs font-medium mb-2" style={{ color: '#9B8B7E' }}>
              {en ? 'UP NEXT IN BASICS' : 'NÆSTE I DET GRUNDLÆGGENDE'}
            </p>
            <Link
              href="/learning/tax-basics"
              className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:opacity-90"
              style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1E0F00' }}>
                  📊 {en ? 'Danish Tax Basics 2026' : 'Danske skatter — det grundlæggende 2026'}
                </p>
                <p className="text-xs" style={{ color: '#6B5C52' }}>
                  {en ? 'AM-bidrag, bundskat, live calculator →' : 'AM-bidrag, bundskat, live beregner →'}
                </p>
              </div>
              <span style={{ color: '#E8634A' }}>→</span>
            </Link>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setStep(0)
                setQuizIdx(0)
                setSelected(null)
                setAnswers(Array(QUIZ.length).fill(null))
              }}
              className="rounded-xl px-6 py-3 text-sm font-medium border"
              style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
            >
              {en ? 'Restart module' : 'Genstart modul'}
            </button>
            <Link
              href="/learning"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{ background: '#1E0F00' }}
            >
              {en ? 'Back to Learning →' : 'Tilbage til Læring →'}
            </Link>
          </div>
        </div>
      )}

      {/* ── Bottom navigation ───────────────────────────────────────────────── */}
      {step < 4 && (
        <div
          className="flex justify-between items-center mt-8 pt-6"
          style={{ borderTop: '1px solid #EDE0D4' }}
        >
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="rounded-xl px-5 py-2.5 text-sm font-medium border disabled:opacity-30"
            style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
          >
            ← {en ? 'Previous' : 'Forrige'}
          </button>

          {step < 3 && (
            <button
              onClick={goNext}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: '#E8634A' }}
            >
              {step === 2
                ? (en ? 'Take the quiz →' : 'Tag quizzen →')
                : (en ? 'Next →' : 'Næste →')}
            </button>
          )}

          {step === 3 && (
            <span className="text-xs" style={{ color: '#9B8B7E' }}>
              {en ? 'Answer to continue' : 'Besvar for at fortsætte'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
