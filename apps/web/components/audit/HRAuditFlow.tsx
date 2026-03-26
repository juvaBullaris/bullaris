'use client'

import { useEffect, useReducer, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { scoreAuditAction, logAuditCompletionAction } from '@/app/actions/audit'
import { localFallbackScore } from '@/lib/localScore'
import { AuditQuestion } from './AuditQuestion'
import { AuditResult } from './AuditResult'
import { BridgePage } from './BridgePage'
import { QUESTIONS, type AuditState, type AuditAction } from './types'

// ─── Reducer ──────────────────────────────────────────────────────────────────

const ANSWER_KEYS = ['size', 'sector', 'benefits', 'stressFrequency', 'priority'] as const

function reducer(state: AuditState, action: AuditAction): AuditState {
  switch (action.type) {
    case 'ANSWER': {
      const key = ANSWER_KEYS[state.currentQuestion]
      const newAnswers = { ...state.answers, [key]: action.value }

      if (state.currentQuestion === QUESTIONS.length - 1) {
        return { ...state, answers: newAnswers, screen: 'calculating', direction: 1 }
      }
      return {
        ...state,
        answers: newAnswers,
        currentQuestion: state.currentQuestion + 1,
        direction: 1,
      }
    }
    case 'BACK': {
      if (state.currentQuestion === 0) return state
      return { ...state, currentQuestion: state.currentQuestion - 1, direction: -1 }
    }
    case 'SET_RESULT':
      return { ...state, screen: 'result', scoredResult: action.result }
    case 'SET_SCREEN':
      return { ...state, screen: action.screen }
    case 'EMAIL_SUBMITTED':
      return { ...state, emailCaptured: true, firstName: action.firstName, screen: 'bridge' }
    case 'CHOOSE_PATH':
      return { ...state, pathChosen: action.path }
  }
}

function initState(): AuditState {
  return {
    screen: 'questions',
    currentQuestion: 0,
    direction: 1,
    answers: {
      size: null,
      sector: null,
      benefits: null,
      stressFrequency: null,
      priority: null,
    },
    scoredResult: null,
    emailCaptured: false,
    firstName: null,
    sessionId: crypto.randomUUID(),
    pathChosen: null,
  }
}

// ─── Animation config ─────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const

const questionVariants = {
  enter: (dir: number) => ({ x: dir * 50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -50, opacity: 0 }),
}

const screenVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

// ─── Calculating screen ───────────────────────────────────────────────────────

function CalculatingScreen() {
  const lines = [
    'Analysing your responses...',
    'Benchmarking against your sector...',
    "Calculating your organisation's risk profile...",
  ]

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #FDF6EE 0%, #F5EDE0 40%, #EDE0D4 100%)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo mark */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'linear-gradient(135deg, #E8634A, #D4503A)' }}
        >
          <Heart className="h-4 w-4 fill-white text-white" />
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ background: '#E8634A' }}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Sequential text lines */}
        <div className="flex flex-col items-center gap-3 text-center">
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.6, duration: 0.5, ease }}
              className="text-sm"
              style={{ color: '#9B7B5A' }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Master component ─────────────────────────────────────────────────────────

export function HRAuditFlow() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  const scoringInProgress = useRef(false)

  // Trigger scoring when we enter the calculating screen
  useEffect(() => {
    if (state.screen !== 'calculating' || scoringInProgress.current) return

    scoringInProgress.current = true

    Promise.all([
      scoreAuditAction(state.answers).catch(() => localFallbackScore(state.answers)),
      new Promise<void>((resolve) => setTimeout(resolve, 2200)),
    ]).then(([result]) => {
      dispatch({ type: 'SET_RESULT', result })

      // Fire-and-forget DB log — must not block result display
      logAuditCompletionAction({
        sessionId: state.sessionId,
        answers: state.answers,
        result,
      }).catch(() => {})

      scoringInProgress.current = false
    })
  }, [state.screen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-transition to bridge after 45 seconds on result screen
  useEffect(() => {
    if (state.screen !== 'result') return
    const id = setTimeout(() => {
      dispatch({ type: 'SET_SCREEN', screen: 'bridge' })
    }, 45_000)
    return () => clearTimeout(id)
  }, [state.screen])

  // ── Question screen — direction-aware ───────────────────────────────────────
  if (state.screen === 'questions') {
    return (
      <AnimatePresence initial={false} custom={state.direction} mode="wait">
        <motion.div
          key={state.currentQuestion}
          custom={state.direction}
          variants={questionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease }}
          className="w-full"
        >
          <AuditQuestion
            question={QUESTIONS[state.currentQuestion]}
            questionIndex={state.currentQuestion}
            totalQuestions={QUESTIONS.length}
            onAnswer={(value) => {
              // Auto-advance after 400ms on last question's selection
              if (state.currentQuestion === QUESTIONS.length - 1) {
                setTimeout(() => dispatch({ type: 'ANSWER', value }), 400)
              } else {
                dispatch({ type: 'ANSWER', value })
              }
            }}
            onBack={() => dispatch({ type: 'BACK' })}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Calculating ─────────────────────────────────────────────────────────────
  if (state.screen === 'calculating') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="calculating"
          {...screenVariants}
          transition={{ duration: 0.4, ease }}
          className="w-full"
        >
          <CalculatingScreen />
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Result ──────────────────────────────────────────────────────────────────
  if (state.screen === 'result' && state.scoredResult) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="result"
          {...screenVariants}
          transition={{ duration: 0.4, ease }}
          className="w-full"
        >
          <AuditResult
            result={state.scoredResult}
            sessionId={state.sessionId}
            onEmailSuccess={(firstName) =>
              dispatch({ type: 'EMAIL_SUBMITTED', firstName })
            }
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  // ── Bridge ──────────────────────────────────────────────────────────────────
  if (state.screen === 'bridge' && state.scoredResult) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="bridge"
          {...screenVariants}
          transition={{ duration: 0.4, ease }}
          className="w-full"
        >
          <BridgePage
            firstName={state.firstName}
            result={state.scoredResult}
            sessionId={state.sessionId}
          />
        </motion.div>
      </AnimatePresence>
    )
  }

  // Fallback — shouldn't be reached
  return null
}
