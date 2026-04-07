'use client'

import { useState } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

const FAILURE_MODES = [
  {
    en: {
      label: 'Vagueness',
      icon: '🌫️',
      problem: 'Goals like "save more" lack measurable targets — progress is invisible, so motivation dies.',
      fix: 'Add a specific number, date, and monthly action amount.',
    },
    da: {
      label: 'Vaghed',
      icon: '🌫️',
      problem: 'Mål som "spar mere" mangler målbare succeskriterier — fremskridt er usynlige, og motivationen dør.',
      fix: 'Tilføj et specifikt tal, dato og månedligt handlingsbeløb.',
    },
    color: '#E8634A',
  },
  {
    en: {
      label: 'Present Bias',
      icon: '⏰',
      problem: 'Your brain systematically overvalues today over the future, causing short-term spending to crowd out saving.',
      fix: 'Automate savings so the decision is made before you can spend.',
    },
    da: {
      label: 'Present Bias',
      icon: '⏰',
      problem: 'Din hjerne overvurderer systematisk i dag over fremtiden, og kortsigtet forbrug udkonkurrerer opsparing.',
      fix: 'Automatisér opsparing, så beslutningen er taget inden du kan bruge pengene.',
    },
    color: '#4A7BE8',
  },
  {
    en: {
      label: 'Willpower Dependence',
      icon: '💪',
      problem: 'Systems that rely on daily discipline degrade under stress. Environmental design beats motivation every time.',
      fix: 'Build systems, not habits. Automate, separate accounts, remove friction.',
    },
    da: {
      label: 'Viljestyrkeafhængighed',
      icon: '💪',
      problem: 'Systemer der kræver daglig disciplin bryder ned under stress. Miljødesign slår motivation hver gang.',
      fix: 'Byg systemer, ikke vaner. Automatisér, adskil konti og fjern friktion.',
    },
    color: '#7B4AE8',
  },
]

const SMARTA = [
  {
    letter: 'S',
    color: '#E8634A',
    en: { label: 'Specific', desc: 'Replace vague ambitions with precise targets.', example: '"Save DKK 50,000 for an emergency fund" — not "save more"' },
    da: { label: 'Specifik', desc: 'Erstat vage ambitioner med præcise mål.', example: '"Spar DKK 50.000 til en nødfond" — ikke "spar mere"' },
  },
  {
    letter: 'M',
    color: '#4A7BE8',
    en: { label: 'Measurable', desc: 'Attach a number, a date, and a tracking method.', example: 'DKK 2,500/month tracked in a dedicated savings app' },
    da: { label: 'Målbar', desc: 'Tilknyt et tal, en dato og en sporingsmetode.', example: 'DKK 2.500/måned sporet i en dedikeret opsparingsapp' },
  },
  {
    letter: 'A',
    color: '#7B4AE8',
    en: { label: 'Action-oriented', desc: 'Define the exact behaviors needed to reach the goal.', example: 'Set up automatic transfer on payday — before anything else' },
    da: { label: 'Handlingsorienteret', desc: 'Definer de præcise handlinger der er nødvendige for at nå målet.', example: 'Opsæt automatisk overførsel på lønningsdag — inden alt andet' },
  },
  {
    letter: 'R',
    color: '#16A34A',
    en: { label: 'Realistic', desc: 'Calibrate to your actual income and fixed expenses.', example: 'Based on your net pay after tax, rent, and fixed costs' },
    da: { label: 'Realistisk', desc: 'Kalibrér til din faktiske indkomst og faste udgifter.', example: 'Baseret på din nettoløn efter skat, husleje og faste udgifter' },
  },
  {
    letter: 'T',
    color: '#CA8A04',
    en: { label: 'Time-bound', desc: 'A hard deadline creates urgency and focus.', example: '"By 31 December 2026" — not "someday"' },
    da: { label: 'Tidsbegrænset', desc: 'En fast deadline skaber motivation og fokus.', example: '"Inden 31. december 2026" — ikke "en dag"' },
  },
  {
    letter: 'A',
    color: '#DB2777',
    en: { label: 'Accountable', desc: 'An external commitment dramatically increases follow-through.', example: 'A partner, advisor, or app that tracks your progress' },
    da: { label: 'Ansvarlig', desc: 'Et eksternt ansvar øger dramatisk chancen for at lykkes.', example: 'En partner, rådgiver eller app der følger dine fremskridt' },
  },
]

