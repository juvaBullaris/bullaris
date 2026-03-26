# AI Chat Integration — Bullaris

Employee-facing finance chat using Claude API. Streaming responses. Employee can ask questions and optionally paste payslip text. No file uploads in V1.

## Model + Config

```typescript
model: 'claude-sonnet-4-6'
max_tokens: 1024        // Hard cap — cost control
stream: true
```

## System Prompt

```
You are Bullaris's financial clarity assistant for Danish employees.
You help employees understand their salary, taxes, pension, and personal finances.
You explain concepts clearly in plain language (Danish or English based on user preference).

IMPORTANT rules:
- You provide financial education and clarity — not regulated investment advice
- Never recommend specific funds, stocks, or investment products
- For pension advice, direct users to their pension provider or a licensed advisor
- Always ground answers in the employee's stated financial situation when available
- When unsure, say so — never fabricate Danish tax rates or rules
- Keep responses concise — max 3 paragraphs unless complexity requires more
```

## Context Injection

Before sending to Claude API, prepend employee's financial snapshot (from DB):
```typescript
const snapshot = `Employee context:
- Gross salary: ${profile.gross_dkk} DKK/month
- Age: ${profile.age}
- Municipality: ${profile.municipality}
- Emergency fund: ${ef.progress_dkk}/${ef.target_dkk} DKK
- Active goals: ${goals.map(g => g.type).join(', ')}
`
```

## Streaming Implementation

```typescript
// apps/web/app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk'
const client = new Anthropic()

export async function POST(req: Request) {
  const { messages, employeeId } = await req.json()
  const snapshot = await getEmployeeSnapshot(employeeId)

  const stream = client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT + '\n\n' + snapshot,
    messages,
  })
  return new Response(stream.toReadableStream())
}
```

## Cost Controls — IMPORTANT

- Max 20 messages per employee per day — enforce in DB with `nudge_events`-style logging
- Trim conversation history to last 10 messages before sending to API
- Log token usage per session to `ai_chat_sessions` table for monitoring
- If employee hits daily limit, show friendly message with link to learning hub
