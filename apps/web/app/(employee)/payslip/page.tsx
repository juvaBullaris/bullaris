'use client'

import { useState, useEffect } from 'react'
import { ConsentModal } from '@/components/consent-modal'
import { SalaryConsentModal } from '@/components/salary-consent-modal'
import { PayslipBreakdown } from '@/components/payslip-breakdown'
import { LearnBanner } from '@/components/learn-banner'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'
import { useConsent } from '@/lib/use-consent'

type BonusFreq = 'monthly' | 'quarterly' | 'annual' | 'irregular'

const BONUS_FREQ_LABELS: Record<BonusFreq, { en: string; da: string }> = {
  monthly:   { en: 'Every month',  da: 'Hver måned' },
  quarterly: { en: 'Every quarter',da: 'Hvert kvartal' },
  annual:    { en: 'Once a year',  da: 'Én gang om året' },
  irregular: { en: 'Irregular',    da: 'Uregelmæssigt' },
}

export default function PayslipPage() {
  const { locale, t } = useLanguage()
  const en = locale === 'en'
  const { hasConsent, isLoading: consentLoading, grant } = useConsent('payslip_module')

  // ── Profile data ─────────────────────────────────────────────────────────────
  const profileQuery = trpc.employee.getProfile.useQuery(undefined, { retry: false })
  const updateProfile = trpc.employee.updateProfile.useMutation()
  const deleteSalaryData = trpc.employee.deleteSalaryData.useMutation({
    onSuccess: () => {
      profileQuery.refetch()
      setGrossInput('')
      setBonusAmount('')
      setBonusFreq('annual')
      setOtherAmount('')
      setOtherLabel('')
      setDeleteConfirm(false)
    },
  })
  const utils = trpc.useUtils()

  // ── Form state ────────────────────────────────────────────────────────────────
  const profile = profileQuery.data?.data ?? null
  const hasSavedSalary = !!profile?.gross_dkk

  const [grossInput, setGrossInput] = useState('')
  const [bonusAmount, setBonusAmount] = useState('')
  const [bonusFreq, setBonusFreq] = useState<BonusFreq>('annual')
  const [otherAmount, setOtherAmount] = useState('')
  const [otherLabel, setOtherLabel] = useState('')

  const [editMode, setEditMode] = useState(false)
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  // Pre-fill form from saved profile
  useEffect(() => {
    if (profile) {
      if (profile.gross_dkk) setGrossInput(String(Math.round(Number(profile.gross_dkk))))
      if (profile.bonus_dkk)  setBonusAmount(String(Math.round(Number(profile.bonus_dkk))))
      if (profile.bonus_frequency) setBonusFreq(profile.bonus_frequency as BonusFreq)
      if (profile.other_income_dkk) setOtherAmount(String(Math.round(Number(profile.other_income_dkk))))
      if (profile.other_income_label) setOtherLabel(profile.other_income_label)
    }
  }, [profileQuery.data])

  const grossNum = Number(grossInput) || 0

  // ── Payslip calculator ────────────────────────────────────────────────────────
  const payslipQuery = trpc.payslip.calculate.useQuery(
    { gross_dkk: grossNum },
    { enabled: hasConsent && grossNum > 0 }
  )

  // ── Handlers ──────────────────────────────────────────────────────────────────
  function handleSaveClick() {
    if (!grossInput || Number(grossInput) <= 0) return
    // If already saved before, save directly. First time → show consent modal.
    if (hasSavedSalary) {
      doSave()
    } else {
      setShowConsentModal(true)
    }
  }

  function handleConsentAccept() {
    setShowConsentModal(false)
    grant() // log payslip_module consent
    doSave()
  }

  function doSave() {
    updateProfile.mutate(
      {
        gross_dkk: Number(grossInput),
        ...(bonusAmount ? { bonus_dkk: Number(bonusAmount), bonus_frequency: bonusFreq } : {}),
        ...(otherAmount ? { other_income_dkk: Number(otherAmount) } : {}),
        ...(otherLabel  ? { other_income_label: otherLabel } : {}),
      },
      {
        onSuccess: () => {
          setEditMode(false)
          setJustSaved(true)
          utils.employee.getProfile.invalidate()
          setTimeout(() => setJustSaved(false), 3000)
        },
      }
    )
  }

  // ── Gate: payslip_module consent ─────────────────────────────────────────────
  if (consentLoading) {
    return <div className="text-center py-12 text-muted-foreground text-sm">{t.common.loading}</div>
  }

  if (!hasConsent) {
    return (
      <ConsentModal
        module="payslip_module"
        onAccept={grant}
        onDecline={() => window.history.back()}
      />
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  const savedGross = profile?.gross_dkk ? Math.round(Number(profile.gross_dkk)) : null
  const savedBonus = profile?.bonus_dkk ? Math.round(Number(profile.bonus_dkk)) : null
  const savedOther = profile?.other_income_dkk ? Math.round(Number(profile.other_income_dkk)) : null

  return (
    <div className="max-w-2xl">
      {/* Salary consent popup */}
      {showConsentModal && (
        <SalaryConsentModal
          onAccept={handleConsentAccept}
          onCancel={() => setShowConsentModal(false)}
        />
      )}

      <h1 className="text-2xl font-bold mb-2">
        {en ? 'Payslip calculator' : 'Lønseddelberegner'}
      </h1>
      <p className="text-muted-foreground mb-8">
        {en
          ? 'Enter your salary once — we use it everywhere to personalise your numbers.'
          : 'Indtast din løn én gang — vi bruger den overalt til at personalisere dine tal.'}
      </p>

      {/* ── Salary profile card ──────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden mb-6"
        style={{ border: '1px solid #EDE0D4' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: '#1E0F00' }}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-lg">💰</span>
            <p className="font-semibold text-sm" style={{ color: '#FFF8F3' }}>
              {en ? 'Your salary profile' : 'Din lønprofil'}
            </p>
          </div>
          {hasSavedSalary && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
              style={{ background: '#E8634A20', color: '#E8634A' }}
            >
              {en ? 'Edit' : 'Rediger'}
            </button>
          )}
        </div>

        {/* Saved state — not editing */}
        {hasSavedSalary && !editMode ? (
          <div className="px-6 py-5" style={{ background: '#FFF8F3' }}>
            {justSaved && (
              <div
                className="rounded-xl px-4 py-3 mb-4 flex items-center gap-2 text-sm font-medium"
                style={{ background: '#F0FBF5', border: '1px solid #A3C9B0', color: '#2D5C3E' }}
              >
                ✓ {en ? 'Salary saved to your profile' : 'Løn gemt i din profil'}
              </div>
            )}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm" style={{ color: '#6B5C52' }}>
                  {en ? 'Monthly gross salary' : 'Månedlig bruttoløn'}
                </p>
                <p className="text-sm font-bold font-mono" style={{ color: '#1E0F00' }}>
                  {savedGross?.toLocaleString(en ? 'en-GB' : 'da-DK')} kr.
                </p>
              </div>
              {savedBonus !== null && (
                <div className="flex justify-between items-center">
                  <p className="text-sm" style={{ color: '#6B5C52' }}>
                    {en ? 'Bonus' : 'Bonus'} ({profile.bonus_frequency ? BONUS_FREQ_LABELS[profile.bonus_frequency as BonusFreq]?.[en ? 'en' : 'da'] : ''})
                  </p>
                  <p className="text-sm font-bold font-mono" style={{ color: '#1E0F00' }}>
                    {savedBonus.toLocaleString(en ? 'en-GB' : 'da-DK')} kr.
                  </p>
                </div>
              )}
              {savedOther !== null && (
                <div className="flex justify-between items-center">
                  <p className="text-sm" style={{ color: '#6B5C52' }}>
                    {profile.other_income_label || (en ? 'Other compensation' : 'Anden kompensation')}
                  </p>
                  <p className="text-sm font-bold font-mono" style={{ color: '#1E0F00' }}>
                    {savedOther.toLocaleString(en ? 'en-GB' : 'da-DK')} kr.
                  </p>
                </div>
              )}
            </div>

            {/* Delete section */}
            <div className="mt-5 pt-4" style={{ borderTop: '1px solid #EDE0D4' }}>
              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="text-xs hover:underline"
                  style={{ color: '#9B8B7E' }}
                >
                  🗑️ {en ? 'Delete my salary data' : 'Slet mine løndata'}
                </button>
              ) : (
                <div
                  className="rounded-xl p-4"
                  style={{ background: '#FFF0EC', border: '1px solid #E8634A30' }}
                >
                  <p className="text-sm font-medium mb-1" style={{ color: '#C0392B' }}>
                    {en ? 'This will permanently delete your salary, bonus, and compensation data.' : 'Dette sletter permanent din løn-, bonus- og kompensationsdata.'}
                  </p>
                  <p className="text-xs mb-3" style={{ color: '#9B8B7E' }}>
                    {en ? 'It will no longer be used for personalised calculations.' : 'Den bruges ikke længere til personaliserede beregninger.'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="flex-1 rounded-lg py-2 text-xs font-medium border"
                      style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
                    >
                      {en ? 'Cancel' : 'Annullér'}
                    </button>
                    <button
                      onClick={() => deleteSalaryData.mutate()}
                      disabled={deleteSalaryData.isPending}
                      className="flex-1 rounded-lg py-2 text-xs font-semibold text-white disabled:opacity-60"
                      style={{ background: '#C0392B' }}
                    >
                      {deleteSalaryData.isPending
                        ? (en ? 'Deleting…' : 'Sletter…')
                        : (en ? 'Yes, delete it' : 'Ja, slet det')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Input form — either first time or edit mode */
          <div className="px-6 py-5 space-y-5" style={{ background: '#FFF8F3' }}>
            {!hasSavedSalary && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{ background: '#E8634A08', border: '1px solid #E8634A20' }}
              >
                <span className="text-base flex-shrink-0 mt-0.5">✦</span>
                <p className="text-xs leading-relaxed" style={{ color: '#6B5C52' }}>
                  {en
                    ? 'Save your salary once and every calculator, tax estimate, and recommendation across the app will use your real numbers instead of examples.'
                    : 'Gem din løn én gang og alle beregnere, skatteestimater og anbefalinger i appen bruger dine rigtige tal i stedet for eksempler.'}
                </p>
              </div>
            )}

            {/* Gross salary */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E0F00' }}>
                {en ? 'Monthly gross salary (DKK)' : 'Månedlig bruttoløn (kr.)'}
                <span className="ml-1 text-xs font-normal" style={{ color: '#E8634A' }}>*</span>
              </label>
              <input
                type="number"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                placeholder={en ? 'e.g. 45000' : 'f.eks. 45000'}
                className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-shadow"
                style={{
                  borderColor: '#EDE0D4',
                  background: '#fff',
                  color: '#1E0F00',
                }}
              />
              <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
                {en ? 'Before tax, as shown on your contract or payslip' : 'Før skat, som vist på din kontrakt eller lønseddel'}
              </p>
            </div>

            {/* Bonus */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E0F00' }}>
                {en ? 'Bonus (optional)' : 'Bonus (valgfrit)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(e.target.value)}
                  placeholder={en ? 'Amount (DKK)' : 'Beløb (kr.)'}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#EDE0D4', background: '#fff', color: '#1E0F00' }}
                />
                <select
                  value={bonusFreq}
                  onChange={(e) => setBonusFreq(e.target.value as BonusFreq)}
                  disabled={!bonusAmount}
                  className="rounded-xl border px-3 py-3 text-sm focus:outline-none focus:ring-2 disabled:opacity-40"
                  style={{ borderColor: '#EDE0D4', background: '#fff', color: '#1E0F00' }}
                >
                  {(Object.entries(BONUS_FREQ_LABELS) as [BonusFreq, { en: string; da: string }][]).map(([val, labels]) => (
                    <option key={val} value={val}>{en ? labels.en : labels.da}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
                {en ? 'Performance bonus, holiday allowance, commission, etc.' : 'Performancebonus, ferietillæg, provision osv.'}
              </p>
            </div>

            {/* Other compensation */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1E0F00' }}>
                {en ? 'Other regular compensation (optional)' : 'Anden fast kompensation (valgfrit)'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={otherLabel}
                  onChange={(e) => setOtherLabel(e.target.value)}
                  placeholder={en ? 'Description (e.g. Car allowance)' : 'Beskrivelse (f.eks. Bilgodtgørelse)'}
                  className="flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#EDE0D4', background: '#fff', color: '#1E0F00' }}
                />
                <input
                  type="number"
                  value={otherAmount}
                  onChange={(e) => setOtherAmount(e.target.value)}
                  placeholder={en ? 'DKK/month' : 'kr./md'}
                  className="w-32 rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#EDE0D4', background: '#fff', color: '#1E0F00' }}
                />
              </div>
              <p className="text-xs mt-1" style={{ color: '#9B8B7E' }}>
                {en
                  ? 'Car allowance, phone allowance, meal benefit, overtime pay — anything paid regularly on top of salary'
                  : 'Bilgodtgørelse, telefontillæg, kantineordning, overarbejdsbetaling — alt der betales regelmæssigt oveni lønnen'}
              </p>
            </div>

            {/* Save / Cancel buttons */}
            <div className="flex gap-3 pt-1">
              {editMode && (
                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 rounded-xl py-3 text-sm font-medium border"
                  style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
                >
                  {en ? 'Cancel' : 'Annullér'}
                </button>
              )}
              <button
                onClick={handleSaveClick}
                disabled={!grossInput || Number(grossInput) <= 0 || updateProfile.isPending}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-40 transition-opacity hover:opacity-90"
                style={{ background: '#E8634A' }}
              >
                {updateProfile.isPending
                  ? (en ? 'Saving…' : 'Gemmer…')
                  : hasSavedSalary
                  ? (en ? 'Update salary' : 'Opdatér løn')
                  : (en ? 'Save to profile' : 'Gem i profil')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Payslip breakdown ────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border mb-6"
        style={{ borderColor: '#EDE0D4' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #EDE0D4' }}>
          <p className="text-sm font-semibold" style={{ color: '#1E0F00' }}>
            {en ? 'Live breakdown' : 'Live nedbrydning'}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#9B8B7E' }}>
            {en
              ? `Showing breakdown for ${grossNum > 0 ? grossNum.toLocaleString(en ? 'en-GB' : 'da-DK') + ' kr./month' : '—'}`
              : `Viser nedbrydning for ${grossNum > 0 ? grossNum.toLocaleString(en ? 'en-GB' : 'da-DK') + ' kr./md' : '—'}`}
          </p>
        </div>
        <div className="px-6 py-5">
          {grossNum > 0 && payslipQuery.data?.data ? (
            <PayslipBreakdown result={payslipQuery.data.data} />
          ) : (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: '#9B8B7E' }}>
                {en
                  ? 'Enter your gross salary above to see your full breakdown'
                  : 'Indtast din bruttoløn ovenfor for at se din fulde nedbrydning'}
              </p>
            </div>
          )}
          {payslipQuery.isLoading && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {t.payslip.calculating}
            </div>
          )}
        </div>
      </div>

      <LearnBanner
        moduleId="payslip-guide"
        href="/learning/payslip-guide"
        icon="📄"
        duration="~8 min"
        en={{
          title: 'Understanding Your Danish Payslip',
          teaser: 'Learn every line of your lønseddel — AM-bidrag, A-skat, pension and more.',
          completedTeaser: 'You completed this module. Review it anytime.',
        }}
        da={{
          title: 'Forstå din danske lønseddel',
          teaser: 'Lær hver linje på din lønseddel — AM-bidrag, A-skat, pension og mere.',
          completedTeaser: 'Du har gennemført dette modul. Gense det når som helst.',
        }}
      />
    </div>
  )
}
