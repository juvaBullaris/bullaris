'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

// ── Types ─────────────────────────────────────────────────────────────────────

type Level = 'beginner' | 'intermediate' | 'advanced'

interface Topic {
  id: string
  label: string
  labelDa: string
  href?: string // only set when a full lesson page exists
}

interface Category {
  id: string
  color: string
  label: string
  labelDa: string
  topics: Record<Level, Topic[]>
}

// ── Curriculum ─────────────────────────────────────────────────────────────────

const CURRICULUM: Category[] = [
  {
    id: 'financial-foundations',
    color: '#22c55e',
    label: 'Financial foundations',
    labelDa: 'Finansielle grundprincipper',
    topics: {
      beginner: [
        { id: 'how-money-works',     label: 'How money works',          labelDa: 'Hvordan penge virker' },
        { id: 'income-vs-expenses',  label: 'Income vs expenses',       labelDa: 'Indtægt vs udgifter' },
        { id: 'net-worth-basics',    label: 'Net worth basics',         labelDa: 'Formue — det grundlæggende' },
        { id: 'budgeting-methods',   label: 'Budgeting methods',        labelDa: 'Budgetmetoder' },
        { id: 'emergency-fund',      label: 'Emergency fund',           labelDa: 'Nødfond' },
        { id: 'good-vs-bad-debt',    label: 'Good vs bad debt',         labelDa: 'God vs dårlig gæld' },
        { id: 'power-of-compounding',label: 'The power of compounding', labelDa: 'Renters rente' },
      ],
      intermediate: [
        { id: 'cash-flow-statement',       label: 'Cash flow statement',            labelDa: 'Pengestrømsopgørelse' },
        { id: 'personal-balance-sheet',    label: 'Personal balance sheet',         labelDa: 'Personlig balance' },
        { id: 'opportunity-cost',          label: 'Opportunity cost',               labelDa: 'Alternativomkostning' },
        { id: 'time-value-of-money',       label: 'Time value of money',            labelDa: 'Penges tidsværdi' },
        { id: 'inflation-purchasing-power',label: 'Inflation and purchasing power', labelDa: 'Inflation og købekraft' },
        { id: 'tax-brackets-dk',           label: 'Tax brackets (Denmark)',         labelDa: 'Skattesatser (Danmark)', href: '/learning/tax-basics' },
        { id: 'marginal-vs-effective-rate',label: 'Marginal vs effective rate',     labelDa: 'Marginal- vs effektiv skattesats' },
      ],
      advanced: [
        { id: 'fi-number',                  label: 'Financial independence number',            labelDa: 'Dit FIRE-tal' },
        { id: 'safe-withdrawal-rate',        label: 'Safe withdrawal rate (4% rule)',           labelDa: 'Sikker hævningsrate (4%-reglen)' },
        { id: 'sequence-of-returns',         label: 'Sequence of returns risk',                labelDa: 'Rækkefølgerisiko' },
        { id: 'behavioural-biases',          label: 'Behavioural finance biases',              labelDa: 'Adfærdsøkonomiske biases' },
        { id: 'liquidity-vs-solvency',       label: 'Liquidity vs solvency',                  labelDa: 'Likviditet vs solvens' },
        { id: 'income-statement-optimisation',label:'Personal income statement optimisation',  labelDa: 'Optimering af personlig indkomstopgørelse' },
      ],
    },
  },
  {
    id: 'interest-rates-credit',
    color: '#3b82f6',
    label: 'Interest rates & credit',
    labelDa: 'Renter og kredit',
    topics: {
      beginner: [
        { id: 'what-is-interest',       label: 'What is an interest rate',    labelDa: 'Hvad er en rente' },
        { id: 'simple-vs-compound',     label: 'Simple vs compound interest', labelDa: 'Simpel vs sammensat rente' },
        { id: 'apr-vs-nominal',         label: 'APR vs nominal rate',         labelDa: 'ÅOP vs nominel rente' },
        { id: 'credit-score-basics',    label: 'Credit score basics',         labelDa: 'Kreditvurdering — grundlæggende' },
        { id: 'types-of-loans',         label: 'Types of loans',              labelDa: 'Lånetyper' },
        { id: 'overdraft-credit-cards', label: 'Overdraft and credit cards',  labelDa: 'Kassekredit og kreditkort' },
      ],
      intermediate: [
        { id: 'central-bank-rates',        label: 'How central banks set rates (Nationalbanken, ECB)', labelDa: 'Centralbankers rentesætning' },
        { id: 'real-vs-nominal-rate',      label: 'Real vs nominal interest rate',                    labelDa: 'Real vs nominel rente' },
        { id: 'yield-curves',              label: 'Yield curves',                                      labelDa: 'Rentekurver' },
        { id: 'fixed-vs-variable-mortgage',label: 'Fixed vs variable rate mortgages',                 labelDa: 'Fast vs variabel rente på boliglån' },
        { id: 'refinancing-logic',         label: 'Refinancing logic',                                labelDa: 'Låneomlægningslogik' },
        { id: 'debt-avalanche-snowball',   label: 'Debt avalanche vs snowball',                       labelDa: 'Gældslawine vs snebold' },
      ],
      advanced: [
        { id: 'duration-sensitivity',label: 'Duration and interest rate sensitivity', labelDa: 'Varighed og rentesensitivitet' },
        { id: 'negative-rates',      label: 'Negative interest rates',               labelDa: 'Negative renter' },
        { id: 'credit-spreads',      label: 'Credit spreads',                        labelDa: 'Kreditspænd' },
        { id: 'convexity',           label: 'Convexity',                             labelDa: 'Konveksitet' },
        { id: 'interest-rate-swaps', label: 'Interest rate swaps (conceptual)',      labelDa: 'Renteswaps (konceptuelt)' },
        { id: 'euribor-cibor',       label: 'EURIBOR / CIBOR mechanics',            labelDa: 'EURIBOR / CIBOR-mekanik' },
      ],
    },
  },
  {
    id: 'macroeconomics',
    color: '#f97316',
    label: 'Macroeconomics',
    labelDa: 'Makroøkonomi',
    topics: {
      beginner: [
        { id: 'what-is-gdp',          label: 'What is GDP',             labelDa: 'Hvad er BNP' },
        { id: 'unemployment-explained',label: 'Unemployment explained', labelDa: 'Arbejdsløshed forklaret' },
        { id: 'what-is-inflation',    label: 'What is inflation (CPI)', labelDa: 'Hvad er inflation (forbrugerprisindeks)' },
        { id: 'why-prices-rise',      label: 'Why prices rise',         labelDa: 'Hvorfor priser stiger' },
        { id: 'government-budgets',   label: 'Government budgets',      labelDa: 'Statsbudgetter' },
        { id: 'what-central-banks-do',label: 'What central banks do',   labelDa: 'Hvad centralbanker gør' },
      ],
      intermediate: [
        { id: 'monetary-vs-fiscal', label: 'Monetary vs fiscal policy',                    labelDa: 'Penge- vs finanspolitik' },
        { id: 'business-cycles',    label: 'Business cycles',                              labelDa: 'Konjunkturcykler' },
        { id: 'ecb-rate-decisions', label: 'ECB interest rate decisions',                  labelDa: 'ECB renteafgørelser' },
        { id: 'dkk-eur-peg',        label: 'Danish fixed exchange rate policy (DKK/EUR)', labelDa: 'Dansk fastkurspolitik (DKK/EUR)' },
        { id: 'trade-balance',      label: 'Trade balance and current account',            labelDa: 'Handelsbalance og betalingsbalance' },
        { id: 'quantitative-easing',label: 'Quantitative easing explained',               labelDa: 'Kvantitative lempelser forklaret' },
      ],
      advanced: [
        { id: 'austrian-business-cycle', label: 'Austrian business cycle theory', labelDa: 'Østrigsk konjunkturteori' },
        { id: 'cantillon-effect',        label: 'Cantillon effect',               labelDa: 'Cantillon-effekten' },
        { id: 'debt-monetisation',       label: 'Debt monetisation',              labelDa: 'Gældsmonetisering' },
        { id: 'sovereign-debt-dynamics', label: 'Sovereign debt dynamics',        labelDa: 'Statsgældsdynamik' },
        { id: 'stagflation',             label: 'Stagflation mechanics',          labelDa: 'Stagflationsmekanik' },
        { id: 'currency-crises',         label: 'Currency crises and capital flight', labelDa: 'Valutakriser og kapitalflugt' },
      ],
    },
  },
  {
    id: 'investing-markets',
    color: '#8b5cf6',
    label: 'Investing & markets',
    labelDa: 'Investering og markeder',
    topics: {
      beginner: [
        { id: 'stocks-bonds-funds',   label: 'Stocks vs bonds vs funds',       labelDa: 'Aktier vs obligationer vs fonde' },
        { id: 'what-is-dividend',     label: 'What is a dividend',             labelDa: 'Hvad er et udbytte' },
        { id: 'risk-return-tradeoff', label: 'Risk and return tradeoff',       labelDa: 'Risiko og afkastforhold' },
        { id: 'diversification-basics',label:'Diversification basics',         labelDa: 'Diversificering — grundlæggende' },
        { id: 'what-is-index-fund',   label: 'What is an index fund',          labelDa: 'Hvad er en indeksfond' },
        { id: 'long-vs-short-term',   label: 'Long-term vs short-term investing',labelDa: 'Langsigtet vs kortsigtet investering' },
      ],
      intermediate: [
        { id: 'asset-allocation',    label: 'Asset allocation frameworks',          labelDa: 'Aktivallokering' },
        { id: 'passive-vs-active',   label: 'Passive vs active investing',          labelDa: 'Passiv vs aktiv investering' },
        { id: 'factor-investing',    label: 'Factor investing (value, momentum)',   labelDa: 'Faktorinvestering (value, momentum)' },
        { id: 'pe-ratio',            label: 'P/E ratio and valuation multiples',    labelDa: 'P/E-tal og værdiansættelsesmultipler' },
        { id: 'portfolio-rebalancing',label:'Portfolio rebalancing',               labelDa: 'Porteføljerebalancering' },
        { id: 'investment-tax-dk',   label: 'Tax on investment returns (Denmark)', labelDa: 'Skat på investeringsafkast (Danmark)' },
        { id: 'etfs-vs-mutual-funds',label: "ETFs vs mutual funds",               labelDa: 'ETFer vs investeringsforeninger' },
      ],
      advanced: [
        { id: 'dcf',                   label: 'Discounted cash flow (DCF)',           labelDa: 'Diskonteret cash flow (DCF)' },
        { id: 'intrinsic-value',       label: 'Intrinsic value and margin of safety', labelDa: 'Indre værdi og sikkerhedsmargin' },
        { id: 'austrian-capital-theory',label:'Austrian capital theory and markets',  labelDa: 'Østrigsk kapitalteori og markeder' },
        { id: 'damodaran',             label: 'Damodaran valuation framework',        labelDa: 'Damodaran-værdiansættelsesramme' },
        { id: 'options-hedging',       label: 'Options basics (hedging)',             labelDa: 'Optioner — grundlæggende (afdækning)' },
        { id: 'private-equity',        label: 'Private equity and illiquidity premium',labelDa: 'Private equity og illikviditetspræmie' },
        { id: 'global-macro',          label: 'Global macro investing',               labelDa: 'Global makroinvestering' },
      ],
    },
  },
  {
    id: 'pension-retirement',
    color: '#14b8a6',
    label: 'Pension & retirement',
    labelDa: 'Pension og alderspension',
    topics: {
      beginner: [
        { id: 'what-is-atp',           label: 'What is ATP',              labelDa: 'Hvad er ATP' },
        { id: 'folkepension',          label: 'Folkepension eligibility', labelDa: 'Folkepension — berettigelse' },
        { id: 'workplace-pension',     label: 'Workplace pension (firmapension)', labelDa: 'Firmapension' },
        { id: 'why-start-early',       label: 'Why start early',          labelDa: 'Hvorfor starte tidligt' },
        { id: 'state-vs-private-pension',label:'State vs private pension',labelDa: 'Offentlig vs privat pension' },
      ],
      intermediate: [
        { id: 'pension-tax-rules',      label: 'Pension tax rules (Denmark)',      labelDa: 'Pensionsskateregler (Danmark)' },
        { id: 'ratepension-vs-livrente',label: 'Ratepension vs livrente',          labelDa: 'Ratepension vs livrente' },
        { id: 'aldersopsparing',        label: 'Aldersopsparing',                  labelDa: 'Aldersopsparing' },
        { id: 'investment-risk-pension',label: 'Investment risk profile in pension',labelDa: 'Investeringsrisikoprofil i pension' },
        { id: 'pension-job-change',     label: 'Pension on job change',            labelDa: 'Pension ved jobskifte' },
        { id: 'self-employed-pension',  label: 'Self-employed pension options',    labelDa: 'Selvstændiges pensionsmuligheder' },
      ],
      advanced: [
        { id: 'fire-dk',             label: 'Early retirement (FIRE) in Danish context', labelDa: 'Tidlig pensionering (FIRE) i dansk kontekst' },
        { id: 'pension-drawdown',    label: 'Pension drawdown strategy',                 labelDa: 'Pensionsudbetaling strategi' },
        { id: 'pension-tax-opt',     label: 'Tax optimisation across pension types',     labelDa: 'Skatteoptimering på tværs af pensionstyper' },
        { id: 'cross-border-pension',label: 'Cross-border pension (expats in DK)',       labelDa: 'Grænseoverskridende pension (expats i DK)' },
        { id: 'annuity-pricing',     label: 'Annuity pricing',                          labelDa: 'Annuitetsprissætning' },
        { id: 'longevity-risk',      label: 'Longevity risk',                           labelDa: 'Langlevedsrisiko' },
      ],
    },
  },
  {
    id: 'housing-real-estate',
    color: '#ec4899',
    label: 'Housing & real estate',
    labelDa: 'Bolig og fast ejendom',
    topics: {
      beginner: [
        { id: 'rent-vs-buy',           label: 'Rent vs buy decision',           labelDa: 'Leje vs køb' },
        { id: 'what-is-boliglan',      label: 'What is a boliglån',             labelDa: 'Hvad er et boliglån' },
        { id: 'how-mortgages-work',    label: 'How mortgages work',             labelDa: 'Hvordan realkreditlån fungerer' },
        { id: 'down-payment-basics',   label: 'Down payment basics',            labelDa: 'Udbetaling — grundlæggende' },
        { id: 'ejendomsskat',          label: 'Property tax (ejendomsskat)',     labelDa: 'Ejendomsskat' },
        { id: 'housing-costs-beyond',  label: 'Housing costs beyond mortgage',  labelDa: 'Boligudgifter ud over realkreditlån' },
      ],
      intermediate: [
        { id: 'realkreditlan',          label: 'Danish mortgage system (realkreditlån)', labelDa: 'Det danske realkreditsystem' },
        { id: 'f1-vs-f5-vs-fixed',     label: 'F1 vs F5 vs fixed rate loans',          labelDa: 'F1 vs F5 vs fastforrentede lån' },
        { id: 'ltv-limits',            label: 'Loan-to-value and LTV limits',           labelDa: 'Belåningsgrad og LTV-grænser' },
        { id: 'amortisation-vs-interest',label:'Amortisation vs interest-only',         labelDa: 'Afdrags- vs afdragsfri lån' },
        { id: 'housing-market-cycles', label: 'Housing market cycles',                  labelDa: 'Boligmarkedscykler' },
        { id: 'boligkobsaftale',       label: 'Boligkøbsaftale process',               labelDa: 'Boligkøbsaftale-processen' },
      ],
      advanced: [
        { id: 'rental-property-investment',label:'Rental property as investment',          labelDa: 'Udlejningsejendom som investering' },
        { id: 'cap-rate',              label: 'Cap rate and yield analysis',              labelDa: 'Cap rate og afkastanalyse' },
        { id: 'leverage-real-estate',  label: 'Leverage effects in real estate',         labelDa: 'Gearingseffekter i fast ejendom' },
        { id: 'real-estate-portfolio', label: 'Real estate in a portfolio context',      labelDa: 'Fast ejendom i porteføljekontekst' },
        { id: 'property-gains-tax',    label: 'Tax on property gains (Denmark)',         labelDa: 'Ejendomsavanceskat (Danmark)' },
        { id: 'refinancing-omlaegning',label: 'Refinancing strategy (omlægning)',        labelDa: 'Låneomlægningsstrategi' },
      ],
    },
  },
  {
    id: 'protection-insurance',
    color: '#eab308',
    label: 'Protection & insurance',
    labelDa: 'Beskyttelse og forsikring',
    topics: {
      beginner: [
        { id: 'why-insurance-exists',   label: 'Why insurance exists',             labelDa: 'Hvorfor forsikring eksisterer' },
        { id: 'health-insurance-dk',    label: 'Health insurance in Denmark',      labelDa: 'Sundhedsforsikring i Danmark' },
        { id: 'life-insurance-basics',  label: 'Life insurance basics',            labelDa: 'Livsforsikring — grundlæggende' },
        { id: 'a-kasse',                label: 'Unemployment insurance (a-kasse)', labelDa: 'A-kasse' },
        { id: 'contents-home-insurance',label: 'Contents and home insurance',      labelDa: 'Indboforsikring og husforsikring' },
      ],
      intermediate: [
        { id: 'critical-illness',     label: 'Critical illness cover',         labelDa: 'Kritisk sygdomsdækning' },
        { id: 'lonsikring',           label: 'Income protection (lønsikring)', labelDa: 'Lønsikring' },
        { id: 'insurance-life-stage', label: 'Insurance needs by life stage',  labelDa: 'Forsikringsbehov efter livsfase' },
        { id: 'excess-premium',       label: 'Excess and premium tradeoffs',   labelDa: 'Selvrisiko og præmieafvejninger' },
        { id: 'group-vs-individual',  label: 'Group vs individual policies',   labelDa: 'Gruppeordninger vs individuelle policer' },
        { id: 'beneficiary',          label: 'Beneficiary designation',        labelDa: 'Begunstigelse' },
      ],
      advanced: [
        { id: 'insurance-financial-plan',  label: 'Insurance as part of financial plan',    labelDa: 'Forsikring som del af finansiel plan' },
        { id: 'self-insurance-threshold',  label: 'Self-insurance threshold',               labelDa: 'Selvforsikringsgrænse' },
        { id: 'business-owner-insurance',  label: 'Business owner insurance needs',         labelDa: 'Forsikringsbehov for virksomhedsejere' },
        { id: 'cross-border-coverage',     label: 'Cross-border coverage issues',           labelDa: 'Grænseoverskridende dækningsproblemer' },
        { id: 'disability-probability',    label: 'Disability probability and planning',    labelDa: 'Sandsynlighed for invaliditet og planlægning' },
        { id: 'estate-planning',           label: 'Estate planning basics (testamente, arv)',labelDa: 'Arve- og boligplanlægning (testamente, arv)' },
      ],
    },
  },
]

