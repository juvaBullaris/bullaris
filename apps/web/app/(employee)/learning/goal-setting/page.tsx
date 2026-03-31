'use client'

import { useState } from 'react'
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

const TOTAL_STEPS = 5

export default function GoalSettingPage() {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [currentStep, setCurrentStep] = useState(0)
  const [failureActive, setFailureActive] = useState<number | null>(null)
  const [smartActive, setSmartActive] = useState<number | null>(null)
  const [activeHorizon, setActiveHorizon] = useState<number | null>(null)
  const [expandedStep7, setExpandedStep7] = useState<number | null>(0)
  const [activeBias, setActiveBias] = useState<number | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null, null])
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const markComplete = trpc.learning.markComplete.useMutation()

  const stepLabels = en
    ? ['Why Goals Fail', 'SMART-A', 'Three Horizons', '7-Step Playbook', 'Biases & Quiz']
    : ['Hvorfor mål fejler', 'SMART-A', 'Tre horisonter', '7-trins plan', 'Bias & Quiz']

  function handleQuizAnswer(qi: number, ai: number) {
    if (quizSubmitted) return
    const updated = [...quizAnswers]
    updated[qi] = ai
    setQuizAnswers(updated)
  }

  function submitQuiz() {
    setQuizSubmitted(true)
    markComplete.mutate({ content_id: 'goal-setting' })
  }

  const score = quizSubmitted
    ? QUIZ_QUESTIONS.filter((q, i) => quizAnswers[i] === q.en.correct).length
    : 0

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: '#E8634A', color: '#fff' }}
          >
            {en ? 'Interactive' : 'Interaktiv'}
          </span>
          <span className="text-xs text-muted-foreground">
            {en ? 'Goal Setting' : 'Målsætning'} · ~10 min
          </span>
        </div>
        <h1 className="text-2xl font-bold mb-1">
          🎯 {en ? 'How to Set Your Financial Goals' : 'Sådan sætter du dine finansielle mål'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {en
            ? 'A science-based guide to setting, executing, and reaching your financial goals.'
            : 'En videnskabeligt baseret guide til at sætte, eksekvere og nå dine finansielle mål.'}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-2 flex gap-1">
        {stepLabels.map((label, i) => (
          <button key={i} onClick={() => setCurrentStep(i)} className="flex-1 text-center">
            <div
              className="h-1.5 rounded-full mb-1 transition-all"
              style={{ background: i <= currentStep ? '#E8634A' : '#E5E7EB' }}
            />
            <span
              className={`text-xs hidden md:block ${
                i === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-6 md:hidden">
        {en ? `Step ${currentStep + 1} of ${TOTAL_STEPS}` : `Trin ${currentStep + 1} af ${TOTAL_STEPS}`}:{' '}
        <span className="font-medium text-foreground">{stepLabels[currentStep]}</span>
      </p>

      {/* Content card */}
      <div className="rounded-2xl border bg-card p-6 mb-6 min-h-[440px]">

        {/* STEP 1: Why Goals Fail */}
        {currentStep === 0 && (
          <div>
            <h2 className="text-xl font-bold mb-1">
              {en ? 'Why Most Financial Goals Fail' : 'Hvorfor de fleste finansielle mål mislykkes'}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {en
                ? 'The problem is rarely a lack of desire. Research points to three structural failure modes. Click each to see the fix.'
                : 'Problemet er sjældent manglende ønske. Forskning peger på tre strukturelle fejlmoder. Klik på hver for at se løsningen.'}
            </p>

            <div className="space-y-3 mb-6">
              {FAILURE_MODES.map((mode, i) => {
                const m = en ? mode.en : mode.da
                const active = failureActive === i
                return (
                  <button
                    key={i}
                    onClick={() => setFailureActive(active ? null : i)}
                    className="w-full rounded-xl border-2 p-4 text-left transition-all"
                    style={{
                      borderColor: active ? mode.color : 'transparent',
                      background: active ? `${mode.color}10` : '#F9FAFB',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{m.label}</span>
                          <span className="text-muted-foreground text-xs">{active ? '▲' : '▼'}</span>
                        </div>
                        {active && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm text-muted-foreground">{m.problem}</p>
                            <div
                              className="flex items-start gap-2 rounded-lg p-2"
                              style={{ background: `${mode.color}15` }}
                            >
                              <span className="text-xs font-bold mt-0.5" style={{ color: mode.color }}>
                                FIX
                              </span>
                              <p className="text-sm font-medium">{m.fix}</p>
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
              <p className="font-medium mb-1">📚 {en ? 'The Science' : 'Videnskaben'}</p>
              <p className="text-muted-foreground">
                {en
                  ? 'A 2024 systematic review in Frontiers in Behavioral Economics confirmed: the intention-to-behavior gap is driven primarily by failures at initiation. The solution is not better information — it is better systems.'
                  : 'En systematisk gennemgang fra 2024 i Frontiers in Behavioral Economics bekræftede: intention-til-adfærd-kløften drives primært af fejl ved initiering. Løsningen er ikke bedre information — det er bedre systemer.'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: SMART-A */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-1">
              {en ? 'The SMART-A Framework' : 'SMART-A-rammen'}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {en
                ? 'The most research-backed framework for financial goals. Click each letter to explore its meaning.'
                : 'Den mest forskningsmæssigt understøttede ramme for finansielle mål. Klik på hvert bogstav for at udforske dets betydning.'}
            </p>

            <div className="flex gap-2 mb-5">
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

            {smartActive !== null && (() => {
              const s = SMARTA[smartActive]
              const d = en ? s.en : s.da
              return (
                <div
                  className="rounded-xl p-5 mb-4"
                  style={{ background: `${s.color}0D`, border: `1px solid ${s.color}40` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl text-white shrink-0"
                      style={{ background: s.color }}
                    >
                      {s.letter}
                    </div>
                    <p className="font-bold text-lg">{d.label}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{d.desc}</p>
                  <div className="rounded-lg p-3 text-sm" style={{ background: `${s.color}15` }}>
                    <span className="font-medium" style={{ color: s.color }}>
                      {en ? 'Example: ' : 'Eksempel: '}
                    </span>
                    {d.example}
                  </div>
                </div>
              )
            })()}

            {smartActive === null && (
              <div className="rounded-xl border p-5 text-center text-muted-foreground text-sm">
                {en ? 'Click a letter above to explore that dimension' : 'Klik på et bogstav ovenfor for at udforske den dimension'}
              </div>
            )}

            <div className="rounded-xl p-4 text-sm mt-4" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
              <p className="text-muted-foreground">
                {en
                  ? '📚 Archuleta et al. (2020) extended the classic SMART framework with Accountability in financial therapy research. Locke & Latham (2002): specific, challenging goals with feedback consistently outperform vague or easy ones.'
                  : '📚 Archuleta et al. (2020) udvidede den klassiske SMART-ramme med Ansvarlighed i finansiel terapiforskning. Locke & Latham (2002): specifikke, udfordrende mål med feedback overgår konsekvent vage eller lette mål.'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Three Horizons */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-1">
              {en ? 'The Three Horizons' : 'De tre horisonter'}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {en
                ? 'Not all goals operate on the same timescale. Each horizon needs a different savings vehicle and risk level. Click to explore each one.'
                : 'Ikke alle mål opererer på den samme tidsskala. Hver horisont kræver et andet opsparingsinstrument og risikoniveau. Klik for at udforske hver enkelt.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {HORIZONS.map((h, i) => {
                const d = en ? h.en : h.da
                const active = activeHorizon === i
                return (
                  <button
                    key={i}
                    onClick={() => setActiveHorizon(active ? null : i)}
                    className="rounded-xl border-2 p-4 text-left transition-all"
                    style={{
                      borderColor: active ? h.color : 'transparent',
                      background: active ? `${h.color}0D` : '#F9FAFB',
                    }}
                  >
                    <div className="text-2xl mb-2">{h.icon}</div>
                    <div className="font-bold mb-0.5" style={{ color: h.color }}>{d.label}</div>
                    <div className="text-xs text-muted-foreground mb-3">{d.timeframe}</div>
                    {active ? (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{d.desc}</p>
                        <ul className="space-y-1">
                          {d.examples.map((ex, j) => (
                            <li key={j} className="text-xs flex items-start gap-1.5">
                              <span style={{ color: h.color }}>•</span>
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        {en ? 'Click to expand' : 'Klik for at udvide'}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="rounded-xl p-4 text-sm" style={{ background: '#FFF8F3', border: '1px solid #EDE0D4' }}>
              <p className="text-muted-foreground">
                {en
                  ? '📚 Shefrin & Statman (2000): goals-based portfolios — where each goal has a dedicated funding strategy — outperform generic total-wealth portfolios. Separating goals prevents emotional interference between buckets (e.g. panic-selling long-term investments to cover short-term needs).'
                  : '📚 Shefrin & Statman (2000): målbaserede porteføljer — hvor hvert mål har en dedikeret finansieringsstrategi — overgår generiske totalformueporteføljer. Adskillelse af mål forhindrer følelsesmæssig interferens (f.eks. panikssalg af langsigtede investeringer for at dække kortsigtede behov).'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: 7-Step Playbook */}
        {currentStep === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-1">
              {en ? 'Your 7-Step Playbook' : 'Din 7-trins plan'}
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              {en
                ? 'Built on implementation intentions research, goal gradient theory, and the behavioral lifecycle hypothesis. Click each step to expand.'
                : 'Bygget på forskning i implementeringshensigter, goal gradient-teori og den adfærdsmæssige livscyklushypotese. Klik på hvert trin for at udvide.'}
            </p>

            <div className="space-y-2">
              {STEPS_7.map((s, i) => {
                const d = en ? s.en : s.da
                const active = expandedStep7 === i
                return (
                  <button
                    key={i}
                    onClick={() => setExpandedStep7(active ? null : i)}
                    className="w-full rounded-xl border p-4 text-left transition-all hover:bg-accent"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{
                          background: active ? '#E8634A' : '#F3F4F6',
                          color: active ? '#fff' : '#6B7280',
                        }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{d.title}</div>
                        {active && (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{d.body}</p>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs mt-1">{active ? '▲' : '▼'}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Biases + Quiz */}
        {currentStep === 4 && (
          <div>
            {!quizSubmitted ? (
              <>
                <h2 className="text-xl font-bold mb-1">
                  {en ? 'The Biases That Will Derail You' : 'De bias der vil afspore dig'}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {en
                    ? 'Four biases most destructive to financial goal achievement — and how to counter each. Click to reveal.'
                    : 'Fire bias der er mest destruktive for finansiel målopnåelse — og hvordan du modvirker dem. Klik for at afsløre.'}
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {BIASES.map((b, i) => {
                    const d = en ? b.en : b.da
                    const active = activeBias === i
                    return (
                      <button
                        key={i}
                        onClick={() => setActiveBias(active ? null : i)}
                        className="rounded-xl border-2 p-3 text-left transition-all"
                        style={{
                          borderColor: active ? b.color : 'transparent',
                          background: active ? `${b.color}0D` : '#F9FAFB',
                        }}
                      >
                        <div className="text-xl mb-1">{b.icon}</div>
                        <div
                          className="font-semibold text-sm mb-1"
                          style={{ color: active ? b.color : undefined }}
                        >
                          {d.name}
                        </div>
                        {active ? (
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">{d.what}</p>
                            <div className="rounded-lg p-2 text-xs" style={{ background: `${b.color}15` }}>
                              <span className="font-bold" style={{ color: b.color }}>
                                {en ? 'Counter: ' : 'Modtræk: '}
                              </span>
                              {d.counter}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            {en ? 'Click to reveal' : 'Klik for at afsløre'}
                          </p>
                        )}
                      </button>
                    )
                  })}
                </div>

                <div className="border-t pt-5">
                  <h3 className="font-bold mb-4">
                    {en ? 'Quick Check — 4 Questions' : 'Hurtig test — 4 spørgsmål'}
                  </h3>
                  <div className="space-y-5">
                    {QUIZ_QUESTIONS.map((q, qi) => {
                      const qd = en ? q.en : q.da
                      return (
                        <div key={qi}>
                          <p className="text-sm font-medium mb-2">{qi + 1}. {qd.q}</p>
                          <div className="space-y-1.5">
                            {qd.options.map((opt, ai) => (
                              <button
                                key={ai}
                                onClick={() => handleQuizAnswer(qi, ai)}
                                className="w-full rounded-lg border px-3 py-2 text-sm text-left transition-all"
                                style={{
                                  background: quizAnswers[qi] === ai ? '#E8634A15' : undefined,
                                  borderColor: quizAnswers[qi] === ai ? '#E8634A' : undefined,
                                }}
                              >
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
                    className="mt-5 w-full rounded-xl py-3 text-sm font-bold text-white transition-all disabled:opacity-40"
                    style={{ background: '#E8634A' }}
                  >
                    {en ? 'Submit Answers' : 'Indsend svar'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-3">
                  {score === 4 ? '🏆' : score >= 3 ? '🎯' : '📚'}
                </div>
                <h2 className="text-xl font-bold mb-1">
                  {score}/4 {en ? 'correct' : 'rigtige'}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {score === 4
                    ? (en ? 'Perfect — you\'re ready to set goals that stick.' : 'Perfekt — du er klar til at sætte mål der holder.')
                    : score >= 3
                    ? (en ? 'Strong result. Review the explanations below.' : 'Stærkt resultat. Gennemgå forklaringerne nedenfor.')
                    : (en ? 'Good effort — revisit the steps before starting.' : 'Godt forsøg — gennemgå trinnene inden du starter.')}
                </p>

                <div className="text-left space-y-4 mb-6">
                  {QUIZ_QUESTIONS.map((q, qi) => {
                    const qd = en ? q.en : q.da
                    const correct = quizAnswers[qi] === q.en.correct
                    return (
                      <div
                        key={qi}
                        className="rounded-xl border p-4"
                        style={{ borderColor: correct ? '#16A34A' : '#E8634A' }}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span style={{ color: correct ? '#16A34A' : '#E8634A' }}>
                            {correct ? '✓' : '✗'}
                          </span>
                          <p className="text-sm font-medium">{qd.q}</p>
                        </div>
                        <p className="text-xs font-medium mb-1">
                          {en ? 'Correct answer: ' : 'Rigtigt svar: '}
                          <span style={{ color: '#16A34A' }}>{qd.options[q.en.correct]}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{qd.explanation}</p>
                      </div>
                    )
                  })}
                </div>

                <div
                  className="rounded-xl p-5"
                  style={{
                    background: 'linear-gradient(135deg, #1E0F00 0%, #3D2B1F 100%)',
                    color: '#FFF8F3',
                  }}
                >
                  <p className="font-serif text-lg font-bold mb-1">
                    {en
                      ? 'The best time to set a financial goal was yesterday.'
                      : 'Det bedste tidspunkt at sætte et finansielt mål var i går.'}
                  </p>
                  <p className="text-sm" style={{ color: '#B5A89D' }}>
                    {en ? 'The second best time is today.' : 'Det næstbedste tidspunkt er i dag.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          disabled={currentStep === 0}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-40 transition-colors"
        >
          {en ? '← Back' : '← Tilbage'}
        </button>
        <span className="text-xs text-muted-foreground">
          {currentStep + 1} / {TOTAL_STEPS}
        </span>
        {currentStep < TOTAL_STEPS - 1 && (
          <button
            onClick={() => setCurrentStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            style={{ background: '#E8634A' }}
          >
            {en ? 'Next →' : 'Næste →'}
          </button>
        )}
        {currentStep === TOTAL_STEPS - 1 && !quizSubmitted && (
          <span className="text-xs text-muted-foreground">
            {en ? 'Complete the quiz to finish' : 'Gennemfør quizzen for at afslutte'}
          </span>
        )}
        {currentStep === TOTAL_STEPS - 1 && quizSubmitted && (
          <span className="text-xs font-medium" style={{ color: '#16A34A' }}>
            ✓ {en ? 'Module complete' : 'Modul fuldført'}
          </span>
        )}
      </div>
    </div>
  )
}
