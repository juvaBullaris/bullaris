'use client'

/**
 * Quarterly financial wellbeing check-in.
 * Questions are adapted from the CFPB Financial Well-Being Scale and
 * OECD/INFE Financial Wellbeing Assessment, localised for Danish employees.
 * Shows once per quarter; responses stored in localStorage.
 */

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'

interface Question {
  id: string
  q: { en: string; da: string }
  options: { en: string; da: string }[]
}

type QuarterDef = {
  title: { en: string; da: string }
  subtitle: { en: string; da: string }
  questions: Question[]
}

const QUARTERS: Record<string, QuarterDef> = {
  Q1: {
    title:    { en: 'New year, how are your finances?', da: 'Nyt år, hvordan står det til?' },
    subtitle: { en: 'A quick check-in on where you stand financially.', da: 'Et hurtigt tjek på, hvor du er finansielt.' },
    questions: [
      {
        id: 'q1_situation',
        q: { en: 'How would you describe your financial situation right now?', da: 'Hvordan vil du beskrive din finansielle situation lige nu?' },
        options: [
          { en: 'Very stressed — money is a constant worry', da: 'Meget stresset — penge er en konstant bekymring' },
          { en: "Managing, but it's tight", da: 'Det går, men det er stramt' },
          { en: 'Comfortable — needs covered with a bit left', da: 'Komfortabelt — behov dækket med lidt til overs' },
          { en: 'In control — saving and making progress', da: 'Styr på det — sparer op og gør fremskridt' },
        ],
      },
      {
        id: 'q1_shock',
        q: { en: 'If you faced an unexpected expense of 15,000 kr today, could you cover it?', da: 'Hvis du stod over for en uventet udgift på 15.000 kr i dag, kunne du dække det?' },
        options: [
          { en: 'No — it would cause serious problems', da: 'Nej — det ville skabe alvorlige problemer' },
          { en: "I'd need to borrow or use credit", da: 'Jeg ville skulle låne eller bruge kredit' },
          { en: "I could cover it but it'd set me back", da: 'Jeg kunne dække det, men det ville sætte mig tilbage' },
          { en: 'Yes — I have savings exactly for this', da: 'Ja — jeg har opsparing til præcis dette' },
        ],
      },
      {
        id: 'q1_worry',
        q: { en: 'How often do you worry about running out of money before payday?', da: 'Hvor ofte bekymrer du dig om at løbe tør for penge inden lønndag?' },
        options: [
          { en: 'Often or always', da: 'Ofte eller altid' },
          { en: 'Sometimes', da: 'Sommetider' },
          { en: 'Rarely', da: 'Sjældent' },
          { en: 'Never — I have a comfortable buffer', da: 'Aldrig — jeg har en komfortabel buffer' },
        ],
      },
      {
        id: 'q1_tracking',
        q: { en: 'How well do you understand where your money goes each month?', da: 'Hvor godt forstår du, hvor dine penge går hen hver måned?' },
        options: [
          { en: "Not at all — it just disappears", da: 'Slet ikke — det bare forsvinder' },
          { en: 'I have a rough idea', da: 'Jeg har en omtrentlig idé' },
          { en: 'I track most of it', da: 'Jeg holder styr på det meste' },
          { en: 'I know exactly — I have a budget', da: 'Jeg ved det præcist — jeg har et budget' },
        ],
      },
      {
        id: 'q1_platform',
        q: { en: 'Has Bullaris helped you understand your finances better in any of these areas?', da: 'Har Bullaris hjulpet dig med at forstå din økonomi bedre på nogen af disse områder?' },
        options: [
          { en: 'Payslip / what I actually earn', da: 'Lønseddel / hvad jeg faktisk tjener' },
          { en: 'Tax and deductions', da: 'Skat og fradrag' },
          { en: 'Savings and goals', da: 'Opsparing og mål' },
          { en: "I'm still exploring the platform", da: 'Jeg er stadig ved at udforske platformen' },
        ],
      },
    ],
  },
  Q2: {
    title:    { en: 'Mid-year check — how is progress?', da: 'Halvårscheck — hvordan går fremgangen?' },
    subtitle: { en: "Let's see how your finances have moved since January.", da: 'Lad os se, hvordan din økonomi har bevæget sig siden januar.' },
    questions: [
      {
        id: 'q2_progress',
        q: { en: 'Compared to January, how is your financial situation?', da: 'Sammenlignet med januar, hvordan er din finansielle situation?' },
        options: [
          { en: 'Worse — things have gotten harder', da: 'Dårligere — tingene er blevet sværere' },
          { en: 'About the same', da: 'Omtrent det samme' },
          { en: 'A bit better', da: 'En smule bedre' },
          { en: 'Noticeably better', da: 'Mærkbart bedre' },
        ],
      },
      {
        id: 'q2_goals',
        q: { en: 'Are you on track to hit at least one financial goal this year?', da: 'Er du på vej til at nå mindst ét finansielt mål i år?' },
        options: [
          { en: "I haven't set any goals yet", da: 'Jeg har ikke sat nogen mål endnu' },
          { en: "I've set goals but I'm behind", da: 'Jeg har sat mål, men er bagud' },
          { en: 'Roughly on track', da: 'Nogenlunde på rette spor' },
          { en: "Yes — I'm ahead of schedule", da: 'Ja — jeg er foran planen' },
        ],
      },
      {
        id: 'q2_confidence',
        q: { en: 'How confident do you feel making big financial decisions (loans, investments, insurance)?', da: 'Hvor tryg føler du dig med at træffe store finansielle beslutninger (lån, investeringer, forsikring)?' },
        options: [
          { en: 'Not confident — I need help with these', da: 'Ikke tryg — jeg har brug for hjælp til disse' },
          { en: 'I manage but often feel uncertain', da: 'Jeg klarer det, men føler mig ofte usikker' },
          { en: 'Reasonably confident', da: 'Rimeligt tryg' },
          { en: 'Very confident — I understand the options', da: 'Meget tryg — jeg forstår mulighederne' },
        ],
      },
      {
        id: 'q2_improvement',
        q: { en: 'Which area of your finances has improved most in the last 3 months?', da: 'Hvilket område af din økonomi er forbedret mest i de seneste 3 måneder?' },
        options: [
          { en: 'Better understanding of my payslip', da: 'Bedre forståelse af min lønseddel' },
          { en: 'More consistent saving', da: 'Mere konsekvent opsparing' },
          { en: 'Less unnecessary spending', da: 'Færre unødvendige udgifter' },
          { en: 'Less anxiety about money generally', da: 'Generelt mindre angst om penge' },
        ],
      },
      {
        id: 'q2_feature',
        q: { en: 'What is the most useful thing you have found on Bullaris?', da: 'Hvad er det mest nyttige, du har fundet på Bullaris?' },
        options: [
          { en: 'The payslip explanation', da: 'Løneddelsforklaringen' },
          { en: 'The learning courses', da: 'Læringsindholdet' },
          { en: 'The goal tracker', da: 'Målsporingen' },
          { en: 'The tax planner or AI chat', da: 'Skatteplanleggeren eller AI-chatten' },
        ],
      },
    ],
  },
  Q3: {
    title:    { en: 'Summer check — resilience and future', da: 'Sommercheck — robusthed og fremtid' },
    subtitle: { en: 'How secure do you feel going into the second half of the year?', da: 'Hvor tryg føler du dig på vej ind i årets anden halvdel?' },
    questions: [
      {
        id: 'q3_resilience',
        q: { en: 'How would you rate your financial resilience — your ability to handle financial shocks?', da: 'Hvordan vurderer du din finansielle robusthed — din evne til at håndtere finansielle chok?' },
        options: [
          { en: 'Very low — any surprise would be a crisis', da: 'Meget lav — enhver overraskelse ville være en krise' },
          { en: "Low — I'd struggle significantly", da: 'Lav — jeg ville kæmpe betydeligt' },
          { en: "Moderate — I'd manage with difficulty", da: 'Moderat — jeg ville klare det med besvær' },
          { en: 'High — I have buffers in place', da: 'Høj — jeg har buffere på plads' },
        ],
      },
      {
        id: 'q3_pension',
        q: { en: 'How do you feel about your pension and retirement savings?', da: 'Hvordan har du det med din pension og pensionsopsparing?' },
        options: [
          { en: "Very worried — I haven't thought about it enough", da: 'Meget bekymret — jeg har ikke tænkt nok over det' },
          { en: "Somewhat worried — I'm behind where I should be", da: "Lidt bekymret — jeg er bagud, hvor jeg burde være" },
          { en: "Neutral — I'm contributing but not sure if it's enough", da: 'Neutral — jeg indbetaler, men er usikker om det er nok' },
          { en: 'Good — I have a clear plan', da: 'Godt — jeg har en klar plan' },
        ],
      },
      {
        id: 'q3_relationship',
        q: { en: 'How has your relationship with money changed since using Bullaris?', da: 'Hvordan har dit forhold til penge ændret sig siden du begyndte at bruge Bullaris?' },
        options: [
          { en: 'No real change', da: 'Ingen reel ændring' },
          { en: 'I think about it more consciously', da: 'Jeg tænker mere bevidst over det' },
          { en: 'I make better decisions with less stress', da: 'Jeg træffer bedre beslutninger med mindre stress' },
          { en: 'I feel genuinely more in control', da: 'Jeg føler mig genuint mere i kontrol' },
        ],
      },
      {
        id: 'q3_buffer',
        q: { en: 'If you lost your income tomorrow, how long could you survive financially?', da: 'Hvis du mistede din indkomst i morgen, hvor længe kunne du så klare dig finansielt?' },
        options: [
          { en: 'Less than 1 month', da: 'Under 1 måned' },
          { en: '1–2 months', da: '1–2 måneder' },
          { en: '3–6 months', da: '3–6 måneder' },
          { en: 'More than 6 months', da: 'Mere end 6 måneder' },
        ],
      },
      {
        id: 'q3_security',
        q: { en: 'What would make you feel most financially secure over the next 6 months?', da: 'Hvad ville få dig til at føle dig mest finansielt tryg i de næste 6 måneder?' },
        options: [
          { en: 'Higher salary or income', da: 'Højere løn eller indkomst' },
          { en: 'Clearer understanding of my expenses', da: 'Klarere forståelse af mine udgifter' },
          { en: 'More savings / emergency fund', da: 'Mere opsparing / nødfond' },
          { en: 'Better investment or pension strategy', da: 'Bedre investerings- eller pensionsstrategi' },
        ],
      },
    ],
  },
  Q4: {
    title:    { en: 'Year-end reflection', da: 'Årsafslutninsrefleksion' },
    subtitle: { en: 'How far have you come this year — and what comes next?', da: 'Hvor langt er du kommet i år — og hvad kommer næst?' },
    questions: [
      {
        id: 'q4_year',
        q: { en: 'Compared to a year ago, how has your financial wellbeing changed?', da: 'Sammenlignet med for et år siden, hvordan har din finansielle trivsel ændret sig?' },
        options: [
          { en: 'Significantly worse', da: 'Betydeligt dårligere' },
          { en: 'About the same', da: 'Omtrent det samme' },
          { en: 'Slightly better', da: 'Lidt bedre' },
          { en: 'Significantly better', da: 'Betydeligt bedre' },
        ],
      },
      {
        id: 'q4_yearend',
        q: { en: 'Are you financially prepared for year-end costs? (Christmas, taxes, bills)', da: 'Er du finansielt forberedt på årsafslutningsomkostninger? (Jul, skat, regninger)' },
        options: [
          { en: "Not at all — I'll need to borrow", da: 'Slet ikke — jeg vil skulle låne' },
          { en: 'Partially — it will be tight', da: 'Delvist — det vil være stramt' },
          { en: "Yes — I've planned for it", da: 'Ja — jeg har planlagt det' },
          { en: 'Yes — I have extra set aside', da: 'Ja — jeg har ekstra til side' },
        ],
      },
      {
        id: 'q4_impact',
        q: { en: 'Which statement best describes how Bullaris has impacted your finances?', da: 'Hvilken påstand beskriver bedst, hvordan Bullaris har påvirket din økonomi?' },
        options: [
          { en: "I haven't used it much yet", da: 'Jeg har ikke brugt det meget endnu' },
          { en: "It's improved my understanding but not changed behaviour", da: 'Det har forbedret min forståelse, men ikke ændret adfærd' },
          { en: "It's helped me take one or two concrete steps", da: 'Det har hjulpet mig til at tage et eller to konkrete skridt' },
          { en: "It's meaningfully improved how I manage money", da: 'Det har meningsfuldt forbedret, hvordan jeg håndterer penge' },
        ],
      },
      {
        id: 'q4_recommend',
        q: { en: 'How likely are you to recommend Bullaris to a colleague?', da: 'Hvor sandsynligt er det, at du vil anbefale Bullaris til en kollega?' },
        options: [
          { en: 'Not likely', da: 'Ikke sandsynligt' },
          { en: 'Maybe', da: 'Måske' },
          { en: 'Likely', da: 'Sandsynligt' },
          { en: 'Definitely', da: 'Helt sikkert' },
        ],
      },
      {
        id: 'q4_next',
        q: { en: 'What would make the biggest difference to your financial confidence next year?', da: 'Hvad ville gøre den største forskel for din finansielle selvtillid næste år?' },
        options: [
          { en: 'More personalised advice', da: 'Mere personlig rådgivning' },
          { en: 'More learning content', da: 'Mere læringsindhold' },
          { en: 'Better tools to track spending', da: 'Bedre værktøjer til at spore udgifter' },
          { en: 'More help with tax and pension', da: 'Mere hjælp med skat og pension' },
        ],
      },
    ],
  },
}

