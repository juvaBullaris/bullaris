'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

const STEPS = ['Navn', 'Stilling', 'Løn'] as const
type Step = 0 | 1 | 2

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)
  const [form, setForm] = useState({
    display_name: '',
    employment_type: '' as 'full_time' | 'part_time' | '',
    gross_dkk: '',
    tax_card_type: '' as 'A' | 'B' | 'frikort' | '',
  })

  const updateProfile = trpc.employee.updateProfile.useMutation({
    onSuccess: () => router.push('/dashboard'),
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleFinish() {
    await updateProfile.mutateAsync({
      display_name: form.display_name,
      employment_type: form.employment_type as 'full_time' | 'part_time',
      gross_dkk: form.gross_dkk ? Number(form.gross_dkk) : undefined,
      tax_card_type: form.tax_card_type as 'A' | 'B' | 'frikort',
    })
  }

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i <= step
                  ? 'bg-bullaris-blue text-white'
                  : 'bg-white border text-muted-foreground'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                i === step ? 'text-[#1E0F00]' : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-white/80 p-8">
        {step === 0 && (
          <>
            <h1 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
              Velkommen til Bullaris 👋
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Hvad må vi kalde dig?
            </p>
            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Dit navn
            </label>
            <input
              type="text"
              placeholder="F.eks. Mette"
              value={form.display_name}
              onChange={(e) => set('display_name', e.target.value)}
              className="w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30 focus:border-bullaris-blue transition mb-6"
            />
            <button
              disabled={!form.display_name.trim()}
              onClick={() => setStep(1)}
              className="w-full rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-50 transition"
            >
              Næste
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
              Din ansættelse
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Dette bruges til at beregne dine fradrag korrekt.
            </p>
            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Ansættelsestype
            </label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {(['full_time', 'part_time'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => set('employment_type', type)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                    form.employment_type === type
                      ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                      : 'hover:bg-accent'
                  }`}
                >
                  {type === 'full_time' ? 'Fuldtid' : 'Deltid'}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition"
              >
                Tilbage
              </button>
              <button
                disabled={!form.employment_type}
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-50 transition"
              >
                Næste
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
              Din løn
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Bruges til at beregne din nettoløn og fradrag. Du kan ændre dette senere.
            </p>
            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Bruttoløn pr. måned (DKK)
            </label>
            <input
              type="number"
              placeholder="F.eks. 45000"
              value={form.gross_dkk}
              onChange={(e) => set('gross_dkk', e.target.value)}
              className="w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30 focus:border-bullaris-blue transition mb-4"
            />
            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Skattekorttype
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(['A', 'B', 'frikort'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => set('tax_card_type', type)}
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    form.tax_card_type === type
                      ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                      : 'hover:bg-accent'
                  }`}
                >
                  {type === 'frikort' ? 'Frikort' : `${type}-kort`}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition"
              >
                Tilbage
              </button>
              <button
                onClick={handleFinish}
                disabled={updateProfile.isPending}
                className="flex-1 rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-50 transition"
              >
                {updateProfile.isPending ? 'Gemmer…' : 'Kom i gang'}
              </button>
            </div>
            {updateProfile.isError && (
              <p className="mt-3 text-sm text-destructive text-center">
                Noget gik galt. Prøv igen.
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-4 text-xs text-center text-muted-foreground">
        Du kan altid opdatere disse oplysninger under din profil.
      </p>
    </div>
  )
}
