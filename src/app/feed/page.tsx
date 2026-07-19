'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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

const SAVED_POST_IDS_KEY = 'lean_in_saved_posts'

function FeedPageContent() {
  const searchParams = useSearchParams()
  const [selectedTag, setSelectedTag] = useState('all')
  const [scopeTab, setScopeTab] = useState<ScopeTab>('all')
  const [savedPostIds, setSavedPostIds] = useState<string[]>([])
  const [careerPulseData, setCareerPulseData] = useState<CareerPulseData | null>(null)
  const [addPost, setAddPost] = useState<((post: Post) => void) | null>(null)

  useEffect(() => {
    const topic = searchParams.get('topic')
    if (topic) {
      setSelectedTag(topic)
    }
  }, [searchParams])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_POST_IDS_KEY)
      if (saved) setSavedPostIds(JSON.parse(saved) as string[])
    } catch {
      // ignore localStorage errors
    }
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
      } catch {
        // Keep null career pulse on failure
      }
    }

    void fetchCareerPulse()
  }, [])

  const handlePostCreated = (post: Post) => {
    addPost?.(post)
  }

  const handleSavePost = (postId: string) => {
    setSavedPostIds((previous) => {
      const next = previous.includes(postId)
        ? previous.filter((id) => id !== postId)
        : [...previous, postId]
      return next
    })
  }

  return (
    <div className="feed-layout">
      <div className="feed-left-column">
        <PostComposer onPostCreated={handlePostCreated} />
        <div
          className="pills-scroll"
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border-default)',
            marginBottom: '16px',
            overflowX: 'auto',
            gap: '0',
            WebkitOverflowScrolling: 'touch',
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
        <FeedList
          selectedTag={selectedTag}
          scopeTab={scopeTab}
          savedPostIds={savedPostIds}
          onSave={handleSavePost}
          onAddPostReady={(nextAddPost) => {
            setAddPost(() => nextAddPost)
          }}
        />
      </div>

      <div className="feed-right-column">
        <CareerPulseCard data={careerPulseData} />
        <TrendingTopics />
        <SuggestedMembers />
      </div>
    </div>
  )
}

export default function FeedPage() {
  return (
    <Suspense fallback={null}>
      <FeedPageContent />
    </Suspense>
  )
}
