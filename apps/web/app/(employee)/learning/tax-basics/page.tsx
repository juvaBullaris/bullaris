'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

// ─── Tax Calculation (2026 rules) ─────────────────────────────────────────────

const MUNICIPALITIES = [
  { label: 'National average', labelDa: 'Landsgennemsnit', rate: 25.049 },
  { label: 'Copenhagen', labelDa: 'København', rate: 23.39 },
  { label: 'Frederiksberg', labelDa: 'Frederiksberg', rate: 22.80 },
  { label: 'Aarhus', labelDa: 'Aarhus', rate: 24.50 },
  { label: 'Odense', labelDa: 'Odense', rate: 25.30 },
  { label: 'Brønderslev (highest)', labelDa: 'Brønderslev (højeste)', rate: 26.30 },
]

interface TaxResult {
  gross: number
  amBidrag: number
  afterAM: number
  bundskat: number
  kommuneskat: number
  mellemskat: number
  topskat: number
  toptopskat: number
  totalTax: number
  netMonthly: number
  effectiveRate: number
  activeBrackets: string[]
}

function calcTax(grossAnnual: number, kommuneRate: number): TaxResult {
  const amBidrag = Math.round(grossAnnual * 0.08)
  const afterAM = grossAnnual - amBidrag
  const personfradrag = 54100
  const beskæftigelsesfradrag = Math.min(Math.round(afterAM * 0.1275), 63300)
  const taxableIncome = Math.max(0, afterAM - personfradrag - beskæftigelsesfradrag)

  const bundskat = Math.round(Math.max(0, afterAM - personfradrag) * 0.1201)
  const kommuneskat = Math.round(taxableIncome * (kommuneRate / 100))
  const mellemskat = Math.round(Math.max(0, afterAM - 641200) * 0.075)
  const topskat = Math.round(Math.max(0, afterAM - 777900) * 0.075)
  const toptopskat = Math.round(Math.max(0, afterAM - 2592700) * 0.05)

  const totalTax = amBidrag + bundskat + kommuneskat + mellemskat + topskat + toptopskat
  const netAnnual = grossAnnual - totalTax
  const netMonthly = Math.round(netAnnual / 12)
  const effectiveRate = Math.round((totalTax / grossAnnual) * 1000) / 10

  const activeBrackets: string[] = ['am', 'bund', 'kommune']
  if (mellemskat > 0) activeBrackets.push('mellem')
  if (topskat > 0) activeBrackets.push('top')
  if (toptopskat > 0) activeBrackets.push('toptop')

  return { gross: grossAnnual, amBidrag, afterAM, bundskat, kommuneskat, mellemskat, topskat, toptopskat, totalTax, netMonthly, effectiveRate, activeBrackets }
}

const fmt = (n: number) => n.toLocaleString('da-DK') + ' kr.'
const fmtPct = (n: number, total: number) => ((n / total) * 100).toFixed(1) + '%'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS_EN = ['The Tax System', 'Tax Brackets', 'Live Calculator', 'Quiz']
const STEPS_DA = ['Skattesystemet', 'Skattebånd', 'Live beregner', 'Quiz']

interface BracketInfo {
  id: string
  nameEn: string
  nameDa: string
  rate: string
  thresholdEn: string
  thresholdDa: string
  whoEn: string
  whoDa: string
  bodyEn: string
  bodyDa: string
  color: string
  bg: string
}

