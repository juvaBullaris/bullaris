---
name: frontend-design-hr
description: Create distinctive, production-grade frontend interfaces with high design quality for HR, People & Culture, Employee Wellbeing, and Compensation & Benefits audiences. Use this skill when building web components, pages, artifacts, or applications targeting HR professionals, CHROs, People Ops leaders, or employee-facing HR products. Generates emotionally resonant, people-first interfaces that avoid generic AI aesthetics — warm, human, and deeply relatable. Trigger this skill for any HR platform UI, employee wellbeing dashboard, onboarding flow, benefits portal, engagement survey tool, total comp visualizer, or any interface meant to be seen by HR/P&C/WE professionals or employees experiencing a personal/emotional product moment.
license: Complete terms in LICENSE.txt
---

This skill guides creation of emotionally intelligent, people-centric frontend interfaces for HR, People & Culture (P&C), Employee Wellbeing (WE), Total Rewards, and Compensation & Benefits contexts. Every design choice must serve one master: making a human feel seen, supported, and safe.

## Design Thinking for HR Audiences

Before writing a single line of code, answer these four questions:

**1. Who is this for — and what are they feeling right now?**
- HR professional evaluating a vendor? They are busy, skeptical, and carrying the emotional weight of hundreds of employee stories.
- Employee using a financial wellness tool at 11pm? They are anxious, possibly ashamed, hoping no one judges them.
- CHRO seeing a dashboard? They want to see impact — but they secretly want to feel proud of their people decisions.

Design for the *emotion*, not just the function.

**2. What is the human truth underneath this feature?**
Every HR product feature has a human truth beneath it:
- "Payslip decoder" = "I've never understood what's deducted from my salary and I feel embarrassed asking"
- "Benefits enrollment" = "I don't want to make the wrong choice for my family"
- "eNPS survey" = "I want to tell the truth but I don't trust that it's anonymous"

Surface that human truth in copy, imagery, and UI tone.

**3. What feeling should someone walk away with?**
Choose ONE dominant emotional register:
- **Warm trust**: "This company genuinely cares about me"
- **Quiet confidence**: "I understand my finances now"
- **Belonging**: "I am seen and included here"
- **Relief**: "Finally, someone made this simple"
- **Pride**: "Look how we've grown together"

Every aesthetic choice — fonts, colors, imagery, motion — should reinforce that single feeling.

**4. What makes this UNFORGETTABLE?**
Not the features. The *feeling it leaves*. Design for the moment someone shares a screenshot with a colleague or tears up slightly during a demo. That's the bar.

---

## HR Frontend Aesthetics System

### Color Philosophy
HR interfaces must feel warm, human, and trustworthy — never cold, never clinical, never corporate-gray.

**Approved emotional palettes:**

| Register | Primary | Accent | Background | Avoid |
|---|---|---|---|---|
| Warm trust | Terracotta `#E8634A` | Sage green `#5B8A6B` | Cream `#FDF6EE` | Blues + whites + grays |
| Quiet confidence | Slate blue `#4A6FA5` | Warm amber `#F0A500` | Off-white `#F8F6F0` | Neon, high contrast |
| Belonging | Forest green `#3D7A5B` | Blush `#EFA8A0` | Linen `#F5EDE0` | Purple gradients |
| Relief/calm | Dusty lavender `#8B6BAE` | Soft gold `#C9A84C` | Ivory `#FAF7F2` | Saturated primary colors |

**Rule**: Never use purple-gradient-on-white. Never use cold blues without warmth. Never use pure black — use deep espresso `#1E0F00` or warm charcoal `#2C1A0E`.

### Typography for Humanity
Typography must signal: *this was made by people who read, who think, who care.*

**The HR type stack:**
- **Display / Headlines**: A humanist serif — `Lora`, `Playfair Display`, `Cormorant Garamond`, `DM Serif Display`. Serifs signal permanence, gravitas, and care. Headlines should feel like a letter written to someone.
- **Body / UI**: A geometric humanist sans — `DM Sans`, `Nunito`, `Outfit`, `Plus Jakarta Sans`. Never Inter. Never Roboto. Never system fonts.
- **Data / Numbers**: `DM Mono` or `IBM Plex Mono` for figures, salaries, percentages — mono spacing prevents number anxiety.

