/**
 * Seed script for demo data with Danish personas.
 * Run: npm run db:seed
 *
 * Creates:
 * - 1 demo employer (Bygmester A/S)
 * - 5 employees with varied personas
 * - Profiles with realistic Danish financial situations
 * - Sample goals and learning progress
 */

import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const DEMO_EMPLOYER = {
  name: 'Bygmester A/S',
  slug: 'bygmester-as',
  seatsPurchased: 20,
}

// Danish personas with realistic financial profiles
const DEMO_EMPLOYEES = [
  {
    supabaseUserId: 'demo-user-1',
    role: 'employee' as const,
    profile: {
      displayName: 'Mette Kristiansen',
      age: 34,
      municipality: 'København',
      employmentType: 'full_time',
      gross_dkk: 52000,
      tax_card_type: 'A',
    },
    goals: [
      { type: 'emergency_fund', target_dkk: 100000, progress_dkk: 42000 },
      { type: 'house_deposit', target_dkk: 300000, progress_dkk: 85000 },
    ],
  },
  {
    supabaseUserId: 'demo-user-2',
    role: 'employee' as const,
    profile: {
      displayName: 'Lars Henriksen',
      age: 42,
      municipality: 'Aarhus',
      employmentType: 'full_time',
      gross_dkk: 68000,
      tax_card_type: 'A',
    },
    goals: [
      { type: 'pension_boost', target_dkk: 500000, progress_dkk: 210000 },
      { type: 'debt_payoff', target_dkk: 120000, progress_dkk: 55000 },
    ],
  },
  {
    supabaseUserId: 'demo-user-3',
    role: 'employee' as const,
    profile: {
      displayName: 'Sofie Andersen',
      age: 27,
      municipality: 'Odense',
      employmentType: 'full_time',
      gross_dkk: 38000,
      tax_card_type: 'A',
    },
    goals: [
      { type: 'emergency_fund', target_dkk: 60000, progress_dkk: 12000 },
    ],
  },
  {
    supabaseUserId: 'demo-user-4',
    role: 'employee' as const,
    profile: {
      displayName: 'Mikkel Nielsen',
      age: 55,
      municipality: 'Aalborg',
      employmentType: 'full_time',
      gross_dkk: 75000,
      tax_card_type: 'A',
    },
    goals: [
      { type: 'pension_boost', target_dkk: 1000000, progress_dkk: 620000 },
      { type: 'vacation', target_dkk: 50000, progress_dkk: 32000 },
    ],
  },
  {
    supabaseUserId: 'demo-user-5',
    role: 'hr_admin' as const,
    profile: {
      displayName: 'Anna Thorsen',
      age: 38,
      municipality: 'Frederiksberg',
      employmentType: 'full_time',
      gross_dkk: 62000,
      tax_card_type: 'A',
    },
    goals: [],
  },
]

const DEMO_LEARNING_CONTENT = [
  {
    sanityId: 'sanity-1',
    type: 'article',
    module: 'payslip',
    title: 'Forstå din lønseddel på 5 minutter',
    description: 'En komplet guide til AM-bidrag, A-skat og hvad du faktisk får udbetalt.',
    publishedAt: new Date('2024-01-15'),
  },
  {
    sanityId: 'sanity-2',
    type: 'video',
    module: 'tax_basics',
    title: 'Sådan fungerer dansk skat',
    description: 'Video-forklaring af bundskat, topskat og personfradrag.',
    publishedAt: new Date('2024-02-01'),
  },
  {
    sanityId: 'sanity-3',
    type: 'article',
    module: 'pension',
    title: 'Pension for begyndere',
    description: 'Hvad er forskellen på arbejdsgiver- og privat pension? Vi forklarer det klart.',
    publishedAt: new Date('2024-02-15'),
  },
  {
    sanityId: 'sanity-4',
    type: 'article',
    module: 'tax_basics',
    title: 'Befordringsfradrag: Sådan beregner du det',
    description: 'Step-by-step guide til at beregne dit pendlerfradrag korrekt.',
    publishedAt: new Date('2024-03-01'),
  },
  {
    sanityId: 'sanity-5',
    type: 'video',
    module: 'budgeting',
    title: '50/30/20-reglen på dansk',
    description: 'Tilpas den populære budgetregel til dansk skatteniveau og leveomkostninger.',
    publishedAt: new Date('2024-03-15'),
  },
]

