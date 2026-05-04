'use client'

import { trpc } from './trpc'
import type { PersonalProfile } from './practical-topic-types'

export function usePersonalProfile() {
  const profileQuery = trpc.employee.getProfile.useQuery(undefined, { retry: false })
  const goalsQuery = trpc.goals.list.useQuery(undefined, { retry: false })

  const raw = profileQuery.data?.data
  const profile: PersonalProfile | null = raw
    ? {
        gross_dkk:        raw.gross_dkk        ?? null,
        age:              raw.age               ?? null,
        municipality:     raw.municipality      ?? null,
        employment_type:  raw.employmentType     ?? null,
        childrenInDaycare: raw.childrenInDaycare ?? null,
      }
    : null

  return {
    profile,
    goals: goalsQuery.data ?? [],
    isLoading: profileQuery.isLoading || goalsQuery.isLoading,
  }
}
