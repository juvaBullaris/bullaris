# Compliance Layer — Bullaris

GDPR + Danish data protection rules. Every feature that touches personal data must follow this doc.

## Data Controller / Processor Split

- **Employer = data controller** for their employees' basic HR data
- **Bullaris (you) = data processor** — sign DPA with every employer before go-live
- **Employee = consent owner** for all voluntarily added financial data

## Consent Requirements by Module

| Module | Lawful basis | Consent required | Revocable |
|---|---|---|---|
| Employee profile (name, age) | Legitimate interest (employment) | No | N/A |
| Payslip explainer | Explicit consent | Yes | Yes — deletes payslip_inputs |
| Tax planner | Explicit consent | Yes | Yes |
| Spending tracker | Explicit consent | Yes | Yes |
| AI chat | Explicit consent | Yes | Yes — deletes chat history |
| Learning progress | Legitimate interest | No | N/A |

## Consent UI Rules — IMPORTANT

- Show consent modal at **first use of each module** — not on onboarding
- Modal must name: what data is collected, why, how long kept, who can see it
- Consent text version must be stored in `consent_events.version`
- Never bundle consents — one module = one consent event
- Revocation must delete the module's data within 24 hours (cron job)

## Data Minimisation Rules — IMPORTANT

- `payslip_inputs`: store only `gross_dkk`, `tax_card_type`, `period` — never bank account
- `net_worth_entries`: store totals only — never account numbers or institution names
- AI chat: store only `session_id` and token count — never store message content
- HR analytics: aggregate server-side to minimum group of 5 — never expose individual rows

## Retention Schedule (automated purge cron — runs nightly)

| Data type | Retention | Trigger |
|---|---|---|
| payslip_inputs | 13 months | Rolling delete |
| spending entries | 13 months | Rolling delete |
| consent_events | 5 years | Legal requirement |
| ai_chat_sessions | 30 days | Rolling delete |
| nudge_events | 6 months | Rolling delete |
| Employee data | 30 days after offboarding | HR admin triggers offboard |

## Sub-processors (list in DPA with every employer)

Vercel (EU), Supabase (Frankfurt), Anthropic (AI chat only), Resend, Mux, Sanity, Stripe