**Type sizing**: Go large on the emotional headline. `3rem`–`5rem` for hero text that states a human truth. Small, quiet captions for disclaimers and legal copy — reduce, don't hide.

**Line length**: Max 65 characters for body text. Long lines cause anxiety in people who are already stressed.

### Imagery & Human Presence
This is the most important differentiator from generic AI interfaces.

**Always use real people imagery when possible.** Source from Unsplash using these searches:
- `team collaboration genuine` — real laughter, real eye contact
- `employee candid office` — not posed stock, real moments
- `diverse team meeting` — genuine diversity, not token diversity
- `woman confident work` — not performatively happy, genuinely capable
- `man thoughtful desk` — contemplative, not stressed

**Image composition rules:**
- Show faces. Emotion is in faces.
- Show human *connection* — two people looking at the same thing, a handshake, a fist bump, a knowing smile
- Warm light. Golden hour if possible. Avoid fluorescent office lighting.
- Use image overlays (subtle warm gradient) to integrate photos into the color palette

**UI "emotion signals"** — sprinkle these throughout:
- Floating emoji particles (💛 🤝 🌱 ✨ 💬) — animated, ephemeral, joyful
- Subtle celebration moments (confetti on goal completion, animated stars)
- Human avatars for testimonials — always real photos, never illustrations
- Progress bars that feel like *growth*, not tracking

### Motion & Animation
Motion in HR interfaces communicates: *we are alive, we are present, we care.*

**Animation principles for HR:**
1. **Entrance animations**: Staggered reveals with `framer-motion`. Start with the most emotional element (the headline), then supporting elements. 60–80ms stagger.
2. **Image reveals**: `scale: 0.92 → 1` + `opacity: 0 → 1` with `ease: [0.22, 1, 0.36, 1]` — this easing feels like a warm breath in.
3. **Hover states**: Images should scale slightly (`1.03×`). Cards should lift gently (`translateY(-4px)`, subtle shadow increase). Never jarring.
4. **Testimonial transitions**: Blur-fade — `filter: blur(8px) → blur(0)` + slide. Feels like a memory coming into focus.
5. **Floating particles**: Loop with `opacity: [0, 0.7, 0]` + upward drift. Ephemeral, not distracting.
6. **Number counters**: Count up from zero on scroll-enter. Numbers should feel *earned*.
7. **Loading states**: Skeleton screens with warm pulsing — never cold gray shimmer.

**Never**: jerky animations, bouncing that feels childish, or motion that creates anxiety (fast flashing, overly energetic).

### Spatial Composition
**The HR layout grammar:**

```
[Pill badge: category label]
[H1: Human truth headline — large, serif, warm]  |  [Image mosaic / hero photo]
[Supporting copy — DM Sans, relaxed line-height]  |  [Testimonial carousel]
[CTA buttons]                                     |  [Social proof avatars]
[Trust badges: GDPR, certifications]

[Stat bar: 4 emotional metrics with icons and colors]

[People strip: avatar row + "joining X others" copy]
```

**Grid rules**:
- Hero: 2-column (copy left, visual right) on desktop. Stack on mobile. Copy col is slightly narrower (`45%`).
- Cards: `border-radius: 16px–24px`. Always. Soft corners = safety.
- Whitespace: Generous. White space *is* calm. People in emotional moments need room to breathe.
- Glassmorphism overlays: `background: rgba(255,255,255,0.7)`, `backdrop-filter: blur(12px)` — for inline data cards on images.

### Copy Patterns for HR Interfaces
Copy is design. These patterns work for HR/P&C audiences:

**Headlines that work:**
- "When your people thrive financially, everyone wins."
- "Your employees are thinking about money. You can help."
- "Benefits they'll actually feel."
- "Finally, a conversation about money at work."
- "Because financial stress doesn't stop at the office door."