const BRACKETS: BracketInfo[] = [
  {
    id: 'am',
    nameEn: 'AM-bidrag',
    nameDa: 'AM-bidrag',
    rate: '8%',
    thresholdEn: 'On all gross income',
    thresholdDa: 'Af al bruttoindkomst',
    whoEn: 'Everyone',
    whoDa: 'Alle',
    bodyEn:
      'AM-bidrag (arbejdsmarkedsbidrag) is Denmark\'s flat 8% labour market contribution. It is deducted FIRST — before any other tax is calculated. This makes it effectively the first layer of Danish taxation. From 2026, employees under 18 are exempt.',
    bodyDa:
      'AM-bidrag (arbejdsmarkedsbidrag) er Danmarks flade 8% arbejdsmarkedsbidrag. Det trækkes FØRST — inden nogen anden skat beregnes. Det gør det reelt til det første lag af dansk beskatning. Fra 2026 er medarbejdere under 18 fritaget.',
    color: '#E8634A',
    bg: '#FFF0EC',
  },
  {
    id: 'bund',
    nameEn: 'Bundskat (bottom tax)',
    nameDa: 'Bundskat',
    rate: '12.01%',
    thresholdEn: 'All income above personfradrag',
    thresholdDa: 'Al indkomst over personfradrag',
    whoEn: 'Everyone with taxable income',
    whoDa: 'Alle med skattepligtig indkomst',
    bodyEn:
      'Bundskat is the base income tax paid by all Danish taxpayers. At 12.01%, it applies to income above your personal allowance (personfradrag: DKK 54,100/year = DKK 4,508/month). The rate has remained unchanged — unlike the higher brackets which were reformed in 2026.',
    bodyDa:
      'Bundskat er den grundlæggende indkomstskat som alle danske skatteydere betaler. Med 12,01% gælder det for indkomst over dit personfradrag (DKK 54.100/år = DKK 4.508/md). Satsen er uændret — i modsætning til de højere brackets som blev reformeret i 2026.',
    color: '#B8860B',
    bg: '#FFFBF0',
  },
  {
    id: 'kommune',
    nameEn: 'Kommuneskat (municipal tax)',
    nameDa: 'Kommuneskat',
    rate: '22.8–26.3%',
    thresholdEn: 'On taxable income (after all deductions)',
    thresholdDa: 'Af skattepligtig indkomst (efter alle fradrag)',
    whoEn: 'Everyone — rate depends on your municipality',
    whoDa: 'Alle — satsen afhænger af din kommune',
    bodyEn:
      'Municipal tax is calculated on your taxable income and varies by where you live. The national average is 25.049% in 2026. Copenhagen is one of the lowest (23.39%), while Brønderslev has one of the highest (26.30%). This is actually the LARGEST single component of most people\'s tax bill.',
    bodyDa:
      'Kommuneskat beregnes af din skattepligtige indkomst og varierer efter hvor du bor. Landsgennemsnittet er 25,049% i 2026. København er et af de laveste (23,39%), mens Brønderslev har et af de højeste (26,30%). Dette er faktisk DEN STØRSTE enkeltkomponent i de fleste personers skatteregning.',
    color: '#7B68A0',
    bg: '#F8F6FD',
  },
  {
    id: 'mellem',
    nameEn: 'Mellemskat (middle tax) — NEW 2026',
    nameDa: 'Mellemskat — NY 2026',
    rate: '7.5%',
    thresholdEn: 'Income above DKK 641,200 (after AM)',
    thresholdDa: 'Indkomst over DKK 641.200 (efter AM)',
    whoEn: '~300,000 Danes earning above DKK 697k gross',
    whoDa: '≈300.000 danskere der tjener over DKK 697k brutto',
    bodyEn:
      'NEW from 2026. The old single topskat (15% above DKK 611,800) was replaced by three new layers. Mellemskat at 7.5% is the first of these — it actually LOWERS the marginal rate for earners in the DKK 611,800–777,900 range, saving up to DKK 14,700 per year for this group.',
    bodyDa:
      'NY fra 2026. Den gamle topskat (15% over DKK 611.800) blev erstattet af tre nye lag. Mellemskat på 7,5% er det første — det SÆNKER faktisk den marginale sats for lønmodtagere i intervallet DKK 611.800–777.900 og sparer op til DKK 14.700 per år for denne gruppe.',
    color: '#5B8A6B',
    bg: '#F0FBF5',
  },
  {
    id: 'top',
    nameEn: 'Topskat (top tax) — REFORMED 2026',
    nameDa: 'Topskat — REFORMERET 2026',
    rate: '7.5%',
    thresholdEn: 'Income above DKK 777,900 (after AM)',
    thresholdDa: 'Indkomst over DKK 777.900 (efter AM)',
    whoEn: 'Earners above ~DKK 845k gross',
    whoDa: 'Lønmodtagere over ≈DKK 845k brutto',
    bodyEn:
      'The reformed topskat continues at 7.5% above DKK 777,900 (after AM). Combined with bundskat, kommuneskat, and mellemskat, the total marginal rate in this bracket is approximately 52% (including AM-bidrag) — capped by the skatteloft for the top bracket.',
    bodyDa:
      'Den reformerede topskat fortsætter med 7,5% over DKK 777.900 (efter AM). Kombineret med bundskat, kommuneskat og mellemskat er den samlede marginale sats i dette bracket ca. 52% (inkl. AM-bidrag) — begrænset af skatteloftet for topbracket.',
    color: '#1E6B5A',
    bg: '#E8F5F0',
  },
  {
    id: 'toptop',
    nameEn: 'Toptopskat — NEW 2026',
    nameDa: 'Toptopskat — NY 2026',
    rate: '5%',
    thresholdEn: 'Income above DKK 2,592,700 (after AM)',
    thresholdDa: 'Indkomst over DKK 2.592.700 (efter AM)',
    whoEn: 'Very high earners above ~DKK 2.8M gross',
    whoDa: 'Meget høje lønninger over ≈DKK 2,8M brutto',
    bodyEn:
      'The top-top tax is a NEW 5% surcharge introduced in 2026 for the highest earners. Above DKK 2,592,700 (after AM-bidrag), the maximum combined marginal rate reaches approximately 60.5% including all layers and AM-bidrag. This is capped by the skatteloft at 57.07% (excluding AM-bidrag).',
    bodyDa:
      'Toptopskatten er en NY 5% tillæg indført i 2026 for de højeste lønninger. Over DKK 2.592.700 (efter AM-bidrag) når den maksimale kombinerede marginale sats ca. 60,5% inklusive alle lag og AM-bidrag. Det er begrænset af skatteloftet på 57,07% (ekskl. AM-bidrag).',
    color: '#1E0F00',
    bg: '#FFF8F3',
  },
]

