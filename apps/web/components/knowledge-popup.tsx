'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/lib/language-context'

interface QuizQuestion {
  course: string
  courseLabel: string
  q:    { en: string; da: string }
  options: { en: string; da: string }[]
  correctIndex: number
  explanation: { en: string; da: string }
}

const QUESTIONS: QuizQuestion[] = [
  {
    course: 'money-monetary-systems', courseLabel: 'Money & Monetary Systems',
    q: { en: 'What are the three functions of money?', da: 'Hvad er penges tre funktioner?' },
    options: [
      { en: 'Store of value, unit of account, medium of exchange', da: 'Værdibeholdning, regningsenhed, byttemiddel' },
      { en: 'Earn interest, store value, pay taxes', da: 'Tjene renter, beholde værdi, betale skat' },
      { en: 'Be printed by governments, earn interest, pay for goods', da: 'Trykkes af regeringer, tjene renter, betale for varer' },
      { en: 'Gold backing, legal tender, electronic transfer', da: 'Guldbaggrund, lovligt betalingsmiddel, elektronisk overførsel' },
    ],
    correctIndex: 0,
    explanation: { en: 'Money is a medium of exchange, a unit of account, and a store of value. The third function — store of value — is where most modern currencies struggle.', da: 'Penge er byttemiddel, regningsenhed og værdibeholdning. Den tredje funktion — værdibeholdning — er det de fleste moderne valutaer kæmper med.' },
  },
  {
    course: 'money-monetary-systems', courseLabel: 'Money & Monetary Systems',
    q: { en: 'Your savings account pays 2% interest. Inflation is 4%. What is your real return?', da: 'Din opsparingskonto betaler 2% rente. Inflationen er 4%. Hvad er dit reelle afkast?' },
    options: [
      { en: '+6%', da: '+6%' },
      { en: '+2%', da: '+2%' },
      { en: '0%', da: '0%' },
      { en: '−2%', da: '−2%' },
    ],
    correctIndex: 3,
    explanation: { en: 'Real return = nominal rate − inflation. 2% − 4% = −2%. Your money loses purchasing power even while "earning" interest.', da: 'Reelt afkast = nominel rente − inflation. 2% − 4% = −2%. Dine penge mister købekraft selv mens du "tjener" renter.' },
  },
  {
    course: 'money-monetary-systems', courseLabel: 'Money & Monetary Systems',
    q: { en: 'Nixon closed the "gold window" in 1971. What did this mean?', da: 'Nixon lukkede "guldvinduet" i 1971. Hvad betød det?' },
    options: [
      { en: 'The US stopped selling gold to citizens', da: 'USA stoppede med at sælge guld til borgere' },
      { en: 'Foreign countries could no longer exchange dollars for gold at a fixed rate', da: 'Fremmede lande kunne ikke længere veksle dollars til guld til en fast kurs' },
      { en: 'The US moved all gold to Fort Knox', da: 'USA flyttede alt guld til Fort Knox' },
      { en: 'Central banks stopped publishing gold reserves', da: 'Centralbanker stoppede med at offentliggøre guldreserver' },
    ],
    correctIndex: 1,
    explanation: { en: 'The "gold window" was the US commitment to exchange foreign-held dollars for gold at $35/oz. When Nixon closed it, every currency became purely fiat — backed by trust and law, not metal.', da: '"Guldvinduet" var USAs forpligtelse til at veksle udenlandsk holdte dollars til guld til $35/oz. Da Nixon lukkede det, blev alle valutaer rent fiat — bakket op af tillid og lov, ikke metal.' },
  },
  {
    course: 'financial-foundations', courseLabel: 'Financial Foundations',
    q: { en: 'You invest 500 kr/month from age 25. A friend invests 1,000 kr/month from age 35. Both earn 7% annually. Who has more at 65?', da: 'Du investerer 500 kr/md fra 25-årsalderen. En ven investerer 1.000 kr/md fra 35. Begge tjener 7% om året. Hvem har mest ved 65?' },
    options: [
      { en: 'Your friend — they invest twice as much per month', da: 'Din ven — de investerer dobbelt så meget om måneden' },
      { en: 'You — starting earlier beats investing more later', da: 'Du — at starte tidligere slår at investere mere senere' },
      { en: "You'll end up with the same amount", da: 'I ender med det samme beløb' },
      { en: 'Impossible to say without knowing the funds', da: 'Umuligt at sige uden at kende fondene' },
    ],
    correctIndex: 1,
    explanation: { en: '500 kr/month from 25 → ~2.6M kr at 65. 1,000 kr/month from 35 → ~1.2M kr. Starting 10 years earlier with half the amount produces more than double. Time beats size.', da: '500 kr/md fra 25 → ca. 2,6 mio. kr ved 65. 1.000 kr/md fra 35 → ca. 1,2 mio. kr. At starte 10 år tidligere med det halve beløb giver mere end det dobbelte. Tid slår størrelse.' },
  },
  {
    course: 'financial-foundations', courseLabel: 'Financial Foundations',
    q: { en: 'What is net worth?', da: 'Hvad er nettoformue?' },
    options: [
      { en: 'Your monthly salary after taxes', da: 'Din månedlige løn efter skat' },
      { en: 'Total assets minus total liabilities', da: 'Samlede aktiver minus samlede forpligtelser' },
      { en: 'Your annual income minus annual expenses', da: 'Din årsindkomst minus årsudgifter' },
      { en: 'The value of your home and savings combined', da: 'Værdien af dit hjem og din opsparing tilsammen' },
    ],
    correctIndex: 1,
    explanation: { en: 'Net worth = what you own minus what you owe. It\'s the single most important financial number — more meaningful than income.', da: 'Nettoformue = hvad du ejer minus hvad du skylder. Det er det vigtigste enkelt finansielle tal — mere meningsfuldt end indkomst.' },
  },
  {
    course: 'interest-rates-credit', courseLabel: 'Interest Rates & Credit',
    q: { en: 'What does ÅOP stand for on a Danish loan offer?', da: 'Hvad står ÅOP for på et dansk lånetilbud?' },
    options: [
      { en: 'Annual repayment percentage', da: 'Årlig afdragsprocent' },
      { en: 'Total annual cost of the loan including all fees', da: 'Samlede årlige omkostninger ved lånet inkl. alle gebyrer' },
      { en: 'Your personal credit score percentage', da: 'Din personlige kreditvurderingsprocent' },
      { en: 'Adjusted open payment plan', da: 'Justeret åbent betalingsplan' },
    ],
    correctIndex: 1,
    explanation: { en: 'ÅOP (Årlige Omkostninger i Procent) is the true annual cost — interest plus all fees. Danish law requires lenders to show it. A 5% interest rate can easily become an 8% ÅOP.', da: 'ÅOP (Årlige Omkostninger i Procent) er den sande årlige pris — renter plus alle gebyrer. Dansk lov kræver at långivere viser det. En 5%-rente kan sagtens blive til 8% ÅOP.' },
  },
  {
    course: 'interest-rates-credit', courseLabel: 'Interest Rates & Credit',
    q: { en: 'Your mortgage rate is 3.5%. Your index fund has historically returned 7%. Should you pay down the mortgage early or invest?', da: 'Din realkreditrente er 3,5%. Din indeksfond har historisk givet 7%. Skal du afdrage ekstra eller investere?' },
    options: [
      { en: 'Always pay down debt first — debt-free is best', da: 'Afbetal altid gæld først — gældfri er bedst' },
      { en: 'Invest — the expected return exceeds the interest cost', da: 'Investér — det forventede afkast overstiger renteomkostningen' },
      { en: 'It makes no mathematical difference', da: 'Det gør ingen matematisk forskel' },
      { en: 'Only if the mortgage is fixed rate', da: 'Kun hvis lånet er fastforrentet' },
    ],
    correctIndex: 1,
    explanation: { en: 'Mathematically: 7% expected return > 3.5% cost of debt. Investing the surplus builds more wealth. Though the psychological value of being debt-free is real — it\'s a personal decision.', da: 'Matematisk: 7% forventet afkast > 3,5% gældsomkostning. Investering af overskuddet opbygger mere formue. Selvom den psykologiske værdi af at være gældfri er reel — det er en personlig beslutning.' },
  },
  {
    course: 'macroeconomics', courseLabel: 'Macroeconomics',
    q: { en: 'What is the primary mandate of Danmarks Nationalbank?', da: 'Hvad er Danmarks Nationalbanks primære mandat?' },
    options: [
      { en: 'Control inflation by setting interest rates', da: 'Kontrollere inflation ved at sætte renter' },
      { en: 'Maintain the krone-euro peg', da: 'Opretholde kronen-euro-kursen' },
      { en: 'Regulate Danish commercial banks', da: 'Regulere danske forretningsbanker' },
      { en: 'Fund the Danish welfare state', da: 'Finansiere den danske velfærdsstat' },
    ],
    correctIndex: 1,
    explanation: { en: 'Unlike the ECB, Danmarks Nationalbank\'s job is keeping DKK pegged to EUR. Denmark imports ECB monetary policy — rates in Copenhagen follow Frankfurt, not the other way around.', da: 'I modsætning til ECB er Danmarks Nationalbanks opgave at holde DKK koblet til EUR. Danmark importerer ECBs pengepolitik — renter i København følger Frankfurt, ikke omvendt.' },
  },
  {
    course: 'macroeconomics', courseLabel: 'Macroeconomics',
    q: { en: 'What is the Cantillon effect?', da: 'Hvad er Cantillon-effekten?' },
    options: [
      { en: 'Inflation always hits food prices first', da: 'Inflation rammer altid madvarer først' },
      { en: 'New money benefits those who receive it first, before prices adjust', da: 'Nye penge gavner dem der modtager dem først, inden priserne justerer sig' },
      { en: 'Interest rate cuts reduce unemployment with a 6-month lag', da: 'Rentenedsættelser reducerer arbejdsløshed med 6 måneders forsinkelse' },
      { en: 'QE only affects asset prices, not consumer prices', da: 'QE påvirker kun aktivpriser, ikke forbrugerpriser' },
    ],
    correctIndex: 1,
    explanation: { en: 'Named after Richard Cantillon (18th c.): new money enters through specific channels — banks, governments, large borrowers buy at old prices. By the time it reaches ordinary wages, prices have risen.', da: 'Opkaldt efter Richard Cantillon (1700-tallet): nye penge kommer ind via specifikke kanaler — banker, regeringer, store låntagere køber til gamle priser. Inden det når til normale lønninger, er priserne steget.' },
  },
  {
    course: 'investing-markets', courseLabel: 'Investing & Markets',
    q: { en: 'What percentage of actively managed funds fail to beat their benchmark over 10 years?', da: 'Hvilken procentdel af aktivt forvaltede fonde klarer sig dårligere end deres benchmark over 10 år?' },
    options: [
      { en: 'About 40%', da: 'Ca. 40%' },
      { en: 'About 60%', da: 'Ca. 60%' },
      { en: 'About 75%', da: 'Ca. 75%' },
      { en: 'About 90%', da: 'Ca. 90%' },
    ],
    correctIndex: 3,
    explanation: { en: 'SPIVA data: ~90% of active funds underperform their index over 10 years, net of fees. This is the core argument for passive index investing — not luck, but structural underperformance.', da: 'SPIVA-data: ca. 90% af aktive fonde underpræsterer deres indeks over 10 år, efter gebyrer. Det er kerneargumentet for passiv indeksinvestering — ikke uld, men strukturel underperformance.' },
  },
  {
    course: 'investing-markets', courseLabel: 'Investing & Markets',
    q: { en: 'What is lagerbeskatning in Denmark?', da: 'Hvad er lagerbeskatning i Danmark?' },
    options: [
      { en: 'Tax paid only when you sell an investment', da: 'Skat betalt kun når du sælger en investering' },
      { en: 'Annual tax on unrealised gains — even if you haven\'t sold', da: 'Årlig skat på urealiserede gevinster — selv hvis du ikke har solgt' },
      { en: 'Capital gains tax on property only', da: 'Kapitalgevinstskat kun på fast ejendom' },
      { en: 'Tax on dividends from foreign stocks', da: 'Skat på udbytte fra udenlandske aktier' },
    ],
    correctIndex: 1,
    explanation: { en: 'Lagerbeskatning: you pay tax each year on investment gains, whether realised or not. This reduces compounding — a key reason to compare Danish funds (often realisationsbeskatning) vs. foreign ETFs.', da: 'Lagerbeskatning: du betaler skat hvert år af investeringsgevinster, uanset om de er realiserede eller ej. Det reducerer renters rente — en nøgleårsag til at sammenligne danske fonde (ofte realisationsbeskatning) med udenlandske ETF\'er.' },
  },
  {
    course: 'pension-retirement', courseLabel: 'Pension & Retirement',
    q: { en: 'What is ATP?', da: 'Hvad er ATP?' },
    options: [
      { en: 'A private pension provider that employers choose', da: 'Et privat pensionsselskab som arbejdsgivere vælger' },
      { en: 'Mandatory collective supplementary pension — a guaranteed monthly floor', da: 'Obligatorisk kollektiv tillægspension — et garanteret månedligt gulv' },
      { en: 'The Danish equivalent of a 401(k) retirement account', da: 'Det danske svar på en 401(k) pensionskonto' },
      { en: 'A tax deduction you claim for pension contributions', da: 'Et skattefradrag du indberetter for pensionsindbetalinger' },
    ],
    correctIndex: 1,
    explanation: { en: 'ATP is mandatory and collective — a guaranteed supplement to folkepension. It\'s a floor, not a foundation. Most Danes need workplace pension and personal savings on top.', da: 'ATP er obligatorisk og kollektiv — et garanteret tillæg til folkepensionen. Det er et gulv, ikke en grundvold. De fleste danskere har brug for firmapension og personlig opsparing oveni.' },
  },
  {
    course: 'pension-retirement', courseLabel: 'Pension & Retirement',
    q: { en: 'Why does contributing to a pension save you extra money when you pay topskat?', da: 'Hvorfor sparer du ekstra penge ved at indbetale til pension, når du betaler topskat?' },
    options: [
      { en: 'Pension contributions are always tax-free', da: 'Pensionsindbetalinger er altid skattefrie' },
      { en: 'You defer tax from ~52% now to a lower rate when you retire', da: 'Du udskyder skat fra ca. 52% nu til en lavere sats, når du går på pension' },
      { en: 'The government adds 25% to all pension contributions', da: 'Staten tilføjer 25% til alle pensionsindbetalinger' },
      { en: 'Pension funds grow faster than taxable investments', da: 'Pensionsfonde vokser hurtigere end skattepligtige investeringer' },
    ],
    correctIndex: 1,
    explanation: { en: 'Contributing to pension reduces your taxable income now, saving you ~52 øre per DKK. When you withdraw in retirement, you\'ll likely be in a lower bracket. That gap is a legal subsidy.', da: 'Pensionsindbetalinger reducerer din skattepligtige indkomst nu og sparer dig ca. 52 øre per krone. Når du hæver ved pension, er du sandsynligvis i en lavere skatteklasse. Den forskel er et lovligt tilskud.' },
  },
  {
    course: 'housing-real-estate', courseLabel: 'Housing & Real Estate',
    q: { en: 'What makes the Danish realkreditlån system globally unique?', da: 'Hvad gør det danske realkreditsystem globalt unikt?' },
    options: [
      { en: 'Danish mortgages always have the lowest rates in Europe', da: 'Danske boliglån har altid de laveste renter i Europa' },
      { en: 'Borrowers can buy back their own mortgage bond at market price when rates rise — reducing their debt', da: 'Låntagere kan købe deres egne realkreditobligationer til markedspris når renten stiger — og reducere deres gæld' },
      { en: 'The Danish state guarantees all mortgages', da: 'Den danske stat garanterer alle boliglån' },
      { en: 'No down payment is required for first-time buyers', da: 'Ingen udbetaling kræves for førstegangskøbere' },
    ],
    correctIndex: 1,
    explanation: { en: 'The callable bond feature: when rates rise, your bond trades below par — you can buy it back cheaply and cancel the debt. This is a powerful tool that most borrowers in the world simply don\'t have.', da: 'Den konverterbare obligation: når renten stiger, handles din obligation under kurs 100 — du kan købe den billigt tilbage og annullere gælden. Det er et stærkt redskab som de fleste låntagere i verden simpelthen ikke har.' },
  },
  {
    course: 'housing-real-estate', courseLabel: 'Housing & Real Estate',
    q: { en: 'What is the maximum loan-to-value for a primary residence in Denmark?', da: 'Hvad er det maksimale belåningsforhold for en primær bolig i Danmark?' },
    options: [
      { en: '60% — you need 40% down', da: '60% — du skal have 40% udbetaling' },
      { en: '70% — you need 30% down', da: '70% — du skal have 30% udbetaling' },
      { en: '80% — you need 20% down', da: '80% — du skal have 20% udbetaling' },
      { en: '95% — you only need 5% down', da: '95% — du skal kun have 5% udbetaling' },
    ],
    correctIndex: 2,
    explanation: { en: 'Danish realkreditlån covers up to 80% of property value. The remaining 20% comes from savings or a bank loan. This is why the down payment question is so critical for first-time buyers.', da: 'Realkreditlån dækker op til 80% af ejendomsværdien. De resterende 20% kommer fra opsparing eller banklån. Det er derfor udbetalingsspørgsmålet er så afgørende for førstegangskøbere.' },
  },
]