// ── Goal → relevant category mapping ──────────────────────────────────────────

const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  emergency_fund:         ['financial-foundations'],
  debt_payoff:            ['interest-rates-credit', 'financial-foundations'],
  vacation:               ['financial-foundations'],
  car:                    ['financial-foundations', 'interest-rates-credit'],
  education:              ['financial-foundations'],
  house_deposit:          ['housing-real-estate', 'financial-foundations'],
  home_renovation:        ['housing-real-estate'],
  children_savings:       ['financial-foundations', 'pension-retirement'],
  investment:             ['investing-markets', 'financial-foundations'],
  side_income:            ['investing-markets'],
  pension_boost:          ['pension-retirement', 'investing-markets'],
  financial_independence: ['financial-foundations', 'investing-markets', 'pension-retirement'],
  passive_income:         ['investing-markets', 'housing-real-estate'],
  early_retirement:       ['pension-retirement', 'investing-markets', 'financial-foundations'],
  generational_wealth:    ['investing-markets', 'protection-insurance', 'pension-retirement'],
  other:                  [],
}

// ── Deep-dive lessons ─────────────────────────────────────────────────────────

const LESSONS = [
  { href: '/learning/payslip-guide', icon: '📄', en: 'Understanding Your Danish Payslip', da: 'Forstå din lønseddel',      mins: '~8 min' },
  { href: '/learning/tax-basics',    icon: '📊', en: 'Danish Tax Basics 2026',            da: 'Danske skatter 2026',       mins: '~10 min' },
  { href: '/learning/tax-return',    icon: '📬', en: 'TastSelv & Annual Tax Return',      da: 'TastSelv & årsopgørelse',  mins: '~12 min' },
  { href: '/learning/goal-setting',  icon: '🎯', en: 'How to Set Financial Goals',        da: 'Sæt finansielle mål',      mins: '~10 min' },
]

