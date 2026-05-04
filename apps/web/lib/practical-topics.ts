import { EmergencyFundCalculator } from '@/components/learning/practical/calculators/EmergencyFundCalculator'
import { LoanComparisonCalculator } from '@/components/learning/practical/calculators/LoanComparisonCalculator'
import { InflationCalculator } from '@/components/learning/practical/calculators/InflationCalculator'
import { IndexFundCalculator } from '@/components/learning/practical/calculators/IndexFundCalculator'
import { FolkepensionCalculator } from '@/components/learning/practical/calculators/FolkepensionCalculator'
import { DownPaymentCalculator } from '@/components/learning/practical/calculators/DownPaymentCalculator'
import { LifeInsuranceCalculator } from '@/components/learning/practical/calculators/LifeInsuranceCalculator'
import { InflationErosionCalculator } from '@/components/learning/practical/calculators/InflationErosionCalculator'
import { CashFlowCalculator } from '@/components/learning/practical/calculators/CashFlowCalculator'
import { NetWorthCalculator } from '@/components/learning/practical/calculators/NetWorthCalculator'
import { BudgetMethodCalculator } from '@/components/learning/practical/calculators/BudgetMethodCalculator'
import { DebtCostCalculator } from '@/components/learning/practical/calculators/DebtCostCalculator'
import { CompoundGrowthCalculator } from '@/components/learning/practical/calculators/CompoundGrowthCalculator'