function pickDailyQuestion(): QuizQuestion {
  // Deterministic daily pick (same question all day, changes each day)
  const seed = Math.floor(Date.now() / 86400000) % QUESTIONS.length
  return QUESTIONS[seed]
}

export function KnowledgePopup() {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [visible, setVisible]   = useState(false)
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [chosen, setChosen]     = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const lastShown = localStorage.getItem('bullaris_quiz_shown')
    if (lastShown === today) return
    // 35% chance of showing per day
    if (Math.random() > 0.35) return

    const q = pickDailyQuestion()
    setQuestion(q)
    localStorage.setItem('bullaris_quiz_shown', today)
    // Delay so other modals have priority
    setTimeout(() => setVisible(true), 3500)
  }, [])

  const handleChoice = useCallback((idx: number) => {
    if (revealed) return
    setChosen(idx)
    setRevealed(true)
    if (idx === question?.correctIndex) {
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 2200)
    }
  }, [revealed, question])

  if (!visible || !question) return null

  const isCorrect = revealed && chosen === question.correctIndex

  return (
    <>
      <style>{`
        @keyframes slide-up-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes confetti-burst {
          0%   { transform: scale(0) rotate(0deg);   opacity: 1; }
          60%  { transform: scale(1.4) rotate(25deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg);   opacity: 0; }
        }
        @keyframes correct-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ring-ping {
          0%   { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .quiz-popup       { animation: slide-up-in 0.3s ease-out forwards; }
        .correct-badge    { animation: correct-pop 0.4s ease-out forwards; }
        .confetti-particle { animation: confetti-burst 0.7s ease-out forwards; position: absolute; pointer-events: none; font-size: 1.4rem; }
        .ring-ping-el     { animation: ring-ping 1s ease-out infinite; }
      `}</style>

      <div
        className="quiz-popup fixed bottom-5 right-5 z-40 w-80 rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: '#FFF8F3', border: '1.5px solid #EDE0D4' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ background: '#1E0F00' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">⚡</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#9B8B7E' }}>
              {en ? 'Quick question' : 'Hurtigt spørgsmål'}
            </span>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-xs px-2 py-0.5 rounded"
            style={{ color: '#6B5C52' }}
          >
            ✕
          </button>
        </div>

        <div className="px-4 pt-3 pb-4 relative">
          {/* Course label */}
          <p className="text-[10px] font-semibold uppercase tracking-wide mb-2" style={{ color: '#9B8B7E' }}>
            {question.courseLabel}
          </p>

          {/* Question */}
          <p className="text-sm font-semibold leading-snug mb-3" style={{ color: '#1E0F00' }}>
            {en ? question.q.en : question.q.da}
          </p>

          {/* Options */}
          <div className="space-y-1.5 mb-3">
            {question.options.map((opt, idx) => {
              const isChosen  = chosen === idx
              const isCorrect = idx === question.correctIndex
              let bg = '#F5EFE9'
              let color = '#1E0F00'
              let border = 'transparent'
              if (revealed) {
                if (isCorrect)               { bg = '#E8F5EE'; color = '#1E5C37'; border = '#5B8A6B' }
                else if (isChosen && !isCorrect) { bg = '#FDE8E4'; color = '#7A1F10'; border = '#E8634A' }
              } else if (isChosen) {
                bg = '#1E0F00'; color = '#FFF8F3'
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  disabled={revealed}
                  className="w-full text-left text-xs px-3 py-2.5 rounded-xl transition-all disabled:cursor-default"
                  style={{ background: bg, color, border: `1.5px solid ${border}`, fontWeight: isChosen || (revealed && isCorrect) ? 600 : 400 }}
                >
                  {revealed && isCorrect && <span className="mr-1.5">✓</span>}
                  {revealed && isChosen && !isCorrect && <span className="mr-1.5">✗</span>}
                  {en ? opt.en : opt.da}
                </button>
              )
            })}
          </div>

          {/* Celebration overlay */}
          {celebrating && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 10 }}>
              {['🎉', '⭐', '🌟', '✨', '🎊', '💫'].map((emoji, i) => (
                <span
                  key={i}
                  className="confetti-particle"
                  style={{
                    animationDelay: `${i * 0.08}s`,
                    left: `${15 + i * 12}%`,
                    top: `${20 + (i % 2 === 0 ? 10 : 30)}%`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          )}

          {/* Correct badge */}
          {revealed && isCorrect && (
            <div className="correct-badge flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: '#E8F5EE' }}>
              <span className="text-lg relative">
                ✅
                <span className="ring-ping-el absolute inset-0 rounded-full" style={{ background: '#5B8A6B20' }} />
              </span>
              <p className="text-xs font-bold" style={{ color: '#1E5C37' }}>
                {en ? 'Correct! 🎉' : 'Korrekt! 🎉'}
              </p>
            </div>
          )}

          {/* Wrong badge */}
          {revealed && !isCorrect && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: '#FDE8E4' }}>
              <span className="text-lg">💡</span>
              <p className="text-xs font-medium" style={{ color: '#7A1F10' }}>
                {en ? 'Not quite — see the correct answer above' : 'Ikke helt — se det rigtige svar ovenfor'}
              </p>
            </div>
          )}

          {/* Explanation */}
          {revealed && (
            <p className="text-[11px] leading-relaxed mb-3" style={{ color: '#6B5C52' }}>
              {en ? question.explanation.en : question.explanation.da}
            </p>
          )}

          {revealed && (
            <button
              onClick={() => setVisible(false)}
              className="w-full rounded-xl py-2 text-xs font-bold text-white transition"
              style={{ background: '#E8634A' }}
            >
              {en ? 'Got it →' : 'Forstået →'}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
