'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/lib/trpc'

// Danish municipalities (top 20 by population + common choices)
const DK_MUNICIPALITIES = [
  'København', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding',
  'Horsens', 'Vejle', 'Roskilde', 'Herning', 'Silkeborg', 'Næstved', 'Fredericia',
  'Viborg', 'Køge', 'Holstebro', 'Helsingør', 'Slagelse', 'Hillerød',
  'Frederiksberg', 'Gentofte', 'Gladsaxe', 'Lyngby-Taarbæk', 'Rudersdal',
  'Ballerup', 'Herlev', 'Hvidovre', 'Albertslund', 'Brøndby',
]

const SE_MUNICIPALITIES = ['Malmø', 'Helsingborg', 'Landskrona', 'Vellinge', 'Staffanstorp', 'Anden svensk by']

const STEPS = ['Bopæl', 'Din situation', 'Navn & løn'] as const
type Step = 0 | 1 | 2

type Country = 'DK' | 'SE' | 'EU' | 'OTHER'
type EmploymentType = 'full_time' | 'part_time' | 'freelance'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(0)

  // Step 0 — Bopæl
  const [country, setCountry] = useState<Country | ''>('')
  const [municipality, setMunicipality] = useState('')
  const [muniSearch, setMuniSearch] = useState('')

  // Step 1 — Situation
  const [employmentType, setEmploymentType] = useState<EmploymentType | ''>('')
  const [hasChildren, setHasChildren] = useState<boolean | null>(null)
  const [childrenCount, setChildrenCount] = useState(1)

  // Step 2 — Navn & løn
  const [displayName, setDisplayName] = useState('')
  const [grossDkk, setGrossDkk] = useState('')
  const [taxCardType, setTaxCardType] = useState<'A' | 'B' | 'frikort' | ''>('')

  const updateProfile = trpc.employee.updateProfile.useMutation({
    onSuccess: () => router.push('/dashboard'),
  })

  async function handleFinish() {
    await updateProfile.mutateAsync({
      display_name: displayName || undefined,
      employment_type: employmentType as EmploymentType,
      gross_dkk: grossDkk ? Number(grossDkk) : undefined,
      tax_card_type: taxCardType as 'A' | 'B' | 'frikort',
      countryOfResidence: country as Country,
      municipality: municipality || undefined,
      childrenInDaycare: hasChildren ? childrenCount : 0,
    })
  }

  const municipalities = country === 'SE' ? SE_MUNICIPALITIES : DK_MUNICIPALITIES
  const filteredMunis = municipalities.filter((m) =>
    m.toLowerCase().includes(muniSearch.toLowerCase())
  )

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i <= step ? 'bg-bullaris-blue text-white' : 'bg-white border text-muted-foreground'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? 'text-[#1E0F00]' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-white/80 p-8">

        {/* ── Step 0: Bopæl ─────────────────────────────────── */}
        {step === 0 && (
          <>
            <h1 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
              Velkommen til Bullaris 👋
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Lad os tilpasse din oplevelse. Hvor bor du?
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {([
                { value: 'DK', label: '🇩🇰 Danmark' },
                { value: 'SE', label: '🇸🇪 Sverige (Øresund)' },
                { value: 'EU', label: '🇪🇺 Andet EU-land' },
                { value: 'OTHER', label: '🌍 Andet land' },
              ] as { value: Country; label: string }[]).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setCountry(value); setMunicipality(''); setMuniSearch('') }}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition text-left ${
                    country === value
                      ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                      : 'hover:bg-accent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {(country === 'DK' || country === 'SE') && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
                  {country === 'SE' ? 'By i Sverige' : 'Kommune'}
                </label>
                <input
                  type="text"
                  placeholder="Søg..."
                  value={muniSearch}
                  onChange={(e) => setMuniSearch(e.target.value)}
                  className="w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30 focus:border-bullaris-blue transition mb-2"
                />
                <div className="max-h-40 overflow-y-auto rounded-lg border border-input divide-y">
                  {filteredMunis.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMunicipality(m); setMuniSearch(m) }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${
                        municipality === m
                          ? 'bg-bullaris-blue/5 text-bullaris-blue font-medium'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              disabled={!country}
              onClick={() => setStep(1)}
              className="w-full rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-50 transition"
            >
              Næste
            </button>
          </>
        )}

        {/* ── Step 1: Din situation ──────────────────────────── */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
              Din situation
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Dette hjælper os med at beregne de rigtige fradrag for dig.
            </p>

            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Ansættelsestype
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {([
                { value: 'full_time', label: 'Fuldtid' },
                { value: 'part_time', label: 'Deltid' },
                { value: 'freelance', label: 'Freelance' },
              ] as { value: EmploymentType; label: string }[]).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setEmploymentType(value)}
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    employmentType === value
                      ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                      : 'hover:bg-accent'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Har du børn i dagsinstitution eller SFO?
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setHasChildren(true)}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  hasChildren === true
                    ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                    : 'hover:bg-accent'
                }`}
              >
                Ja
              </button>
              <button
                onClick={() => { setHasChildren(false); setChildrenCount(0) }}
                className={`rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  hasChildren === false
                    ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                    : 'hover:bg-accent'
                }`}
              >
                Nej
              </button>
            </div>

            {hasChildren && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
                  Hvor mange? (max. 2 tæller i fradraget)
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3].map((n) => (
                    <button
                      key={n}
                      onClick={() => setChildrenCount(n)}
                      className={`flex-1 rounded-lg border py-3 text-sm font-medium transition ${
                        childrenCount === n
                          ? 'border-bullaris-blue bg-bullaris-blue/5 text-bullaris-blue'
                          : 'hover:bg-accent'
                      }`}
                    >
                      {n === 3 ? '3+' : n}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  SKAT giver fradrag for max. 2 børn (6.400 DKK/barn/år, 2026)
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition"
              >
                Tilbage
              </button>
              <button
                disabled={!employmentType || hasChildren === null}
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-50 transition"
              >
                Næste
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Navn & løn ─────────────────────────────── */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-serif font-bold text-[#1E0F00] mb-2">
              Navn & løn
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Bruges til at beregne din nettoløn og fradrag. Du kan ændre dette senere.
            </p>

            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Dit navn (valgfrit)
            </label>
            <input
              type="text"
              placeholder="F.eks. Mette"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30 focus:border-bullaris-blue transition mb-4"
            />

            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Bruttoløn pr. måned (DKK)
            </label>
            <input
              type="number"
              placeholder="F.eks. 45000"
              value={grossDkk}
              onChange={(e) => setGrossDkk(e.target.value)}
              className="w-full rounded-lg border border-input bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-bullaris-blue/30 focus:border-bullaris-blue transition mb-4"
            />

            <label className="block text-sm font-medium text-[#1E0F00] mb-1.5">
              Skattekorttype
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(['A', 'B', 'frikort'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTaxCardType(type)}
                  className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${
                    taxCardType === type
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
                disabled={updateProfile.isPending || !taxCardType}
                className="flex-1 rounded-lg bg-bullaris-blue text-white px-4 py-2.5 text-sm font-semibold hover:bg-bullaris-blue/90 disabled:opacity-50 transition"
              >
                {updateProfile.isPending ? 'Gemmer…' : 'Kom i gang →'}
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
