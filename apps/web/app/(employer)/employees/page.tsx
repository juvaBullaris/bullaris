'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc'

export default function EmployeesPage() {
  const [inviteEmail, setInviteEmail] = useState('')
  const employeesQuery = trpc.employer.listEmployees.useQuery()
  const inviteMutation = trpc.employer.inviteEmployee.useMutation({
    onSuccess: () => {
      employeesQuery.refetch()
      setInviteEmail('')
    },
  })

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Medarbejdere</h1>
      <p className="text-muted-foreground mb-8">
        Inviter medarbejdere og se onboarding-status. Ingen finansielle data vises her.
      </p>

      {/* Invite form */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <h2 className="font-semibold mb-4">Inviter medarbejder</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Medarbejdere modtager et magic link og opretter selv deres profil. De inviteres aldrig
          til at angive finansielle oplysninger uden eksplicit samtykke.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (inviteEmail) inviteMutation.mutate({ email: inviteEmail })
          }}
          className="flex gap-3"
        >
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="medarbejder@virksomhed.dk"
            className="flex-1 rounded-md border px-3 py-2 text-sm"
            required
          />
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="rounded-md bg-bullaris-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {inviteMutation.isPending ? 'Sender...' : 'Send invitation'}
          </button>
        </form>
        {inviteMutation.isSuccess && (
          <p className="text-sm text-bullaris-teal mt-2">Invitation sendt.</p>
        )}
        {inviteMutation.isError && (
          <p className="text-sm text-destructive mt-2">Fejl: {inviteMutation.error.message}</p>
        )}
      </div>

      {/* Employee list — no financial data */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Medarbejderliste</h2>
          <span className="text-xs text-muted-foreground">
            {employeesQuery.data?.length ?? 0} medarbejdere
          </span>
        </div>
        {employeesQuery.isLoading && (
          <div className="p-8 text-center text-sm text-muted-foreground">Indlæser...</div>
        )}
        {employeesQuery.data?.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Ingen medarbejdere endnu.
          </div>
        )}
        <ul className="divide-y">
          {employeesQuery.data?.map((emp) => (
            <li key={emp.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{emp.displayName ?? 'Unavngivet'}</p>
                <p className="text-xs text-muted-foreground">{emp.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    emp.onboarded
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {emp.onboarded ? 'Onboardet' : 'Afventer'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
