'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Shield, TrendingUp, Users, ArrowRight, Sparkles, Star,
  Settings, Smartphone, BarChart2, Receipt, Check, Linkedin, Mail,
} from 'lucide-react'
import { useLanguage, type Locale } from '@/lib/language-context'

// ─── Animation helpers ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease, delay },
  }),
}

function FadeInWhenVisible({
  children,
  className,
  id,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  id?: string
  delay?: number
  as?: keyof JSX.IntrinsicElements
}) {
  const Component = motion[Tag as 'div']
  return (
    <Component
      id={id}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </Component>
  )
}

// ─── Testimonials data ────────────────────────────────────────────────────────

const testimonials = [
  {
    quote: "For the first time, our employees aren't afraid to talk about money at work. That cultural shift? Priceless.",
    name: 'Mette Sørensen',
    role: 'Head of People & Culture',
    company: 'Nordic Retail Group',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: 'We saw our eNPS climb 18 points in six months. Our people finally feel like we care about their whole lives.',
    name: 'Lars Andersen',
    role: 'Chief People Officer',
    company: 'TechFlow Danmark',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
  },
  {
    quote: 'Bullaris gave us the language to start honest conversations about wellbeing — not just performance.',
    name: 'Sofie Holm',
    role: 'Employee Experience Lead',
    company: 'Bygge & Co',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=80&h=80&fit=crop&crop=face',
  },
]

const avatarIds = [
  'photo-1494790108377-be9c29b29330',
  'photo-1507003211169-0a1dd7228f2d',
  'photo-1438761681033-6461ffad8d80',
  'photo-1500648767791-00dcc994a43e',
  'photo-1544005313-94ddf0286df2',
  'photo-1472099645785-5658abf4ff4e',
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function EmotionParticle({ emoji, delay, x, y }: { emoji: string; delay: number; x: number; y: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute select-none text-2xl"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: [0, 0.7, 0], scale: [0, 1.2, 0.8], y: [20, -60] }}
      transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: 6 + Math.random() * 4 }}
    >
      {emoji}
    </motion.div>
  )
}

