'use client'

import { notFound } from 'next/navigation'
import { useParams } from 'next/navigation'
import { getPracticalTopic } from '@/lib/practical-topics'
import { usePersonalProfile } from '@/lib/use-personal-profile'
import { PracticalTopicLayout } from '@/components/learning/practical/PracticalTopicLayout'

export default function PracticalTopicPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const topic = getPracticalTopic(topicId)

  if (!topic) notFound()

  const { profile } = usePersonalProfile()

  return <PracticalTopicLayout topic={topic} profile={profile} />
}