const HORIZONS = [
  {
    icon: '⚡',
    color: '#E8634A',
    en: {
      label: 'Short-term',
      timeframe: '0–2 years',
      desc: 'High liquidity required. Keep in cash or short-term instruments.',
      examples: ['Emergency fund (3–6 months of expenses)', 'Paying off high-interest debt', 'Saving for a specific purchase'],
    },
    da: {
      label: 'Kort sigt',
      timeframe: '0–2 år',
      desc: 'Høj likviditet krævet. Hold i kontanter eller kortfristede instrumenter.',
      examples: ['Nødfond (3–6 måneders udgifter)', 'Afdragning af højtforrentet gæld', 'Opsparing til et specifikt køb'],
    },
  },
  {
    icon: '🎯',
    color: '#4A7BE8',
    en: {
      label: 'Medium-term',
      timeframe: '2–7 years',
      desc: 'Moderate risk tolerance. A balanced portfolio is appropriate.',
      examples: ['Down payment on property', 'Starting a business', 'Education funding'],
    },
    da: {
      label: 'Mellemlangt sigt',
      timeframe: '2–7 år',
      desc: 'Moderat risikotolerance. En balanceret portefølje er passende.',
      examples: ['Udbetaling til bolig', 'Starte en virksomhed', 'Uddannelsesfinansiering'],
    },
  },
  {
    icon: '🌱',
    color: '#16A34A',
    en: {
      label: 'Long-term',
      timeframe: '7+ years',
      desc: 'Higher risk tolerance justified by time. Equities and real assets appropriate.',
      examples: ['Retirement', 'Financial independence', 'Generational wealth'],
    },
    da: {
      label: 'Langt sigt',
      timeframe: '7+ år',
      desc: 'Højere risikotolerance berettiget af tid. Aktier og realaktiver er passende.',
      examples: ['Pension', 'Finansiel uafhængighed', 'Generationsformue'],
    },
  },
]

const STEPS_7 = [
  {
    en: { title: 'Conduct a Financial Audit', body: 'Map your current reality before setting any targets: monthly income, fixed expenses, variable expenses, debt (with interest rates), and net worth. You cannot set a realistic goal without a baseline. Know your numbers first.' },
    da: { title: 'Lav et finansielt overblik', body: 'Kortlæg din nuværende situation inden du sætter mål: månedlig indkomst, faste udgifter, variable udgifter, gæld (med renter) og nettoformue. Du kan ikke sætte et realistisk mål uden et udgangspunkt. Kend dine tal først.' },
  },
  {
    en: { title: 'Define Goals Using SMART-A', body: 'Write down every financial goal. Then apply the SMART-A filter: add a specific number, a date, an action (monthly transfer amount), a realistic calibration to your income, and name an accountability partner or tool.' },
    da: { title: 'Definer mål med SMART-A', body: 'Skriv alle dine finansielle mål ned. Anvend derefter SMART-A-filteret: tilføj et specifikt tal, en dato, en handling (månedligt overførselsbeløb), en realistisk kalibrering til din indkomst, og navngiv en ansvarlig partner eller et værktøj.' },
  },
  {
    en: { title: 'Prioritize by Urgency and Return', body: 'Sequence by: (1) eliminate high-interest debt first — any debt above 7% p.a. guarantees a return higher than most investments, (2) build a 3-month emergency fund, (3) contribute to tax-advantaged accounts, (4) invest toward medium and long-term goals.' },
    da: { title: 'Prioritér efter hastende behov og afkast', body: 'Rækkefølge: (1) eliminer højtforrentet gæld først — al gæld over 7% p.a. giver et garanteret afkast højere end de fleste investeringer, (2) byg en 3-måneders nødfond, (3) bidrag til skattefordelte konti, (4) investér mod mellum- og langsigtede mål.' },
  },
  {
    en: { title: 'Automate Before You Can Spend', body: 'The most powerful behavioral intervention available. Set up automatic transfers to each goal account on the same day your salary arrives. This bypasses present bias entirely. Research shows automatic savings commitments raise savings rates by an average of 3.5 percentage points per year.' },
    da: { title: 'Automatisér inden du kan bruge', body: 'Den kraftigste adfærdsmæssige intervention til rådighed. Opsæt automatiske overførsler til hver målkonto samme dag din løn ankommer. Dette omgår present bias fuldstændigt. Forskning viser at automatiske opsparingsforpligtelser øger opsparingsraten med gennemsnitlig 3,5 procentpoint om året.' },
  },
  {
    en: { title: 'Break Goals Into Monthly Milestones', body: 'Goal gradient theory: motivation increases as you approach a goal. Create visible monthly targets. A DKK 120,000 goal over 2 years becomes DKK 5,000/month — a concrete, trackable milestone that provides regular feedback and keeps momentum going.' },
    da: { title: 'Del mål op i månedlige milepæle', body: 'Goal gradient-teorien: motivation stiger jo tættere du er på et mål. Opret synlige månedlige mål. Et mål på DKK 120.000 over 2 år bliver DKK 5.000/måned — en konkret, sporbar milepæl der giver regelmæssig feedback og opretholder momentum.' },
  },
  {
    en: { title: 'Pre-commit Against Obstacles', body: 'Pre-planning responses to obstacles is more effective than positive visualization alone. For each goal write: "If [obstacle], then I will [specific response]." This is an implementation intention — research shows it dramatically increases follow-through when life gets in the way.' },
    da: { title: 'Forbind dig mod forhindringer', body: 'At planlægge svar på forhindringer er mere effektivt end positiv visualisering alene. Skriv for hvert mål: "Hvis [forhindring], vil jeg [specifikt svar]." Dette er en implementeringshensigt — forskning viser at det dramatisk øger gennemførelsen, når livet stiller sig i vejen.' },
  },
  {
    en: { title: 'Schedule Quarterly Reviews', body: 'Goals need updating. Income changes, emergencies happen, priorities shift. A quarterly 30-minute review prevents goals from becoming stale and allows reallocation of resources. Annual reviews are too infrequent; monthly is prone to noise. Quarterly is the research-supported cadence.' },
    da: { title: 'Planlæg kvartalsvise gennemgange', body: 'Mål skal opdateres. Indkomst ændres, nødsituationer opstår, prioriteter skifter. En kvartalsvis 30-minutters gennemgang forhindrer mål i at blive forældet og muliggør omfordeling af ressourcer. Kvartalsvise gennemgange er den forskningsmæssigt understøttede kadence.' },
  },
]