**CTA language:**
- Instead of "Sign Up" → "Start a pilot" or "See how it works"
- Instead of "Book Demo" → "Book a conversation"
- Instead of "Learn More" → "See the human impact"

**Testimonial framing:**
- Always include role + company context (P&C credibility)
- Emphasize *cultural* impact, not just metrics: "Our employees aren't afraid to talk about money anymore" > "We increased retention by 15%"
- 5-star ratings signal trust but the QUOTE is the persuasion

**Trust signal copy:**
- GDPR compliant · PSD2 certified · MiFID II aligned (for Danish/EU fintechs)
- "Your data is yours. Always."
- "Anonymous. Confidential. Yours."

---

## Component Patterns

### The Emotion-Signal Card
```tsx
// Used for inline data callouts on images or alongside stats
<div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 p-4 shadow-xl">
  <div className="flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
      <TrendingUp className="h-4 w-4 text-green-600" />
    </div>
    <div>
      <div className="text-xs font-bold text-stone-800">[Positive milestone headline]</div>
      <div className="text-[10px] text-stone-500">[Human-readable context + emoji]</div>
    </div>
  </div>
</div>
```

### The Testimonial Rotator
- Auto-rotate every 5 seconds
- Blur-fade transition between quotes
- Always show face photo + name + role + company
- Dot indicators (active dot widens to `24px`, inactive is `6px`)
- 5 stars always visible (social proof anchoring)

### The Social Proof Avatar Strip
- Row of real face photos, overlapping (`-ml-2`)
- Ring styling: `ring-2 ring-white` 
- Overflow indicator: `+11K` in brand color
- Caption: "Joining X others who finally feel confident about [thing]"

### The Stat Bar
- 4 stats, icon left, number large, label small
- Each stat has a unique accent color (don't use the same color for all four)
- Background: `bg-white/60 backdrop-blur-sm` on the warm background
- Entrance: stagger by `0.1s` from left

---

## Bullaris-Specific Patterns

Since this skill was created in the context of the Bullaris project (Danish B2B SaaS employee financial wellness for SMEs), these additional patterns apply:

**Brand voice**: Warm, direct, Scandinavian-informed (understated warmth, not effusive American positivity). Like a knowledgeable friend who happens to be a CFP.

**Bullaris color identity**:
- Primary: Terracotta `#E8634A` — warmth, humanity, Danish design sensibility  
- Positive/growth: Sage `#5B8A6B`
- Trust: Slate blue `#4A6FA5`
- Background system: Cream `#FDF6EE` → Stone `#F5EDE0` → Warm linen `#EDE0D4`
- Never: cold blues, sterile whites, aggressive reds

**Bullaris copy truths**:
- Financial wellness is *emotional* first, rational second
- Employers care; they just don't know how to show it
- "Your salary is more than a number"
- Focus on *today* (net pay, emergency fund) before *tomorrow* (pension)

**Compliance badges to always show**: GDPR · PSD2 · MiFID II

---

## Implementation Notes

**Stack**: React + TypeScript + Tailwind CSS + framer-motion + lucide-react

**Google Fonts to load**:
```html
<link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap" rel="stylesheet">
```

**Unsplash image patterns for HR**:
- Team: `photo-1522071820081-009f0129c71c` (collaboration)
- Connection: `photo-1531545514256-b1400bc00f31` (colleagues)
- Happiness at work: `photo-1600880292089-90a7e086ee0c`
- Diverse faces: `photo-1494790108377-be9c29b29330`, `photo-1507003211169-0a1dd7228f2d`, `photo-1438761681033-6461ffad8d80`

**Accessibility**: Use `aria-label` on icon-only buttons. Ensure testimonial rotator has keyboard controls. Color contrast minimum AA for all text.

---

## The Golden Rule

Every pixel you render will be seen by someone who is thinking about whether their employer actually cares about them. Design like it matters. Because it does.