const LEVELS: { id: Level; en: string; da: string }[] = [
  { id: 'beginner',     en: 'Beginner',     da: 'Begynder' },
  { id: 'intermediate', en: 'Intermediate', da: 'Øvet' },
  { id: 'advanced',     en: 'Advanced',     da: 'Avanceret' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LearningPage() {
  const { locale } = useLanguage()
  const da = locale === 'da'

  const [level, setLevel] = useState<Level>('beginner')

  useEffect(() => {
    const saved = localStorage.getItem('bullaris-learning-level') as Level | null
    if (saved && (['beginner', 'intermediate', 'advanced'] as string[]).includes(saved)) {
      setLevel(saved)
    }
  }, [])

  const changeLevel = (l: Level) => {
    setLevel(l)
    localStorage.setItem('bullaris-learning-level', l)
  }

  const goalsQuery    = trpc.goals.list.useQuery()
  const progressQuery = trpc.learning.myProgress.useQuery()

  const relevantCategories = new Set<string>(
    (goalsQuery.data ?? []).flatMap((g) => GOAL_CATEGORY_MAP[g.type] ?? [])
  )

  const completedIds = new Set((progressQuery.data ?? []).map((p) => p.contentId))

  const totalTopics = CURRICULUM.reduce(
    (sum, cat) =>
      sum +
      cat.topics.beginner.length +
      cat.topics.intermediate.length +
      cat.topics.advanced.length,
    0
  )

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {da ? 'Finansiel læring' : 'Financial learning'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {da
            ? `${totalTopics} emner på tværs af 7 kategorier — tilpasset dine mål og dit niveau`
            : `${totalTopics} topics across 7 categories — matched to your goals and level`}
        </p>
      </div>

      {/* Level tabs */}
      <div className="flex gap-1 mb-8 p-1 bg-muted rounded-lg w-fit">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            onClick={() => changeLevel(l.id)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              level === l.id
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {da ? l.da : l.en}
          </button>
        ))}
      </div>

      {/* Goal context banner */}
      {goalsQuery.data && goalsQuery.data.length > 0 && relevantCategories.size > 0 && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
          <span className="text-foreground font-medium">
            {da ? 'Tilpasset dine mål · ' : 'Matched to your goals · '}
          </span>
          {da
            ? 'Kategorier markeret med ★ er mest relevante for det, du arbejder hen imod.'
            : "Categories marked ★ are most relevant to what you're working towards."}
        </div>
      )}

      {/* Curriculum */}
      <div className="space-y-10">
        {CURRICULUM.map((cat) => {
          const topics     = cat.topics[level]
          const isRelevant = relevantCategories.has(cat.id)
          const catTotal   =
            cat.topics.beginner.length +
            cat.topics.intermediate.length +
            cat.topics.advanced.length

          return (
            <div key={cat.id}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <h2 className="text-base font-semibold">
                  {da ? cat.labelDa : cat.label}
                  {isRelevant && <span className="ml-1.5 text-primary">★</span>}
                </h2>
                <span className="ml-auto text-xs text-muted-foreground">
                  {catTotal} {da ? 'emner' : 'topics'}
                </span>
              </div>

              {/* Level sub-label */}
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2.5">
                {da ? LEVELS.find((l) => l.id === level)?.da : LEVELS.find((l) => l.id === level)?.en}
              </p>

              {/* Topic pills */}
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => {
                  const label = da ? topic.labelDa : topic.label
                  const done  = topic.href ? completedIds.has(topic.id) : false

                  if (topic.href) {
                    return (
                      <Link
                        key={topic.id}
                        href={topic.href}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                          done
                            ? 'bg-primary/10 border-primary/20 text-primary'
                            : 'bg-background border-border hover:border-primary/40 hover:bg-primary/5'
                        }`}
                      >
                        {done ? (
                          <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 flex-shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        {label}
                      </Link>
                    )
                  }

                  return (
                    <span
                      key={topic.id}
                      title={da ? 'Kommer snart' : 'Coming soon'}
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm border border-border bg-muted/40 text-muted-foreground cursor-default select-none"
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Deep-dive lessons */}
      <div className="mt-12 pt-6 border-t">
        <p className="text-sm font-medium mb-3">
          {da ? 'Dybdegående lektioner' : 'Deep-dive lessons'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LESSONS.map((lesson) => (
            <Link
              key={lesson.href}
              href={lesson.href}
              className="flex items-start gap-3 p-3 rounded-lg border hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <span className="text-xl">{lesson.icon}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug">
                  {da ? lesson.da : lesson.en}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{lesson.mins}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