const BIASES = [
  {
    icon: '⏰',
    color: '#E8634A',
    en: { name: 'Present Bias', what: 'You discount future benefits too heavily, causing overspending today.', counter: 'Automate savings before money hits your spending account.' },
    da: { name: 'Present Bias', what: 'Du rabatterer fremtidige fordele for meget, og bruger for meget i dag.', counter: 'Automatisér opsparing inden pengene rammer din forbrugskonto.' },
  },
  {
    icon: '⚖️',
    color: '#4A7BE8',
    en: { name: 'Loss Aversion', what: 'Losses feel ~2× more painful than equivalent gains feel good (Kahneman & Tversky).', counter: 'Frame saving as "locking in" security rather than losing spending power.' },
    da: { name: 'Tab-aversion', what: 'Tab føles ~2× mere smertefuldt end tilsvarende gevinster føles godt (Kahneman & Tversky).', counter: 'Betragt opsparing som at "sikre" tryghed snarere end at miste købekraft.' },
  },
  {
    icon: '🎲',
    color: '#7B4AE8',
    en: { name: 'Overconfidence', what: 'Investors consistently overestimate their ability to time markets and select stocks.', counter: 'Use low-cost index funds for core investments. Reserve active picks for a small discretionary slice.' },
    da: { name: 'Overmod', what: 'Investorer overvurderer konsekvent deres evne til at time markeder og udvælge aktier.', counter: 'Brug lavomkostningsindeksfonde til kernen. Reserver aktive valg til en lille skønsmæssig andel.' },
  },
  {
    icon: '🕳️',
    color: '#CA8A04',
    en: { name: 'Sunk Cost Fallacy', what: 'Continuing a failing investment because of what you\'ve already put in.', counter: 'Evaluate all positions on future expected returns only — ignore past losses.' },
    da: { name: 'Sunk Cost-fejlslutning', what: 'Fortsætte en fejlslagen investering på grund af hvad du allerede har investeret.', counter: 'Vurder alle positioner udelukkende på fremtidigt forventet afkast — ignorer tidligere tab.' },
  },
]

