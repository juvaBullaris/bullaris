export type WebinarCategory =
  | 'investments'
  | 'pension'
  | 'real-estate'
  | 'tax'
  | 'savings'

export interface Webinar {
  id: string
  icon: string
  date: string
  duration: string
  speaker: string
  goalTypes: string[]
  category: WebinarCategory
  en: { title: string; description: string }
  da: { title: string; description: string }
}

export const WEBINARS: Webinar[] = [
  // ── Tax ──────────────────────────────────────────────────────────────────────
  {
    id: 'webinar-tax-2026',
    icon: '📊',
    date: '2026-06-16T17:00:00',
    duration: '45 min',
    speaker: 'Bullaris Tax Team',
    category: 'tax',
    goalTypes: ['debt_payoff', 'investment', 'financial_independence', 'passive_income', 'pension_boost', 'side_income'],
    en: {
      title: '2026 Tax Changes — What Every Employee Needs to Know',
      description: 'Walk through the key rule changes for 2026 and what they mean for your take-home pay, deductions, and year-end tax return.',
    },
    da: {
      title: '2026 Skatteændringer — hvad enhver medarbejder skal vide',
      description: 'Gennemgang af de vigtigste regelændringer for 2026 og hvad de betyder for din nettoløn, fradrag og årsopgørelse.',
    },
  },
  {
    id: 'webinar-payslip-deep',
    icon: '🧾',
    date: '2026-07-08T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    category: 'tax',
    goalTypes: [],
    en: {
      title: 'Your Payslip Decoded: Every Line Explained',
      description: 'AM-bidrag, bundskat, kommuneskat, personfradrag — a live walkthrough of a real Danish payslip with full Q&A.',
    },
    da: {
      title: 'Din lønseddel forklaret: Hver linje gennemgået',
      description: 'AM-bidrag, bundskat, kommuneskat, personfradrag — en live gennemgang af en ægte dansk lønseddel med spørgsmål og svar.',
    },
  },
  {
    id: 'webinar-fradrag-guide',
    icon: '🗂️',
    date: '2026-09-15T17:00:00',
    duration: '45 min',
    speaker: 'Bullaris Tax Team',
    category: 'tax',
    goalTypes: ['debt_payoff', 'investment'],
    en: {
      title: 'Fradrag You Are Probably Missing',
      description: 'Transport, union dues, tool costs, home office — a practical guide to legal deductions that most Danish employees overlook.',
    },
    da: {
      title: 'Fradrag du sandsynligvis overser',
      description: 'Transport, fagforeningskontingent, arbejdsredskaber, hjemmekontor — en praktisk guide til lovlige fradrag de fleste overser.',
    },
  },

  // ── Investments ───────────────────────────────────────────────────────────────
  {
    id: 'webinar-fire-dk',
    icon: '🌅',
    date: '2026-06-24T17:00:00',
    duration: '60 min',
    speaker: 'Financial Independence Network DK',
    category: 'investments',
    goalTypes: ['financial_independence', 'early_retirement', 'passive_income', 'investment'],
    en: {
      title: 'FIRE in Denmark: The Practical Roadmap',
      description: 'How Danes are building financial independence using index funds, pension contributions, and the Danish tax system — with real DKK numbers.',
    },
    da: {
      title: 'FIRE i Danmark: Det praktiske vejkort',
      description: 'Hvordan danskere opbygger finansiel frihed med indeksfonde, pensionsbidrag og det danske skattesystem — med rigtige DKK-tal.',
    },
  },
  {
    id: 'webinar-aktiesparekonto',
    icon: '📈',
    date: '2026-07-14T18:00:00',
    duration: '45 min',
    speaker: 'Nordnet',
    category: 'investments',
    goalTypes: ['investment', 'financial_independence', 'passive_income', 'early_retirement', 'children_savings'],
    en: {
      title: 'Aktiesparekonto 2026: Maximize Your Tax-Free Returns',
      description: 'The aktiesparekonto lets you invest up to 135,900 kr with a flat 17% tax rate. Learn exactly what to put in it and what to keep outside.',
    },
    da: {
      title: 'Aktiesparekonto 2026: Maksimer dit skattefrie afkast',
      description: 'Aktiesparekontoen giver dig mulighed for at investere op til 135.900 kr til en flad sats på 17%. Lær præcis hvad du skal lægge ind og hvad du holder udenfor.',
    },
  },
  {
    id: 'webinar-etf-selection',
    icon: '🌍',
    date: '2026-08-11T17:00:00',
    duration: '45 min',
    speaker: 'Nordnet',
    category: 'investments',
    goalTypes: ['investment', 'financial_independence', 'passive_income'],
    en: {
      title: 'Choosing ETFs as a Danish Investor: Lagerbeskatning vs. Realisationsbeskatning',
      description: 'Not all funds are taxed the same way. Learn which ETFs qualify for realisationsbeskatning and why it matters for long-term compounding.',
    },
    da: {
      title: 'Valg af ETF som dansk investor: Lagerbeskatning vs. realisationsbeskatning',
      description: 'Ikke alle fonde beskattes ens. Lær hvilke ETF\'er der er berettiget til realisationsbeskatning og hvorfor det betyder noget for din langsigtede afkast.',
    },
  },
  {
    id: 'webinar-side-income',
    icon: '💼',
    date: '2026-08-25T17:00:00',
    duration: '45 min',
    speaker: 'e-conomic + Bullaris',
    category: 'investments',
    goalTypes: ['side_income', 'financial_independence', 'passive_income', 'early_retirement'],
    en: {
      title: 'Building a Side Income in Denmark: Tax, Registration & Growth',
      description: 'Freelancing, consulting, rental income — how to set it up legally, what you pay in tax, and how to grow it without burning out.',
    },
    da: {
      title: 'Biindtægt i Danmark: Skat, registrering og vækst',
      description: 'Freelancing, konsulentvirksomhed, lejeindtægt — hvordan du sætter det op lovligt, hvad du betaler i skat, og hvordan du vokser det.',
    },
  },

  // ── Pension ───────────────────────────────────────────────────────────────────
  {
    id: 'webinar-pension-boost',
    icon: '🏦',
    date: '2026-06-30T17:00:00',
    duration: '45 min',
    speaker: 'PensionDanmark',
    category: 'pension',
    goalTypes: ['pension_boost', 'early_retirement', 'generational_wealth', 'financial_independence'],
    en: {
      title: 'Boost Your Pension: Extra Contributions That Compound',
      description: 'Every extra krone you put into pension before hitting topskat saves you 52% in tax. See exactly how much you can gain with a simple contribution increase.',
    },
    da: {
      title: 'Boost din pension: Ekstra bidrag der giver renters rente',
      description: 'Hver ekstra krone du lægger i pension inden topskat sparer dig 52% i skat. Se præcis hvad du vinder med en simpel forhøjelse af bidraget.',
    },
  },
  {
    id: 'webinar-pension-stages',
    icon: '📅',
    date: '2026-07-22T17:00:00',
    duration: '45 min',
    speaker: 'PensionDanmark',
    category: 'pension',
    goalTypes: ['pension_boost', 'early_retirement', 'financial_independence'],
    en: {
      title: 'Your Pension at 30, 40, and 50: What to Do at Each Stage',
      description: 'The decisions you make in your 30s cost ten times more than the same decisions in your 50s. A practical guide to pension strategy by life stage.',
    },
    da: {
      title: 'Din pension ved 30, 40 og 50: Hvad du skal gøre på hvert trin',
      description: 'De beslutninger du træffer i 30\'erne koster ti gange mere end de samme beslutninger i 50\'erne. En praktisk guide til pensionsstrategi efter livsfase.',
    },
  },
  {
    id: 'webinar-atp-folkepension',
    icon: '🇩🇰',
    date: '2026-09-08T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    category: 'pension',
    goalTypes: ['pension_boost'],
    en: {
      title: 'ATP & Folkepension: What You Are Actually Entitled To',
      description: 'Most Danes have no idea what their ATP balance means in monthly kroner at retirement. We run the actual numbers and show what the state floor looks like.',
    },
    da: {
      title: 'ATP og folkepension: Hvad du rent faktisk er berettiget til',
      description: 'De fleste danskere aner ikke hvad deres ATP-saldo betyder i månedlige kroner ved pension. Vi kører de rigtige tal og viser hvad den statslige bund ser ud som.',
    },
  },
  {
    id: 'webinar-children-savings',
    icon: '👶',
    date: '2026-10-06T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    category: 'pension',
    goalTypes: ['children_savings', 'generational_wealth'],
    en: {
      title: "Children's Savings in Denmark: Børneopsparing & Beyond",
      description: 'Børneopsparing, junior investment accounts, and how to think about transferring wealth to the next generation within Danish tax law.',
    },
    da: {
      title: 'Børneopsparing i Danmark: Børneopsparing og mere',
      description: 'Børneopsparing, juniorinvesteringskonti og hvordan man tænker på formueoverførsel til næste generation inden for dansk skattelovgivning.',
    },
  },

  // ── Real estate ───────────────────────────────────────────────────────────────
  {
    id: 'webinar-house-2026',
    icon: '🏠',
    date: '2026-07-01T17:00:00',
    duration: '45 min',
    speaker: 'Nykredit Advisors',
    category: 'real-estate',
    goalTypes: ['house_deposit', 'home_renovation', 'generational_wealth'],
    en: {
      title: 'Buying Your First Home in Denmark in 2026',
      description: 'Down payment rules, realkreditlån vs. bank loan, new property tax from 2024, and the step-by-step process of a Danish property purchase.',
    },
    da: {
      title: 'Køb dit første hjem i Danmark i 2026',
      description: 'Udbetaling, realkreditlån vs. banklån, ny ejendomsskat fra 2024 og den trin-for-trin-proces ved et dansk boligkøb.',
    },
  },
  {
    id: 'webinar-realkreditlan',
    icon: '📋',
    date: '2026-08-04T17:00:00',
    duration: '45 min',
    speaker: 'Nykredit Advisors',
    category: 'real-estate',
    goalTypes: ['house_deposit', 'home_renovation'],
    en: {
      title: 'Realkreditlån Explained: F1, F3, F5 or Fixed — How to Choose',
      description: 'The Danish mortgage system is unique in the world. Learn how callable bonds work, how to refinance when rates change, and how to pick the right loan type.',
    },
    da: {
      title: 'Realkreditlån forklaret: F1, F3, F5 eller fast — hvordan vælger du',
      description: 'Det danske realkreditsystem er unikt i verden. Lær hvordan konverterbare obligationer fungerer, hvordan du omlægger når renterne ændrer sig, og hvordan du vælger den rigtige låntype.',
    },
  },
  {
    id: 'webinar-rent-vs-buy',
    icon: '⚖️',
    date: '2026-09-22T17:00:00',
    duration: '45 min',
    speaker: 'Bullaris',
    category: 'real-estate',
    goalTypes: ['house_deposit'],
    en: {
      title: 'Rent vs. Buy in 2026: The Honest Calculation',
      description: 'After transaction costs, property tax, maintenance, and opportunity cost of the down payment — is buying actually better? We run the full numbers.',
    },
    da: {
      title: 'Leje vs. køb i 2026: Den ærlige beregning',
      description: 'Når transaktionsomkostninger, ejendomsskat, vedligeholdelse og alternativomkostning af udbetalingen tages i betragtning — er køb faktisk bedre? Vi kører de fulde tal.',
    },
  },
  {
    id: 'webinar-investment-property',
    icon: '🏢',
    date: '2026-10-20T17:00:00',
    duration: '60 min',
    speaker: 'Nykredit Advisors',
    category: 'real-estate',
    goalTypes: ['passive_income', 'generational_wealth', 'investment'],
    en: {
      title: 'Investment Property in Denmark: Does the Maths Work?',
      description: 'Rental yield, void risk, maintenance costs, and tax on rental income. An honest look at whether a buy-to-let property makes financial sense in 2026.',
    },
    da: {
      title: 'Investeringsejendom i Danmark: Holder regnestykket?',
      description: 'Lejeafkast, tomgangsrisiko, vedligeholdelsesomkostninger og skat på lejeindtægt. Et ærligt blik på om en udlejningsejendom giver finansiel mening i 2026.',
    },
  },

  // ── Savings & debt ────────────────────────────────────────────────────────────
  {
    id: 'webinar-debt-free',
    icon: '🔗',
    date: '2026-06-17T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    category: 'savings',
    goalTypes: ['debt_payoff'],
    en: {
      title: 'Debt-Free Fast: Avalanche vs. Snowball in Danish Context',
      description: 'SU-lån, consumer loans, and mortgage — how to structure your debt payoff strategy and what order actually saves the most interest.',
    },
    da: {
      title: 'Gældfri hurtigt: Lavine vs. snebold i dansk kontekst',
      description: 'SU-lån, forbrugslån og realkreditlån — hvordan du strukturerer din gældsafviklingsstrategi og hvilken rækkefølge der faktisk sparer mest i renter.',
    },
  },
  {
    id: 'webinar-emergency-fund',
    icon: '🛡️',
    date: '2026-07-28T17:00:00',
    duration: '30 min',
    speaker: 'Bullaris',
    category: 'savings',
    goalTypes: ['emergency_fund'],
    en: {
      title: 'Emergency Fund: How Much, Where, and When to Use It',
      description: '3 months or 6 months? Which Danish savings account pays the best rate right now? And how do you rebuild it after drawing it down?',
    },
    da: {
      title: 'Nødreserve: Hvor meget, hvor og hvornår bruger du den',
      description: '3 måneder eller 6 måneder? Hvilken dansk opsparingskonto giver den bedste rente nu? Og hvordan genopbygger du den efter at have brugt den?',
    },
  },
]
