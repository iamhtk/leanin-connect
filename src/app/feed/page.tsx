'use client'

import { useEffect, useState } from 'react'
import { PostComposer } from '@/components/organisms/PostComposer'
import { TopicFilter } from '@/components/molecules/TopicFilter'
import { FeedList } from '@/components/organisms/FeedList'
import { CareerPulseCard } from '@/components/molecules/CareerPulseCard'
import { TrendingTopics } from '@/components/molecules/TrendingTopics'
import { SuggestedMembers } from '@/components/molecules/SuggestedMembers'
import type { Post, CareerPulseCard as CareerPulseData } from '@/lib/types'

const CAREER_PULSE_TAGS = [
  'Negotiation',
  'Promotions',
  'Bias at Work',
  'Work-Life Balance',
  'Career Pivots',
  'Mentorship',
  'Leadership',
  'Early Career',
]

function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-subtle)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ width: '120px', height: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-subtle)' }} />
          <div style={{ width: '160px', height: '10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-subtle)', marginTop: '6px' }} />
        </div>
      </div>
      <div style={{ width: '100%', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-subtle)', marginTop: '16px' }} />
    </div>
  )
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState('all')
  const [careerPulseData, setCareerPulseData] = useState<CareerPulseData | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        const result = await response.json()
        setPosts(result.data ?? [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const fetchCareerPulse = async () => {
      try {
        const response = await fetch('/api/ai/career-pulse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tags: CAREER_PULSE_TAGS }),
        })
        const result = await response.json()
        setCareerPulseData(result.data ?? null)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCareerPulse()
  }, [])

  const handlePostCreated = (post: Post) => {
    setPosts((previousPosts) => [post, ...previousPosts])
  }

  const filteredPosts = selectedTag === 'all' ? posts : posts.filter((post) => post.topic_tag === selectedTag)

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        gap: 0,
        alignItems: 'flex-start',
        padding: 0,
        height: '100%',
      }}
    >
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '24px 24px 0 24px',
          overflowY: 'auto',
          height: '100vh',
        }}
      >
        <PostComposer onPostCreated={handlePostCreated} />
        <TopicFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
        {loading ? (
          <div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <FeedList posts={filteredPosts} />
        )}
      </div>

      <div
        style={{
          width: '280px',
          minWidth: '280px',
          padding: '24px 16px 0 0',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          borderLeft: '1px solid var(--color-border-default)',
          backgroundColor: 'var(--color-background)',
        }}
      >
        <CareerPulseCard data={careerPulseData} />
        <TrendingTopics />
        <SuggestedMembers />
      </div>
    </div>
  )
}
