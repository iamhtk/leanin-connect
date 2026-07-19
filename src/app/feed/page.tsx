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

const SCOPE_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Your Network', value: 'network' },
  { label: 'Your Circle', value: 'circle' },
  { label: 'Saved', value: 'saved' },
] as const

type ScopeTab = (typeof SCOPE_TABS)[number]['value']

const NETWORK_AUTHOR_NAMES = [
  'Priya Sharma',
  'Sarah Chen',
  'Jennifer Park',
  'Lucia Fernandez',
  'Divya Menon',
]

const CIRCLE_AUTHOR_NAMES = ['Amara Okafor', 'Fatima Al-Hassan', 'Kezia Williams']

const SAVED_POST_IDS_KEY = 'lean_in_saved_posts'

function SkeletonCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '8px',
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
  const [scopeTab, setScopeTab] = useState<ScopeTab>('all')
  const [savedPostIds, setSavedPostIds] = useState<string[]>([])
  const [careerPulseData, setCareerPulseData] = useState<CareerPulseData | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_POST_IDS_KEY)
      if (saved) setSavedPostIds(JSON.parse(saved) as string[])
    } catch {
      // ignore localStorage errors
    }
  }, [])

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

  const handleSavePost = (postId: string) => {
    setSavedPostIds((previous) => {
      const next = previous.includes(postId)
        ? previous.filter((id) => id !== postId)
        : [...previous, postId]
      return next
    })
  }

  const scopeFilteredPosts = posts.filter((post) => {
    if (scopeTab === 'all') return true
    if (scopeTab === 'network') {
      return NETWORK_AUTHOR_NAMES.includes(post.author_name)
    }
    if (scopeTab === 'circle') {
      return CIRCLE_AUTHOR_NAMES.includes(post.author_name)
    }
    if (scopeTab === 'saved') {
      return savedPostIds.includes(post.id)
    }
    return true
  })

  const filteredPosts = scopeFilteredPosts.filter(
    (post) => selectedTag === 'all' || post.topic_tag === selectedTag
  )

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: '1025px',
          minWidth: '840px',
          flexShrink: 0,
          padding: '20px 32px 48px 32px',
        }}
      >
        <PostComposer onPostCreated={handlePostCreated} />
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border-default)',
            marginBottom: '16px',
          }}
        >
          {SCOPE_TABS.map((tab) => {
            const isActive = scopeTab === tab.value

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setScopeTab(tab.value)}
                style={{
                  display: 'inline-flex',
                  padding: '8px 0',
                  marginRight: '24px',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-text-default)' : 'var(--color-text-muted)',
                  cursor: 'pointer',
                  borderBottom: isActive
                    ? '2px solid var(--color-text-default)'
                    : '2px solid transparent',
                  background: 'transparent',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  transition: 'all 0.12s',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <TopicFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
        {loading ? (
          <div>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <FeedList posts={filteredPosts} scopeTab={scopeTab} onSave={handleSavePost} />
        )}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '20px 20px 20px 20px',
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