const DEMO_NUDGE_RULES = [
  {
    code: 'PAYSLIP_REMINDER',
    triggerCondition: JSON.stringify({ type: 'no_payslip_30_days' }),
    templateId: 'payslip_reminder',
    cooldownDays: 30,
  },
  {
    code: 'GOAL_STALLED',
    triggerCondition: JSON.stringify({ type: 'goal_no_update_60_days' }),
    templateId: 'goal_progress',
    cooldownDays: 60,
  },
  {
    code: 'TAX_DEDUCTION_TIP',
    triggerCondition: JSON.stringify({ type: 'tax_planner_unused' }),
    templateId: 'tax_deduction_tip',
    cooldownDays: 90,
  },
  {
    code: 'LEARNING_SUGGESTION',
    triggerCondition: JSON.stringify({ type: 'weekly_content_available' }),
    templateId: 'learning_suggestion',
    cooldownDays: 7,
  },
]

async function main() {
  console.log('Seeding Bullaris demo data...')

  // Clean existing demo data
  await db.nudgeRule.deleteMany({})
  await db.learningContent.deleteMany({})
  await db.employer.deleteMany({ where: { slug: DEMO_EMPLOYER.slug } })

  // Create employer
  const employer = await db.employer.create({ data: DEMO_EMPLOYER })
  console.log(`Created employer: ${employer.name} (${employer.id})`)

  // Create learning content
  const content = await db.learningContent.createMany({ data: DEMO_LEARNING_CONTENT })
  console.log(`Created ${content.count} learning content items`)

  const allContent = await db.learningContent.findMany()

  // Create nudge rules
  await db.nudgeRule.createMany({ data: DEMO_NUDGE_RULES })
  console.log(`Created ${DEMO_NUDGE_RULES.length} nudge rules`)

  // Create employees
  for (const empData of DEMO_EMPLOYEES) {
    const { goals, profile, ...employeeFields } = empData

    const employee = await db.employee.create({
      data: {
        ...employeeFields,
        employerId: employer.id,
        onboardedAt: new Date(),
        profile: { create: profile },
      },
    })

    // Create goals
    for (const goal of goals) {
      await db.goal.create({
        data: {
          ...goal,
          employeeId: employee.id,
          target_dkk: goal.target_dkk,
          progress_dkk: goal.progress_dkk,
        },
      })
    }

    // Create sample payslip inputs (last 3 months)
    const now = new Date()
    for (let i = 0; i < 3; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      await db.payslipInput.upsert({
        where: { employeeId_period: { employeeId: employee.id, period } },
        create: {
          employeeId: employee.id,
          gross_dkk: profile.gross_dkk,
          taxCardType: profile.tax_card_type,
          period,
        },
        update: {},
      })
    }

    // Create consent events (simulate first-use consents)
    if (empData.role === 'employee') {
      for (const module of ['payslip_module', 'tax_planner', 'ai_chat'] as const) {
        await db.consentEvent.create({
          data: {
            employeeId: employee.id,
            source: module,
            version: '1.0',
            action: 'grant',
          },
        })
      }
    }

    // Create some learning progress
    if (empData.role === 'employee' && allContent.length > 0) {
      await db.learningProgress.createMany({
        data: allContent.slice(0, 2).map((c) => ({
          employeeId: employee.id,
          contentId: c.id,
          completedAt: new Date(),
        })),
        skipDuplicates: true,
      })
    }

    console.log(`Created employee: ${profile.displayName} (${employee.id})`)
  }

  console.log('\nSeed complete!')
  console.log(`  Employer: ${employer.name}`)
  console.log(`  Employees: ${DEMO_EMPLOYEES.length}`)
  console.log(`  Learning content: ${DEMO_LEARNING_CONTENT.length} items`)
  console.log(`  Nudge rules: ${DEMO_NUDGE_RULES.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