const QUIZ_QUESTIONS = [
  {
    en: {
      q: 'According to behavioral research, what is the primary reason financial goals fail at the start?',
      options: ['Lack of money', 'Goals are too ambitious', 'Failure at initiation — people know what to do but don\'t start', 'Bad economic conditions'],
      correct: 2,
      explanation: 'A 2024 systematic review in Frontiers in Behavioral Economics confirmed the intention-to-behavior gap is driven by failures at initiation. The fix is better systems, not more information.',
    },
    da: {
      q: 'Hvad er ifølge adfærdsforskning den primære grund til at finansielle mål mislykkes fra starten?',
      options: ['Mangel på penge', 'Målene er for ambitiøse', 'Fejl ved initiering — folk ved hvad de skal gøre, men starter ikke', 'Dårlige økonomiske forhold'],
      correct: 2,
      explanation: 'En systematisk gennemgang fra 2024 i Frontiers in Behavioral Economics bekræftede, at intention-til-adfærd-kløften drives af fejl ved initiering. Løsningen er bedre systemer, ikke mere information.',
    },
  },
  {
    en: {
      q: 'In SMART-A, what does the final "A" stand for?',
      options: ['Ambitious', 'Achievable', 'Automated', 'Accountable'],
      correct: 3,
      explanation: 'The final A is Accountable — an external commitment such as a partner, advisor, or tracking app. External accountability dramatically increases follow-through on financial goals.',
    },
    da: {
      q: 'I SMART-A, hvad står det sidste "A" for?',
      options: ['Ambitiøs', 'Opnåelig', 'Automatiseret', 'Ansvarlig'],
      correct: 3,
      explanation: 'Det sidste A er Ansvarlig — en ekstern forpligtelse som en partner, rådgiver eller sporings-app. Eksternt ansvar øger dramatisk gennemførelsen af finansielle mål.',
    },
  },
  {
    en: {
      q: 'According to the 7-step system, which should you prioritize FIRST?',
      options: ['Open an investment account', 'Eliminate high-interest debt (above 7% p.a.) before investing', 'Maximize pension contributions', 'Build a 12-month emergency fund'],
      correct: 1,
      explanation: 'Any debt above 7% p.a. has a guaranteed return higher than most investments. Eliminating it is the highest-return move available before any investing begins.',
    },
    da: {
      q: 'Hvad bør du ifølge 7-trins-systemet prioritere FØRST?',
      options: ['Åbn en investeringskonto', 'Eliminer højtforrentet gæld (over 7% p.a.) inden investering', 'Maksimér pensionsbidrag', 'Byg en 12-måneders nødfond'],
      correct: 1,
      explanation: 'Al gæld over 7% p.a. giver et garanteret afkast højere end de fleste investeringer. At eliminere den er det højest afkastende træk du kan foretage inden du begynder at investere.',
    },
  },
  {
    en: {
      q: 'What did the Gargano et al. (2024) Journal of Finance study find about named savings goals in apps?',
      options: ['They create financial anxiety', 'They make no measurable difference', 'Users with explicit named goals saved significantly more', 'Only high-income users benefit'],
      correct: 2,
      explanation: 'The study analyzed FinTech app data and found users who set explicit savings goals saved significantly more — the goal label itself was the key behavioral mechanism, leveraging mental accounting.',
    },
    da: {
      q: 'Hvad fandt Gargano et al. (2024) Journal of Finance-studiet om navngivne opsparingsmål i apps?',
      options: ['De skaber finansiel angst', 'De gør ingen målbar forskel', 'Brugere med eksplicitte navngivne mål sparede betydeligt mere', 'Kun højindkomstbrugere drager fordel'],
      correct: 2,
      explanation: 'Studiet analyserede FinTech-appdata og fandt at brugere der satte eksplicitte opsparingsmål sparede betydeligt mere — målmærket selv var den vigtigste adfærdsmæssige mekanisme, der udnyttede mental accounting.',
    },
  },
]

const CONTENT_STEPS = 5 // steps 0–4 are content, step 5 is the done screen

