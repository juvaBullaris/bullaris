'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { CURRICULUM as COURSES } from '@/lib/curriculum-data'
import { buildContentId } from '@/lib/curriculum-types'

// ── Types ─────────────────────────────────────────────────────────────────────

type Level = 'beginner' | 'intermediate' | 'advanced'

interface Topic {
  id: string
  label: string
  labelDa: string
  href?: string
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
    label: 'Your money basics',
    labelDa: 'Dine pengebasics',
    topics: {
      beginner: [
        { id: 'how-money-works',      label: 'How money actually works — and why it matters to you',          labelDa: 'Hvordan penge egentlig fungerer — og hvorfor det betyder noget for dig' },
        { id: 'income-vs-expenses',   label: 'Are you earning more than you spend?',                          labelDa: 'Tjener du mere, end du bruger?' },
        { id: 'net-worth-basics',     label: 'What are you actually worth today?',                            labelDa: 'Hvad er du egentlig værd i dag?' },
        { id: 'budgeting-methods',    label: 'Which budgeting method fits your life?',                        labelDa: 'Hvilken budgetmetode passer til dit liv?' },
        { id: 'emergency-fund',       label: 'How much should you keep for emergencies — and where?',         labelDa: 'Hvor meget skal du have til nødsituationer — og hvor?' },
        { id: 'good-vs-bad-debt',     label: 'When is borrowing smart — and when is it dangerous?',           labelDa: 'Hvornår er det smart at låne — og hvornår er det farligt?' },
        { id: 'power-of-compounding', label: 'Why starting to save 10 years earlier makes a massive difference', labelDa: 'Hvorfor det gør en kæmpe forskel at starte med at spare 10 år tidligere' },
      ],
      intermediate: [
        { id: 'cash-flow-statement',        label: 'Where does your money actually go each month?',                            labelDa: 'Hvor går dine penge egentlig hen hver måned?' },
        { id: 'personal-balance-sheet',     label: 'How to take a snapshot of your financial health',                         labelDa: 'Sådan tager du et øjebliksbillede af din finansielle sundhed' },
        { id: 'opportunity-cost',           label: "What you're really giving up when you spend money",                       labelDa: 'Hvad du egentlig giver afkald på, når du bruger penge' },
        { id: 'time-value-of-money',        label: 'Why 100.000 kr today is worth more than 100.000 kr in 5 years',           labelDa: 'Hvorfor 100.000 kr i dag er mere værd end 100.000 kr om 5 år' },
        { id: 'inflation-purchasing-power', label: 'Why your money buys less every year — and what to do about it',           labelDa: 'Hvorfor dine penge køber mindre hvert år — og hvad du kan gøre ved det' },
        { id: 'tax-brackets-dk',            label: 'How Danish income tax actually works on your payslip',                    labelDa: 'Hvordan dansk indkomstskat egentlig fungerer på din lønseddel', href: '/learning/tax-basics' },
        { id: 'marginal-vs-effective-rate', label: 'What tax rate do you really pay?',                                        labelDa: 'Hvilken skattesats betaler du egentlig?' },
      ],
      advanced: [
        { id: 'fi-number',                   label: 'How much money do you need to never work again?',                                  labelDa: 'Hvor meget penge skal du have for aldrig at arbejde igen?' },
        { id: 'safe-withdrawal-rate',        label: 'How much can you spend each year in retirement without running out?',              labelDa: 'Hvor meget kan du bruge hvert år på pension uden at løbe tør?' },
        { id: 'sequence-of-returns',         label: 'Why market crashes hurt more when you have just retired',                          labelDa: 'Hvorfor markedskrak skader mere, når du lige er gået på pension' },
        { id: 'behavioural-biases',          label: 'The mental traps that make smart people lose money',                               labelDa: 'De mentale fælder, der får kloge mennesker til at tabe penge' },
        { id: 'liquidity-vs-solvency',       label: 'The difference between being cash-poor and actually broke',                        labelDa: 'Forskellen på at mangle likviditet og faktisk at være insolvent' },
        { id: 'income-statement-optimisation', label: 'How to legally structure your income to keep more of it',                        labelDa: 'Hvordan du lovligt strukturerer din indkomst for at beholde mere' },
      ],
    },
  },
  {
    id: 'interest-rates-credit',
    color: '#3b82f6',
    label: 'Loans & credit',
    labelDa: 'Lån og kredit',
    topics: {
      beginner: [
        { id: 'what-is-interest',       label: 'What does an interest rate actually cost you in real money?',   labelDa: 'Hvad koster en rente dig egentlig i rigtige penge?' },
        { id: 'simple-vs-compound',     label: 'Why some loans grow much faster than others',                   labelDa: 'Hvorfor nogle lån vokser meget hurtigere end andre' },
        { id: 'apr-vs-nominal',         label: 'The real cost of a loan — beyond the headline rate',            labelDa: 'Den reelle omkostning ved et lån — ud over den annoncerede rente' },
        { id: 'credit-score-basics',    label: 'What is a credit score and how does it affect your loan terms?',labelDa: 'Hvad er en kreditvurdering, og hvordan påvirker den dine lånevilkår?' },
        { id: 'types-of-loans',         label: 'Consumer loan, car loan, mortgage — what is the difference?',  labelDa: 'Forbrugslån, billån, boliglån — hvad er forskellen?' },
        { id: 'overdraft-credit-cards', label: 'When does a credit card become expensive debt?',               labelDa: 'Hvornår bliver et kreditkort til dyr gæld?' },
      ],
      intermediate: [
        { id: 'central-bank-rates',         label: "Why the ECB's decisions affect your mortgage payment",             labelDa: 'Hvorfor ECBs beslutninger påvirker din ydelse på boliglånet' },
        { id: 'real-vs-nominal-rate',       label: 'Is your savings account actually growing when inflation is high?', labelDa: 'Vokser din opsparing egentlig, når inflationen er høj?' },
        { id: 'yield-curves',               label: "What an inverted yield curve says about the economy's direction",  labelDa: 'Hvad en inverteret rentekurve siger om økonomiens retning' },
        { id: 'fixed-vs-variable-mortgage', label: 'Fixed or adjustable rate — which is better for your situation?',  labelDa: 'Fast eller variabel rente — hvad er bedst for din situation?' },
        { id: 'refinancing-logic',          label: 'When does it actually make sense to refinance your mortgage?',     labelDa: 'Hvornår giver det egentlig mening at omlægge dit lån?' },
        { id: 'debt-avalanche-snowball',    label: "What is the fastest way to pay off multiple debts?",               labelDa: 'Hvad er den hurtigste måde at betale flere gælde af?' },
      ],
      advanced: [
        { id: 'duration-sensitivity', label: 'Why your bond fund drops when interest rates rise',                          labelDa: 'Hvorfor din obligationsfond falder, når renten stiger' },
        { id: 'negative-rates',       label: 'What happens when banks charge you to hold your money',                      labelDa: 'Hvad sker der, når banker opkræver betaling for at holde dine penge' },
        { id: 'credit-spreads',       label: 'How the market prices the risk of lending to different borrowers',           labelDa: 'Hvordan markedet prissætter risikoen ved at låne til forskellige låntagere' },
        { id: 'convexity',            label: "Why bonds don't move in a straight line when rates change",                  labelDa: 'Hvorfor obligationer ikke bevæger sig lineært, når renten ændrer sig' },
        { id: 'interest-rate-swaps', label: 'How companies lock in borrowing costs — and what you can learn from it',     labelDa: 'Hvordan virksomheder låser låneomkostninger fast — og hvad du kan lære af det' },
        { id: 'euribor-cibor',       label: 'The benchmark rates that set the price of your variable mortgage',            labelDa: 'Benchmarkrenterne der sætter prisen på dit variabelt forrentede lån' },
      ],
    },
  },
  {
    id: 'macroeconomics',
    color: '#f97316',
    label: 'The economy around you',
    labelDa: 'Økonomien omkring dig',
    topics: {
      beginner: [
        { id: 'what-is-gdp',           label: 'What does it mean when the economy grows — and why should you care?',     labelDa: 'Hvad betyder det, når økonomien vokser — og hvorfor bør du gide?' },
        { id: 'unemployment-explained',label: 'How unemployment is measured — and what it means for your job security',  labelDa: 'Hvordan arbejdsløshed måles — og hvad det betyder for din jobsikkerhed' },
        { id: 'what-is-inflation',     label: 'Why your grocery bill is higher than it was two years ago',               labelDa: 'Hvorfor din dagligvareregning er højere end for to år siden' },
        { id: 'why-prices-rise',       label: 'What drives inflation — and who benefits from it?',                       labelDa: 'Hvad driver inflation — og hvem tjener på det?' },
        { id: 'government-budgets',    label: 'Where does your tax money actually go?',                                  labelDa: 'Hvor går dine skattepenge egentlig hen?' },
        { id: 'what-central-banks-do', label: 'What does Danmarks Nationalbank actually do with interest rates?',        labelDa: 'Hvad gør Danmarks Nationalbank egentlig med renterne?' },
      ],
      intermediate: [
        { id: 'monetary-vs-fiscal', label: 'What tools does the government have when the economy slows down?',                  labelDa: 'Hvilke redskaber har regeringen, når økonomien bremser op?' },
        { id: 'business-cycles',    label: 'How to recognise where we are in the economic cycle',                               labelDa: 'Hvordan du genkender, hvor vi er i konjunkturcyklen' },
        { id: 'ecb-rate-decisions', label: "How the ECB's rate decisions reach your savings account and mortgage",              labelDa: 'Hvordan ECBs rentebeslutninger når din opsparing og dit boliglån' },
        { id: 'dkk-eur-peg',        label: 'Why Denmark keeps the krone pegged to the euro',                                   labelDa: 'Hvorfor Danmark holder kronen bundet til euroen' },
        { id: 'trade-balance',      label: "What Denmark's trade surplus tells you about the economy",                         labelDa: 'Hvad Danmarks handelsoverskud fortæller dig om økonomien' },
        { id: 'quantitative-easing',label: 'What happened when central banks printed money — and what it did to asset prices', labelDa: 'Hvad skete der, da centralbanker trykkede penge — og hvad det gjorde ved aktivpriser' },
      ],
      advanced: [
        { id: 'austrian-business-cycle', label: 'How cheap credit creates booms — and why busts always follow',             labelDa: 'Hvordan billig kredit skaber opsving — og hvorfor nedture altid følger' },
        { id: 'cantillon-effect',        label: "Why newly created money doesn't reach everyone equally",                   labelDa: 'Hvorfor nyoprettede penge ikke når alle ligeligt' },
        { id: 'debt-monetisation',       label: 'What happens when governments print money to pay their bills',             labelDa: 'Hvad sker der, når regeringer trykker penge for at betale regninger' },
        { id: 'sovereign-debt-dynamics', label: 'When does government debt become a problem — and for whom?',              labelDa: 'Hvornår bliver statsgæld et problem — og for hvem?' },
        { id: 'stagflation',             label: 'Why high inflation and high unemployment can happen at the same time',     labelDa: 'Hvorfor høj inflation og høj arbejdsløshed kan ske på samme tid' },
        { id: 'currency-crises',         label: "What causes a currency to collapse — and what it means for your savings", labelDa: 'Hvad får en valuta til at kollapse — og hvad det betyder for din opsparing' },
      ],
    },
  },
  {
    id: 'investing-markets',
    color: '#8b5cf6',
    label: 'Growing your money',
    labelDa: 'Få dine penge til at vokse',
    topics: {
      beginner: [
        { id: 'stocks-bonds-funds',    label: "What is the difference between a stock, a bond, and a fund?",          labelDa: 'Hvad er forskellen på en aktie, en obligation og en fond?' },
        { id: 'what-is-dividend',      label: 'What does it mean when a company pays you just for owning a share?',   labelDa: 'Hvad betyder det, når en virksomhed betaler dig bare for at eje en aktie?' },
        { id: 'risk-return-tradeoff',  label: 'Why higher returns always come with higher risk',                      labelDa: 'Hvorfor højere afkast altid kommer med højere risiko' },
        { id: 'diversification-basics',label: 'Why you should never put all your money in one place',                 labelDa: 'Hvorfor du aldrig bør sætte alle dine penge ét sted' },
        { id: 'what-is-index-fund',    label: 'The simplest, cheapest way most people should invest',                 labelDa: 'Den simpleste og billigste måde de fleste bør investere på' },
        { id: 'long-vs-short-term',    label: 'How long you invest changes everything about what you should buy',     labelDa: 'Hvor længe du investerer ændrer alt ved, hvad du bør købe' },
      ],
      intermediate: [
        { id: 'asset-allocation',     label: 'How to split your money between stocks, bonds, and cash',                       labelDa: 'Hvordan du fordeler dine penge mellem aktier, obligationer og kontanter' },
        { id: 'passive-vs-active',    label: 'Do fund managers actually beat the market — and at what cost?',                 labelDa: 'Slår fondsforvaltere egentlig markedet — og til hvilken pris?' },
        { id: 'factor-investing',     label: 'Why value and momentum stocks historically outperform',                         labelDa: 'Hvorfor value- og momentumaktier historisk har givet bedre afkast' },
        { id: 'pe-ratio',             label: 'How to tell if a stock is cheap or expensive',                                  labelDa: 'Hvordan du afgør, om en aktie er billig eller dyr' },
        { id: 'portfolio-rebalancing',label: 'Why you need to reset your investments once a year',                            labelDa: 'Hvorfor du skal nulstille dine investeringer én gang om året' },
        { id: 'investment-tax-dk',    label: 'How Danish tax rules affect what you actually keep from investing',             labelDa: 'Hvordan danske skatteregler påvirker, hvad du faktisk beholder fra investeringer' },
        { id: 'etfs-vs-mutual-funds', label: 'ETF or investeringsforening — which is cheaper for a Danish investor?',        labelDa: 'ETF eller investeringsforening — hvad er billigst for en dansk investor?' },
      ],
      advanced: [
        { id: 'dcf',                    label: 'How to calculate what a business is actually worth',                         labelDa: 'Hvordan du beregner, hvad en virksomhed egentlig er værd' },
        { id: 'intrinsic-value',        label: 'How value investors decide when a stock is cheap enough to buy',             labelDa: 'Hvordan værdiorienterede investorer beslutter, hvornår en aktie er billig nok' },
        { id: 'austrian-capital-theory',label: 'How interest rates shape what gets built — and what gets destroyed',         labelDa: 'Hvordan renter former, hvad der bygges — og hvad der ødelægges' },
        { id: 'damodaran',              label: 'A practical framework for valuing any company',                              labelDa: 'Et praktisk framework til at værdiansætte enhver virksomhed' },
        { id: 'options-hedging',        label: 'How to use options to protect a portfolio you already own',                  labelDa: 'Hvordan du bruger optioner til at beskytte en portefølje du allerede ejer' },
        { id: 'private-equity',         label: 'Why locking up your money for 10 years should earn you more',               labelDa: 'Hvorfor det at binde dine penge i 10 år bør give dig mere' },
        { id: 'global-macro',           label: 'How the biggest investors bet on interest rates, currencies, and economies', labelDa: 'Hvordan de største investorer satser på renter, valutaer og økonomier' },
      ],
    },
  },
  {
    id: 'pension-retirement',
    color: '#14b8a6',
    label: 'Your future self',
    labelDa: 'Din fremtidige økonomi',
    topics: {
      beginner: [
        { id: 'what-is-atp',              label: 'What is ATP and how much will you actually receive?',            labelDa: 'Hvad er ATP, og hvor meget vil du egentlig modtage?' },
        { id: 'folkepension',             label: 'When do you qualify for folkepension — and how much is it?',    labelDa: 'Hvornår er du berettiget til folkepension — og hvor meget er det?' },
        { id: 'workplace-pension',        label: 'How your employer pension works and what it is actually worth', labelDa: 'Hvordan din firmapension fungerer, og hvad den egentlig er værd' },
        { id: 'why-start-early',          label: 'What starting your pension 10 years earlier does to your retirement', labelDa: 'Hvad det gør ved din pension at starte 10 år tidligere' },
        { id: 'state-vs-private-pension', label: 'What the state will give you — and what you need to provide yourself', labelDa: 'Hvad staten giver dig — og hvad du selv skal sørge for' },
      ],
      intermediate: [
        { id: 'pension-tax-rules',       label: 'How to use Danish tax rules to put more into your pension for free',      labelDa: 'Hvordan du bruger danske skatteregler til at indbetale mere til pension gratis' },
        { id: 'ratepension-vs-livrente', label: 'Ratepension or livrente — which payout type suits you?',                  labelDa: 'Ratepension eller livrente — hvilken udbetalingsform passer til dig?' },
        { id: 'aldersopsparing',         label: 'What is aldersopsparing and when should you use it?',                     labelDa: 'Hvad er aldersopsparing, og hvornår bør du bruge den?' },
        { id: 'investment-risk-pension', label: 'Should your pension be in stocks or bonds — and how to decide',           labelDa: 'Skal din pension stå i aktier eller obligationer — og hvordan beslutter du?' },
        { id: 'pension-job-change',      label: 'What happens to your pension when you change jobs?',                      labelDa: 'Hvad sker der med din pension, når du skifter job?' },
        { id: 'self-employed-pension',   label: 'How to build a pension when you are self-employed in Denmark',            labelDa: 'Hvordan du opbygger pension som selvstændig i Danmark' },
      ],
      advanced: [
        { id: 'fire-dk',              label: 'What does retiring at 50 actually require in Denmark?',                       labelDa: 'Hvad kræver det egentlig at gå på pension som 50-årig i Danmark?' },
        { id: 'pension-drawdown',     label: 'In what order should you draw down your savings in retirement?',              labelDa: 'I hvilken rækkefølge skal du trække på din opsparing på pension?' },
        { id: 'pension-tax-opt',      label: 'How to structure your pension to minimise tax across your lifetime',          labelDa: 'Hvordan du strukturerer din pension for at minimere skat over hele livet' },
        { id: 'cross-border-pension', label: 'What happens to your pension if you leave Denmark?',                         labelDa: 'Hvad sker der med din pension, hvis du forlader Danmark?' },
        { id: 'annuity-pricing',      label: 'How insurance companies calculate your monthly pension payout',               labelDa: 'Hvordan forsikringsselskaber beregner din månedlige pensionsudbetaling' },
        { id: 'longevity-risk',       label: 'What if you outlive your savings — and how to plan for it',                  labelDa: 'Hvad hvis du lever længere end din opsparing — og hvordan du planlægger for det' },
      ],
    },
  },
  {
    id: 'housing-real-estate',
    color: '#ec4899',
    label: 'Buying a home',
    labelDa: 'Boligkøb',
    topics: {
      beginner: [
        { id: 'rent-vs-buy',           label: 'Is it better to rent or buy in Denmark right now?',                    labelDa: 'Er det bedre at leje eller købe i Danmark lige nu?' },
        { id: 'what-is-boliglan',      label: 'What is a Danish mortgage and how does it work?',                      labelDa: 'Hvad er et dansk boliglån, og hvordan fungerer det?' },
        { id: 'how-mortgages-work',    label: 'How your monthly mortgage payment is actually calculated',             labelDa: 'Hvordan din månedlige ydelse på boliglånet egentlig beregnes' },
        { id: 'down-payment-basics',   label: 'How much do you actually need saved before buying a home?',            labelDa: 'Hvor meget skal du egentlig have sparet op, inden du køber bolig?' },
        { id: 'ejendomsskat',          label: 'What is ejendomsskat and how much will you pay?',                      labelDa: 'Hvad er ejendomsskat, og hvor meget skal du betale?' },
        { id: 'housing-costs-beyond',  label: 'What does owning a home really cost beyond the mortgage?',            labelDa: 'Hvad koster det egentlig at eje en bolig ud over boliglånet?' },
      ],
      intermediate: [
        { id: 'realkreditlan',            label: 'How the Danish realkreditlån system works — and why it is unique',   labelDa: 'Hvordan det danske realkreditsystem fungerer — og hvorfor det er unikt' },
        { id: 'f1-vs-f5-vs-fixed',       label: 'F1, F5, or fixed rate — which mortgage type suits your situation?', labelDa: 'F1, F5 eller fastforrentet — hvilken lånetype passer til din situation?' },
        { id: 'ltv-limits',              label: 'How much can you borrow relative to what your home is worth?',       labelDa: 'Hvor meget kan du låne i forhold til, hvad din bolig er værd?' },
        { id: 'amortisation-vs-interest',label: 'Should you pay down your mortgage or invest the difference?',        labelDa: 'Skal du afdrage på dit lån eller investere differencen?' },
        { id: 'housing-market-cycles',   label: 'How to read the Danish property market cycle',                       labelDa: 'Hvordan du aflæser det danske boligmarkedscyklus' },
        { id: 'boligkobsaftale',         label: 'What happens step by step when you buy a home in Denmark?',          labelDa: 'Hvad sker der trin for trin, når du køber en bolig i Danmark?' },
      ],
      advanced: [
        { id: 'rental-property-investment',label: 'Does buying a rental property actually make financial sense?',      labelDa: 'Giver det egentlig finansiel mening at købe en udlejningsejendom?' },
        { id: 'cap-rate',                  label: 'How to calculate the real return on an investment property',        labelDa: 'Hvordan du beregner det reelle afkast på en investeringsejendom' },
        { id: 'leverage-real-estate',      label: 'How borrowing amplifies both gains and losses in property',        labelDa: 'Hvordan låntagning forstærker både gevinster og tab i fast ejendom' },
        { id: 'real-estate-portfolio',     label: 'How much of your wealth should be in property?',                   labelDa: 'Hvor stor en del af din formue bør stå i fast ejendom?' },
        { id: 'property-gains-tax',        label: 'What tax do you pay when you sell your home in Denmark?',          labelDa: 'Hvilken skat betaler du, når du sælger din bolig i Danmark?' },
        { id: 'refinancing-omlaegning',    label: 'When and how to refinance your mortgage to save money',            labelDa: 'Hvornår og hvordan du omlægger dit lån for at spare penge' },
      ],
    },
  },
  {
    id: 'protection-insurance',
    color: '#eab308',
    label: 'Protecting what you have',
    labelDa: 'Beskyt det du har',
    topics: {
      beginner: [
        { id: 'why-insurance-exists',    label: 'What is insurance actually for — and when do you need it?',          labelDa: 'Hvad er forsikring egentlig til — og hvornår har du brug for det?' },
        { id: 'health-insurance-dk',     label: 'What does the Danish healthcare system cover — and what does it not?',labelDa: 'Hvad dækker det danske sundhedssystem — og hvad dækker det ikke?' },
        { id: 'life-insurance-basics',   label: 'Do you need life insurance — and how much?',                         labelDa: 'Har du brug for livsforsikring — og hvor meget?' },
        { id: 'a-kasse',                 label: 'What does an a-kasse give you and how do you choose one?',           labelDa: 'Hvad giver en a-kasse dig, og hvordan vælger du den rigtige?' },
        { id: 'contents-home-insurance', label: 'What should your home insurance actually cover?',                    labelDa: 'Hvad bør din indboforsikring egentlig dække?' },
      ],
      intermediate: [
        { id: 'critical-illness',     label: 'What happens financially if you get seriously ill?',                          labelDa: 'Hvad sker der finansielt, hvis du bliver alvorligt syg?' },
        { id: 'lonsikring',           label: 'How much of your salary would you actually receive if you could not work?',    labelDa: 'Hvor meget af din løn ville du egentlig modtage, hvis du ikke kunne arbejde?' },
        { id: 'insurance-life-stage', label: 'What insurance do you need at 25 vs 45 vs 65?',                              labelDa: 'Hvilken forsikring har du brug for som 25-årig vs 45-årig vs 65-årig?' },
        { id: 'excess-premium',       label: 'Should you choose a high or low excess on your insurance?',                   labelDa: 'Skal du vælge høj eller lav selvrisiko på din forsikring?' },
        { id: 'group-vs-individual',  label: "Is your employer's group insurance enough — or do you need your own?",        labelDa: 'Er din arbejdsgivers gruppeforsikring nok — eller skal du have din egen?' },
        { id: 'beneficiary',          label: 'Who receives your life insurance payout — and have you checked recently?',    labelDa: 'Hvem modtager din livsforsikringsudbetaling — og har du tjekket det for nylig?' },
      ],
      advanced: [
        { id: 'insurance-financial-plan', label: 'How much of your income should go to insurance premiums?',               labelDa: 'Hvor stor en del af din indkomst bør gå til forsikringspræmier?' },
        { id: 'self-insurance-threshold', label: 'At what net worth can you stop buying some types of insurance?',          labelDa: 'Ved hvilken formue kan du stoppe med at købe visse forsikringstyper?' },
        { id: 'business-owner-insurance', label: 'What insurance does a company owner need that employees do not?',         labelDa: 'Hvilken forsikring har en virksomhedsejer brug for, som lønmodtagere ikke har?' },
        { id: 'cross-border-coverage',    label: 'Does your insurance still cover you if you work abroad?',                 labelDa: 'Dækker din forsikring dig stadig, hvis du arbejder i udlandet?' },
        { id: 'disability-probability',   label: 'What is the real probability you will become disabled before retirement?',labelDa: 'Hvad er den reelle sandsynlighed for, at du bliver invalid inden pension?' },
        { id: 'estate-planning',          label: 'What happens to your money and home when you die — without a will?',      labelDa: 'Hvad sker der med dine penge og din bolig, når du dør — uden et testamente?' },
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
  { id: 'beginner',     en: 'Getting started', da: 'Kom i gang' },
  { id: 'intermediate', en: 'Going deeper',    da: 'Gå dybere' },
  { id: 'advanced',     en: 'Mastering it',    da: 'Mestre det' },
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

  const LEVEL_BADGE_LABELS: Record<string, { en: string; da: string }> = {
    basics:       { en: 'Basics',       da: 'Begynder' },
    intermediate: { en: 'Intermediate', da: 'Øvet' },
    advanced:     { en: 'Advanced',     da: 'Avanceret' },
  }

  return (
    <div className="max-w-3xl">

      {/* ── Practical Learning ───────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">
            {da ? 'Praktisk læring' : 'Practical learning'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {da
              ? 'Svar på de spørgsmål, der faktisk betyder noget for din økonomi'
              : 'Answers to the questions that actually matter for your finances'}
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

        {/* Topic grid */}
        <div className="space-y-10">
          {CURRICULUM.map((cat) => {
            const topics     = cat.topics[level]
            const isRelevant = relevantCategories.has(cat.id)

            return (
              <div key={cat.id}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <h2 className="text-base font-semibold">
                    {da ? cat.labelDa : cat.label}
                    {isRelevant && <span className="ml-1.5 text-primary">★</span>}
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  {topics.map((topic) => {
                    const label = da ? topic.labelDa : topic.label
                    const done  = topic.href ? completedIds.has(topic.id) : false

                    if (topic.href) {
                      return (
                        <Link
                          key={topic.id}
                          href={topic.href}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                            done
                              ? 'bg-primary/10 border-primary/20 text-primary'
                              : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
                          }`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: done ? 'currentColor' : cat.color }}
                          />
                          {done && (
                            <svg className="w-3.5 h-3.5 flex-shrink-0 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {label}
                        </Link>
                      )
                    }

                    return (
                      <div
                        key={topic.id}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm border border-border bg-muted/30 text-muted-foreground cursor-default select-none"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40"
                          style={{ backgroundColor: cat.color }}
                        />
                        {label}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Courses ──────────────────────────────────────────────────────────── */}
      <div className="mb-12 pt-8 border-t">
        <h2 className="text-lg font-semibold mb-1">
          {da ? 'Kurser' : 'Courses'}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {da
            ? '7 strukturerede kurser med videoer, podcasts og quizzer'
            : '7 structured courses with videos, podcasts, and quizzes'}
        </p>

        {/* Goal context banner */}
        {goalsQuery.data && goalsQuery.data.length > 0 && relevantCategories.size > 0 && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-muted-foreground">
            <span className="text-foreground font-medium">
              {da ? 'Anbefalet til dine mål · ' : 'Recommended for your goals · '}
            </span>
            {da
              ? 'Kurserne markeret med ★ er mest relevante for det, du arbejder hen imod.'
              : "Courses marked ★ are the most relevant to what you're working towards."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...COURSES]
            .sort((a, b) => {
              const aRel = relevantCategories.has(a.slug) ? 1 : 0
              const bRel = relevantCategories.has(b.slug) ? 1 : 0
              return bRel - aRel
            })
            .map((course) => {
            const courseTitle = da ? course.titleDa : course.titleEn
            const courseDesc  = da ? course.descriptionDa : course.descriptionEn
            const isRelevant  = relevantCategories.has(course.slug)

            const allIds = course.levels.flatMap((l) =>
              l.modules.flatMap((m) => [
                ...m.videos.map((_, i) => buildContentId(course.slug, l.slug, m.slug, 'video', i)),
                buildContentId(course.slug, l.slug, m.slug, 'podcast', 0),
                buildContentId(course.slug, l.slug, m.slug, 'quiz', 0),
              ]),
            )
            const doneCount  = allIds.filter((id) => completedIds.has(id)).length
            const totalCount = allIds.length
            const pct        = totalCount > 0 ? (doneCount / totalCount) * 100 : 0
            const started    = doneCount > 0

            return (
              <Link
                key={course.slug}
                href={`/learning/${course.slug}`}
                className="flex flex-col gap-3 rounded-xl border p-4 transition-all hover:shadow-sm"
                style={{
                  borderColor: isRelevant ? course.color : '#EDE0D4',
                  background: '#fff',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                      style={{ background: course.color }}
                    />
                    <p className="font-serif text-base leading-snug" style={{ color: '#1E0F00' }}>
                      {courseTitle}
                    </p>
                  </div>
                  {isRelevant && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: course.color + '20', color: course.color }}
                    >
                      ★ {da ? 'Anbefalet' : 'Recommended'}
                    </span>
                  )}
                </div>

                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#9B8B7E' }}>
                  {courseDesc}
                </p>

                <div className="flex gap-1.5 flex-wrap">
                  {course.levels.map((l) => {
                    const badge = LEVEL_BADGE_LABELS[l.slug] ?? { en: l.slug, da: l.slug }
                    return (
                      <span
                        key={l.slug}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#EDE0D4', color: '#6B5B4E' }}
                      >
                        {da ? badge.da : badge.en}
                      </span>
                    )
                  })}
                </div>

                <div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: '#EDE0D4' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: pct === 100 ? '#5B8A6B' : course.color }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs" style={{ color: '#9B8B7E' }}>
                      {doneCount}/{totalCount} {da ? 'gennemført' : 'completed'}
                    </p>
                    <span className="text-xs font-medium" style={{ color: course.color }}>
                      {started ? (da ? 'Fortsæt →' : 'Continue →') : (da ? 'Start →' : 'Start →')}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Deep-dive lessons ────────────────────────────────────────────────── */}
      <div className="pt-6 border-t">
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