function getCurrentQuarterKey(): string {
  const m = new Date().getMonth()
  const y = new Date().getFullYear()
  const q = Math.floor(m / 3) + 1
  return `${y}-Q${q}`
}

function getQuarterLabel(): keyof typeof QUARTERS {
  const m = new Date().getMonth()
  const q = Math.floor(m / 3) + 1
  return `Q${q}` as keyof typeof QUARTERS
}

export function QuarterlyCheckIn({ onComplete }: { onComplete?: () => void }) {
  const { locale } = useLanguage()
  const en = locale === 'en'

  const [open, setOpen]         = useState(false)
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState<Record<string, number>>({})
  const [done, setDone]         = useState(false)

  const quarterKey = getCurrentQuarterKey()
  const quarterLabel = getQuarterLabel()
  const def = QUARTERS[quarterLabel]

  useEffect(() => {
    const saved = localStorage.getItem(`bullaris_quarterly_${quarterKey}`)
    if (saved) return
    // Delay slightly so it doesn't clash with pulse modal
    setTimeout(() => setOpen(true), 1400)
  }, [quarterKey])

  function selectAnswer(questionId: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: idx }))
  }

  function handleNext() {
    if (step < def.questions.length - 1) {
      setStep((s) => s + 1)
    } else {
      // Save and close
      localStorage.setItem(`bullaris_quarterly_${quarterKey}`, JSON.stringify(answers))
      setDone(true)
      setTimeout(() => { setOpen(false); onComplete?.() }, 2000)
    }
  }

  function handleSkip() {
    localStorage.setItem(`bullaris_quarterly_${quarterKey}`, 'skipped')
    setOpen(false)
    onComplete?.()
  }

  if (!open) return null

  const currentQ = def.questions[step]
  const hasAnswer = answers[currentQ?.id ?? ''] !== undefined
  const progress  = ((step + (hasAnswer ? 1 : 0)) / def.questions.length) * 100

  return (
    <>
      <style>{`
        @keyframes quarterly-in {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .quarterly-card { animation: quarterly-in 0.3s ease-out forwards; }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0"
        style={{ background: 'rgba(30,15,0,0.5)' }}
        onClick={handleSkip}
      >
        <div
          className="quarterly-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: '#FFF8F3' }}
          onClick={(e) => e.stopPropagation()}
        >
          {done ? (
            <div className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
              <span className="text-4xl">✨</span>
              <p className="text-lg font-bold" style={{ color: '#1E0F00', fontFamily: 'Georgia, serif' }}>
                {en ? 'Thank you — your feedback shapes Bullaris' : 'Tak — din feedback former Bullaris'}
              </p>
              <p className="text-sm" style={{ color: '#9B8B7E' }}>
                {en ? "We'll use this to improve your experience over the next quarter." : 'Vi bruger dette til at forbedre din oplevelse i næste kvartal.'}
              </p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="h-1.5 w-full" style={{ background: '#EDE0D4' }}>
                <div
                  className="h-1.5 transition-all duration-500"
                  style={{ width: `${progress}%`, background: '#E8634A' }}
                />
              </div>

              <div className="px-6 pt-5 pb-2">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9B8B7E' }}>
                      {en ? `Quarterly check-in · ${quarterLabel}` : `Kvartalstjek · ${quarterLabel}`}
                    </p>
                    <h2 className="text-base font-bold leading-snug" style={{ color: '#1E0F00', fontFamily: 'Georgia, serif' }}>
                      {en ? def.title.en : def.title.da}
                    </h2>
                  </div>
                  <button
                    onClick={handleSkip}
                    className="text-xs shrink-0 ml-3 px-2 py-1 rounded-lg"
                    style={{ color: '#9B8B7E', background: '#EDE0D4' }}
                  >
                    {en ? 'Skip' : 'Spring over'}
                  </button>
                </div>

                {/* Step counter */}
                <p className="text-xs mb-4" style={{ color: '#9B8B7E' }}>
                  {en ? `Question ${step + 1} of ${def.questions.length}` : `Spørgsmål ${step + 1} af ${def.questions.length}`}
                </p>

                {/* Question */}
                <p className="text-sm font-semibold mb-4 leading-snug" style={{ color: '#1E0F00' }}>
                  {en ? currentQ.q.en : currentQ.q.da}
                </p>

                {/* Options */}
                <div className="space-y-2 mb-5">
                  {currentQ.options.map((opt, idx) => {
                    const selected = answers[currentQ.id] === idx
                    return (
                      <button
                        key={idx}
                        onClick={() => selectAnswer(currentQ.id, idx)}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                        style={{
                          background: selected ? '#1E0F00' : '#F5EFE9',
                          color: selected ? '#FFF8F3' : '#1E0F00',
                          border: `1.5px solid ${selected ? '#1E0F00' : 'transparent'}`,
                          fontWeight: selected ? 600 : 400,
                        }}
                      >
                        {en ? opt.en : opt.da}
                      </button>
                    )
                  })}
                </div>

                <button
                  disabled={!hasAnswer}
                  onClick={handleNext}
                  className="w-full rounded-2xl py-3.5 text-sm font-bold text-white disabled:opacity-30 transition mb-5"
                  style={{ background: '#E8634A' }}
                >
                  {step < def.questions.length - 1
                    ? (en ? 'Next →' : 'Næste →')
                    : (en ? 'Finish ✓' : 'Afslut ✓')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
