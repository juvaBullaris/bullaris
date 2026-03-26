import Anthropic from '@anthropic-ai/sdk'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { db } from '@bullaris/db'

const client = new Anthropic()

const SYSTEM_PROMPT = `You are Bullaris's financial clarity assistant for Danish employees.
You help employees understand their salary, taxes, pension, and personal finances.
You explain concepts clearly in plain language (Danish or English based on user preference).

IMPORTANT rules:
- You provide financial education and clarity — not regulated investment advice
- Never recommend specific funds, stocks, or investment products
- For pension advice, direct users to their pension provider or a licensed advisor
- Always ground answers in the employee's stated financial situation when available
- When unsure, say so — never fabricate Danish tax rates or rules
- Keep responses concise — max 3 paragraphs unless complexity requires more`

async function getEmployeeSnapshot(employeeId: string): Promise<string> {
  try {
    const profile = await db.profile.findUnique({ where: { id: employeeId } })
    const goals = await db.goal.findMany({ where: { employeeId }, take: 5 })
    return `Employee context:
- Gross salary: ${profile?.gross_dkk ?? 'not provided'} DKK/month
- Age: ${profile?.age ?? 'unknown'}
- Municipality: ${profile?.municipality ?? 'unknown'}
- Active goals: ${goals.map((g) => g.type).join(', ') || 'none'}`
  } catch {
    return 'Employee context: not available'
  }
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { messages } = await req.json()

  // Trim to last 10 messages for cost control
  const trimmedMessages = (messages as Array<{ role: string; content: string }>).slice(-10)

  // Check daily limit (20 messages/day)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sessionCount = await db.aiChatSession.count({
    where: {
      employeeId: user.id,
      createdAt: { gte: today },
    },
  })

  if (sessionCount >= 20) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'DAILY_LIMIT',
          message:
            'Daily message limit reached. Visit the Learning Hub for more resources.',
        },
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const snapshot = await getEmployeeSnapshot(user.id)

  // Log session — token counts updated post-response in a real implementation
  await db.aiChatSession.create({
    data: {
      employeeId: user.id,
      inputTokens: 0,
      outputTokens: 0,
    },
  })

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT + '\n\n' + snapshot,
    messages: trimmedMessages as Anthropic.MessageParam[],
  })

  return new Response(stream.toReadableStream())
}
