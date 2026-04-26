'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'

type CelebrationVariant = 'small' | 'large'

interface CelebrationBurstProps {
  active: boolean
  variant: CelebrationVariant
  onComplete?: () => void
}

const COLORS = [
  '#E8634A', '#F9A87D', '#FFD580', '#5B8A6B',
  '#A3C9B0', '#9B8B7E', '#EDE0D4', '#4A7BE8',
  '#C084FC', '#34D399', '#F472B6', '#60A5FA',
]

interface Piece {
  id: number
  color: string
  width: number
  height: number
  xStart: number
  xDrift: number
  yTarget: number
  rotate: number
  delay: number
  isRect: boolean
}

export function CelebrationBurst({ active, variant, onComplete }: CelebrationBurstProps) {
  const count = variant === 'small' ? 8 : 36
  const stagger = variant === 'small' ? 0.05 : 0.04
  const duration = variant === 'small' ? 1.2 : 2.5

  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const side = i % 2 === 0 ? 1 : -1
      return {
        id: i,
        color: COLORS[i % COLORS.length],
        width: variant === 'small' ? 12 + (i % 3) * 6 : 10 + (i % 4) * 5,
        height: variant === 'small' ? 8 + (i % 4) * 4 : 6 + (i % 5) * 4,
        xStart: variant === 'large' ? 5 + ((i / count) * 90) : 50,
        xDrift: variant === 'small'
          ? side * (20 + (i % 4) * 15)
          : side * (30 + (i % 5) * 20),
        yTarget: variant === 'small'
          ? -(80 + (i % 4) * 30)
          : 520 + (i % 5) * 60,
        rotate: side * (30 + i * 9),
        delay: i * stagger,
        isRect: i % 3 !== 0,
      }
    })
  }, [variant, count, stagger])

  if (variant === 'small') {
    return (
      <AnimatePresence>
        {active && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ zIndex: 10 }}
          >
            {pieces.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                animate={{ opacity: 0, y: p.yTarget, x: p.xDrift, rotate: p.rotate }}
                transition={{ duration, delay: p.delay, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={p.id === 0 ? onComplete : undefined}
                style={{
                  position: 'absolute',
                  bottom: '30%',
                  left: `calc(${p.xStart}% - ${p.width / 2}px)`,
                  width: p.width,
                  height: p.isRect ? p.height : p.width,
                  borderRadius: p.isRect ? 2 : p.width / 2,
                  backgroundColor: p.color,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    )
  }

  // large — fixed overlay covering full viewport
  return (
    <AnimatePresence>
      {active && (
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          style={{ zIndex: 50 }}
        >
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
              animate={{ opacity: 0, y: p.yTarget, x: p.xDrift, rotate: p.rotate }}
              transition={{ duration, delay: p.delay, ease: 'easeIn' }}
              onAnimationComplete={p.id === 0 ? onComplete : undefined}
              style={{
                position: 'absolute',
                top: 0,
                left: `${p.xStart}%`,
                width: p.width,
                height: p.isRect ? p.height : p.width,
                borderRadius: p.isRect ? 2 : p.width / 2,
                backgroundColor: p.color,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