function TestimonialCard({ t, active }: { t: typeof testimonials[0]; active: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease }}
          className="rounded-2xl border border-white/80 bg-white/70 p-6 shadow-xl backdrop-blur-sm"
          style={{ boxShadow: '0 8px 40px rgba(92,82,70,0.10)' }}
        >
          <div className="mb-3 flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="mb-4 text-[15px] italic leading-relaxed text-stone-700">"{t.quote}"</p>
          <div className="flex items-center gap-3">
            <img
              src={t.avatar}
              alt={t.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-200"
            />
            <div>
              <div className="text-sm font-semibold text-stone-800">{t.name}</div>
              <div className="text-xs text-stone-500">{t.role} · {t.company}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function GlassCard({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100">
          <Icon className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <div className="text-xs font-bold text-stone-800">{title}</div>
          <div className="text-[10px] text-stone-500">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

function LangPill() {
  const { locale, setLocale } = useLanguage()
  const options: { value: Locale; label: string }[] = [
    { value: 'da', label: 'DA' },
    { value: 'en', label: 'EN' },
  ]
  return (
    <div
      className="flex items-center rounded-full p-0.5"
      style={{ background: 'rgba(232,99,74,0.10)', border: '1px solid rgba(212,184,152,0.5)' }}
      role="group"
      aria-label="Language switcher"
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setLocale(value)}
          aria-pressed={locale === value}
          className="rounded-full px-3 py-1 text-xs font-bold transition-all"
          style={{
            background: locale === value ? '#E8634A' : 'transparent',
            color: locale === value ? '#fff' : '#9B7B5A',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

// ─── JSON-LD schemas ─────────────────────────────────────────────────────────

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is employee financial wellness?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Employee financial wellness refers to programmes and tools that help employees understand and manage their personal finances — including salary, tax, savings, and debt — reducing financial stress and improving overall wellbeing at work.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Bullaris GDPR compliant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Bullaris is fully GDPR compliant. All data is stored on EU servers in Frankfurt, a data processing agreement is included in every subscription, and employees can withdraw consent at any time. HR teams never see individual employee data.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does setup take for HR teams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most HR teams are up and running in one afternoon. No IT department or complex integrations required. You can connect payroll data or enter headcount manually.',
      },
    },
    {
      '@type': 'Question',
      name: "Can employees see each other's financial data?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Each employee has a completely private dashboard. HR managers only see anonymised, aggregated insights — never individual employee data. A minimum of 5 employees is required before any aggregate is shown.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does Bullaris cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bullaris starts from 49 DKK per employee per month, billed annually with a minimum of 10 seats. All plans include a free 30-day pilot and dedicated onboarding. No credit card required to start.',
      },
    },
  ],
}

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Bullaris',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '49',
    priceCurrency: 'DKK',
    description: 'Per employee per month, billed annually',
  },
  description:
    'Employee financial wellness platform for Danish SMEs. Helps HR teams support employee financial confidence through salary decoding, tax planning, and anonymised aggregate insights.',
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { t } = useLanguage()
  const m = t.marketing
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(id)
  }, [])

  const stats = [
    { value: m.stats.c1value, label: m.stats.c1label, source: m.stats.c1source, icon: Heart, color: '#E8634A' },
    { value: m.stats.c2value, label: m.stats.c2label, source: m.stats.c2source, icon: TrendingUp, color: '#5B8A6B' },
    { value: m.stats.c3value, label: m.stats.c3label, source: m.stats.c3source, icon: Users, color: '#4A6FA5' },
    { value: m.stats.c4value, label: m.stats.c4label, source: m.stats.c4source, icon: Shield, color: '#8B6BAE' },
  ]

  const steps = [
    { icon: Settings, title: m.howItWorks.step1title, desc: m.howItWorks.step1desc, num: '01' },
    { icon: Smartphone, title: m.howItWorks.step2title, desc: m.howItWorks.step2desc, num: '02' },
    { icon: BarChart2, title: m.howItWorks.step3title, desc: m.howItWorks.step3desc, num: '03' },
  ]

  const features = [m.pricing.f1, m.pricing.f2, m.pricing.f3, m.pricing.f4]

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      {/* ═══════════════════════════════════════════════════
          ABOVE-THE-FOLD: hero area — cream gradient bg
      ═══════════════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EDE0 40%, #EDE0D4 100%)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Warm gradient orbs */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 75% 20%, rgba(232,99,74,0.10) 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 20% 80%, rgba(91,138,107,0.10) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.40) 0%, transparent 80%)
            `,
          }}
        />

        {/* Emotion particles — hero only */}
        <EmotionParticle emoji="💛" delay={0} x={8} y={15} />
        <EmotionParticle emoji="🤝" delay={2.5} x={90} y={25} />
        <EmotionParticle emoji="✨" delay={5} x={15} y={70} />
        <EmotionParticle emoji="🌱" delay={1.5} x={85} y={65} />
        <EmotionParticle emoji="💬" delay={3.5} x={50} y={10} />

        {/* ── NAVBAR ── */}
        <nav className="relative z-20 flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, #E8634A, #D4503A)' }}
            >
              <Heart className="h-4 w-4 fill-white text-white" />
            </div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: '#2C1A0E', fontFamily: "'Lora', serif" }}
            >
              Bullaris
            </span>
          </motion.a>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden items-center gap-8 md:flex"
          >
            <a
              href="#how-it-works"
              className="text-sm font-medium transition-colors hover:text-amber-700"
              style={{ color: '#6B4C2A' }}
            >
              {m.nav.howItWorks}
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium transition-colors hover:text-amber-700"
              style={{ color: '#6B4C2A' }}
            >
              {m.nav.pricing}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <LangPill />
            <a
              href="mailto:hello@bullaris.dk"
              className="hidden rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg md:block"
              style={{ background: 'linear-gradient(135deg, #E8634A, #D4503A)' }}
            >
              {m.nav.bookDemo}
            </a>
          </motion.div>
        </nav>

        {/* ── HERO BODY ── */}
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-10 pt-4 md:grid-cols-2 md:items-center md:px-8 md:py-12">

          {/* LEFT: copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ background: 'rgba(232,99,74,0.12)', color: '#C04830' }}
            >
              <Sparkles className="h-3 w-3" />
              {m.hero.badge}
            </motion.div>

            {/* H1 — fixed design element, headline must stay in EN per spec */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.8, ease }}
              className="mb-5 text-[3.2rem] font-bold leading-[1.1] tracking-tight"
              style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
            >
              When your people
              <br />
              <span style={{ color: '#E8634A' }}>thrive financially,</span>
              <br />
              everyone wins.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mb-8 max-w-[42ch] text-[1.05rem] leading-relaxed"
              style={{ color: '#5C3D1E' }}
            >
              {m.hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <a
                href="/audit"
                className="flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg, #E8634A 0%, #C04830 100%)' }}
              >
                {m.hero.cta}
              </a>
              <a
                href="mailto:hello@bullaris.dk"
                className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-amber-50"
                style={{ borderColor: '#D4B898', color: '#6B4C2A' }}
              >
                {m.hero.secondaryCta}
              </a>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-8 flex flex-wrap items-center gap-2 text-[13px]"
              style={{ color: '#9B7B5A' }}
            >
              <Shield className="h-4 w-4 text-green-600" />
              <span>{m.trust.dpa}</span>
              <span className="opacity-40">·</span>
              <span>{m.trust.servers}</span>
              <span className="opacity-40">·</span>
              <span>{m.trust.noHr}</span>
            </motion.div>
          </div>

          {/* RIGHT: image mosaic + testimonial rotator */}
          <div className="relative flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1, ease }}
              className="relative grid grid-cols-3 grid-rows-2 gap-3"
              style={{ height: '340px' }}
            >
              {/* Large left image */}
              <div className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=420&fit=crop&crop=center"
                  alt="HR team discussing employee financial wellness at work"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <GlassCard icon={TrendingUp} title={m.hero.cardTitle} subtitle={m.hero.cardSubtitle} />
                </div>
              </div>

              {/* Top right */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=200&h=180&fit=crop&crop=faces"
                  alt="Colleagues collaborating on employee benefits platform"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                {/* Second micro-card */}
                <div className="absolute inset-x-2 bottom-2">
                  <div
                    className="rounded-lg px-2.5 py-2"
                    style={{
                      background: 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-100">
                        <Receipt className="h-3 w-3 text-amber-600" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold leading-tight text-stone-800">{m.hero.card2Title}</div>
                        <div className="text-[9px] leading-tight text-stone-500">{m.hero.card2Subtitle}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom right */}
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=200&h=180&fit=crop&crop=center"
                  alt="Happy employee using financial wellness app"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </motion.div>

            {/* Testimonial rotator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="relative min-h-[170px]"
            >
              {testimonials.map((testimonial, i) => (
                <div key={testimonial.name} className={i === activeTestimonial ? 'block' : 'hidden'}>
                  <TestimonialCard t={testimonial} active={i === activeTestimonial} />
                </div>
              ))}
              <div className="mt-3 flex gap-1.5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === activeTestimonial ? '24px' : '6px',
                      background: i === activeTestimonial ? '#E8634A' : '#D4B898',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <FadeInWhenVisible
          className="relative z-10 mx-auto mb-2 grid max-w-5xl grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease }}
              className="flex flex-col gap-2 rounded-2xl bg-white/60 px-5 py-4 shadow-sm backdrop-blur-sm"
              style={{ border: '1px solid rgba(255,255,255,0.8)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${stat.color}1A` }}
                >
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <div
                  className="text-2xl font-bold leading-none"
                  style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
                >
                  {stat.value}
                </div>
              </div>
              <div className="text-xs leading-snug" style={{ color: '#5C3D1E' }}>
                {stat.label}
              </div>
              {stat.source && (
                <div className="text-[10px]" style={{ color: '#9B7B5A' }}>
                  {stat.source}
                </div>
              )}
            </motion.div>
          ))}
        </FadeInWhenVisible>

        {/* Stats source line */}
        <FadeInWhenVisible
          className="mx-auto mb-10 max-w-5xl px-6 text-center md:px-8"
          delay={0.2}
        >
          <p className="text-[11px]" style={{ color: '#9B7B5A' }}>
            {m.stats.source}
          </p>
        </FadeInWhenVisible>

        {/* ── PEOPLE STRIP ── */}
        <FadeInWhenVisible className="mx-auto mb-16 flex max-w-5xl flex-col items-center gap-4 px-6 md:px-8">
          <div className="flex">
            {avatarIds.map((id, i) => (
              <motion.img
                key={id}
                src={`https://images.unsplash.com/${id}?w=64&h=64&fit=crop&crop=face`}
                alt=""
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5, ease }}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-md"
                style={{ marginLeft: i === 0 ? 0 : '-8px' }}
              />
            ))}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold shadow-md"
              style={{ background: '#E8634A', color: 'white', marginLeft: '-8px', fontFamily: "'DM Sans', sans-serif" }}
            >
              +11K
            </div>
          </div>
          <p className="max-w-sm text-center text-sm" style={{ color: '#9B7B5A' }}>
            {m.peopleStrip}
          </p>
        </FadeInWhenVisible>
      </div>

      {/* ═══════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        style={{ background: '#F0E6D8', fontFamily: "'DM Sans', sans-serif" }}
        className="py-24"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <FadeInWhenVisible className="mb-16 text-center">
            <h2
              className="mb-3 text-3xl font-bold"
              style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
            >
              {/* H2 per SEO spec */}
              {m.howItWorks.h2}
            </h2>
            <p className="text-2xl font-semibold" style={{ color: '#2C1A0E', fontFamily: "'Lora', serif" }}>
              {m.howItWorks.headline}
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base" style={{ color: '#6B4C2A' }}>
              {m.howItWorks.subheadline}
            </p>
          </FadeInWhenVisible>

          {/* Steps */}
          <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {/* Dashed connector — desktop only */}
            <div
              className="absolute top-10 hidden h-px w-full md:block"
              style={{
                left: '16.7%',
                right: '16.7%',
                borderTop: '2px dashed rgba(212,184,152,0.6)',
                zIndex: 0,
              }}
            />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.12, duration: 0.8, ease }}
                className="relative z-10 rounded-2xl bg-white/80 p-8 shadow-sm"
                style={{ border: '1px solid rgba(255,255,255,0.9)' }}
              >
                {/* Step number */}
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black"
                  style={{ background: 'rgba(232,99,74,0.12)', color: '#E8634A', fontFamily: "'Lora', serif" }}
                >
                  {step.num}
                </div>
                {/* Icon */}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(232,99,74,0.08)' }}
                >
                  <step.icon className="h-6 w-6" style={{ color: '#E8634A' }} />
                </div>
                <h3
                  className="mb-3 text-lg font-bold"
                  style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6B4C2A' }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════ */}
      <section
        id="pricing"
        style={{
          background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EDE0 100%)',
          fontFamily: "'DM Sans', sans-serif",
        }}
        className="py-24"
      >
        <div className="mx-auto max-w-2xl px-6 md:px-8">
          <FadeInWhenVisible className="mb-12 text-center">
            {/* H2 per SEO spec — hidden visually, for screen readers */}
            <h2 className="sr-only">{m.pricing.h2}</h2>
            <p
              className="text-3xl font-bold"
              style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
            >
              {m.pricing.headline}
            </p>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.1}>
            <div
              className="rounded-3xl bg-white p-10 shadow-xl"
              style={{ border: '1px solid rgba(212,184,152,0.4)', boxShadow: '0 12px 60px rgba(92,58,30,0.10)' }}
            >
              <div className="mb-2 text-sm font-medium" style={{ color: '#9B7B5A' }}>
                {m.pricing.label}
              </div>
              <div
                className="mb-1 text-5xl font-black leading-none"
                style={{ color: '#1E0F00', fontFamily: "'Lora', serif" }}
              >
                {m.pricing.price}
              </div>
              <p className="mb-8 text-sm" style={{ color: '#9B7B5A' }}>
                {m.pricing.subtext}
              </p>

              <ul className="mb-8 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm" style={{ color: '#2C1A0E' }}>
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'rgba(91,138,107,0.15)' }}
                    >
                      <Check className="h-3 w-3" style={{ color: '#5B8A6B' }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@bullaris.dk"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #E8634A, #C04830)' }}
              >
                {m.pricing.cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-5 text-center text-sm" style={{ color: '#9B7B5A' }}>
              {m.pricing.below}
            </p>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA  (id=audit)
      ═══════════════════════════════════════════════════ */}
      <section
        id="audit"
        className="relative overflow-hidden py-24"
        style={{ background: '#E8634A', fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* Grain texture via SVG filter */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden="true">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Subtle radial highlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)',
          }}
        />

        <FadeInWhenVisible className="relative z-10 mx-auto max-w-2xl px-6 text-center md:px-8">
          <h2
            className="mb-4 text-4xl font-bold leading-tight"
            style={{ color: '#fff', fontFamily: "'Lora', serif" }}
          >
            {m.finalCta.headline}
          </h2>
          <p
            className="mb-10 text-lg leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            {m.finalCta.subheadline}
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/audit"
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
              style={{ color: '#E8634A' }}
            >
              {m.finalCta.primary}
            </a>
            <a
              href="mailto:hello@bullaris.dk"
              className="flex items-center gap-2 rounded-xl border-2 border-white/60 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
            >
              {m.finalCta.secondary}
            </a>
          </div>

          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {m.finalCta.reassurance}
          </p>
        </FadeInWhenVisible>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════ */}
      <footer
        style={{ background: '#1E0F00', fontFamily: "'DM Sans', sans-serif" }}
        className="py-16"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Left: logo + tagline */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg"
                  style={{ background: 'linear-gradient(135deg, #E8634A, #D4503A)' }}
                >
                  <Heart className="h-3.5 w-3.5 fill-white text-white" />
                </div>
                <span
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  Bullaris
                </span>
              </div>
              <p className="max-w-[24ch] text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {m.footer.tagline}
              </p>
            </div>

            {/* Middle: links */}
            <div className="flex flex-col gap-3">
              {[
                { label: m.footer.l1, href: '#how-it-works' },
                { label: m.footer.l2, href: '#pricing' },
                { label: m.footer.l3, href: '/privacy' },
                { label: m.footer.l4, href: '/dpa' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {label}
                </a>
              ))}
            </div>

            {/* Right: made in DK + contact */}
            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium text-white">{m.footer.madeIn}</p>
              <a
                href="https://linkedin.com/company/bullaris"
                aria-label="Bullaris on LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <Linkedin className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.65)' }} />
              </a>
              <a
                href={`mailto:${m.footer.email}`}
                className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                <Mail className="h-4 w-4" />
                {m.footer.email}
              </a>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="border-t pt-8 text-center text-xs"
            style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}
          >
            © {new Date().getFullYear()} {m.footer.bottom}
          </div>
        </div>
      </footer>
    </>
  )
}