const DEDUCTIONS = [
  {
    icon: '🚗',
    nameEn: 'Commuting (Befordringsfradrag)',
    nameDa: 'Befordringsfradrag',
    detailEn: 'DKK 2.28/km (km 25–120) · DKK 1.14/km above 120',
    detailDa: 'DKK 2,28/km (km 25–120) · DKK 1,14/km over 120',
    conditionEn: 'Round trip > 24 km · No company car',
    conditionDa: 'Daglig tur/retur > 24 km · Ingen firmabil',
    exampleEn: '60 km/day × 220 days = 13,200 km → ~DKK 28,160/yr deduction',
    exampleDa: '60 km/dag × 220 dage = 13.200 km → ≈DKK 28.160/år fradrag',
    savingEn: '~DKK 7,000 tax saved (at 25% kommuneskat)',
    savingDa: '≈DKK 7.000 skat sparet (ved 25% kommuneskat)',
    highlight: false,
  },
  {
    icon: '🏗️',
    nameEn: 'Håndværker- og Servicefradrag',
    nameDa: 'Håndværker- og Servicefradrag',
    detailEn: 'Service (cleaning, gardening): up to DKK 18,300 · Craftsman work: up to DKK 9,000',
    detailDa: 'Service (rengøring, havearbejde): op til DKK 18.300 · Håndværkerydelser: op til DKK 9.000',
    conditionEn: 'VAT-registered business · Paid by bank transfer (no cash)',
    conditionDa: 'Momsregistreret virksomhed · Betalt via bankoverførsel (ikke kontant)',
    exampleEn: 'DKK 9,000 craftsman + DKK 18,300 service = DKK 27,300 → ~DKK 6,800 saved',
    exampleDa: 'DKK 9.000 håndværker + DKK 18.300 service = DKK 27.300 → ≈DKK 6.800 sparet',
    savingEn: 'Up to ~DKK 6,800/year',
    savingDa: 'Op til ≈DKK 6.800/år',
    highlight: true,
  },
  {
    icon: '🤝',
    nameEn: 'Union & A-kasse',
    nameDa: 'Fagforening & A-kasse',
    detailEn: 'Union fees: up to DKK 7,000/yr · A-kasse: fully deductible',
    detailDa: 'Fagforeningskontingent: op til DKK 7.000/år · A-kasse: fuldt fradragsberettiget',
    conditionEn: 'Automatically deductible — no action needed',
    conditionDa: 'Automatisk fradragsberettiget — ingen handling nødvendig',
    exampleEn: 'DKK 7,000 union + DKK 5,000 A-kasse = DKK 12,000 → ~DKK 3,000 saved',
    exampleDa: 'DKK 7.000 fagforening + DKK 5.000 A-kasse = DKK 12.000 → ≈DKK 3.000 sparet',
    savingEn: '~DKK 3,000/year',
    savingDa: '≈DKK 3.000/år',
    highlight: false,
  },
  {
    icon: '💰',
    nameEn: 'Employment Allowance (Beskæftigelsesfradrag)',
    nameDa: 'Beskæftigelsesfradrag',
    detailEn: '12.75% of employment income · Max DKK 63,300/year',
    detailDa: '12,75% af lønindkomst · Max DKK 63.300/år',
    conditionEn: 'Automatic — you get it just for working',
    conditionDa: 'Automatisk — du får det bare for at arbejde',
    exampleEn: 'At DKK 500k gross: DKK 58,650 deduction → ~DKK 14,700 saved',
    exampleDa: 'Ved DKK 500k brutto: DKK 58.650 fradrag → ≈DKK 14.700 sparet',
    savingEn: 'Up to ~DKK 15,850/year (automatic)',
    savingDa: 'Op til ≈DKK 15.850/år (automatisk)',
    highlight: true,
  },
]

