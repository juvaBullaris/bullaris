export interface AuditAnswers {
  size: string | null
  sector: string | null
  benefits: string | null
  stressFrequency: number | null
  priority: string | null
}

export interface ScoredResult {
  riskTier: 'Low' | 'Medium' | 'High' | 'Acute'
  riskScore: number
  stressEstimate: string
  primaryMetricAffected: string
  benchmarkNote: string
  plainReadout: string
  oneAction: string
  costRangeLow: number
  costRangeHigh: number
  sectorName: string
  headcountMidpoint: number
  actions: Array<{ title: string; description: string }>
}

export type Screen = 'questions' | 'calculating' | 'result' | 'bridge'

export interface AuditState {
  screen: Screen
  currentQuestion: number
  direction: 1 | -1
  answers: AuditAnswers
  scoredResult: ScoredResult | null
  emailCaptured: boolean
  firstName: string | null
  sessionId: string
  pathChosen: 'employee-audit' | 'meeting' | null
}

export interface QuestionOption {
  label: string
  value: string | number
}

export interface Question {
  question: string
  options: QuestionOption[]
  hasSectorNote?: boolean
}

export type AuditAction =
  | { type: 'ANSWER'; value: string | number }
  | { type: 'BACK' }
  | { type: 'SET_RESULT'; result: ScoredResult }
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'EMAIL_SUBMITTED'; firstName: string }
  | { type: 'CHOOSE_PATH'; path: 'employee-audit' | 'meeting' }

export const QUESTIONS: Question[] = [
  {
    question: 'How many people work at your company?',
    options: [
      { label: '10–49 employees', value: '10-49' },
      { label: '50–199 employees', value: '50-199' },
      { label: '200–499 employees', value: '200-499' },
      { label: '500+ employees', value: '500+' },
    ],
  },
  {
    question: 'Which sector are you in?',
    options: [
      { label: 'Retail & e-commerce', value: 'retail' },
      { label: 'Tech & software', value: 'tech' },
      { label: 'Construction & trades', value: 'construction' },
      { label: 'Healthcare & social', value: 'healthcare' },
    ],
    hasSectorNote: true,
  },
  {
    question:
      'Does your company currently offer any financial wellbeing support to employees?',
    options: [
      { label: 'Yes, we have a structured programme', value: 'yes' },
      { label: 'We offer some ad-hoc support', value: 'partial' },
      { label: 'Not currently', value: 'no' },
      { label: "I'm not sure what we offer", value: 'unsure' },
    ],
  },
  {
    question:
      'How often do financial pressures come up in conversations with employees or managers?',
    options: [
      { label: "Rarely — it's not something we hear", value: 1 },
      { label: 'Occasionally — maybe a few times a year', value: 2 },
      { label: 'Regularly — it comes up monthly', value: 3 },
      { label: 'Often — it\'s a recurring theme', value: 4 },
    ],
  },
  {
    question: 'Which metric are you most focused on improving this year?',
    options: [
      { label: 'Employee retention', value: 'retention' },
      { label: 'eNPS or engagement', value: 'enps' },
      { label: 'Absenteeism reduction', value: 'absenteeism' },
      { label: 'Benefits competitiveness', value: 'benefits' },
    ],
  },
]
