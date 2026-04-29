'use client'

import { notFound } from 'next/navigation'
import { use } from 'react'
import { getPracticalTopic } from '@/lib/practical-topics'
import { usePersonalProfile } from '@/lib/use-personal-profile'
import { PracticalTopicLayout } from '@/components/learning/practical/PracticalTopicLayout'

interface Props {
  params: Promise<{ topicId: string }>
}

export default function PracticalTopicPage({ params }: Props) {
  const { topicId } = use(params)
  const topic = getPracticalTopic(topicId)

  if (!topic) notFound()

  const { profile } = usePersonalProfile()

  return <PracticalTopicLayout topic={topic} profile={profile} />
}