import type { PracticalTopic, PersonalProfile } from './practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export const PRACTICAL_TOPICS: Record<string, PracticalTopic> = {

  // ── financial-foundations ────────────────────────────────────────────────────

  'how-money-works': {
    id: 'how-money-works',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '💡',
    mins: '~5 min',
    question: {
      en: 'How money actually works — and why it matters to you',
      da: 'Hvordan penge egentlig fungerer — og hvorfor det betyder noget for dig',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const saved = p?.gross_dkk ? Math.round(p.gross_dkk * 6 / 10000) * 10000 : 100000
      const cashIn10 = Math.round(saved * Math.pow(0.97, 10))
      const investedIn10 = Math.round(saved * Math.pow(1.04, 10))
      return {
        en: `Money is a tool that loses value over time. ${fmt(saved)} held in cash for 10 years at 3% inflation is worth only ${fmt(cashIn10)} in today's terms. The same amount invested in a global index fund would be worth ~${fmt(investedIn10)}.`,
        da: `Penge er et redskab der mister værdi over tid. ${fmt(saved)} i kontanter i 10 år ved 3% inflation er kun ${fmt(cashIn10)} i nutidstermer. Det samme beløb investeret i en global indeksfond ville være ~${fmt(investedIn10)} værd.`,
      }
    },
    whyCards: [
      {
        icon: '⏳',
        title: { en: 'Money is a store of value — until it isn\'t', da: 'Penge er en værdiopbevaring — indtil de ikke er' },
        body: {
          en: 'For most of history, money was backed by gold or silver — something real that held value. Today, it is backed by trust and government policy. The consequence: every major currency has lost purchasing power every decade for the last 100 years. A 100 kr note from 1975 buys roughly what 15 kr bought then.',
          da: 'Det meste af historien var penge støttet af guld eller sølv — noget reelt der holdt sin værdi. I dag er de støttet af tillid og offentlig politik. Konsekvensen: enhver vigtig valuta har mistet købekraft hvert årti de seneste 100 år. En 100 kr seddel fra 1975 køber omtrent hvad 15 kr gjorde dengang.',
        },
      },
      {
        icon: '📊',
        title: { en: 'The three jobs money has to do', da: 'De tre opgaver penge skal udføre' },
        body: {
          en: 'Money serves three functions: a medium of exchange (makes buying and selling easy), a unit of account (lets you compare prices), and a store of value (holds purchasing power over time). The Danish kroner performs well on the first two. The third is where inflation quietly erodes your position — unless you take action.',
          da: 'Penge tjener tre formål: byttemiddel (gør køb og salg nemt), regningsenhed (lader dig sammenligne priser) og værdiopbevaring (fastholder købekraft over tid). Den danske krone klarer sig godt på de to første. Den tredje er hvor inflation stille og roligt nedbryder din position — medmindre du handler.',
        },
      },
      {
        icon: '🔄',
        title: { en: 'Inflation is not random — it\'s structural', da: 'Inflation er ikke tilfældig — det er strukturelt' },
        body: {
          en: "The European Central Bank (ECB) explicitly targets 2% annual inflation. Denmark follows this target via the krone-euro peg. That means policymakers consider a 2% annual loss of your savings' purchasing power acceptable. Over a 40-year career, that target alone reduces purchasing power by nearly 55%.",
          da: 'Den Europæiske Centralbank (ECB) sigter eksplicit efter 2% årlig inflation. Danmark følger dette mål via krone-euro pegningen. Det betyder at beslutningstagere betragter et 2% årligt tab af din opsparing som acceptabelt. Over en 40-årig karriere reducerer det målet alene købekraften med næsten 55%.',
        },
      },
      {
        icon: '🛡️',
        title: { en: 'The response: own assets, not just money', da: 'Svaret: eje aktiver, ikke bare penge' },
        body: {
          en: "Cash erodes. Assets that produce real value — a share in a business, property, a pension — tend to rise in price alongside inflation because they represent real things, not just a number. The goal is not to \"get rich\" — it is to prevent silently getting poorer. Investing is a defence mechanism against the system you're already in.",
          da: 'Kontanter eroderer. Aktiver der producerer reel værdi — en andel i en virksomhed, ejendom, en pension — stiger typisk i pris i takt med inflation fordi de repræsenterer reelle ting, ikke bare et tal. Målet er ikke at "blive rig" — det er at forhindre stille og roligt at blive fattigere. Investering er en forsvarsmekanisme mod det system du allerede er i.',
        },
      },
    ],
    Calculator: InflationErosionCalculator,
    action: {
      icon: '📈',
      cta: { en: 'Start beating inflation — open an investment account', da: 'Begynd at slå inflationen — åbn en investeringskonto' },
      href: '/learning/practical/what-is-index-fund',
    },
    quiz: [
      {
        id: 'hmwq1',
        en: 'What does the ECB\'s 2% inflation target mean for your savings?',
        da: 'Hvad betyder ECB\'s inflationsmål på 2% for din opsparing?',
        options: [
          { en: 'Your savings grow by 2% per year automatically', da: 'Din opsparing vokser automatisk med 2% om året' },
          { en: 'Your savings lose roughly 2% of purchasing power per year', da: 'Din opsparing mister ca. 2% købekraft om året' },
          { en: 'The government tops up your savings to compensate', da: 'Staten supplerer din opsparing for at kompensere' },
          { en: 'It only affects businesses, not individuals', da: 'Det påvirker kun virksomheder, ikke enkeltpersoner' },
        ],
        correct: 1,
        explanationEn: 'A 2% inflation target means prices rise 2% per year on average. If your savings earn less than 2%, you lose purchasing power — even though the number in your account stays the same or rises slightly.',
        explanationDa: 'Et inflationsmål på 2% betyder at priserne stiger 2% om året i gennemsnit. Hvis din opsparing tjener under 2%, mister du købekraft — selvom tallet på din konto forbliver det samme eller stiger lidt.',
      },
      {
        id: 'hmwq2',
        en: 'Which of the three functions of money does inflation primarily undermine?',
        da: 'Hvilken af de tre pengefunktioner underminerer inflation primært?',
        options: [
          { en: 'Medium of exchange', da: 'Byttemiddel' },
          { en: 'Unit of account', da: 'Regningsenhed' },
          { en: 'Store of value', da: 'Værdiopbevaring' },
          { en: 'All three equally', da: 'Alle tre ens' },
        ],
        correct: 2,
        explanationEn: "Inflation directly erodes money's store of value function — money held over time buys progressively less. The exchange and accounting functions still work fine in the short term.",
        explanationDa: 'Inflation eroderer direkte penges værdiopbevaringsfunktion — penge opbevaret over tid køber progressivt mindre. Bytte- og regningsenhedsfunktionerne fungerer stadig fint på kort sigt.',
      },
      {
        id: 'hmwq3',
        en: 'Why do investments in equities or property help protect against inflation?',
        da: 'Hvorfor hjælper investeringer i aktier eller ejendom med at beskytte mod inflation?',
        options: [
          { en: 'They are guaranteed to rise faster than inflation', da: 'De er garanteret til at stige hurtigere end inflation' },
          { en: 'They represent ownership of real assets whose prices tend to rise with inflation', da: 'De repræsenterer ejerskab af reale aktiver hvis priser tenderer til at stige med inflation' },
          { en: 'The Danish government protects investors from inflation', da: 'Den danske stat beskytter investorer mod inflation' },
          { en: 'They generate cash that is exempt from inflation', da: 'De genererer kontanter der er fritaget fra inflation' },
        ],
        correct: 1,
        explanationEn: 'Real assets — businesses, property — tend to rise in price alongside inflation because they have underlying value independent of any currency. No guarantee, but historically the most reliable inflation protection.',
        explanationDa: 'Reale aktiver — virksomheder, ejendom — tenderer til at stige i pris i takt med inflation fordi de har underliggende værdi uafhængig af enhver valuta. Ingen garanti, men historisk set den mest pålidelige inflationsbeskyttelse.',
      },
    ],
  },

  'income-vs-expenses': {
    id: 'income-vs-expenses',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '💰',
    mins: '~6 min',
    question: {
      en: 'Are you earning more than you spend?',
      da: 'Tjener du mere, end du bruger?',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const gross = p?.gross_dkk ?? 45000
      const takeHome = Math.round(gross * 0.65)
      const surplus20 = Math.round(takeHome * 0.2)
      return {
        en: `Your take-home pay is roughly ${fmt(takeHome)}/month (gross × ~65%). If you save just 20%, that's ${fmt(surplus20)}/month — ${fmt(surplus20 * 12)}/year that can work for you instead of just passing through.`,
        da: `Din nettoløn er cirka ${fmt(takeHome)}/måned (brutto × ~65%). Hvis du bare sparer 20%, er det ${fmt(surplus20)}/måned — ${fmt(surplus20 * 12)}/år der kan arbejde for dig i stedet for bare at passere igennem.`,
      }
    },
    whyCards: [
      {
        icon: '🏆',
        title: { en: 'The only number that predicts financial outcomes', da: 'Det eneste tal der forudsiger finansielle resultater' },
        body: {
          en: "Income is what comes in. Expenses are what go out. The gap between them — your monthly surplus — is the single most important number in personal finance. A high earner who spends everything is less financially healthy than a moderate earner who consistently saves 20%. It's not what you earn — it's what you keep.",
          da: 'Indkomst er det der kommer ind. Udgifter er det der går ud. Forskellen — dit månedlige overskud — er det vigtigste enkelttal i privatøkonomi. En højtlønnet der bruger alt er finansielt ringere stillet end en moderat lønnet der konsekvent sparer 20%. Det er ikke hvad du tjener — det er hvad du beholder.',
        },
      },
      {
        icon: '🔒',
        title: { en: 'Fixed vs. variable — which to cut first', da: 'Fast vs. variabel — hvad skal du skære i først' },
        body: {
          en: "Fixed costs (rent, insurance, subscriptions) are the hardest to change but have the biggest impact. Variable costs (restaurants, shopping) are easy to reduce temporarily but hard to sustain long-term. The most effective strategy: reduce fixed costs once, permanently. This takes one decision that pays off every single month for years.",
          da: 'Faste udgifter (husleje, forsikring, abonnementer) er sværest at ændre men har størst effekt. Variable udgifter (restauranter, shopping) er nemme at reducere midlertidigt men svære at opretholde på lang sigt. Den mest effektive strategi: reducer faste udgifter én gang, permanent. Det kræver én beslutning der betaler sig hver eneste måned i årevis.',
        },
      },
      {
        icon: '👻',
        title: { en: 'The forgotten expenses that drain you silently', da: 'De glemte udgifter der tømmer dig stille og roligt' },
        body: {
          en: "The average Danish household pays ~2,400 kr/year on subscriptions they've forgotten about. Add annual insurance auto-renewals, bank fees, and unused gym memberships, and silent drain can reach 5,000–8,000 kr/year. A quarterly review — one hour, once every three months — finds and eliminates these without any sacrifice.",
          da: 'Den gennemsnitlige danske husstand betaler ~2.400 kr/år på abonnementer de har glemt. Læg automatisk fornyede forsikringer, bankgebyrer og ubrugte fitnessmedlemskaber til, og stille og roligt tab kan nå 5.000–8.000 kr/år. En kvartalsmæssig gennemgang — én time, én gang hvert kvartal — finder og eliminerer disse uden noget offer.',
        },
      },
      {
        icon: '⚡',
        title: { en: 'Pay yourself first — automate it', da: 'Betal dig selv først — automatiser det' },
        body: {
          en: "The most reliable savings strategy: treat savings as a fixed cost. On payday, a scheduled transfer moves your savings amount before you can spend it. What's left is what you live on. This removes decision fatigue and the temptation to 'save what's left' — which is usually nothing.",
          da: 'Den mest pålidelige opsparingsstrategi: behandl opsparing som en fast udgift. På lønningsdag overfører en planlagt overførsel dit opsparingsbeløb, inden du kan bruge det. Det der er tilbage er hvad du lever af. Det fjerner beslutningstræthed og fristelsen til at "spare hvad der er tilbage" — hvilket normalt er ingenting.',
        },
      },
    ],
    Calculator: CashFlowCalculator,
    action: {
      icon: '📊',
      cta: { en: 'See your spending in the finance overview', da: 'Se dit forbrug i finansoversigten' },
      href: '/finance',
    },
    quiz: [
      {
        id: 'iveq1',
        en: 'Why is a high earner who spends everything less financially healthy than a moderate earner who saves 20%?',
        da: 'Hvorfor er en højtlønnet der bruger alt finansielt ringere stillet end en moderat lønnet der sparer 20%?',
        options: [
          { en: 'They pay more in taxes', da: 'De betaler mere i skat' },
          { en: 'Wealth is built from the surplus, not the income level', da: 'Formue bygges fra overskuddet, ikke indkomstniveauet' },
          { en: 'High earners always have worse spending habits', da: 'Højtlønnede har altid dårligere forbrugsvaner' },
          { en: 'There is no difference — income determines financial health', da: 'Der er ingen forskel — indkomst bestemmer finansiel sundhed' },
        ],
        correct: 1,
        explanationEn: 'Wealth is built from surplus — what remains after expenses. Zero surplus means zero saved, regardless of income. Consistently saving even a small percentage creates compound wealth over decades.',
        explanationDa: 'Formue bygges fra overskud — hvad der er tilbage efter udgifter. Nul overskud betyder nul sparet, uanset indkomst. Konsekvent at spare selv en lille procentdel skaber akkumuleret formue over årtier.',
      },
      {
        id: 'iveq2',
        en: 'Which type of expense reduction has the largest long-term impact?',
        da: 'Hvilken type udgiftsreduktion har den største langsigtede effekt?',
        options: [
          { en: 'Cutting coffee and small daily purchases', da: 'Skære ned på kaffe og småindkøb' },
          { en: 'Reducing variable spending like restaurants once a month', da: 'Reducere variable udgifter som restauranter én gang om måneden' },
          { en: 'Reducing fixed costs permanently (rent, subscriptions, insurance)', da: 'Reducere faste udgifter permanent (husleje, abonnementer, forsikring)' },
          { en: 'All expense types have equal impact', da: 'Alle udgiftstyper har ens effekt' },
        ],
        correct: 2,
        explanationEn: "Reducing a fixed cost once pays off every month for years. Reducing a 300 kr/month subscription saves 3,600 kr/year, compounding into tens of thousands in opportunity cost over a decade.",
        explanationDa: 'At reducere en fast udgift én gang betaler sig hvert måned i årevis. At reducere et abonnement på 300 kr/måned sparer 3.600 kr/år, der akkumulerer til titusinder i mulighedsomkostninger over et årti.',
      },
      {
        id: 'iveq3',
        en: 'What does "paying yourself first" mean in practice?',
        da: 'Hvad betyder "betal dig selv først" i praksis?',
        options: [
          { en: 'Spending on yourself before paying bills', da: 'Bruge penge på dig selv inden du betaler regninger' },
          { en: 'Automatically transferring savings on payday before spending anything', da: 'Automatisk overføre opsparing på lønningsdag inden du bruger noget' },
          { en: 'Paying down debt before investing', da: 'Betale gæld ned inden du investerer' },
          { en: 'Keeping a large cash reserve in a current account', da: 'Holde en stor kontantreserve på en lønkonto' },
        ],
        correct: 1,
        explanationEn: "Automating savings on payday removes the decision entirely. You spend what's left — which is enough. Waiting to 'save what's left' almost never works.",
        explanationDa: 'Automatisering af opsparing på lønningsdag fjerner beslutningen fuldstændigt. Du bruger hvad der er tilbage — det er nok. At vente på at "spare hvad der er tilbage" virker næsten aldrig.',
      },
    ],
  },

  'net-worth-basics': {
    id: 'net-worth-basics',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '📋',
    mins: '~6 min',
    question: {
      en: 'What are you actually worth today?',
      da: 'Hvad er du egentlig værd i dag?',
    },
    tldrFn: (_p: PersonalProfile | null) => ({
      en: "Net worth = what you own minus what you owe. It's the single most useful financial health number — better than income, better than bank balance. Most people have never calculated it.",
      da: 'Nettoformue = hvad du ejer minus hvad du skylder. Det er det enkelt mest nyttige finansielle sundhedstal — bedre end indkomst, bedre end banksaldo. De fleste har aldrig beregnet det.',
    }),
    whyCards: [
      {
        icon: '🗺️',
        title: { en: "Why net worth beats 'how much do you earn'", da: "Hvorfor nettoformue slår 'hvad tjener du'" },
        body: {
          en: "Income shows how fast money flows in. Net worth shows how much has stayed. A 60,000 kr/month earner with 500,000 kr in consumer debt and no savings has a lower net worth than a 30,000 kr/month earner who has consistently saved for 5 years. Net worth is the scoreboard — income is just one of the inputs.",
          da: 'Indkomst viser hvor hurtigt penge strømmer ind. Nettoformue viser hvor meget er blevet. En der tjener 60.000 kr/måned med 500.000 kr i forbrugsgæld og ingen opsparing har lavere nettoformue end en der tjener 30.000 kr/måned og konsekvent har sparet i 5 år. Nettoformue er resultattavlen — indkomst er blot et af inputtene.',
        },
      },
      {
        icon: '📂',
        title: { en: 'What counts as an asset', da: 'Hvad tæller som et aktiv' },
        body: {
          en: "Assets: cash and savings, investment accounts, pension (current value, not projected), property (current market value, not what you paid), any business ownership. What does NOT count: your car (it depreciates), your phone, furniture, or other consumer goods. These have value but not in a financial planning sense.",
          da: 'Aktiver: kontanter og opsparing, investeringskonti, pension (nuværende værdi, ikke projiceret), ejendom (nuværende markedsværdi, ikke hvad du betalte), evt. virksomhedsejerskab. Hvad tæller IKKE: din bil (den afskrives), din telefon, møbler eller andre forbrugsgoder. Disse har værdi men ikke i finansiel planlægningsmæssig forstand.',
        },
      },
      {
        icon: '📉',
        title: { en: 'Good debt vs bad debt in your balance sheet', da: 'God gæld vs dårlig gæld i dit regnskab' },
        body: {
          en: "Not all debt is equal. A mortgage finances an asset that tends to appreciate — the net effect on your balance sheet is often positive. Consumer loans finance things that immediately lose value. Student loans (SU-lån) are low-interest and finance income-generating capacity. Classify each liability: is the asset it bought appreciating or depreciating?",
          da: 'Al gæld er ikke ens. Et boliglån finansierer et aktiv der tenderer til at stige i værdi — nettoeffekten på din balance er ofte positiv. Forbrugslån finansierer ting der straks mister værdi. Studielån (SU-lån) er billige og finansierer indkomstgenererende kapacitet. Klassificer hver gældspost: stiger eller falder aktivet det finansierede i værdi?',
        },
      },
      {
        icon: '📅',
        title: { en: 'Track it quarterly — that\'s all it takes', da: 'Spor det kvartalsvist — det er alt der skal til' },
        body: {
          en: "You don't need a financial advisor to track net worth. One spreadsheet, updated quarterly, shows whether you're moving in the right direction. The trend matters more than the absolute number — consistent growth, even slowly, confirms the system is working. A negative net worth is not a crisis: it's a starting point with a clear direction.",
          da: 'Du behøver ikke en finansiel rådgiver for at spore nettoformue. Et regneark opdateret kvartalsvist viser om du bevæger dig i den rigtige retning. Tendensen er vigtigere end det absolutte tal — konsekvent vækst, selv langsomt, bekræfter at systemet virker. En negativ nettoformue er ikke en krise: det er et startpunkt med en tydelig retning.',
        },
      },
    ],
    Calculator: NetWorthCalculator,
    action: {
      icon: '📊',
      cta: { en: 'Check your finance overview', da: 'Tjek din finansoversigt' },
      href: '/finance',
    },
    quiz: [
      {
        id: 'nwbq1',
        en: 'How is net worth calculated?',
        da: 'Hvordan beregnes nettoformue?',
        options: [
          { en: 'Monthly salary × 12', da: 'Månedlig løn × 12' },
          { en: 'Total savings + pension', da: 'Samlet opsparing + pension' },
          { en: 'Total assets minus total liabilities', da: 'Samlede aktiver minus samlet gæld' },
          { en: 'Annual income minus annual expenses', da: 'Årsindkomst minus årsudgifter' },
        ],
        correct: 2,
        explanationEn: "Net worth = everything you own (assets) minus everything you owe (liabilities). Income and expenses affect it over time, but the snapshot at any moment is assets minus liabilities.",
        explanationDa: 'Nettoformue = alt du ejer (aktiver) minus alt du skylder (gæld). Indkomst og udgifter påvirker det over tid, men øjebliksbilledet på ethvert tidspunkt er aktiver minus gæld.',
      },
      {
        id: 'nwbq2',
        en: "Should you include your car's value as an asset when calculating net worth?",
        da: 'Bør du inkludere din bils værdi som et aktiv ved beregning af nettoformue?',
        options: [
          { en: 'Yes, always at the purchase price', da: 'Ja, altid til købsprisen' },
          { en: 'Yes, at the current market value, but note it depreciates rapidly', da: 'Ja, til aktuel markedsværdi, men bemærk at den afskrives hurtigt' },
          { en: "No — consumer goods don't count as financial assets", da: 'Nej — forbrugsgoder tæller ikke som finansielle aktiver' },
          { en: 'Only if it is worth over 100,000 kr', da: 'Kun hvis den er mere end 100.000 kr værd' },
        ],
        correct: 1,
        explanationEn: "Cars technically have resale value, but they depreciate quickly. Including them at current market value is technically correct, though many practitioners exclude depreciating consumer goods to keep the picture focused on wealth-building assets.",
        explanationDa: 'Biler har teknisk set salgsværdi, men de afskrives hurtigt. At inkludere dem til aktuel markedsværdi er teknisk korrekt, selvom mange praktikere udelukker afskrivende forbrugsgoder for at holde billedet fokuseret på formuesopbygningsaktiver.',
      },
      {
        id: 'nwbq3',
        en: 'You have a 3M kr home, a 2.4M kr mortgage, 200k kr in pension, and 50k kr in savings. What is your net worth?',
        da: 'Du har en bolig til 3 mio. kr., et boliglån på 2,4 mio. kr., 200k kr i pension og 50k kr i opsparing. Hvad er din nettoformue?',
        options: [
          { en: '850,000 kr', da: '850.000 kr' },
          { en: '3,250,000 kr', da: '3.250.000 kr' },
          { en: '650,000 kr', da: '650.000 kr' },
          { en: '−2,150,000 kr', da: '−2.150.000 kr' },
        ],
        correct: 0,
        explanationEn: 'Assets: 3,000,000 + 200,000 + 50,000 = 3,250,000. Liabilities: 2,400,000. Net worth = 3,250,000 − 2,400,000 = 850,000 kr.',
        explanationDa: 'Aktiver: 3.000.000 + 200.000 + 50.000 = 3.250.000. Gæld: 2.400.000. Nettoformue = 3.250.000 − 2.400.000 = 850.000 kr.',
      },
    ],
  },

  'budgeting-methods': {
    id: 'budgeting-methods',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '📊',
    mins: '~5 min',
    question: {
      en: 'Which budgeting method fits your life?',
      da: 'Hvilken budgetmetode passer til dit liv?',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const takeHome = p?.gross_dkk ? Math.round(p.gross_dkk * 0.65) : 28000
      const savings20 = Math.round(takeHome * 0.2)
      return {
        en: `There is no single right method — but you need a plan. The 50/30/20 rule assigns ${fmt(savings20)}/month (20%) as savings for you. The key insight: automate that slice so it never reaches your spending account.`,
        da: `Der er ikke én rigtig metode — men du har brug for en plan. 50/30/20-reglen tildeler ${fmt(savings20)}/måned (20%) som opsparing for dig. Den vigtige indsigt: automatiser den del så den aldrig når din forbrugskonto.`,
      }
    },
    whyCards: [
      {
        icon: '✉️',
        title: { en: 'The envelope method — for spenders', da: 'Kuvertmetoden — for dem der bruger for meget' },
        body: {
          en: "Physically divide take-home pay into labelled envelopes: rent, food, transport, entertainment. When an envelope is empty, spending in that category stops. Sounds old-fashioned — it works because cash is viscerally painful to hand over, unlike tapping a card. Best for people who consistently overspend and need a hard stop.",
          da: 'Del fysisk nettoløn op i mærkede kuverter: husleje, mad, transport, underholdning. Når en kuvert er tom, stopper udgifterne i den kategori. Lyder gammeldags — det virker fordi kontanter er smerteligt at give fra sig, i modsætning til at tappe et kort. Bedst til folk der konsekvent overbruger og har brug for en hård grænse.',
        },
      },
      {
        icon: '0️⃣',
        title: { en: 'Zero-based budgeting — for analysts', da: 'Nulbaseret budget — for analytikerne' },
        body: {
          en: "Every kroner of income is assigned a purpose. Income minus all allocations equals zero. No unaccounted money. Requires an hour each month to plan and track. The reward: complete visibility and control. Best for people who enjoy tracking data and want to optimise precisely.",
          da: 'Hver krone af indkomst tildeles et formål. Indkomst minus alle tildelinger er lig nul. Ingen ufordelte penge. Kræver en time om måneden til planlægning og sporing. Belønningen: fuld synlighed og kontrol. Bedst til folk der nyder at spore data og vil optimere præcist.',
        },
      },
      {
        icon: '🤖',
        title: { en: 'Pay yourself first — for minimalists', da: 'Betal dig selv først — for minimalisterne' },
        body: {
          en: "On payday, automate transfers: one to savings, one to pension top-up. Live on whatever remains. No tracking required. The trade-off: you may not optimise every kroner, but you will consistently save. Ideal for people who don't want to budget actively but can control their spending on the remaining amount.",
          da: 'På lønningsdag automatiser overførsler: én til opsparing, én til pensionspåfyldning. Lev af hvad der er tilbage. Ingen sporning nødvendig. Kompromisset: du optimerer måske ikke hver krone, men du vil konsekvent spare. Ideel til folk der ikke vil budgettere aktivt men kan kontrollere deres forbrug på det resterende beløb.',
        },
      },
      {
        icon: '💡',
        title: { en: 'The 50/30/20 rule — for beginners', da: '50/30/20-reglen — for begyndere' },
        body: {
          en: "Needs (rent, food, transport, insurance): 50%. Wants (dining out, hobbies, streaming): 30%. Savings and debt repayment: 20%. No tracking required beyond knowing your three totals. It's a framework — not a rule. In Copenhagen, 50% on needs may be impossible if rent alone is 10,000 kr/month on a 25,000 kr take-home. Adjust ratios, keep the structure.",
          da: 'Behov (husleje, mad, transport, forsikring): 50%. Ønsker (restauranter, hobbyer, streaming): 30%. Opsparing og gældsafdrag: 20%. Ingen sporning nødvendig udover at kende dine tre totaler. Det er en ramme — ikke en regel. I København kan 50% på behov være umuligt hvis huslejen alene er 10.000 kr/måned på 25.000 kr netto. Juster forholdet, behold strukturen.',
        },
      },
    ],
    Calculator: BudgetMethodCalculator,
    action: {
      icon: '📋',
      cta: { en: 'Build your budget in the finance planner', da: 'Byg dit budget i finansplanleggeren' },
      href: '/finance',
    },
    quiz: [
      {
        id: 'bmq1',
        en: 'In the 50/30/20 rule, what does the 20% represent?',
        da: 'Hvad repræsenterer de 20% i 50/30/20-reglen?',
        options: [
          { en: 'Tax payments', da: 'Skattebetalinger' },
          { en: 'Spending on wants (restaurants, entertainment)', da: 'Forbrug på ønsker (restauranter, underholdning)' },
          { en: 'Savings and debt repayment', da: 'Opsparing og gældsafdrag' },
          { en: 'Investment in property only', da: 'Investering i ejendom alene' },
        ],
        correct: 2,
        explanationEn: "The 20% in 50/30/20 is for savings and debt repayment — money that builds your net worth or reduces liabilities. Applied to take-home pay, not gross salary.",
        explanationDa: 'De 20% i 50/30/20 er til opsparing og gældsafdrag — penge der opbygger din nettoformue eller reducerer gæld. Anvendt på nettoløn, ikke bruttoløn.',
      },
      {
        id: 'bmq2',
        en: "Which budgeting method is best for someone who doesn't want to track every kroner but will follow a plan?",
        da: 'Hvilken budgetmetode er bedst for nogen der ikke vil spore hver krone men vil følge en plan?',
        options: [
          { en: 'Zero-based budgeting', da: 'Nulbaseret budget' },
          { en: 'The envelope method', da: 'Kuvertmetoden' },
          { en: 'Pay yourself first', da: 'Betal dig selv først' },
          { en: '50/30/20 tracking', da: '50/30/20 sporing' },
        ],
        correct: 2,
        explanationEn: "'Pay yourself first' automates savings on payday so you never need to decide. You spend what's left without detailed tracking. Works for people who overspend when tracking becomes tedious.",
        explanationDa: '"Betal dig selv først" automatiserer opsparing på lønningsdag så du aldrig behøver at beslutte. Du bruger hvad der er tilbage uden detaljeret sporing. Virker til folk der overbruger når sporing bliver kedeligt.',
      },
      {
        id: 'bmq3',
        en: 'What is the most important single action regardless of which budgeting method you choose?',
        da: 'Hvad er den vigtigste enkelthandling uanset hvilken budgetmetode du vælger?',
        options: [
          { en: 'Track every transaction manually', da: 'Spore hver transaktion manuelt' },
          { en: 'Automate the savings portion so it moves on payday', da: 'Automatisere opsparingsdelen så den flyttes på lønningsdag' },
          { en: 'Use a premium budgeting app', da: 'Bruge en premium budget-app' },
          { en: 'Review your budget every day', da: 'Gennemgå dit budget hver dag' },
        ],
        correct: 1,
        explanationEn: "Automating savings removes the daily decision. The biggest reason savings plans fail is that discretionary savings are always the last priority after spending — automation makes them the first.",
        explanationDa: 'Automatisering af opsparing fjerner den daglige beslutning. Den største årsag til at opsparingsplaner fejler er at diskretionær opsparing altid er den sidste prioritet efter forbrug — automatisering gør dem til den første.',
      },
    ],
  },

  'good-vs-bad-debt': {
    id: 'good-vs-bad-debt',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '⚖️',
    mins: '~7 min',
    question: {
      en: 'When is borrowing smart — and when is it dangerous?',
      da: 'Hvornår er det smart at låne — og hvornår er det farligt?',
    },
    tldrFn: (_p: PersonalProfile | null) => ({
      en: "Debt is a tool. A mortgage at 4% on an appreciating asset can build wealth. A consumer loan at 18% for a holiday destroys it. The rule: borrow only when the return on the thing you're buying exceeds the cost of the loan.",
      da: 'Gæld er et redskab. Et boliglån på 4% på et stigende aktiv kan opbygge formue. Et forbrugslån på 18% til en ferie ødelægger det. Reglen: lån kun når afkastet på det du køber overstiger lånets omkostning.',
    }),
    whyCards: [
      {
        icon: '🏠',
        title: { en: 'When borrowing makes you wealthier', da: 'Når låntagning gør dig rigere' },
        body: {
          en: "Good debt finances assets that produce returns: a mortgage on a property that appreciates, a student loan that dramatically increases your earning capacity, a business loan generating more than it costs. The test: does the expected return on the purchased asset exceed the ÅOP? If yes, the debt is potentially wealth-creating.",
          da: 'God gæld finansierer aktiver der giver afkast: et boliglån på en ejendom der stiger i værdi, et studielån der dramatisk øger din indkomstkapacitet, et erhvervslån der genererer mere end det koster. Testen: overstiger det forventede afkast på det erhvervede aktiv ÅOP\'en? Hvis ja, er gælden potentielt formuesopbyggende.',
        },
      },
      {
        icon: '🚗',
        title: { en: 'When borrowing makes you poorer', da: 'Når låntagning gør dig fattigere' },
        body: {
          en: "Bad debt finances consumption or depreciating assets: consumer loans for holidays, car loans (the car loses 15–25% of its value the moment you drive it off the lot), credit card balances rolled month to month. The item you bought loses value while the debt accumulates interest. Both forces work against you simultaneously.",
          da: 'Dårlig gæld finansierer forbrug eller afskrivende aktiver: forbrugslån til ferier, billån (bilen mister 15–25% af sin værdi i det øjeblik du kører den ud af forhandleren), kreditkortsaldi der rulles måned for måned. Den vare du køber mister værdi mens gælden akkumulerer rente. Begge kræfter virker imod dig på samme tid.',
        },
      },
      {
        icon: '🧮',
        title: { en: "The real cost you won't see in the contract", da: 'Den reelle omkostning du ikke ser i kontrakten' },
        body: {
          en: "A 50,000 kr consumer loan at 15% ÅOP over 5 years costs ~18,000 kr in interest — paid for nothing. But there's a second cost: the monthly payments you make on that loan could have been invested. At 7% return, the same monthly payment invested over 5 years would grow to more than the loan itself. The true total cost is interest paid plus investment return foregone.",
          da: 'Et forbrugslån på 50.000 kr til 15% ÅOP over 5 år koster ~18.000 kr i renter — betalt for ingenting. Men der er en anden omkostning: de månedlige afdrag du betaler på det lån kunne have været investeret. Ved 7% afkast ville den samme månedlige betaling investeret over 5 år vokse til mere end selve lånet. Den sande samlede omkostning er betalte renter plus tabt investeringsafkast.',
        },
      },
      {
        icon: '🇩🇰',
        title: { en: "Denmark's unique mortgage advantage", da: 'Danmarks unikke realkreditfordel' },
        body: {
          en: "The Danish realkreditlån system offers some of Europe's most competitive mortgage rates because mortgages are funded through bonds traded on the capital market — not just bank deposits. Interest on a Danish mortgage is also tax-deductible (rentefradrag). This makes Danish mortgage debt among the cheapest available, reducing the argument against carrying a mortgage.",
          da: 'Det danske realkreditsystem tilbyder nogle af Europas mest konkurrencedygtige realkreditrenter fordi lån finansieres via obligationer handlet på kapitalmarkedet — ikke bare bankindskud. Renter på et dansk boliglån er også fradragsberettiget (rentefradrag). Dette gør dansk realkreditgæld blandt de billigste tilgængelige, og reducerer argumentet imod at have et boliglån.',
        },
      },
    ],
    Calculator: DebtCostCalculator,
    action: {
      icon: '📉',
      cta: { en: 'Review your current debts', da: 'Gennemgå din nuværende gæld' },
      href: '/finance',
    },
    quiz: [
      {
        id: 'gbdq1',
        en: 'What is the key test for whether debt is "good" or "bad"?',
        da: 'Hvad er den vigtigste test for om gæld er "god" eller "dårlig"?',
        options: [
          { en: 'Whether the loan is from a bank or an online lender', da: 'Om lånet er fra en bank eller en onlinelåneudbyder' },
          { en: 'The loan amount — smaller is always better', da: 'Lånebeløbet — mindre er altid bedre' },
          { en: "Whether the asset purchased returns more than the loan's ÅOP", da: 'Om det erhvervede aktiv giver mere end lånets ÅOP' },
          { en: 'Whether you feel comfortable with the monthly payment', da: 'Om du er komfortabel med den månedlige ydelse' },
        ],
        correct: 2,
        explanationEn: "Good debt finances assets that return more than they cost. A mortgage at 4% on a property appreciating 5% creates net wealth. A consumer loan at 18% for a holiday creates net loss.",
        explanationDa: 'God gæld finansierer aktiver der giver mere end de koster. Et boliglån på 4% på en ejendom der stiger 5% skaber nettoformue. Et forbrugslån på 18% til en ferie skaber nettotab.',
      },
      {
        id: 'gbdq2',
        en: 'Beyond interest paid, what is the "hidden" second cost of consumer debt?',
        da: 'Udover betalte renter, hvad er den "skjulte" anden omkostning ved forbrugsgæld?',
        options: [
          { en: 'Impact on your credit score (RKI)', da: 'Påvirkning af din kreditvurdering (RKI)' },
          { en: 'The investment return you could have earned on the same monthly payments', da: 'Det investeringsafkast du kunne have tjent på de samme månedlige afdrag' },
          { en: 'The administrative fees from the bank', da: 'De administrative gebyrer fra banken' },
          { en: 'There is no hidden cost', da: 'Der er ingen skjult omkostning' },
        ],
        correct: 1,
        explanationEn: "Every kroner paid in loan repayments is a kroner not invested. At 7% historical returns, the opportunity cost over years can exceed the interest itself — making debt far more expensive than the ÅOP alone suggests.",
        explanationDa: 'Hver krone betalt i låneafdrag er en krone ikke investeret. Ved 7% historiske afkast kan mulighedsomkostningen over år overstige renterne selv — hvilket gør gæld langt dyrere end ÅOP alene antyder.',
      },
      {
        id: 'gbdq3',
        en: 'Why is mortgage debt in Denmark often considered one of the more acceptable forms of debt?',
        da: 'Hvorfor betragtes realkreditgæld i Danmark ofte som en af de mere acceptable former for gæld?',
        options: [
          { en: 'Because Danish banks never charge interest', da: 'Fordi danske banker aldrig opkræver renter' },
          { en: 'Because it is tax-deductible and among Europe\'s lowest rates, financing an appreciating asset', da: 'Fordi det er fradragsberettiget og blandt Europas laveste renter, finansierer et stigende aktiv' },
          { en: 'Because the government repays it if you lose your job', da: 'Fordi staten tilbagebetaler det hvis du mister dit job' },
          { en: 'Because mortgage debt has no effect on net worth', da: 'Fordi realkreditgæld ikke påvirker nettoformue' },
        ],
        correct: 1,
        explanationEn: "Danish mortgage rates are among Europe's lowest, interest is tax-deductible, and the underlying asset (property) has historically appreciated. All three factors reduce the net cost of carrying mortgage debt.",
        explanationDa: 'Danske realkreditrenter er blandt Europas laveste, renter er fradragsberettiget, og det underliggende aktiv (ejendom) er historisk steget i værdi. Alle tre faktorer reducerer nettoomkostningen ved at have realkreditgæld.',
      },
    ],
  },

  'power-of-compounding': {
    id: 'power-of-compounding',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '🚀',
    mins: '~6 min',
    question: {
      en: 'Why starting to save 10 years earlier makes a massive difference',
      da: 'Hvorfor det gør en kæmpe forskel at starte med at spare 10 år tidligere',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const age = p?.age ?? 30
      const years = Math.max(0, 67 - age)
      const monthly = 2000
      const r = 0.07 / 12
      const n = years * 12
      const fvNow = n > 0 ? Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r)) : 0
      const nLater = Math.max(0, (years - 10) * 12)
      const fvLater = nLater > 0 ? Math.round(monthly * ((Math.pow(1 + r, nLater) - 1) / r)) : 0
      const cost = Math.max(0, fvNow - fvLater)
      return {
        en: `Starting at age ${age} with 2.000 kr/month, you'd reach ~${fmt(fvNow)} at 67. Starting at ${age + 10}, you'd reach ~${fmt(fvLater)}. The 10-year delay costs you ~${fmt(cost)} — even though you'd contribute the same amount monthly.`,
        da: `Hvis du starter som ${age}-årig med 2.000 kr/måned, vil du nå ~${fmt(fvNow)} ved 67. Starter du som ${age + 10}-årig, når du ~${fmt(fvLater)}. De 10 års forsinkelse koster dig ~${fmt(cost)} — selvom du bidrager det samme månedligt.`,
      }
    },
    whyCards: [
      {
        icon: '⏱️',
        title: { en: "Time is the ingredient you can't buy back", da: "Tid er den ingrediens du ikke kan købe tilbage" },
        body: {
          en: "At 7% annual return, money doubles roughly every 10 years. 10,000 kr invested at age 25 becomes ~80,000 kr by 67. The same 10,000 kr invested at 35 becomes ~40,000 kr. You didn't contribute more — the 25-year-old's money simply spent more time compounding. Every year you wait cuts the final result by more than you'd expect.",
          da: 'Ved 7% årligt afkast fordobles penge cirka hvert 10. år. 10.000 kr investeret som 25-årig bliver ~80.000 kr ved 67. De samme 10.000 kr investeret som 35-årig bliver ~40.000 kr. Du bidrog ikke mere — den 25-åriges penge brugte simpelthen mere tid på at akkumulere. Hvert år du venter reducerer slutresultatet mere end du ville forvente.',
        },
      },
      {
        icon: '🧮',
        title: { en: 'Why contributing less earlier beats contributing more later', da: 'Hvorfor det at bidrage mindre tidligt slår at bidrage mere sent' },
        body: {
          en: "Consider two people: Sara contributes 1,000 kr/month from age 25 to 35, then stops. Lars contributes 1,000 kr/month from 35 to 67. Lars contributes for 32 years; Sara for only 10. At retirement, Sara still wins — because her contributions had 32 more years to grow. The first contributions are the most valuable.",
          da: 'Overvej to mennesker: Sara bidrager 1.000 kr/måned fra 25 til 35, derefter stopper hun. Lars bidrager 1.000 kr/måned fra 35 til 67. Lars bidrager i 32 år; Sara i kun 10. Ved pensionering vinder Sara stadig — fordi hendes bidrag havde 32 mere år til at vokse. De første bidrag er de mest værdifulde.',
        },
      },
      {
        icon: '💸',
        title: { en: 'The two enemies: fees and taxes', da: 'De to fjender: gebyrer og skat' },
        body: {
          en: "Compound growth can work for you — or against you. A 1% annual fee sounds trivial. Over 40 years at 7% returns, it destroys roughly 24% of your terminal wealth. That's hundreds of thousands of kroner on a typical Danish pension. Choose low-cost index funds. Check the ÅOP on every savings product. The number that matters is net return, not gross.",
          da: 'Renters rente kan arbejde for dig — eller imod dig. Et 1% årligt gebyr lyder trivielt. Over 40 år ved 7% afkast ødelægger det ca. 24% af din slutformue. Det er hundredtusinder af kroner på en typisk dansk pension. Vælg billige indeksfonde. Tjek ÅOP på hvert opsparingsprodukt. Det tal der betyder noget er nettoafkast, ikke bruttoafkast.',
        },
      },
      {
        icon: '🇩🇰',
        title: { en: 'The Danish pension advantage you may be wasting', da: 'Den danske pensionsfordel du måske spilder' },
        body: {
          en: "Most Danish employees get employer pension contributions — typically 10–12% of gross salary. Combined with their own contribution (typically 5%), that's 15–17% of gross going into a compound-growth account. If you're in topskat (marginal rate ~52%), each kr you contribute to pension saves ~52% in tax immediately and is taxed at a lower rate when drawn down. The tax advantage amplifies compounding significantly.",
          da: 'De fleste danske ansatte får arbejdsgiverbidrag til pension — typisk 10–12% af bruttoløn. Kombineret med eget bidrag (typisk 5%) er det 15–17% af brutto der går ind på en akkumulationskonto. Hvis du betaler topskat (marginalskattesats ~52%), sparer hver krone du bidrager til pension ~52% i skat straks og beskattes til en lavere sats ved udbetaling. Skattefordelen forstærker akkumuleringen betydeligt.',
        },
      },
    ],
    Calculator: CompoundGrowthCalculator,
    action: {
      icon: '🎯',
      cta: { en: 'Check your pension at PensionsInfo', da: 'Tjek din pension på PensionsInfo' },
      href: 'https://www.pensionsinfo.dk',
      external: true,
    },
    quiz: [
      {
        id: 'pocq1',
        en: 'At 7% annual return, roughly how long does it take for money to double?',
        da: 'Hvad er den omtrentlige tid det tager for penge at fordobles ved 7% årligt afkast?',
        options: [
          { en: '5 years', da: '5 år' },
          { en: '10 years', da: '10 år' },
          { en: '20 years', da: '20 år' },
          { en: '35 years', da: '35 år' },
        ],
        correct: 1,
        explanationEn: "The Rule of 72: divide 72 by the annual return to get doubling time. 72 ÷ 7 ≈ 10 years. This is why the difference between starting at 25 vs. 35 is so dramatic — the early contributions get an extra doubling.",
        explanationDa: '72-reglen: divider 72 med det årlige afkast for at få fordobelingstiden. 72 ÷ 7 ≈ 10 år. Det er derfor forskellen mellem at starte som 25-årig vs. 35-årig er så dramatisk — de tidlige bidrag får en ekstra fordobling.',
      },
      {
        id: 'pocq2',
        en: 'How does a 1% annual fund fee affect a 40-year investment at 7% gross returns?',
        da: 'Hvordan påvirker et 1% årligt fondsgebyr en 40-årig investering ved 7% bruttoafkast?',
        options: [
          { en: "It reduces returns by 1% — almost nothing over time", da: 'Det reducerer afkastet med 1% — næsten ingenting over tid' },
          { en: 'It reduces your final balance by roughly 24%', da: 'Det reducerer din slutsaldo med ca. 24%' },
          { en: 'It only matters on large portfolios', da: 'Det betyder kun noget på store porteføljer' },
          { en: 'Higher fees guarantee better management', da: 'Højere gebyrer garanterer bedre forvaltning' },
        ],
        correct: 1,
        explanationEn: 'Fees compound just like returns do. 1% per year over 40 years reduces terminal wealth by ~24%. On a 1M kr portfolio that is 240,000 kr — paid to a fund manager who statistically underperforms the index.',
        explanationDa: 'Gebyrer akkumulerer ligesom afkast gør det. 1% om året over 40 år reducerer slutformuen med ~24%. På en portefølje på 1 mio. kr. er det 240.000 kr — betalt til en fondsforvalter der statistisk underpræsterer indekset.',
      },
      {
        id: 'pocq3',
        en: 'Sara saves 1,000 kr/month from age 25 to 35 (10 years) then stops. Lars saves 1,000 kr/month from age 35 to 67 (32 years). Both earn 7%. Who has more at 67?',
        da: 'Sara sparer 1.000 kr/måned fra 25 til 35 år (10 år) og stopper. Lars sparer 1.000 kr/måned fra 35 til 67 (32 år). Begge tjener 7%. Hvem har mest ved 67?',
        options: [
          { en: 'Lars — he contributed for much longer', da: 'Lars — han bidrog meget længere' },
          { en: 'They end up with the same amount', da: 'De ender med det samme beløb' },
          { en: 'Sara — her early contributions compounded for longer', da: 'Sara — hendes tidlige bidrag akkumulerede i længere tid' },
          { en: "It depends on market conditions", da: 'Det afhænger af markedsforholdene' },
        ],
        correct: 2,
        explanationEn: "Sara's contributions from age 25–35 compound for 32–42 years before retirement. Even though Lars contributed 3.2× more money, Sara's head start creates a larger final balance — demonstrating that time in the market outweighs amount contributed.",
        explanationDa: 'Saras bidrag fra 25–35 akkumulerer i 32–42 år inden pension. Selvom Lars bidrog 3,2 gange mere penge, skaber Saras forspring en større slutsaldo — hvilket demonstrerer at tid i markedet overstiger bidragets størrelse.',
      },
    ],
  },

  'emergency-fund': {
    id: 'emergency-fund',
    category: 'financial-foundations',
    level: 'beginner',
    icon: '🛡️',
    mins: '~6 min',
    question: {
      en: 'How much should you keep for emergencies — and where?',
      da: 'Hvor meget skal du have til nødsituationer — og hvor?',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const expenses = p?.gross_dkk ? Math.round(p.gross_dkk * 0.65) : 28000
      const lo = fmt(expenses * 3)
      const hi = fmt(expenses * 6)
      return {
        en: `Aim for 3–6 months of expenses (${lo}–${hi} for you) in a separate high-yield savings account — not your day-to-day account.`,
        da: `Sigt efter 3–6 måneders udgifter (${lo}–${hi} for dig) på en separat opsparingskonto med høj rente — ikke din daglige konto.`,
      }
    },
    whyCards: [
      {
        icon: '📉',
        title: { en: 'Why 3 months?', da: 'Hvorfor 3 måneder?' },
        body: {
          en: "Three months covers the most common emergencies: losing your job, unexpected medical costs, or major repairs. Without it, you'd have to borrow — often at 10–20% interest — to solve a problem that was already bad.",
          da: 'Tre måneder dækker de mest almindelige nødsituationer: jobmistelse, uventede helbredsudgifter eller større reparationer. Uden den ville du skulle låne — ofte til 10–20% rente — for at løse et problem, der allerede var slemt.',
        },
      },
      {
        icon: '🏦',
        title: { en: 'Keep it separate', da: 'Hold den adskilt' },
        body: {
          en: "The biggest reason emergency funds fail is they're in the same account as everyday spending. A separate account creates psychological friction that prevents accidental draining. Name it 'Emergency Fund' and forget it exists — until you need it.",
          da: 'Den største årsag til, at nødopsparinger fejler, er at de er på samme konto som dagligdagsudgifter. En separat konto skaber psykologisk modstand, der forhindrer utilsigtet tæring. Navngiv den "Nødopsparing" og lad som om den ikke eksisterer — indtil du har brug for den.',
        },
      },
      {
        icon: '📈',
        title: { en: 'Earn something while it sits', da: 'Tjen noget mens den venter' },
        body: {
          en: 'A high-yield savings account in Denmark currently pays 1.5–3.5%. That matters when your fund holds 3+ months of expenses. Look for accounts where money is accessible within 1–2 business days. Pension or investment accounts are not suitable — they can drop in value or lock funds.',
          da: 'En opsparingskonto med høj rente i Danmark giver i øjeblikket 1,5–3,5%. Det betyder noget, når din fond har 3+ måneders udgifter. Kig efter konti, hvor penge kan tilgås inden for 1–2 bankdage. Pensions- eller investeringskonti er ikke egnede — de kan falde i værdi eller låse midler.',
        },
      },
      {
        icon: '🔄',
        title: { en: 'Rebuild immediately after use', da: 'Genopbyg straks efter brug' },
        body: {
          en: "If you spend it — it worked. That's what it's for. But the moment you use it, treat refilling it as your top financial priority. Even small, automatic monthly transfers will rebuild it faster than you think.",
          da: 'Hvis du bruger den — virkede den. Det er det, den er til. Men i det øjeblik du bruger den, skal du behandle genopfyldning som din vigtigste finansielle prioritet. Selv små, automatiske månedlige overførsler genopbygger den hurtigere, end du tror.',
        },
      },
    ],
    Calculator: EmergencyFundCalculator,
    action: {
      icon: '🎯',
      cta: {
        en: 'Set an emergency fund goal',
        da: 'Sæt et mål for din nødopsparing',
      },
      href: '/goals',
    },
    quiz: [
      {
        id: 'efq1',
        en: 'What is the recommended size of an emergency fund?',
        da: 'Hvad er den anbefalede størrelse af en nødopsparing?',
        options: [
          { en: '1 month of expenses', da: '1 måneds udgifter' },
          { en: '3–6 months of expenses', da: '3–6 måneders udgifter' },
          { en: '12 months of expenses', da: '12 måneders udgifter' },
          { en: '1 month of gross salary', da: '1 måneds bruttoløn' },
        ],
        correct: 1,
        explanationEn: '3–6 months of expenses covers the most common emergencies — job loss, illness, or unexpected bills — without forcing you into high-interest debt.',
        explanationDa: '3–6 måneders udgifter dækker de mest almindelige nødsituationer — jobmistelse, sygdom eller uventede regninger — uden at tvinge dig til at tage dyre lån.',
      },
      {
        id: 'efq2',
        en: 'Where is the best place to keep your emergency fund?',
        da: 'Hvor er det bedste sted at opbevare din nødopsparing?',
        options: [
          { en: 'In a stock index fund', da: 'I en aktieindeksfond' },
          { en: 'In your everyday checking account', da: 'På din daglige lønkonto' },
          { en: 'In a separate, instant-access savings account', da: 'På en separat opsparingskonto med hurtig adgang' },
          { en: 'In a locked pension account', da: 'På en låst pensionskonto' },
        ],
        correct: 2,
        explanationEn: 'A separate savings account keeps it accessible in 1–2 days, earns some interest, and prevents accidental spending. Stocks can drop 30% right when you need the money most.',
        explanationDa: 'En separat opsparingskonto holder den tilgængelig inden for 1–2 dage, giver noget rente, og forhindrer utilsigtet forbrug. Aktier kan falde 30% præcis når du har mest brug for pengene.',
      },
      {
        id: 'efq3',
        en: 'What should you do immediately after using your emergency fund?',
        da: 'Hvad bør du gøre umiddelbart efter at have brugt din nødopsparing?',
        options: [
          { en: 'Invest it instead next time', da: 'Investere den i stedet næste gang' },
          { en: 'Make refilling it your top financial priority', da: 'Gøre genopfyldning til din vigtigste finansielle prioritet' },
          { en: 'Wait until you get a raise', da: 'Vente til du får lønforhøjelse' },
          { en: 'It is not necessary to refill it', da: 'Det er ikke nødvendigt at genopfylde den' },
        ],
        correct: 1,
        explanationEn: "Using it means it worked — but you're now unprotected. Rebuild it before focusing on any other financial goal.",
        explanationDa: 'At bruge den betyder, at den virkede — men du er nu ubeskyttet. Genopbyg den, inden du fokuserer på andre finansielle mål.',
      },
    ],
  },

  // ── interest-rates-credit ────────────────────────────────────────────────────

  'types-of-loans': {
    id: 'types-of-loans',
    category: 'interest-rates-credit',
    level: 'beginner',
    icon: '💳',
    mins: '~7 min',
    question: {
      en: 'Consumer loan, car loan, mortgage — what is the difference?',
      da: 'Forbrugslån, billån, boliglån — hvad er forskellen?',
    },
    tldrFn: (_p: PersonalProfile | null) => ({
      en: 'Consumer loans cost 8–25% APR. Car loans 4–8%. Mortgages 3–5%. The difference is collateral — secured loans are cheaper because the bank can take back the asset if you stop paying.',
      da: 'Forbrugslån koster 8–25% ÅOP. Billån 4–8%. Boliglån 3–5%. Forskellen er sikkerhed — sikrede lån er billigere fordi banken kan tage aktivet tilbage hvis du stopper med at betale.',
    }),
    whyCards: [
      {
        icon: '🔒',
        title: { en: 'Secured vs. unsecured', da: 'Sikret vs. usikret' },
        body: {
          en: "A mortgage uses your home as collateral. A car loan uses the car. If you stop paying, the lender can repossess the asset. This reduces the bank's risk, so they charge you less. A consumer loan has no collateral — if you default, the bank loses. That's why rates are much higher.",
          da: 'Et boliglån bruger din bolig som sikkerhed. Et billån bruger bilen. Hvis du stopper med at betale, kan långiveren tage aktivet tilbage. Det reducerer bankens risiko, så de opkræver dig mindre. Et forbrugslån har ingen sikkerhed — hvis du misligholder, taber banken. Derfor er renterne meget højere.',
        },
      },
      {
        icon: '📊',
        title: { en: 'APR (ÅOP) tells the real story', da: 'ÅOP fortæller den virkelige historie' },
        body: {
          en: "The advertised interest rate is not the full cost. APR (Annual Percentage Rate, or ÅOP in Danish) includes all fees, setup costs, and compounding. A loan at '7% interest' might have an APR of 12% after fees. Always compare APR, not the headline rate.",
          da: 'Den annoncerede rente er ikke den fulde omkostning. ÅOP (Årlige Omkostninger i Procent) inkluderer alle gebyrer, oprettelsesomkostninger og renters rente. Et lån med "7% rente" kan have et ÅOP på 12% efter gebyrer. Sammenlign altid ÅOP, ikke den annoncerede rente.',
        },
      },
      {
        icon: '⏱️',
        title: { en: 'Term changes everything', da: 'Løbetid ændrer alt' },
        body: {
          en: 'Same loan amount, same rate, different term: a 5-year loan costs much less in total than a 20-year loan, but has higher monthly payments. A mortgage stretches over 20–30 years, which keeps payments low but means you pay enormous amounts of interest in total.',
          da: 'Samme lånebeløb, samme rente, forskellig løbetid: et 5-årigt lån koster meget mindre i alt end et 20-årigt lån, men har højere månedlige ydelser. Et boliglån strækker sig over 20–30 år, hvilket holder ydelserne lave men betyder at du betaler enorme mængder rente i alt.',
        },
      },
      {
        icon: '🏠',
        title: { en: "Denmark's unique mortgage system", da: 'Danmarks unikke realkreditsystem' },
        body: {
          en: "Denmark has one of the world's most sophisticated mortgage markets. The 'realkreditlån' bonds issued by lenders can be traded on the stock exchange. This transparency keeps Danish mortgage rates among Europe's lowest. The system is why Danes can borrow up to 80% of a home's value at historically low rates.",
          da: 'Danmark har et af verdens mest sofistikerede realkreditmarkeder. De "realkreditobligationer" udstedt af långivere kan handles på fondsbørsen. Denne gennemsigtighed holder danske realkreditrenter blandt Europas laveste. Systemet er grunden til at danskere kan låne op til 80% af en boligs værdi til historisk lave renter.',
        },
      },
    ],
    Calculator: LoanComparisonCalculator,
    action: {
      icon: '📋',
      cta: {
        en: 'View your current debts',
        da: 'Se din nuværende gæld',
      },
      href: '/debt',
    },
    quiz: [
      {
        id: 'tlq1',
        en: 'Why is a consumer loan more expensive than a mortgage?',
        da: 'Hvorfor er et forbrugslån dyrere end et boliglån?',
        options: [
          { en: 'The loan amounts are smaller', da: 'Lånebeløbene er mindre' },
          { en: 'Consumer loans have no collateral, so the bank takes more risk', da: 'Forbrugslån har ingen sikkerhed, så banken løber større risiko' },
          { en: 'Consumer loans are regulated differently', da: 'Forbrugslån er reguleret anderledes' },
          { en: 'There is no difference in Denmark', da: 'Der er ingen forskel i Danmark' },
        ],
        correct: 1,
        explanationEn: "Without collateral, a lender can't recover the money if you default. To compensate for that risk, they charge much higher interest rates.",
        explanationDa: 'Uden sikkerhed kan en långiver ikke inddrive pengene, hvis du misligholder. For at kompensere for den risiko opkræver de meget højere renter.',
      },
      {
        id: 'tlq2',
        en: 'What does APR (ÅOP) include that the headline rate does not?',
        da: 'Hvad inkluderer ÅOP som den annoncerede rente ikke gør?',
        options: [
          { en: 'The collateral value', da: 'Sikkerhedsværdien' },
          { en: 'All fees, setup costs, and charges on top of the interest', da: 'Alle gebyrer, oprettelsesomkostninger og tillæg oven i renten' },
          { en: 'The monthly repayment schedule', da: 'Den månedlige tilbagebetalingsplan' },
          { en: 'The bank\'s profit margin', da: 'Bankens avance' },
        ],
        correct: 1,
        explanationEn: 'APR is the true cost of borrowing — it includes the interest rate plus all fees, making it the only fair way to compare loans.',
        explanationDa: 'ÅOP er den sande lånomkostning — den inkluderer renten plus alle gebyrer, og er den eneste rimelige måde at sammenligne lån på.',
      },
      {
        id: 'tlq3',
        en: 'In Denmark, how much of a home\'s value can a realkreditlån cover?',
        da: 'Hvor stor en del af en boligs værdi kan et realkreditlån dække i Danmark?',
        options: [
          { en: 'Up to 60%', da: 'Op til 60%' },
          { en: 'Up to 80%', da: 'Op til 80%' },
          { en: 'Up to 95%', da: 'Op til 95%' },
          { en: 'The full purchase price', da: 'Den fulde købesum' },
        ],
        correct: 1,
        explanationEn: 'Danish law caps realkreditlån at 80% of the property value. Banks can lend up to 15% more, leaving a minimum 5% for the buyer to provide.',
        explanationDa: 'Dansk lov begrænser realkreditlån til 80% af ejendomsværdien. Banker kan låne op til 15% mere, og efterlader minimum 5% som køber skal bidrage med.',
      },
    ],
  },

  // ── macroeconomics ────────────────────────────────────────────────────────────

  'what-is-inflation': {
    id: 'what-is-inflation',
    category: 'macroeconomics',
    level: 'beginner',
    icon: '📉',
    mins: '~6 min',
    question: {
      en: 'Why is your grocery bill higher than it was two years ago?',
      da: 'Hvorfor er din dagligvareregning højere end for to år siden?',
    },
    tldrFn: (_p: PersonalProfile | null) => ({
      en: "Inflation means each kroner buys less each year. Denmark averaged 6–8% inflation in 2022–2023. At 3% ongoing inflation, 100.000 kr today will buy only 74.000 kr worth of goods in 10 years.",
      da: 'Inflation betyder at hver krone køber mindre hvert år. Danmark havde gennemsnitligt 6–8% inflation i 2022–2023. Med 3% løbende inflation vil 100.000 kr i dag kun købe varer for 74.000 kr om 10 år.',
    }),
    whyCards: [
      {
        icon: '🛒',
        title: { en: 'What inflation actually measures', da: 'Hvad inflation egentlig måler' },
        body: {
          en: "Statistics Denmark tracks a 'basket' of goods and services — food, rent, transport, energy. If the basket costs 100 kr one year and 103 kr the next, inflation is 3%. Your personal inflation depends on your own spending mix, which may differ significantly from the official figure.",
          da: 'Danmarks Statistik følger en "kurv" af varer og tjenester — mad, husleje, transport, energi. Hvis kurven koster 100 kr et år og 103 kr det næste, er inflationen 3%. Din personlige inflation afhænger af dit eget forbrugsmix, som kan afvige væsentligt fra det officielle tal.',
        },
      },
      {
        icon: '🏆',
        title: { en: 'Who benefits from inflation', da: 'Hvem tjener på inflation' },
        body: {
          en: "Borrowers benefit — their debt becomes cheaper in real terms. Asset owners benefit — property and stocks often rise with or above inflation. Cash savers lose — money under the mattress or in a 0% account loses purchasing power every year. This is why holding large amounts in cash long-term is a silent wealth destroyer.",
          da: 'Låntagere tjener på det — deres gæld bliver billigere i reale termer. Aktivejere tjener på det — ejendom og aktier stiger ofte i takt med eller over inflation. Opsparere i kontanter taber — penge under madrassen eller på en 0%-konto mister købekraft hvert år. Det er derfor at holde store beløb i kontanter på lang sigt er en stille formueødelægger.',
        },
      },
      {
        icon: '🇩🇰',
        title: { en: "Denmark's recent inflation story", da: 'Danmarks seneste inflationshistorie' },
        body: {
          en: "Danish inflation peaked at 10.1% in October 2022 — the highest in 40 years — driven by energy prices after Russia's invasion of Ukraine and post-COVID supply chain disruptions. By 2024 it had fallen to ~2–3%. The impact: if you got a 2% pay rise in 2022, your real purchasing power fell by ~8%.",
          da: 'Dansk inflation toppede med 10,1% i oktober 2022 — det højeste i 40 år — drevet af energipriser efter Ruslands invasion af Ukraine og forstyrrelser i forsyningskæden efter COVID. I 2024 var den faldet til ~2–3%. Konsekvensen: hvis du fik en lønforhøjelse på 2% i 2022, faldt din reale købekraft med ~8%.',
        },
      },
      {
        icon: '🛡️',
        title: { en: 'How to protect yourself', da: 'Sådan beskytter du dig selv' },
        body: {
          en: "The goal is a positive 'real return': your money must grow faster than inflation. Cash savings at 2% with 3% inflation = −1% real return. Index funds historically return ~7% nominal = ~4% real over the long run. Property and equities are the main inflation hedges for most people.",
          da: 'Målet er et positivt "realafkast": dine penge skal vokse hurtigere end inflationen. Kontantopsparing på 2% med 3% inflation = −1% realafkast. Indeksfonde giver historisk ~7% nominelt = ~4% realt på lang sigt. Ejendom og aktier er de vigtigste inflationsskærme for de fleste.',
        },
      },
    ],
    Calculator: InflationCalculator,
    action: {
      icon: '📊',
      cta: {
        en: 'Check your net worth and savings',
        da: 'Tjek din formue og opsparing',
      },
      href: '/net-worth',
    },
    quiz: [
      {
        id: 'infq1',
        en: 'At 3% annual inflation, what happens to the purchasing power of 100.000 kr over 10 years?',
        da: 'Hvad sker der med købekraften af 100.000 kr over 10 år ved 3% årlig inflation?',
        options: [
          { en: 'It stays at 100.000 kr', da: 'Den forbliver på 100.000 kr' },
          { en: 'It falls to around 97.000 kr', da: 'Den falder til omkring 97.000 kr' },
          { en: 'It falls to around 74.000 kr', da: 'Den falder til omkring 74.000 kr' },
          { en: 'It falls to zero', da: 'Den falder til nul' },
        ],
        correct: 2,
        explanationEn: '100,000 × (0.97)^10 ≈ 73,700 kr. Compounding works in reverse too — small annual losses add up dramatically over a decade.',
        explanationDa: '100.000 × (0,97)^10 ≈ 73.700 kr. Renters rente virker omvendt også — små årlige tab akkumuleres dramatisk over et årti.',
      },
      {
        id: 'infq2',
        en: 'Which group generally benefits from high inflation?',
        da: 'Hvilken gruppe har generelt fordel af høj inflation?',
        options: [
          { en: 'People with large cash savings', da: 'Folk med store kontantopsparinger' },
          { en: 'Borrowers with fixed-rate mortgages', da: 'Låntagere med fastforrentede boliglån' },
          { en: 'Pensioners on fixed incomes', da: 'Pensionister med fast indkomst' },
          { en: 'People holding government bonds', da: 'Folk der har statsobligationer' },
        ],
        correct: 1,
        explanationEn: "Borrowers benefit because the real value of their debt shrinks. A 2M kr mortgage becomes 'cheaper' in real terms when inflation erodes the value of money.",
        explanationDa: 'Låntagere har fordel fordi den reale værdi af deres gæld skrumper. Et boliglån på 2 mio. kr. bliver "billigere" i reale termer, når inflationen eroderer penges værdi.',
      },
      {
        id: 'infq3',
        en: 'What is a "real return"?',
        da: 'Hvad er et "realafkast"?',
        options: [
          { en: 'Return on property investments only', da: 'Afkast på ejendomsinvesteringer alene' },
          { en: 'Your total nominal gains before tax', da: 'Dine samlede nominelle gevinster før skat' },
          { en: 'Nominal return minus inflation', da: 'Nominelt afkast minus inflation' },
          { en: 'The guaranteed return from your bank', da: 'Det garanterede afkast fra din bank' },
        ],
        correct: 2,
        explanationEn: 'Real return = nominal return − inflation. If your savings pay 2% and inflation is 3%, your real return is −1%. You are getting poorer even though the number in your account is growing.',
        explanationDa: 'Realafkast = nominelt afkast − inflation. Hvis din opsparing giver 2% og inflationen er 3%, er dit realafkast −1%. Du bliver fattigere selvom tallet på din konto vokser.',
      },
    ],
  },

  // ── investing-markets ────────────────────────────────────────────────────────

  'what-is-index-fund': {
    id: 'what-is-index-fund',
    category: 'investing-markets',
    level: 'beginner',
    icon: '📈',
    mins: '~7 min',
    question: {
      en: 'The simplest, cheapest way most people should invest',
      da: 'Den simpleste og billigste måde de fleste bør investere på',
    },
    tldrFn: (_p: PersonalProfile | null) => ({
      en: 'A global index fund (e.g. iShares MSCI World) automatically buys a slice of 1,500+ companies for ~0.2% annual fee. Historically returns ~7–9% per year. Start with any amount — 500 DKK/month compounds to millions over decades.',
      da: 'En global indeksfond (f.eks. iShares MSCI World) køber automatisk en andel af 1.500+ virksomheder for ~0,2% i årligt gebyr. Giver historisk ~7–9% om året. Start med ethvert beløb — 500 kr/måned vokser til millioner over årtier.',
    }),
    whyCards: [
      {
        icon: '🌍',
        title: { en: 'What is an index?', da: 'Hvad er et indeks?' },
        body: {
          en: "An index is a list of companies ranked by size. The MSCI World Index includes ~1,500 companies from 23 developed countries. An index fund simply buys all of them in proportion to their size. When Apple grows, you own a bit more Apple. When a company collapses, your exposure shrinks automatically.",
          da: 'Et indeks er en liste over virksomheder rangeret efter størrelse. MSCI World Index inkluderer ~1.500 virksomheder fra 23 udviklede lande. En indeksfond køber simpelthen dem alle i forhold til deres størrelse. Når Apple vokser, ejer du lidt mere Apple. Når en virksomhed kollapser, reduceres din eksponering automatisk.',
        },
      },
      {
        icon: '💸',
        title: { en: 'Why fees matter more than you think', da: 'Hvorfor gebyrer betyder mere end du tror' },
        body: {
          en: "A 1.5% annual fee vs 0.2% seems trivial. Over 30 years at 7% returns, an extra 1.3% in fees cuts your final balance by roughly 32%. On a 1M kr portfolio, that's 320,000 kr lost — paid to a fund manager who statistically underperforms the index anyway.",
          da: 'Et årligt gebyr på 1,5% vs 0,2% virker trivielt. Over 30 år ved 7% afkast reducerer 1,3% ekstra i gebyrer din slutsaldo med ca. 32%. På en portefølje på 1 mio. kr. er det 320.000 kr. tabt — betalt til en fondsforvalter der statistisk set underpræsterer indekset alligevel.',
        },
      },
      {
        icon: '🧠',
        title: { en: 'Why professionals rarely beat it', da: 'Hvorfor professionelle sjældent slår det' },
        body: {
          en: "Every year, roughly 80–90% of actively managed funds underperform their benchmark index after fees. The market is an aggregation of all investors' knowledge. Beating it consistently requires knowing something the entire market doesn't — which is nearly impossible over the long run.",
          da: 'Hvert år underpræsterer ca. 80–90% af aktivt forvaltede fonde deres benchmarkindeks efter gebyrer. Markedet er en sammenlægning af alle investorers viden. At slå det konsekvent kræver at vide noget hele markedet ikke ved — hvilket er næsten umuligt på lang sigt.',
        },
      },
      {
        icon: '🇩🇰',
        title: { en: 'How to invest in Denmark', da: 'Sådan investerer du i Danmark' },
        body: {
          en: "Danish investors typically use a 'aktiesparekonto' (up to 135,900 DKK, 17% flat tax on gains) or a regular investment account. Investeringsforeninger (Danish investment trusts) are often preferred for their tax treatment. Popular low-cost options: Sparindex, Storebrand, and global ETFs via Nordnet or Saxo Bank.",
          da: 'Danske investorer bruger typisk en aktiesparekonto (op til 135.900 kr, 17% flat skat på gevinster) eller en almindelig investeringskonto. Investeringsforeninger er ofte foretrukket for deres skattemæssige behandling. Populære billige muligheder: Sparindex, Storebrand og globale ETF\'er via Nordnet eller Saxo Bank.',
        },
      },
    ],
    Calculator: IndexFundCalculator,
    action: {
      icon: '🎯',
      cta: {
        en: 'Set an investment goal',
        da: 'Sæt et investeringsmål',
      },
      href: '/goals',
    },
    quiz: [
      {
        id: 'idxq1',
        en: 'What does a global index fund do?',
        da: 'Hvad gør en global indeksfond?',
        options: [
          { en: 'A fund manager picks the best stocks', da: 'En fondsforvalter udvælger de bedste aktier' },
          { en: 'It automatically tracks a market index by holding all its stocks', da: 'Den følger automatisk et markedsindeks ved at holde alle dets aktier' },
          { en: 'It invests only in Danish companies', da: 'Den investerer kun i danske virksomheder' },
          { en: 'It guarantees a fixed annual return', da: 'Den garanterer et fast årligt afkast' },
        ],
        correct: 1,
        explanationEn: 'An index fund passively tracks a market index — no active stock picking. It buys all (or most) stocks in proportion to their size, giving you broad market exposure at very low cost.',
        explanationDa: 'En indeksfond følger passivt et markedsindeks — ingen aktiv aktieplukning. Den køber alle (eller de fleste) aktier i forhold til deres størrelse, og giver dig bred markedseksponering til meget lav pris.',
      },
      {
        id: 'idxq2',
        en: 'What is the typical annual fee (ÅOP) for a passive index fund?',
        da: 'Hvad er det typiske årlige gebyr (ÅOP) for en passiv indeksfond?',
        options: [
          { en: '0.1–0.5%', da: '0,1–0,5%' },
          { en: '1–2%', da: '1–2%' },
          { en: '3–5%', da: '3–5%' },
          { en: 'Over 5%', da: 'Over 5%' },
        ],
        correct: 0,
        explanationEn: 'Passive index funds typically charge 0.1–0.3% per year. This compares to 1–2% for actively managed funds — a difference that compounds dramatically over decades.',
        explanationDa: 'Passive indeksfonde opkræver typisk 0,1–0,3% om året. Dette sammenlignes med 1–2% for aktivt forvaltede fonde — en forskel der akkumulerer dramatisk over årtier.',
      },
      {
        id: 'idxq3',
        en: 'Over 30 years, how does a 1.3% higher annual fee affect your wealth?',
        da: 'Hvordan påvirker et 1,3% højere årligt gebyr din formue over 30 år?',
        options: [
          { en: 'The difference is negligible', da: 'Forskellen er ubetydelig' },
          { en: 'It reduces your final balance by about 5%', da: 'Det reducerer din slutsaldo med ca. 5%' },
          { en: 'It reduces your final balance by roughly 30–35%', da: 'Det reducerer din slutsaldo med ca. 30–35%' },
          { en: 'Higher fees always mean better performance', da: 'Højere gebyrer betyder altid bedre resultater' },
        ],
        correct: 2,
        explanationEn: 'Compounding works against you with fees. A 1.3% fee over 30 years at 7% returns costs roughly 32% of your final balance — often hundreds of thousands of kroner.',
        explanationDa: 'Renters rente virker imod dig med gebyrer. Et 1,3% gebyr over 30 år ved 7% afkast koster ca. 32% af din slutsaldo — ofte hundredtusindvis af kroner.',
      },
    ],
  },

  // ── pension-retirement ────────────────────────────────────────────────────────

  'folkepension': {
    id: 'folkepension',
    category: 'pension-retirement',
    level: 'beginner',
    icon: '🏛️',
    mins: '~6 min',
    question: {
      en: 'When do you qualify for folkepension — and how much is it?',
      da: 'Hvornår er du berettiget til folkepension — og hvor meget er det?',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const age = p?.age ?? 35
      const yearsLeft = Math.max(0, 67 - age)
      return {
        en: `You qualify at age 67 (for most). You need 40 years of Danish residency for the full benefit (~7,800 kr/month basic, up to ~16,200 kr with supplement). ${yearsLeft > 0 ? `That's ${yearsLeft} years away for you.` : 'You are at or past the qualifying age.'}`,
        da: `Du er berettiget ved alder 67 (for de fleste). Du skal bo i Danmark i 40 år for fuld ydelse (~7.800 kr/måned grundbeløb, op til ~16.200 kr med tillæg). ${yearsLeft > 0 ? `Det er ${yearsLeft} år væk for dig.` : 'Du er ved eller forbi pensionsalderen.'}`,
      }
    },
    whyCards: [
      {
        icon: '🏛️',
        title: { en: 'What folkepension actually is', da: 'Hvad folkepension egentlig er' },
        body: {
          en: "Folkepension is the Danish state pension — funded by current taxpayers, paid to everyone who qualifies. It is not a savings account. Unlike ATP (which is your own contributions), folkepension is a collective guarantee that all Danes get a basic income in retirement.",
          da: 'Folkepension er den danske statspension — finansieret af nutidens skatteydere, udbetalt til alle der er berettiget. Det er ikke en opsparingskonto. I modsætning til ATP (som er dine egne indbetalinger) er folkepension en kollektiv garanti om at alle danskere får en grundindkomst på pension.',
        },
      },
      {
        icon: '📅',
        title: { en: 'The 40-year residency rule', da: '40-årsreglen for bopæl' },
        body: {
          en: "You must have lived in Denmark for 40 years between age 15 and pension age to receive full folkepension. Each missing year reduces your benefit by 1/40. Moved to Denmark at 30? You will receive 25/40 of the full benefit at age 67 (assuming you stay). Time spent working in other EU countries may count — check with Udbetaling Danmark.",
          da: 'Du skal have boet i Danmark i 40 år mellem 15 og pensionsalderen for at modtage fuld folkepension. Hvert manglende år reducerer din ydelse med 1/40. Flyttede til Danmark som 30-årig? Du modtager 25/40 af fuld ydelse ved 67 (forudsat du bliver). Tid brugt på arbejde i andre EU-lande kan tælle — tjek med Udbetaling Danmark.',
        },
      },
      {
        icon: '💰',
        title: { en: "The supplement — who gets it and who doesn't", da: 'Tillægget — hvem får det og hvem gør ikke' },
        body: {
          en: "Folkepension has two parts: the basic amount (grundbeløb) everyone with 40 years gets, and the income-tested supplement (pensionstillæg). The supplement phases out if you have significant pension income from other sources. If you have a large workplace pension, you may receive little or no supplement.",
          da: 'Folkepension har to dele: grundbeløbet som alle med 40 år får, og det indkomstprøvede tillæg (pensionstillæg). Tillægget udfases hvis du har væsentlig pensionsindkomst fra andre kilder. Hvis du har en stor firmapension, modtager du måske lidt eller intet tillæg.',
        },
      },
      {
        icon: '⚠️',
        title: { en: "It won't be enough on its own", da: 'Det er ikke nok alene' },
        body: {
          en: "Full folkepension pays ~7,800 kr/month basic + up to ~8,400 kr supplement = ~16,200 kr/month maximum. The average Danish household spends significantly more than this. Most Danes are expected to supplement folkepension with workplace pensions, ATP, and personal savings.",
          da: 'Fuld folkepension udbetaler ~7.800 kr/måned grundbeløb + op til ~8.400 kr tillæg = ~16.200 kr/måned maksimalt. En gennemsnitlig dansk husstand bruger væsentligt mere end dette. De fleste danskere forventes at supplere folkepension med firmapensioner, ATP og personlig opsparing.',
        },
      },
    ],
    Calculator: FolkepensionCalculator,
    action: {
      icon: '🔍',
      cta: {
        en: 'See your full pension picture at PensionsInfo',
        da: 'Se dit fulde pensionsbillede på PensionsInfo',
      },
      href: 'https://www.pensionsinfo.dk',
      external: true,
    },
    quiz: [
      {
        id: 'fpq1',
        en: 'At what age do most Danes currently qualify for folkepension?',
        da: 'Hvornår er de fleste danskere i øjeblikket berettiget til folkepension?',
        options: [
          { en: '62', da: '62' },
          { en: '65', da: '65' },
          { en: '67', da: '67' },
          { en: '70', da: '70' },
        ],
        correct: 2,
        explanationEn: "The current folkepension age is 67 for those born in 1963 or later. It's set to rise gradually — to 68 for those born 1968–1972 and potentially higher for younger generations.",
        explanationDa: 'Den nuværende folkepensionsalder er 67 for dem, der er født i 1963 eller senere. Den er sat til at stige gradvist — til 68 for dem, der er født 1968–1972 og potentielt højere for yngre generationer.',
      },
      {
        id: 'fpq2',
        en: 'How many years of Danish residency are needed for full folkepension?',
        da: 'Hvor mange års dansk bopæl er nødvendigt for fuld folkepension?',
        options: [
          { en: '10 years', da: '10 år' },
          { en: '25 years', da: '25 år' },
          { en: '40 years', da: '40 år' },
          { en: '50 years', da: '50 år' },
        ],
        correct: 2,
        explanationEn: "You need 40 years of residency between age 15 and your pension age. Each missing year reduces the benefit by 1/40. People who've lived abroad for part of their life should check with Udbetaling Danmark.",
        explanationDa: 'Du skal bo i Danmark i 40 år mellem 15 og din pensionsalder. Hvert manglende år reducerer ydelsen med 1/40. Folk der har boet i udlandet i en del af deres liv bør tjekke med Udbetaling Danmark.',
      },
      {
        id: 'fpq3',
        en: "You moved to Denmark at age 30 and plan to stay until pension age 67. What fraction of full folkepension will you receive?",
        da: 'Du flyttede til Danmark som 30-årig og planlægger at blive til pensionsalderen 67. Hvilken brøkdel af fuld folkepension modtager du?',
        options: [
          { en: 'The full amount — citizenship matters, not residency', da: 'Det fulde beløb — statsborgerskab tæller, ikke bopæl' },
          { en: '30/40 (75%)', da: '30/40 (75%)' },
          { en: '37/40 (92.5%)', da: '37/40 (92,5%)' },
          { en: 'None — you need to have been born in Denmark', da: 'Intet — du skal have været født i Danmark' },
        ],
        correct: 2,
        explanationEn: "Aged 30–67 is 37 years of Danish residency, giving you 37/40 of full folkepension. Residency — not citizenship or birth — is what matters.",
        explanationDa: 'Alder 30–67 er 37 års dansk bopæl, og giver dig 37/40 af fuld folkepension. Bopæl — ikke statsborgerskab eller fødsel — er det der tæller.',
      },
    ],
  },

  // ── housing-real-estate ───────────────────────────────────────────────────────

  'down-payment-basics': {
    id: 'down-payment-basics',
    category: 'housing-real-estate',
    level: 'beginner',
    icon: '🏠',
    mins: '~7 min',
    question: {
      en: 'How much do you actually need saved before buying a home?',
      da: 'Hvor meget skal du egentlig have sparet op, inden du køber bolig?',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const savingCapacity = p?.gross_dkk ? Math.round(p.gross_dkk * 0.15) : 5000
      const target = 625000 // 25% of 2.5M DKK
      const months = Math.ceil(target / savingCapacity)
      return {
        en: `On a 2.5M kr home, you need at least 125,000 kr (5% minimum) but 500,000 kr (20%) for the best terms — plus ~87,500 kr in transaction costs. Saving ${Math.round(savingCapacity / 1000)}k kr/month, you'd be ready in about ${Math.round(months / 12)} years.`,
        da: `For en bolig til 2,5 mio. kr. skal du bruge mindst 125.000 kr (5% minimum) men 500.000 kr (20%) for de bedste vilkår — plus ~87.500 kr i transaktionsomkostninger. Med ${Math.round(savingCapacity / 1000)}k kr/måned i opsparing er du klar om ca. ${Math.round(months / 12)} år.`,
      }
    },
    whyCards: [
      {
        icon: '🏦',
        title: { en: "Denmark's financing rules", da: 'Danmarks finansieringsregler' },
        body: {
          en: "By law, a realkreditlån can finance up to 80% of the home's assessed value. Banks can lend up to 15% more. That means the buyer must provide at least 5%. In practice, most banks require 20%+ for the best interest rates. The 5% minimum is a legal floor — not a recommended target.",
          da: 'Ved lov kan et realkreditlån finansiere op til 80% af boligens vurderingsværdi. Banker kan låne op til 15% mere. Det betyder at køber skal bidrage med mindst 5%. I praksis kræver de fleste banker 20%+ for de bedste renter. 5%-minimummet er et lovmæssigt gulv — ikke et anbefalet mål.',
        },
      },
      {
        icon: '🧾',
        title: { en: 'The hidden costs no one mentions', da: 'De skjulte omkostninger ingen nævner' },
        body: {
          en: "Beyond the down payment, budget for: tinglysningsafgift (registration fee, ~0.6% + 1,660 kr fixed), bank fees, valuation (valuarvurdering), legal advisor, estate agent fees if selling. Total transaction costs: roughly 3–5% of the purchase price. These must come from your savings, not the mortgage.",
          da: 'Udover udbetalingen skal du budgettere med: tinglysningsafgift (~0,6% + 1.660 kr fast), bankgebyrer, vurdering (valuarvurdering), juridisk rådgiver, ejendomsmæglerhonorarer hvis du sælger. Samlede transaktionsomkostninger: ca. 3–5% af købesummen. Disse skal komme fra din opsparing, ikke lånet.',
        },
      },
      {
        icon: '📈',
        title: { en: 'More equity = lower rate', da: 'Mere egenkapital = lavere rente' },
        body: {
          en: "The more you put down, the less the bank lends as a percentage of the property value. This reduces the bank's risk, so they offer better terms. Going from 5% to 20% down can reduce your interest rate by 0.3–0.8%, saving tens of thousands of kroner over the loan term.",
          da: 'Jo mere du lægger ned, jo mindre låner banken som en procentdel af ejendomsværdien. Det reducerer bankens risiko, så de tilbyder bedre vilkår. At gå fra 5% til 20% udbetaling kan reducere din rente med 0,3–0,8%, og spare titusindvis af kroner over lånets løbetid.',
        },
      },
      {
        icon: '🏗️',
        title: { en: 'How Danish home buying actually works', da: 'Sådan fungerer boligkøb i Danmark faktisk' },
        body: {
          en: "1. Get a bank pre-approval (tilbudslån). 2. Find a home and make an offer. 3. Sign a purchase agreement (købsaftale). 4. Get a home inspection (bygningssagkyndig rapport). 5. Sign final documents and register (tinglysning). The full process typically takes 2–4 months from offer to keys.",
          da: '1. Få en forhåndsgodkendelse fra banken (tilbudslån). 2. Find en bolig og lav et bud. 3. Underskriv en købsaftale. 4. Få en tilstandsrapport (bygningssagkyndig rapport). 5. Underskriv endelige dokumenter og registrer (tinglysning). Hele processen tager typisk 2–4 måneder fra bud til nøgler.',
        },
      },
    ],
    Calculator: DownPaymentCalculator,
    action: {
      icon: '🎯',
      cta: {
        en: 'Set a house deposit savings goal',
        da: 'Sæt et mål for boligopsparing',
      },
      href: '/goals',
    },
    quiz: [
      {
        id: 'dpq1',
        en: 'What is the legal minimum down payment required when buying a home in Denmark?',
        da: 'Hvad er det lovmæssige minimum for udbetaling ved boligkøb i Danmark?',
        options: [
          { en: '0% — mortgages can cover everything', da: '0% — lån kan dække det hele' },
          { en: '5%', da: '5%' },
          { en: '10%', da: '10%' },
          { en: '20%', da: '20%' },
        ],
        correct: 1,
        explanationEn: "Danish law requires a minimum 5% down payment. The realkreditlån covers up to 80% and banks can lend up to 15% more, leaving 5% for the buyer. However, 5% rarely gets you the best terms.",
        explanationDa: 'Dansk lov kræver minimum 5% udbetaling. Realkreditlånet dækker op til 80% og banker kan låne op til 15% mere, og efterlader 5% til køber. Dog giver 5% sjældent de bedste vilkår.',
      },
      {
        id: 'dpq2',
        en: "Beyond the down payment, roughly what percentage of the home price should you budget for transaction costs?",
        da: 'Ud over udbetalingen, hvad bør du budgettere med i transaktionsomkostninger som procentdel af boligprisen?',
        options: [
          { en: 'Nothing — these are included in the mortgage', da: 'Intet — disse er inkluderet i lånet' },
          { en: '0.5% (just the tinglysning fee)', da: '0,5% (kun tinglysningsgebyret)' },
          { en: '3–5%', da: '3–5%' },
          { en: 'Over 10%', da: 'Over 10%' },
        ],
        correct: 2,
        explanationEn: "Transaction costs include registration fees (tinglysning), bank fees, valuations, and legal advice. Budget 3–5% of the purchase price on top of your down payment.",
        explanationDa: 'Transaktionsomkostninger inkluderer registreringsafgifter (tinglysning), bankgebyrer, vurderinger og juridisk rådgivning. Budgettér med 3–5% af købesummen oven i din udbetaling.',
      },
      {
        id: 'dpq3',
        en: "Why does a larger down payment usually mean a lower interest rate?",
        da: 'Hvorfor betyder en større udbetaling normalt en lavere rente?',
        options: [
          { en: 'The government subsidises larger down payments', da: 'Staten subsidier større udbetalinger' },
          { en: 'The bank lends a smaller proportion of the home value, reducing their risk', da: 'Banken låner en mindre andel af boligens værdi, hvilket reducerer deres risiko' },
          { en: 'It is purely a marketing strategy by banks', da: 'Det er udelukkende en marketingstrategi fra banker' },
          { en: 'The mortgage term is automatically shorter', da: 'Lånets løbetid bliver automatisk kortere' },
        ],
        correct: 1,
        explanationEn: "Loan-to-value ratio (LTV) measures how much you owe vs. how much the home is worth. Lower LTV = lower bank risk = lower rate. Providing 20% down means the bank is secured against price drops of up to 20%.",
        explanationDa: 'Belåningsgrad (LTV) måler hvad du skylder vs. hvad boligen er værd. Lavere LTV = lavere bankrisiko = lavere rente. En udbetaling på 20% betyder at banken er sikret mod prisfald på op til 20%.',
      },
    ],
  },

  // ── protection-insurance ─────────────────────────────────────────────────────

  'life-insurance-basics': {
    id: 'life-insurance-basics',
    category: 'protection-insurance',
    level: 'beginner',
    icon: '🔐',
    mins: '~6 min',
    question: {
      en: 'Do you need life insurance — and how much?',
      da: 'Har du brug for livsforsikring — og hvor meget?',
    },
    tldrFn: (p: PersonalProfile | null) => {
      const salary = p?.gross_dkk ? Math.round(p.gross_dkk * 12 / 100000) * 100000 : 480000
      const coverage = Math.round((2000000 + salary * 5) / 100000) * 100000
      return {
        en: `If you have a mortgage or dependents, aim for coverage of ~mortgage + 5× annual salary (~${Math.round(coverage / 1000)}k kr). Check your pension scheme first — many Danes are already covered for 2–3× salary.`,
        da: `Hvis du har boliglån eller forsørgere, sigt efter dækning på ~boliglån + 5× årsløn (~${Math.round(coverage / 1000)}k kr). Tjek din pensionsordning først — mange danskere er allerede dækket for 2–3× årsløn.`,
      }
    },
    whyCards: [
      {
        icon: '👨‍👩‍👧',
        title: { en: 'When do you actually need it?', da: 'Hvornår har du egentlig brug for det?' },
        body: {
          en: "Life insurance is for people who depend on your income. If you have: a mortgage your partner couldn't pay alone, children, or a partner who would struggle financially without you — you need it. If you're single, renting, and have no dependents, the need is minimal.",
          da: 'Livsforsikring er til folk der er afhængige af din indkomst. Hvis du har: et boliglån din partner ikke kunne betale alene, børn, eller en partner der ville kæmpe finansielt uden dig — har du brug for det. Hvis du er single, lejer og ingen forsørgere har, er behovet minimalt.',
        },
      },
      {
        icon: '🏢',
        title: { en: 'Check your employer first', da: 'Tjek din arbejdsgiver først' },
        body: {
          en: "Many Danish collective agreements (overenskomster) automatically include life insurance worth 2–3× your annual salary. Check your pension statement at pensionsinfo.dk — your employer may already have you covered. Buying additional insurance on top of full coverage wastes money.",
          da: 'Mange danske overenskomster inkluderer automatisk livsforsikring svarende til 2–3× din årsløn. Tjek din pensionsopgørelse på pensionsinfo.dk — din arbejdsgiver har måske allerede dækket dig. At købe yderligere forsikring ovenpå fuld dækning er spild af penge.',
        },
      },
      {
        icon: '⏰',
        title: { en: 'Term life vs. whole life', da: 'Risikoforsikring vs. livsforsikring med opsparing' },
        body: {
          en: "In Denmark, risikoforsikring (term life) pays out if you die within the coverage period. Livsforsikring with a savings component builds up cash value but charges much more in premiums. For most people, term life is the right choice — it's cheaper, and investment returns are better handled in a separate account.",
          da: 'I Danmark udbetaler risikoforsikring (tidsbegrænset livsforsikring) hvis du dør inden for dækningsperioden. Livsforsikring med opsparingselement opbygger kontantværdi men opkræver langt højere præmier. For de fleste er tidsbegrænset forsikring det rigtige valg — den er billigere, og investeringsafkast håndteres bedre på en separat konto.',
        },
      },
      {
        icon: '🔢',
        title: { en: 'How much is enough?', da: 'Hvor meget er nok?' },
        body: {
          en: "A common rule: outstanding mortgage + 5–10× annual salary. The mortgage part is straightforward. The income replacement part depends on how long your dependents need support. Young children = longer period = more coverage needed. The calculator below personalises this for your situation.",
          da: 'En almindelig tommelfingerregel: udestående boliglån + 5–10× årsløn. Boliglånsdelen er ligetil. Indkomstersatningsdelen afhænger af, hvor længe dine forsørgede har brug for støtte. Små børn = længere periode = mere dækning nødvendig. Beregneren nedenfor tilpasser dette til din situation.',
        },
      },
    ],
    Calculator: LifeInsuranceCalculator,
    action: {
      icon: '🔍',
      cta: {
        en: 'Check your pension coverage at PensionsInfo',
        da: 'Tjek din pensionsdækning på PensionsInfo',
      },
      href: 'https://www.pensionsinfo.dk',
      external: true,
    },
    quiz: [
      {
        id: 'liq1',
        en: 'If you are single, renting, and have no dependents, do you generally need life insurance?',
        da: 'Hvis du er single, lejer og ingen forsørgere har — har du generelt brug for livsforsikring?',
        options: [
          { en: 'Yes, everyone needs life insurance', da: 'Ja, alle har brug for livsforsikring' },
          { en: 'No — life insurance protects dependents, not the insured', da: 'Nej — livsforsikring beskytter forsørgede, ikke den forsikrede' },
          { en: 'Yes, but only a small amount', da: 'Ja, men kun et lille beløb' },
          { en: 'Only if you are over 40', da: 'Kun hvis du er over 40' },
        ],
        correct: 1,
        explanationEn: "Life insurance replaces your income for people who depend on it. Without dependents or a mortgage, there's no one financially harmed by your death. Focus your money on building wealth instead.",
        explanationDa: 'Livsforsikring erstatter din indkomst for folk der er afhængige af den. Uden forsørgede eller boliglån er der ingen der lider finansiel skade ved din død. Fokusér dine penge på formuesopbygning i stedet.',
      },
      {
        id: 'liq2',
        en: 'Where should you look first for existing life insurance coverage?',
        da: 'Hvor bør du kigge først for eksisterende livsforsikringsdækning?',
        options: [
          { en: 'A private insurance broker', da: 'En privat forsikringsmægler' },
          { en: 'Your bank', da: 'Din bank' },
          { en: 'Your pension scheme or employer collective agreement', da: 'Din pensionsordning eller arbejdsgivers overenskomst' },
          { en: 'The Danish government (Udbetaling Danmark)', da: 'Den danske stat (Udbetaling Danmark)' },
        ],
        correct: 2,
        explanationEn: "Many Danish collective agreements and pension schemes automatically include life insurance of 2–3× annual salary. Check pensionsinfo.dk to see what you already have before buying more.",
        explanationDa: 'Mange danske overenskomster og pensionsordninger inkluderer automatisk livsforsikring på 2–3× årsløn. Tjek pensionsinfo.dk for at se hvad du allerede har, inden du køber mere.',
      },
      {
        id: 'liq3',
        en: 'What is the key difference between risikoforsikring (term life) and whole life insurance?',
        da: 'Hvad er den væsentligste forskel på risikoforsikring (tidsbegrænset) og livsforsikring med opsparing?',
        options: [
          { en: 'They cover different death causes', da: 'De dækker forskellige dødsårsager' },
          { en: 'Term life pays out only if you die within the term; whole life includes a savings component', da: 'Risikoforsikring udbetaler kun hvis du dør inden for perioden; livsforsikring med opsparing inkluderer en opsparingskomponent' },
          { en: 'Term life is only available for people under 30', da: 'Risikoforsikring er kun tilgængelig for folk under 30' },
          { en: 'There is no difference in Denmark', da: 'Der er ingen forskel i Danmark' },
        ],
        correct: 1,
        explanationEn: "Term life (risikoforsikring) is pure death protection — cheaper and suitable for most people. Whole life builds savings but charges much more. For Danes, separating insurance from investment is almost always the better approach.",
        explanationDa: 'Risikoforsikring er ren dødsfaldsbeskyttelse — billigere og egnet til de fleste. Livsforsikring med opsparing opbygger opsparing men er langt dyrere. For danskere er det næsten altid bedre at holde forsikring adskilt fra investering.',
      },
    ],
  },
}

export function getPracticalTopic(id: string): PracticalTopic | null {
  return PRACTICAL_TOPICS[id] ?? null
}
