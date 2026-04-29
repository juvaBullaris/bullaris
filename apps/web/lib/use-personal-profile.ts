'use client'

import { trpc } from './trpc'
import type { PersonalProfile } from './practical-topic-types'

export function usePersonalProfile() {
  const profileQuery = trpc.employee.getProfile.useQuery(undefined, { retry: false })
  const goalsQuery = trpc.goals.list.useQuery(undefined, { retry: false })

  const raw = profileQuery.data?.data
  const profile: PersonalProfile | null = raw
    ? {
        gross_dkk: (raw as any).gross_dkk ?? null,
        age: (raw as any).age ?? null,
        municipality: (raw as any).municipality ?? null,
        employment_type: (raw as any).employment_type ?? null,
        childrenInDaycare: (raw as any).childrenInDaycare ?? null,
      }
    : null

  return {
    profile,
    goals: goalsQuery.data ?? [],
    isLoading: profileQuery.isLoading || goalsQuery.isLoading,
  }
}