export default function GoalSettingPage() {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [step, setStep] = useState(0)
  const [failureActive, setFailureActive] = useState<number | null>(null)
  const [smartActive, setSmartActive] = useState<number | null>(null)
  const [activeHorizon, setActiveHorizon] = useState<number | null>(null)
  const [expandedStep7, setExpandedStep7] = useState<number | null>(0)
  const [activeBias, setActiveBias] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null])

  const markComplete = trpc.learning.markComplete.useMutation()

  const steps = en
    ? ['Why Goals Fail', 'SMART-A', 'Three Horizons', '7-Step Playbook', 'Biases & Quiz']
    : ['Hvorfor mål fejler', 'SMART-A', 'Tre horisonter', '7-trins plan', 'Bias & Quiz']

  function goNext() { setStep((s) => Math.min(s + 1, CONTENT_STEPS)) }
  function goPrev() { setStep((s) => Math.max(s - 1, 0)) }

  function handleQuizAnswer(qi: number, ai: number) {
    const updated = [...quizAnswers]
    updated[qi] = ai
    setQuizAnswers(updated)
  }

  function submitQuiz() {
    markComplete.mutate({ content_id: 'goal-setting' })
    setStep(CONTENT_STEPS)
  }

  const score = step === CONTENT_STEPS
    ? QUIZ_QUESTIONS.filter((q, i) => quizAnswers[i] === q.en.correct).length
    : 0

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
          <span className="text-2xl">🎯</span>
          <h1 className="font-serif text-2xl font-bold" style={{ color: '#1E0F00' }}>
            {en ? 'How to Set Your Financial Goals' : 'Sådan sætter du dine finansielle mål'}
          </h1>
        </div>
        <p className="text-sm ml-10" style={{ color: '#9B8B7E' }}>
          {en ? '5 sections · ~10 min · Interactive' : '5 sektioner · ≈10 min · Interaktiv'}
        </p>
      </div>

      {/* Progress bar */}
      {step < CONTENT_STEPS && (
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

      {/* ── STEP 0: Why Goals Fail ───────────────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-3" style={{ color: '#1E0F00' }}>
              {en ? 'Why Most Financial Goals Fail' : 'Hvorfor de fleste finansielle mål mislykkes'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? 'The problem is rarely a lack of desire. Research consistently points to three structural failure modes. Click each one to see the fix.'
                : 'Problemet er sjældent manglende ønske. Forskning peger konsekvent på tre strukturelle fejlmoder. Klik på hver for at se løsningen.'}
            </p>
          </div>

          <div className="space-y-3">
            {FAILURE_MODES.map((mode, i) => {
              const m = en ? mode.en : mode.da
              const active = failureActive === i
              return (
                <button
                  key={i}
                  onClick={() => setFailureActive(active ? null : i)}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: active ? `${mode.color}10` : '#FFF8F3',
                    border: `2px solid ${active ? mode.color : '#EDE0D4'}`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold" style={{ color: '#1E0F00' }}>{m.label}</span>
                        <span style={{ color: '#9B8B7E', fontSize: '10px' }}>{active ? '▲' : '▼'}</span>
                      </div>
                      {active && (
                        <div className="mt-2 space-y-2">
                          <p className="text-sm" style={{ color: '#6B5C52' }}>{m.problem}</p>
                          <div
                            className="flex items-start gap-2 rounded-lg p-2"
                            style={{ background: `${mode.color}15` }}
                          >
                            <span className="text-xs font-bold mt-0.5" style={{ color: mode.color }}>FIX</span>
                            <p className="text-sm font-medium" style={{ color: '#1E0F00' }}>{m.fix}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl p-4 text-sm" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <p className="font-medium mb-1" style={{ color: '#1E0F00' }}>📚 {en ? 'Source' : 'Kilde'}</p>
            <p style={{ color: '#6B5C52' }}>
              {en
                ? 'Frontiers in Behavioral Economics (2024): the intention-to-behavior gap in saving is driven by failures at initiation. The solution is not more information — it is better systems.'
                : 'Frontiers in Behavioral Economics (2024): intention-til-adfærd-kløften drives af fejl ved initiering. Løsningen er ikke mere information — det er bedre systemer.'}
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 1: SMART-A ─────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-2" style={{ color: '#1E0F00' }}>
              {en ? 'The SMART-A Framework' : 'SMART-A-rammen'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? 'The most research-backed goal-setting framework. Click each letter below to explore its meaning and see a Danish financial example.'
                : 'Den mest forskningsmæssigt understøttede ramme for målsætning. Klik på hvert bogstav for at udforske dets betydning og se et dansk finansielt eksempel.'}
            </p>
          </div>

          <div className="flex gap-2">
            {SMARTA.map((s, i) => (
              <button
                key={i}
                onClick={() => setSmartActive(smartActive === i ? null : i)}
                className="flex-1 h-12 rounded-xl font-bold text-lg transition-all"
                style={{
                  background: smartActive === i ? s.color : `${s.color}20`,
                  color: smartActive === i ? '#fff' : s.color,
                  border: `2px solid ${s.color}`,
                }}
              >
                {s.letter}
              </button>
            ))}
          </div>

          {smartActive !== null ? (() => {
            const s = SMARTA[smartActive]
            const d = en ? s.en : s.da
            return (
              <div
                className="rounded-xl p-5"
                style={{ background: `${s.color}0D`, border: `1px solid ${s.color}40` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl text-white shrink-0"
                    style={{ background: s.color }}
                  >
                    {s.letter}
                  </div>
                  <p className="font-bold text-lg" style={{ color: '#1E0F00' }}>{d.label}</p>
                </div>
                <p className="text-sm mb-3" style={{ color: '#3D2B1F' }}>{d.desc}</p>
                <div className="rounded-lg p-3 text-sm" style={{ background: `${s.color}15` }}>
                  <span className="font-medium" style={{ color: s.color }}>
                    {en ? 'Example: ' : 'Eksempel: '}
                  </span>
                  <span style={{ color: '#3D2B1F' }}>{d.example}</span>
                </div>
              </div>
            )
          })() : (
            <div className="rounded-xl p-5 text-center" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
              <p className="text-sm" style={{ color: '#9B8B7E' }}>
                {en ? 'Click a letter above to explore that dimension' : 'Klik på et bogstav ovenfor for at udforske den dimension'}
              </p>
            </div>
          )}

          <div className="rounded-xl p-4 text-sm" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <p className="font-medium mb-1" style={{ color: '#1E0F00' }}>📚 {en ? 'Source' : 'Kilde'}</p>
            <p style={{ color: '#6B5C52' }}>
              {en
                ? 'Archuleta et al. (2020) added Accountability to the classic SMART framework in financial therapy research. Locke & Latham (2002): specific, challenging goals consistently outperform vague or easy ones.'
                : 'Archuleta et al. (2020) tilføjede Ansvarlighed til den klassiske SMART-ramme i finansiel terapiforskning. Locke & Latham (2002): specifikke, udfordrende mål overgår konsekvent vage eller lette mål.'}
            </p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Three Horizons ───────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-2" style={{ color: '#1E0F00' }}>
              {en ? 'The Three Horizons' : 'De tre horisonter'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? 'Not all goals operate on the same timescale. Each horizon needs a different savings vehicle and risk level. Click each horizon to explore.'
                : 'Ikke alle mål opererer på samme tidsskala. Hver horisont kræver et andet opsparingsinstrument og risikoniveau. Klik for at udforske.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {HORIZONS.map((h, i) => {
              const d = en ? h.en : h.da
              const active = activeHorizon === i
              return (
                <button
                  key={i}
                  onClick={() => setActiveHorizon(active ? null : i)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    background: active ? `${h.color}0D` : '#FFF8F3',
                    border: `2px solid ${active ? h.color : '#EDE0D4'}`,
                  }}
                >
                  <div className="text-2xl mb-2">{h.icon}</div>
                  <div className="font-bold mb-0.5" style={{ color: h.color }}>{d.label}</div>
                  <div className="text-xs mb-3" style={{ color: '#9B8B7E' }}>{d.timeframe}</div>
                  {active ? (
                    <div>
                      <p className="text-xs mb-2" style={{ color: '#6B5C52' }}>{d.desc}</p>
                      <ul className="space-y-1">
                        {d.examples.map((ex, j) => (
                          <li key={j} className="text-xs flex items-start gap-1.5">
                            <span style={{ color: h.color }}>•</span>
                            <span style={{ color: '#3D2B1F' }}>{ex}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: '#9B8B7E' }}>
                      {en ? 'Click to expand' : 'Klik for at udvide'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          <div className="rounded-xl p-4 text-sm" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <p style={{ color: '#6B5C52' }}>
              {en
                ? '📚 Shefrin & Statman (2000): goals-based portfolios outperform generic total-wealth portfolios. Separating goals prevents emotional interference — e.g. panic-selling long-term investments to cover short-term needs.'
                : '📚 Shefrin & Statman (2000): målbaserede porteføljer overgår generiske totalformueporteføljer. Adskillelse af mål forhindrer følelsesmæssig interferens — f.eks. panikssalg af langsigtede investeringer for at dække kortsigtede behov.'}
            </p>
          </div>

          <div
            className="rounded-xl px-5 py-4 flex items-center justify-between"
            style={{ background: '#FDF6EE', border: '1px solid #EDE0D4' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>
                {en ? 'Ready to set your goals?' : 'Klar til at sætte dine mål?'}
              </p>
              <p className="text-xs" style={{ color: '#6B5C52' }}>
                {en ? 'Track them inside the app — finish this module first.' : 'Spor dem i appen — færdiggør dette modul først.'}
              </p>
            </div>
            <Link
              href="/goals"
              className="rounded-xl px-4 py-2 text-xs font-semibold text-white shrink-0"
              style={{ background: '#E8634A' }}
            >
              {en ? 'My Goals →' : 'Mine mål →'}
            </Link>
          </div>
        </div>
      )}

      {/* ── STEP 3: 7-Step Playbook ──────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-2" style={{ color: '#1E0F00' }}>
              {en ? 'Your 7-Step Playbook' : 'Din 7-trins plan'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? 'Built on implementation intentions research, goal gradient theory, and the behavioral lifecycle hypothesis. Click each step to expand.'
                : 'Bygget på forskning i implementeringshensigter, goal gradient-teori og den adfærdsmæssige livscyklushypotese. Klik på hvert trin for at udvide.'}
            </p>
          </div>

          <div className="space-y-2">
            {STEPS_7.map((s, i) => {
              const d = en ? s.en : s.da
              const active = expandedStep7 === i
              return (
                <button
                  key={i}
                  onClick={() => setExpandedStep7(active ? null : i)}
                  className="w-full rounded-xl p-4 text-left transition-all"
                  style={{
                    background: active ? '#FDF6EE' : '#FFF8F3',
                    border: `1px solid ${active ? '#E8634A40' : '#EDE0D4'}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                      style={{
                        background: active ? '#E8634A' : '#EDE0D4',
                        color: active ? '#fff' : '#6B5C52',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: '#1E0F00' }}>{d.title}</div>
                      {active && (
                        <p className="text-sm mt-2 leading-relaxed" style={{ color: '#6B5C52' }}>{d.body}</p>
                      )}
                    </div>
                    <span style={{ color: '#9B8B7E', fontSize: '10px', marginTop: '4px' }}>{active ? '▲' : '▼'}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── STEP 4: Biases + Quiz ────────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            <h2 className="font-serif text-xl font-bold mb-2" style={{ color: '#1E0F00' }}>
              {en ? 'The Biases That Will Derail You' : 'De bias der vil afspore dig'}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#3D2B1F' }}>
              {en
                ? 'Four biases most destructive to financial goal achievement — and how to counter each. Click each card to reveal the countermeasure.'
                : 'Fire bias der er mest destruktive for finansiel målopnåelse — og hvordan du modvirker dem. Klik for at afsløre modtrækket.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BIASES.map((b, i) => {
              const d = en ? b.en : b.da
              const active = activeBias === i
              return (
                <button
                  key={i}
                  onClick={() => setActiveBias(active ? null : i)}
                  className="rounded-xl p-4 text-left transition-all"
                  style={{
                    background: active ? `${b.color}0D` : '#FFF8F3',
                    border: `2px solid ${active ? b.color : '#EDE0D4'}`,
                  }}
                >
                  <div className="text-xl mb-1">{b.icon}</div>
                  <div className="font-semibold text-sm mb-1" style={{ color: active ? b.color : '#1E0F00' }}>
                    {d.name}
                  </div>
                  {active ? (
                    <div className="space-y-2">
                      <p className="text-xs" style={{ color: '#6B5C52' }}>{d.what}</p>
                      <div className="rounded-lg p-2 text-xs" style={{ background: `${b.color}15` }}>
                        <span className="font-bold" style={{ color: b.color }}>
                          {en ? 'Counter: ' : 'Modtræk: '}
                        </span>
                        <span style={{ color: '#3D2B1F' }}>{d.counter}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs" style={{ color: '#9B8B7E' }}>
                      {en ? 'Click to reveal' : 'Klik for at afsløre'}
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          <div style={{ borderTop: '1px solid #EDE0D4', paddingTop: '20px' }}>
            <h3 className="font-serif text-lg font-bold mb-1" style={{ color: '#1E0F00' }}>
              {en ? 'Quick Check' : 'Hurtig test'}
            </h3>
            <p className="text-sm mb-5" style={{ color: '#6B5C52' }}>
              {en ? '4 questions — select an answer for each, then submit.' : '4 spørgsmål — vælg et svar til hvert, og indsend derefter.'}
            </p>
            <div className="space-y-5">
              {QUIZ_QUESTIONS.map((q, qi) => {
                const qd = en ? q.en : q.da
                return (
                  <div key={qi}>
                    <p className="text-sm font-medium mb-2" style={{ color: '#1E0F00' }}>{qi + 1}. {qd.q}</p>
                    <div className="space-y-1.5">
                      {qd.options.map((opt, ai) => (
                        <button
                          key={ai}
                          onClick={() => handleQuizAnswer(qi, ai)}
                          className="w-full rounded-xl px-4 py-3 text-sm text-left transition-all"
                          style={{
                            background: quizAnswers[qi] === ai ? '#FDF6EE' : '#FFF8F3',
                            border: `2px solid ${quizAnswers[qi] === ai ? '#E8634A' : '#EDE0D4'}`,
                            color: '#1E0F00',
                          }}
                        >
                          <span className="mr-3 font-bold opacity-40">{String.fromCharCode(65 + ai)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            <button
              onClick={submitQuiz}
              disabled={quizAnswers.some((a) => a === null)}
              className="mt-6 w-full rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: '#E8634A' }}
            >
              {en ? 'Submit & See Score →' : 'Indsend og se score →'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Done ─────────────────────────────────────────────────────── */}
      {step === CONTENT_STEPS && (
        <div className="text-center py-10">
          <div className="text-6xl mb-5">{score === 4 ? '🎉' : score >= 3 ? '👍' : '📚'}</div>
          <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: '#1E0F00' }}>
            {en ? `${score} / 4 correct` : `${score} / 4 rigtige`}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#6B5C52' }}>
            {score === 4
              ? (en ? 'Perfect! You\'re ready to set goals that stick.' : 'Perfekt! Du er klar til at sætte mål der holder.')
              : score >= 3
              ? (en ? 'Well done — review the explanations below.' : 'Godt klaret — gennemgå forklaringerne nedenfor.')
              : (en ? 'Keep at it — revisit the steps and try again.' : 'Bliv ved — gennemgå trinnene og prøv igen.')}
          </p>

          <div className="rounded-2xl p-5 mb-8 text-left space-y-3 max-w-sm mx-auto" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
            {QUIZ_QUESTIONS.map((q, i) => {
              const correct = quizAnswers[i] === q.en.correct
              const qd = en ? q.en : q.da
              return (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ background: correct ? '#5B8A6B' : '#E8634A' }}
                  >
                    {correct ? '✓' : '✗'}
                  </span>
                  <span style={{ color: '#3D2B1F' }}>{qd.q}</span>
                </div>
              )
            })}
          </div>

          {/* Next steps */}
          <div className="space-y-3 max-w-sm mx-auto mb-8">
            <Link
              href="/goals"
              className="flex items-center justify-between rounded-xl px-5 py-4 text-left transition-all hover:opacity-90"
              style={{ background: '#E8634A', color: '#fff' }}
            >
              <div>
                <p className="font-semibold text-sm">{en ? 'Set your first goal' : 'Sæt dit første mål'}</p>
                <p className="text-xs opacity-80">{en ? 'Apply what you just learned →' : 'Anvend det du netop lærte →'}</p>
              </div>
              <span className="text-2xl">🎯</span>
            </Link>
            <Link
              href="/chat"
              className="flex items-center justify-between rounded-xl px-5 py-4 text-left transition-all"
              style={{ background: '#FFF8F3', border: '1px solid #EDE0D4', color: '#1E0F00' }}
            >
              <div>
                <p className="font-semibold text-sm">{en ? 'Ask our AI assistant' : 'Spørg vores AI-assistent'}</p>
                <p className="text-xs" style={{ color: '#6B5C52' }}>{en ? 'Questions about your specific situation →' : 'Spørgsmål om din specifikke situation →'}</p>
              </div>
              <span className="text-2xl">💬</span>
            </Link>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => { setStep(0); setQuizAnswers([null, null, null, null]) }}
              className="rounded-xl px-6 py-3 text-sm font-medium border"
              style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
            >
              {en ? 'Restart' : 'Genstart'}
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

      {/* ── Bottom nav ───────────────────────────────────────────────────────── */}
      {step < CONTENT_STEPS && (
        <div className="flex justify-between items-center mt-8 pt-6" style={{ borderTop: '1px solid #EDE0D4' }}>
          <button
            onClick={goPrev}
            disabled={step === 0}
            className="rounded-xl px-5 py-2.5 text-sm font-medium border disabled:opacity-30"
            style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
          >
            ← {en ? 'Previous' : 'Forrige'}
          </button>
          {step < CONTENT_STEPS - 1 && (
            <button
              onClick={goNext}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: '#E8634A' }}
            >
              {en ? 'Next →' : 'Næste →'}
            </button>
          )}
          {step === CONTENT_STEPS - 1 && (
            <span className="text-xs" style={{ color: '#9B8B7E' }}>
              {en ? 'Answer all questions to continue' : 'Besvar alle spørgsmål for at fortsætte'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
