'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'
import { useLanguage } from '@/lib/language-context'

export default function NudgesPage() {
  const { t } = useLanguage()
  const [subject, setSubject]         = useState('')
  const [body, setBody]               = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [formError, setFormError]     = useState('')

  const listQuery     = trpc.campaigns.list.useQuery()
  const createMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      setSubject('')
      setBody('')
      setScheduledAt('')
      setFormError('')
      listQuery.refetch()
    },
    onError: (err) => setFormError(err.message),
  })
  const cancelMutation = trpc.campaigns.cancel.useMutation({
    onSuccess: () => listQuery.refetch(),
  })

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!subject || !body || !scheduledAt) {
      setFormError('Alle felter er påkrævet.')
      return
    }
    createMutation.mutate({ subject, body, scheduledAt: new Date(scheduledAt) })
  }

  const tNudges = (t as any).nudges ?? {}

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-1" style={{ color: '#1E0F00' }}>
        {tNudges.title ?? 'Nudge-kampagner'}
      </h1>
      <p className="text-sm mb-8" style={{ color: '#A0917F' }}>
        {tNudges.subtitle ?? 'Send målrettede beskeder til alle medarbejdere på et bestemt tidspunkt.'}
      </p>

      {/* Create form */}
      <form onSubmit={handleCreate} className="rounded-2xl p-6 mb-8" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
        <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
          {tNudges.new ?? 'Ny kampagne'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B5C52' }}>
              {tNudges.subject ?? 'Emne'}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              className="w-full rounded-lg px-3 py-2 text-sm"
              style={{ border: '1.5px solid #EDE0D4', background: '#FDF6EE', color: '#1E0F00', outline: 'none' }}
              placeholder="F.eks. Husk at tjekke dine mål denne måned"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B5C52' }}>
              {tNudges.body ?? 'Besked'} <span style={{ color: '#A0917F' }}>({body.length}/500)</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full rounded-lg px-3 py-2 text-sm resize-none"
              style={{ border: '1.5px solid #EDE0D4', background: '#FDF6EE', color: '#1E0F00', outline: 'none' }}
              placeholder="Skriv din besked her..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6B5C52' }}>
              {tNudges.scheduledAt ?? 'Afsendingstidspunkt'}
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{ border: '1.5px solid #EDE0D4', background: '#FDF6EE', color: '#1E0F00', outline: 'none' }}
            />
          </div>

          {formError && (
            <p className="text-xs" style={{ color: '#DC2626' }}>{formError}</p>
          )}

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 transition"
            style={{ background: '#E8634A' }}
          >
            {createMutation.isPending ? '...' : (tNudges.create ?? 'Opret kampagne')}
          </button>
        </div>
      </form>

      {/* Campaign list */}
      <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #EDE0D4' }}>
        <h2 className="font-serif font-semibold text-lg mb-4" style={{ color: '#1E0F00' }}>
          Planlagte og afsendte kampagner
        </h2>

        {listQuery.isLoading && (
          <p className="text-sm" style={{ color: '#A0917F' }}>Indlæser...</p>
        )}

        {listQuery.data && listQuery.data.length === 0 && (
          <p className="text-sm" style={{ color: '#A0917F' }}>
            {tNudges.noCampaigns ?? 'Ingen kampagner endnu.'}
          </p>
        )}

        {listQuery.data && listQuery.data.length > 0 && (
          <div className="space-y-3">
            {listQuery.data.map((campaign) => {
              const isSent = campaign.sentAt !== null
              const scheduledDate = new Date(campaign.scheduledAt).toLocaleString('da-DK', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })
              return (
                <div
                  key={campaign.id}
                  className="flex items-start justify-between rounded-xl p-4"
                  style={{ background: '#FDF6EE', border: '1px solid #EDE0D4' }}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-semibold mb-0.5" style={{ color: '#1E0F00' }}>
                      {campaign.subject}
                    </p>
                    <p className="text-xs truncate mb-1" style={{ color: '#6B5C52' }}>
                      {campaign.body}
                    </p>
                    <p className="text-xs" style={{ color: '#A0917F' }}>
                      {scheduledDate} ·{' '}
                      <span
                        className="font-medium"
                        style={{ color: isSent ? '#16A34A' : '#E8634A' }}
                      >
                        {isSent
                          ? (tNudges.status?.sent ?? 'Afsendt')
                          : (tNudges.status?.scheduled ?? 'Planlagt')}
                      </span>
                    </p>
                  </div>
                  {!isSent && (
                    <button
                      onClick={() => cancelMutation.mutate({ id: campaign.id })}
                      disabled={cancelMutation.isPending}
                      className="text-xs px-3 py-1 rounded-lg font-medium shrink-0"
                      style={{ color: '#DC2626', border: '1px solid #FCA5A5', background: '#FFF1F2' }}
                    >
                      {tNudges.cancel ?? 'Annuller'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
