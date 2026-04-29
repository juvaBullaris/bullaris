'use client'

interface SalaryConsentModalProps {
  onAccept: () => void
  onCancel: () => void
}

export function SalaryConsentModal({ onAccept, onCancel }: SalaryConsentModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(30, 15, 0, 0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#FFF8F3' }}
      >
        {/* Header */}
        <div className="px-8 py-7" style={{ background: '#1E0F00' }}>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#E8634A20' }}
            >
              🔒
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#E8634A' }}>
                Before we save anything
              </p>
              <h2 className="font-serif text-xl font-bold leading-tight" style={{ color: '#FFF8F3' }}>
                Your salary data will be saved to your profile
              </h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          {/* What gets saved */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9B8B7E' }}>
              What we store
            </p>
            <div className="space-y-2">
              {[
                { icon: '💰', text: 'Your monthly gross salary (DKK)' },
                { icon: '🎁', text: 'Bonus amount and frequency (if provided)' },
                { icon: '📋', text: 'Other regular compensation (if provided)' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-base flex-shrink-0">{item.icon}</span>
                  <p className="text-sm" style={{ color: '#3D2B1F' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees */}
          <div
            className="rounded-xl p-4 space-y-2.5"
            style={{ background: '#F0FBF5', border: '1px solid #A3C9B0' }}
          >
            {[
              { icon: '👤', text: 'Only you can see this data — HR and your employer cannot' },
              { icon: '🗑️', text: 'You can delete it at any time — one click, gone permanently' },
              { icon: '⚡', text: 'It is used only to personalise calculations across the app' },
              { icon: '🇪🇺', text: 'Stored in EU servers, compliant with GDPR' },
            ].map((item) => (
              <div key={item.text} className="flex items-start gap-3">
                <span className="text-sm flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-sm leading-snug" style={{ color: '#2D5C3E' }}>{item.text}</p>
              </div>
            ))}
          </div>

          <p className="text-xs" style={{ color: '#9B8B7E' }}>
            By clicking "Save my salary" you consent to storing this data under the terms above.
            Consent version 1.0 — logged with timestamp to your account as required by Danish data law.
          </p>
        </div>

        {/* Footer */}
        <div
          className="px-8 py-5 flex gap-3"
          style={{ borderTop: '1px solid #EDE0D4' }}
        >
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-3 text-sm font-medium border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#EDE0D4', color: '#6B5C52' }}
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#E8634A' }}
          >
            Yes, save my salary
          </button>
        </div>
      </div>
    </div>
  )
}
