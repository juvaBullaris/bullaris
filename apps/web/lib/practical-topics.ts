import { EmergencyFundCalculator } from '@/components/learning/practical/calculators/EmergencyFundCalculator'
import { LoanComparisonCalculator } from '@/components/learning/practical/calculators/LoanComparisonCalculator'
import { InflationCalculator } from '@/components/learning/practical/calculators/InflationCalculator'
import { IndexFundCalculator } from '@/components/learning/practical/calculators/IndexFundCalculator'
import { FolkepensionCalculator } from '@/components/learning/practical/calculators/FolkepensionCalculator'
import { DownPaymentCalculator } from '@/components/learning/practical/calculators/DownPaymentCalculator'
import { LifeInsuranceCalculator } from '@/components/learning/practical/calculators/LifeInsuranceCalculator'

import type { PracticalTopic, PersonalProfile } from './practical-topic-types'

const fmt = (n: number) => Math.round(n).toLocaleString('da-DK') + ' kr.'

export const PRACTICAL_TOPICS: Record<string, PracticalTopic> = {

  // ── financial-foundations ────────────────────────────────────────────────────

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