const QUIZ = [
  {
    en: 'What is the 2026 bundskat (bottom tax) rate?',
    da: 'Hvad er 2026 bundskattesatsen?',
    options: [{ en: '8%', da: '8%' }, { en: '10%', da: '10%' }, { en: '12.01%', da: '12,01%' }, { en: '15%', da: '15%' }],
    correct: 2,
    expEn: 'Bundskat is 12.01% and applies to all taxable income above the personal allowance.',
    expDa: 'Bundskat er 12,01% og gælder for al skattepligtig indkomst over personfradraget.',
  },
  {
    en: 'What is the 2026 personfradrag (personal allowance) for a single person?',
    da: 'Hvad er 2026 personfradraget for en enlig person?',
    options: [{ en: 'DKK 46,000', da: 'DKK 46.000' }, { en: 'DKK 50,000', da: 'DKK 50.000' }, { en: 'DKK 54,100', da: 'DKK 54.100' }, { en: 'DKK 60,000', da: 'DKK 60.000' }],
    correct: 2,
    expEn: 'The personfradrag is DKK 54,100 in 2026 — a 4.8% increase from the prior year.',
    expDa: 'Personfradraget er DKK 54.100 i 2026 — en stigning på 4,8% fra det foregående år.',
  },
  {
    en: 'What is the minimum daily round-trip distance to qualify for befordringsfradrag (commuting deduction)?',
    da: 'Hvad er den minimale daglige tur/retur-distance for at kvalificere til befordringsfradrag?',
    options: [{ en: 'More than 10 km', da: 'Mere end 10 km' }, { en: 'More than 24 km', da: 'Mere end 24 km' }, { en: 'More than 50 km', da: 'Mere end 50 km' }, { en: 'There is no minimum', da: 'Der er ingen mindste-grænse' }],
    correct: 1,
    expEn: 'You qualify if your round-trip daily commute exceeds 24 km and you have no company car.',
    expDa: 'Du kvalificerer hvis din daglige tur/retur-pendling overstiger 24 km og du ikke har firmabil.',
  },
  {
    en: 'What replaced the old single topskat (15%) from 2026?',
    da: 'Hvad erstattede den gamle enkelt topskat (15%) fra 2026?',
    options: [
      { en: 'A higher flat rate of 20%', da: 'En højere fast sats på 20%' },
      { en: 'It was abolished entirely', da: 'Den blev afskaffet fuldstændigt' },
      { en: 'Three new brackets: mellemskat, topskat, toptopskat', da: 'Tre nye brackets: mellemskat, topskat, toptopskat' },
      { en: 'A wealth tax', da: 'En formuesskat' },
    ],
    correct: 2,
    expEn: 'The 2026 reform replaced the single 15% topskat with three layers (mellemskat 7.5%, topskat 7.5%, toptopskat 5%), lowering the rate for most earners in the top bracket.',
    expDa: '2026-reformen erstattede den enkelt 15% topskat med tre lag (mellemskat 7,5%, topskat 7,5%, toptopskat 5%), hvilket sænkede satsen for de fleste i topbracket.',
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function TaxBasicsPage() {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [step, setStep] = useState(0)
  const [activeBracket, setActiveBracket] = useState<string | null>(null)
  const [grossInput, setGrossInput] = useState(480000)
  const [selectedMunicipality, setSelectedMunicipality] = useState(0)
  const [quizIdx, setQuizIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ.length).fill(null))

  const markComplete = trpc.learning.markComplete.useMutation()

  const steps = en ? STEPS_EN : STEPS_DA
  const kommuneRate = MUNICIPALITIES[selectedMunicipality].rate
  const tax = useMemo(() => calcTax(grossInput, kommuneRate), [grossInput, kommuneRate])
  const activeBracketData = BRACKETS.find((b) => b.id === activeBracket)
  const score = answers.filter((a, i) => a === QUIZ[i].correct).length

  function goNext() { setStep((s) => Math.min(s + 1, 5)) }
  function goPrev() { setStep((s) => Math.max(s - 1, 0)) }

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
      markComplete.mutate({ content_id: 'tax-basics' })
      setStep(4)
    }
  }

  // ── Bar segments for calculator ──
  const segments = [
    { labelEn: 'AM-bidrag', labelDa: 'AM-bidrag', value: tax.amBidrag, color: '#E8634A' },
    { labelEn: 'Bundskat', labelDa: 'Bundskat', value: tax.bundskat, color: '#B8860B' },
    { labelEn: 'Kommuneskat', labelDa: 'Kommuneskat', value: tax.kommuneskat, color: '#7B68A0' },
    { labelEn: 'Higher brackets', labelDa: 'Højere brackets', value: tax.mellemskat + tax.topskat + tax.toptopskat, color: '#1E6B5A' },
    { labelEn: 'Net pay', labelDa: 'Nettoløn', value: tax.gross - tax.totalTax, color: '#5B8A6B' },
  ].filter((s) => s.value > 0)

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/learning" className="text-sm flex items-center gap-1 mb-4 hover:underline" style={{ color: '#9B8B7E' }}>
          ← {en ? 'Back to Learning' : 'Tilbage til Læring'}
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🏛️</span>
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E0F00' }}>
            {en ? 'Danish Tax Basics 2026' : 'Grundlæggende dansk skat 2026'}
          </h1>
        </div>
        <p className="text-sm ml-10" style={{ color: '#9B8B7E' }}>
          {en ? '4 sections · ~10 min · Interactive calculator included' : '4 sektioner · ≈10 min · Interaktiv beregner inkluderet'}
        </p>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className="h-1.5 rounded-full transition-all duration-300" style={{ background: i <= step ? '#E8634A' : '#EDE0D4' }} />
              <p className="text-xs mt-1.5 font-medium truncate" style={{ color: i === step ? '#E8634A' : '#9B8B7E' }}>{s}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 0: Introduction ─────────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#1E0F00' }}>
              {en ? 'How Danish tax works' : 'Sådan fungerer dansk skat'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? 'Denmark has a progressive, multi-layer income tax system. The more you earn, the higher the marginal rate — but only on the portion above each threshold. For most employees, the effective tax rate is 32–42% of gross salary.'
                : 'Danmark har et progressivt, flerlagsdelt indkomstskattesystem. Jo mere du tjener, jo højere er den marginale sats — men kun på den del over hvert trin. For de fleste medarbejdere er den effektive skattesats 32–42% af bruttolønnen.'}
            </p>
          </div>

          {/* 2026 reform banner */}
          <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #1E0F00, #3D2B1F)', border: '1px solid #EDE0D4' }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: '#E8634A', color: '#fff' }}>
                {en ? 'NEW 2026' : 'NY 2026'}
              </span>
              <span className="text-sm font-semibold" style={{ color: '#FFF8F3' }}>
                {en ? 'Major tax reform — what changed' : 'Stor skattereform — hvad ændrede sig'}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs" style={{ color: '#B5A89D' }}>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="font-bold mb-1" style={{ color: '#EDE0D4' }}>Until 2025</div>
                <div>Topskat: 15% above DKK 611,800</div>
                <div style={{ color: '#E8634A' }}>→ Single bracket</div>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="font-bold mb-1" style={{ color: '#EDE0D4' }}>From 2026</div>
                <div>Mellemskat: 7.5% above DKK 641,200</div>
                <div>Topskat: 7.5% above DKK 777,900</div>
                <div>Toptopskat: 5% above DKK 2,592,700</div>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: '#9B8B7E' }}>
              {en ? '~300,000 Danes benefit with savings up to DKK 14,700/year (Lov nr. 482 af 22.05.2024)' : '≈300.000 danskere nyder godt med besparelser op til DKK 14.700/år (Lov nr. 482 af 22.05.2024)'}
            </p>
          </div>

          {/* 3 key facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🧱', en: 'Multi-layer', da: 'Flerlagsdelt', bodyEn: 'Tax is built in layers: AM-bidrag → bundskat → kommuneskat → higher brackets. Each layer only applies above its threshold.', bodyDa: 'Skat er bygget i lag: AM-bidrag → bundskat → kommuneskat → højere brackets. Hvert lag gælder kun over dets tærskel.' },
              { icon: '📍', en: 'Where you live matters', da: 'Bopæl betyder noget', bodyEn: 'Kommuneskat varies from 22.8% (Frederiksberg) to 26.3% (Brønderslev). Moving can save thousands per year.', bodyDa: 'Kommuneskat varierer fra 22,8% (Frederiksberg) til 26,3% (Brønderslev). At flytte kan spare tusindvis om året.' },
              { icon: '📋', en: 'File every November', da: 'Indgiv hvert november', bodyEn: 'Update your forskudsopgørelse (preliminary return) at skat.dk each November. If you skip it, SKAT withholds at ~55%.', bodyDa: 'Opdater din forskudsopgørelse på skat.dk hvert november. Glemmer du det, trækker SKAT ca. 55% i skat.', link: 'https://www.skat.dk', linkLabel: 'skat.dk ↗' },
            ].map((c) => (
              <div key={c.en} className="rounded-xl p-5" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
                <div className="text-2xl mb-2">{c.icon}</div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: '#1E0F00' }}>{en ? c.en : c.da}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6B5C52' }}>{en ? c.bodyEn : c.bodyDa}</p>
                {'link' in c && (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium hover:underline"
                    style={{ color: '#E8634A' }}
                  >
                    {c.linkLabel}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: Tax Brackets ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <p className="text-sm mb-5" style={{ color: '#6B5C52' }}>
            👆 {en ? 'Click any bracket to understand it in depth.' : 'Klik på et skattelager for at forstå det i dybden.'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Bracket list */}
            <div className="space-y-2">
              {BRACKETS.map((b) => {
                const active = activeBracket === b.id
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBracket(active ? null : b.id)}
                    className="w-full text-left rounded-xl px-4 py-3.5 flex items-center gap-4 transition-all"
                    style={{
                      background: active ? b.color : b.bg,
                      border: `2px solid ${active ? b.color : '#EDE0D4'}`,
                      color: active ? '#fff' : '#1E0F00',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ background: active ? 'rgba(255,255,255,0.2)' : b.color, color: '#fff' }}
                    >
                      {b.rate}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{en ? b.nameEn : b.nameDa}</div>
                      <div className="text-xs truncate mt-0.5" style={{ color: active ? 'rgba(255,255,255,0.8)' : '#9B8B7E' }}>
                        {en ? b.thresholdEn : b.thresholdDa}
                      </div>
                    </div>
                    <span style={{ opacity: 0.6 }}>{active ? '✕' : '→'}</span>
                  </button>
                )
              })}
            </div>

            {/* Explanation panel */}
            <div
              className="rounded-xl p-6 flex flex-col"
              style={{
                background: activeBracketData?.bg ?? '#FFF8F3',
                border: activeBracketData ? `2px solid ${activeBracketData.color}` : '1px solid #EDE0D4',
                minHeight: '320px',
                transition: 'all 0.2s',
              }}
            >
              {activeBracketData ? (
                <div>
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                    style={{ background: activeBracketData.color }}
                  >
                    {activeBracketData.rate}
                  </div>
                  <h3 className="font-serif text-lg font-bold mb-1" style={{ color: '#1E0F00' }}>
                    {en ? activeBracketData.nameEn : activeBracketData.nameDa}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: activeBracketData.color }}>
                    👥 {en ? activeBracketData.whoEn : activeBracketData.whoDa}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
                    {en ? activeBracketData.bodyEn : activeBracketData.bodyDa}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center gap-3">
                  <div className="text-4xl opacity-30">👈</div>
                  <p className="text-sm" style={{ color: '#9B8B7E' }}>
                    {en ? 'Click a tax bracket to see a full explanation.' : 'Klik på et skattelager for at se en fuld forklaring.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Live Tax Calculator ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-5" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E0F00' }}>
                {en ? 'Gross annual salary' : 'Bruttoårsløn'}
              </label>
              <input
                type="number"
                value={grossInput}
                onChange={(e) => setGrossInput(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2"
                style={{ borderColor: '#EDE0D4' }}
              />
              <input
                type="range"
                min={100000}
                max={1500000}
                step={10000}
                value={grossInput}
                onChange={(e) => setGrossInput(Number(e.target.value))}
                className="w-full accent-terracotta"
                style={{ accentColor: '#E8634A' }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: '#9B8B7E' }}>
                <span>100k</span><span>750k</span><span>1.5M DKK</span>
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E0F00' }}>
                {en ? 'Municipality' : 'Kommune'}
              </label>
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2 text-sm"
                style={{ borderColor: '#EDE0D4' }}
              >
                {MUNICIPALITIES.map((m, i) => (
                  <option key={i} value={i}>
                    {en ? m.label : m.labelDa} — {m.rate}%
                  </option>
                ))}
              </select>
              <p className="text-xs mt-3" style={{ color: '#9B8B7E' }}>
                {en ? 'Municipal tax is the single largest component of most tax bills.' : 'Kommuneskat er den største enkeltkomponent i de fleste skatteregninger.'}
              </p>
            </div>
          </div>

          {/* Stacked bar */}
          <div>
            <div className="flex h-10 rounded-xl overflow-hidden mb-2">
              {segments.map((s) => (
                <div
                  key={s.labelEn}
                  style={{ width: `${(s.value / tax.gross) * 100}%`, background: s.color, transition: 'width 0.3s' }}
                  title={`${en ? s.labelEn : s.labelDa}: ${fmt(s.value)}`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {segments.map((s) => (
                <div key={s.labelEn} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                  <span style={{ color: '#6B5C52' }}>{en ? s.labelEn : s.labelDa}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown table */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EDE0D4' }}>
            <div className="px-4 py-2.5 text-xs font-bold" style={{ background: '#F5F0EB', color: '#6B5C52' }}>
              {en ? `Tax breakdown for ${fmt(grossInput)} gross` : `Skatteberegning for ${fmt(grossInput)} brutto`}
            </div>
            {[
              { labelEn: 'AM-bidrag (8%)', labelDa: 'AM-bidrag (8%)', value: tax.amBidrag, color: '#E8634A', formula: `${fmt(tax.gross)} × 8%` },
              { labelEn: 'Bundskat (12.01%)', labelDa: 'Bundskat (12,01%)', value: tax.bundskat, color: '#B8860B', formula: `after AM − personfradrag × 12.01%` },
              { labelEn: `Kommuneskat (${kommuneRate}%)`, labelDa: `Kommuneskat (${kommuneRate}%)`, value: tax.kommuneskat, color: '#7B68A0', formula: `taxable income × ${kommuneRate}%` },
              ...(tax.mellemskat > 0 ? [{ labelEn: 'Mellemskat (7.5%)', labelDa: 'Mellemskat (7,5%)', value: tax.mellemskat, color: '#5B8A6B', formula: `above DKK 641,200 × 7.5%` }] : []),
              ...(tax.topskat > 0 ? [{ labelEn: 'Topskat (7.5%)', labelDa: 'Topskat (7,5%)', value: tax.topskat, color: '#1E6B5A', formula: `above DKK 777,900 × 7.5%` }] : []),
              ...(tax.toptopskat > 0 ? [{ labelEn: 'Toptopskat (5%)', labelDa: 'Toptopskat (5%)', value: tax.toptopskat, color: '#1E0F00', formula: `above DKK 2,592,700 × 5%` }] : []),
            ].map((row) => (
              <div key={row.labelEn} className="px-4 py-3 flex items-center justify-between border-b text-sm" style={{ borderColor: '#EDE0D4' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                  <span style={{ color: '#1E0F00' }}>{en ? row.labelEn : row.labelDa}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold" style={{ color: '#C0392B' }}>{fmt(row.value)}</span>
                  <span className="text-xs ml-2" style={{ color: '#9B8B7E' }}>({fmtPct(row.value, tax.gross)})</span>
                </div>
              </div>
            ))}
            <div className="px-4 py-3 flex justify-between text-sm font-bold" style={{ background: '#FFF8F3', borderBottom: '1px solid #EDE0D4' }}>
              <span style={{ color: '#C0392B' }}>{en ? 'Total tax' : 'Skat i alt'}</span>
              <span style={{ color: '#C0392B' }}>{fmt(tax.totalTax)} ({tax.effectiveRate}%)</span>
            </div>
            <div className="px-4 py-4 flex justify-between items-center" style={{ background: '#1E0F00' }}>
              <div>
                <div className="text-sm font-bold" style={{ color: '#FFF8F3' }}>{en ? 'Net monthly take-home' : 'Nettoløn per måned'}</div>
                <div className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>{en ? 'Last working day of each month' : 'Sidste arbejdsdag i måneden'}</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: '#A3C9B0' }}>{fmt(tax.netMonthly)}</div>
            </div>
          </div>

          <p className="text-xs text-center" style={{ color: '#9B8B7E' }}>
            {en
              ? '⚠️ Simplified estimate. Actual tax depends on your specific deductions and allowances. Verify at skat.dk.'
              : '⚠️ Forenklet skøn. Faktisk skat afhænger af dine specifikke fradrag og tillæg. Verificer på skat.dk.'}
          </p>
        </div>
      )}

      {/* ── STEP 3: Quiz ─────────────────────────────────────────────────────── */}
      {step === 3 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold" style={{ color: '#1E0F00' }}>
              {en ? `Question ${quizIdx + 1} / ${QUIZ.length}` : `Spørgsmål ${quizIdx + 1} / ${QUIZ.length}`}
            </h2>
            <div className="flex gap-2">
              {QUIZ.map((q, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full transition-all" style={{
                  background: answers[i] !== null ? (answers[i] === q.correct ? '#5B8A6B' : '#E8634A') : (i === quizIdx ? '#1E0F00' : '#EDE0D4'),
                }} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 mb-5" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <p className="font-medium" style={{ color: '#1E0F00' }}>{en ? QUIZ[quizIdx].en : QUIZ[quizIdx].da}</p>
          </div>

          <div className="space-y-3 mb-5">
            {QUIZ[quizIdx].options.map((opt, i) => {
              const isCorrect = i === QUIZ[quizIdx].correct
              let bg = '#FFF8F3', border = '#EDE0D4', color = '#1E0F00'
              if (selected !== null) {
                if (isCorrect) { bg = '#F0FBF5'; border = '#5B8A6B'; color = '#2D5C3E' }
                else if (selected === i) { bg = '#FFF0EC'; border = '#E8634A'; color = '#C0392B' }
              }
              return (
                <button key={i} onClick={() => answerQuiz(i)} disabled={selected !== null}
                  className="w-full text-left rounded-xl px-5 py-4 text-sm font-medium transition-all"
                  style={{ background: bg, border: `2px solid ${border}`, color }}>
                  <span className="mr-3 font-bold opacity-40">{String.fromCharCode(65 + i)}.</span>
                  {en ? opt.en : opt.da}
                  {selected !== null && isCorrect && <span className="float-right">✓</span>}
                  {selected !== null && selected === i && !isCorrect && <span className="float-right">✗</span>}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <>
              <div className="rounded-xl p-4 text-sm mb-4"
                style={{ background: selected === QUIZ[quizIdx].correct ? '#F0FBF5' : '#FFF0EC', border: `1px solid ${selected === QUIZ[quizIdx].correct ? '#5B8A6B' : '#E8634A'}`, color: selected === QUIZ[quizIdx].correct ? '#2D5C3E' : '#C0392B' }}>
                {selected === QUIZ[quizIdx].correct ? '✓ ' : '✗ '}
                {en ? QUIZ[quizIdx].expEn : QUIZ[quizIdx].expDa}
              </div>
              <button onClick={nextQuestion} className="w-full rounded-xl py-3 text-sm font-semibold text-white" style={{ background: '#E8634A' }}>
                {quizIdx < QUIZ.length - 1 ? (en ? 'Next →' : 'Næste →') : (en ? 'See my score →' : 'Se min score →')}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── STEP 4: Done ─────────────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="text-center py-10">
          <div className="text-6xl mb-5">{score === QUIZ.length ? '🎉' : score >= 3 ? '👍' : '📚'}</div>
          <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#1E0F00' }}>
            {en ? `${score} / ${QUIZ.length} correct` : `${score} / ${QUIZ.length} rigtige`}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6B5C52' }}>
            {score === QUIZ.length ? (en ? 'Perfect! You know your Danish taxes.' : 'Perfekt! Du kender din danske skat.')
              : score >= 3 ? (en ? 'Well done! One more review and you\'ll be an expert.' : 'Godt klaret! Én gennemgang til og du er ekspert.')
              : (en ? 'Keep studying — go back and try again.' : 'Bliv ved — gå tilbage og prøv igen.')}
          </p>
          <div className="rounded-2xl p-5 mb-8 text-left space-y-2 max-w-sm mx-auto" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            {QUIZ.map((q, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ background: answers[i] === q.correct ? '#5B8A6B' : '#E8634A' }}>
                  {answers[i] === q.correct ? '✓' : '✗'}
                </span>
                <span style={{ color: '#3D2B1F' }}>{en ? q.en : q.da}</span>
              </div>
            ))}
          </div>
          {/* Apply it CTA */}
          <div className="max-w-sm mx-auto mb-6">
            <p className="text-xs font-medium mb-2" style={{ color: '#9B8B7E' }}>
              {en ? 'PUT IT INTO PRACTICE' : 'BRUG DET I PRAKSIS'}
            </p>
            <Link
              href="/tax-planner"
              className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:opacity-90"
              style={{ background: '#E8634A10', border: '1.5px solid #E8634A40' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1E0F00' }}>
                  📊 {en ? 'Open the Tax Planner' : 'Åbn skatteplanlæggeren'}
                </p>
                <p className="text-xs" style={{ color: '#6B5C52' }}>
                  {en ? 'Calculate your real deductions and see what you save →' : 'Beregn dine fradrag og se hvad du sparer →'}
                </p>
              </div>
              <span style={{ color: '#E8634A' }}>→</span>
            </Link>
          </div>

          {/* Next module */}
          <div className="max-w-sm mx-auto mb-8">
            <p className="text-xs font-medium mb-2" style={{ color: '#9B8B7E' }}>
              {en ? 'UP NEXT IN BASICS' : 'NÆSTE I DET GRUNDLÆGGENDE'}
            </p>
            <Link
              href="/learning/goal-setting"
              className="flex items-center justify-between rounded-xl px-5 py-4 transition-all hover:opacity-90"
              style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: '#1E0F00' }}>
                  🎯 {en ? 'How to Set Your Financial Goals' : 'Sådan sætter du dine finansielle mål'}
                </p>
                <p className="text-xs" style={{ color: '#6B5C52' }}>
                  {en ? 'SMART-A, Three Horizons, 7-step system →' : 'SMART-A, tre horisonter, 7-trins plan →'}
                </p>
              </div>
              <span style={{ color: '#E8634A' }}>→</span>
            </Link>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => { setStep(0); setQuizIdx(0); setSelected(null); setAnswers(Array(QUIZ.length).fill(null)) }}
              className="rounded-xl px-6 py-3 text-sm font-medium border" style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}>
              {en ? 'Restart' : 'Genstart'}
            </button>
            <Link href="/learning" className="rounded-xl px-6 py-3 text-sm font-semibold text-white" style={{ background: '#1E0F00' }}>
              {en ? 'Back to Learning →' : 'Tilbage til Læring →'}
            </Link>
          </div>
        </div>
      )}

      {/* ── Bottom nav ───────────────────────────────────────────────────────── */}
      {step < 4 && (
        <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #EDE0D4' }}>
          <button onClick={goPrev} disabled={step === 0}
            className="rounded-xl px-5 py-2.5 text-sm font-medium border disabled:opacity-30"
            style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}>
            ← {en ? 'Previous' : 'Forrige'}
          </button>
          {step < 3 && (
            <button onClick={goNext} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: '#E8634A' }}>
              {step === 2 ? (en ? 'Take the quiz →' : 'Tag quizzen →') : (en ? 'Next →' : 'Næste →')}
            </button>
          )}
          {step === 3 && (
            <span className="text-xs" style={{ color: '#9B8B7E' }}>{en ? 'Answer to continue' : 'Besvar for at fortsætte'}</span>
          )}
        </div>
      )}
    </div>
  )
}
