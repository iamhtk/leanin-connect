'use client'

import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Bookmark } from 'lucide-react'
import { showToast } from '@/lib/utils'
import { COVER_IMAGES } from '@/lib/cover-images'
import { CoverImage } from '@/components/atoms/CoverImage'

interface Resource {
  id: number
  type: string
  title: string
  description: string
  author: string
  authorInitials: string
  readTime: string
  color: string
  cover_url: string
  featured: boolean
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: 1,
    type: 'Workshop',
    title: 'Your first Circle meeting',
    description: 'Get to know each other and lay the groundwork for a successful Circle.',
    author: 'Lean In',
    authorInitials: 'LI',
    readTime: '5 min',
    color: '#7B2335',
    cover_url: COVER_IMAGES.womenWorkshop,
    featured: true,
  },
  {
    id: 2,
    type: 'Article',
    title: 'Lean In Connect FAQs',
    description: 'Get answers to common questions about using Lean In Connect.',
    author: 'Lean In Team',
    authorInitials: 'LT',
    readTime: '4 min',
    color: '#1E4A8C',
    cover_url: COVER_IMAGES.notebookDesk,
    featured: true,
  },
  {
    id: 3,
    type: 'Video',
    title: 'How to negotiate so everyone wins',
    description: 'Learn the Stanford negotiation framework to get better results.',
    author: 'Sara Chen',
    authorInitials: 'SC',
    readTime: '8 min',
    color: '#065F46',
    cover_url: COVER_IMAGES.bookLearning,
    featured: false,
  },
  {
    id: 4,
    type: 'Article',
    title: 'Make stress work for you',
    description: 'Your mindset shapes stress. Learn how to reframe it.',
    author: 'Diane Kasprowicz',
    authorInitials: 'DK',
    readTime: '4 min',
    color: '#B45309',
    cover_url: COVER_IMAGES.womenPresentation,
    featured: false,
  },
  {
    id: 5,
    type: 'Video',
    title: 'Why stories beat data at work',
    description: 'Learn the four elements of stories that persuade and inspire.',
    author: 'Aisha Patel',
    authorInitials: 'AP',
    readTime: '7 min',
    color: '#6B21A8',
    cover_url: COVER_IMAGES.womenWriting,
    featured: false,
  },
  {
    id: 6,
    type: 'Toolkit',
    title: 'Negotiation prep template',
    description: 'A 12-page worksheet for walking into your next salary conversation.',
    author: 'Sara Chen',
    authorInitials: 'SC',
    readTime: '4 min',
    color: '#1A6B3C',
    cover_url: COVER_IMAGES.deskWork,
    featured: false,
  },
  {
    id: 7,
    type: 'Article',
    title: 'Managing up when your manager changes',
    description: 'The first 30 days under a new manager set the tone.',
    author: 'Aisha Patel',
    authorInitials: 'AP',
    readTime: '7 min',
    color: '#7B2335',
    cover_url: COVER_IMAGES.womenMentorship,
    featured: false,
  },
  {
    id: 8,
    type: 'Article',
    title: '5 ways to fight burnout at work',
    description: 'Protect your energy with five strategies to prevent burnout.',
    author: 'Priya Sharma',
    authorInitials: 'PS',
    readTime: '6 min',
    color: '#0F4C81',
    cover_url: COVER_IMAGES.womenLeadership,
    featured: false,
  },
  {
    id: 9,
    type: 'Podcast',
    title: 'How to lead with data and courage',
    description: "Google's former People Operations leader shares principles.",
    author: 'Jennifer Park',
    authorInitials: 'JP',
    readTime: '32 min',
    color: '#065F46',
    cover_url: COVER_IMAGES.womenLaptop,
    featured: false,
  },
]

const SAVED_RESOURCES_KEY = 'lean_in_saved_resources'

type ResourcesTab = 'all' | 'library' | 'tips' | 'tracks' | 'saved'

function filterResourcesBySearch(resources: Resource[], query: string): Resource[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return resources

  return resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(normalizedQuery) ||
      resource.author.toLowerCase().includes(normalizedQuery),
  )
}

function parseSavedIds(raw: string | null): Set<number> {
  if (!raw) return new Set()

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()

    const ids = parsed.filter((value): value is number => typeof value === 'number')
    return new Set(ids)
  } catch {
    return new Set()
  }
}

export default function ResourcesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ResourcesTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())
  const [hasLoadedSaved, setHasLoadedSaved] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(SAVED_RESOURCES_KEY)
    setSavedIds(parseSavedIds(stored))
    setHasLoadedSaved(true)
  }, [])

  useEffect(() => {
    if (!hasLoadedSaved) return
    window.localStorage.setItem(SAVED_RESOURCES_KEY, JSON.stringify([...savedIds]))
  }, [savedIds, hasLoadedSaved])

  const toggleSaved = (resource: Resource, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    setSavedIds((previous) => {
      const next = new Set(previous)
      if (next.has(resource.id)) {
        next.delete(resource.id)
        showToast('Removed from library')
      } else {
        next.add(resource.id)
        showToast('Saved to your library')
      }
      return next
    })
  }

  const resources = useMemo(() => {
    let baseResources: Resource[]

    if (activeTab === 'saved') {
      baseResources = MOCK_RESOURCES.filter((resource) => savedIds.has(resource.id))
    } else if (activeTab === 'library') {
      baseResources = MOCK_RESOURCES.filter(
        (resource) => resource.type === 'Article' || resource.type === 'Workshop',
      )
    } else if (activeTab === 'tips') {
      baseResources = MOCK_RESOURCES.filter((resource) => resource.featured)
    } else if (activeTab === 'tracks') {
      baseResources = filterResourcesBySearch(MOCK_RESOURCES, searchQuery).slice(0, 2)
      return baseResources
    } else {
      baseResources = MOCK_RESOURCES
    }

    return filterResourcesBySearch(baseResources, searchQuery)
  }, [activeTab, savedIds, searchQuery])

  const showTrackBadge = activeTab === 'tracks'

  return (
    <main className="page-shell" aria-label="Resources">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Resources</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Toolkits, workshops, articles, and videos to help you lead.
        </p>
      </div>

      <div className="sticky-nav">
        <div className="page-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '0 16px',
              height: '40px',
            }}
          >
            <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
            <label htmlFor="resources-search" className="sr-only">
              Search resources
            </label>
            <input
              id="resources-search"
              type="search"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                background: 'transparent',
                color: 'var(--color-text-default)',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => showToast('Filters coming soon')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              color: 'var(--color-text-default)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Filter size={14} />
            Filters
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {(
            [
              { label: 'All', value: 'all' },
              { label: 'Leadership Library', value: 'library' },
              { label: 'Circle Leader Tips', value: 'tips' },
              { label: 'Learning Tracks', value: 'tracks' },
              { label: 'Saved', value: 'saved' },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  border: isActive ? 'none' : '1px solid var(--color-border-default)',
                  background: isActive ? 'var(--color-text-default)' : 'transparent',
                  color: isActive ? 'var(--color-background)' : 'var(--color-text-secondary)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === 'saved' && resources.length === 0 ? (
        <div
          style={{
            marginTop: '32px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '14px',
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <Bookmark size={40} style={{ color: 'var(--color-brand)', marginBottom: '16px' }} />
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            No saved resources yet.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Bookmark resources to find them here later.
          </p>
        </div>
      ) : (
        <div className="page-grid-3" style={{ marginTop: '20px' }}>
          {resources.map((resource) => {
            const isSaved = savedIds.has(resource.id)
            return (
              <div
                key={resource.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push('/resources/' + resource.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push('/resources/' + resource.id)
                  }
                }}
                className="card-hover"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: 'none',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <CoverImage
                    src={resource.cover_url}
                    alt={resource.title}
                    height={120}
                    overlayOpacity={0.25}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'var(--color-surface)',
                      borderRadius: '9999px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-default)',
                      zIndex: 1,
                    }}
                  >
                    {showTrackBadge ? 'Track' : resource.type}
                  </span>
                  {resource.featured && !showTrackBadge && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '36px',
                        background: 'var(--color-surface)',
                        borderRadius: '9999px',
                        padding: '4px 8px',
                        fontSize: '10px',
                        fontWeight: '600',
                        color: 'var(--color-text-default)',
                        zIndex: 1,
                      }}
                    >
                      Featured
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(event) => toggleSaved(resource, event)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: isSaved ? 'var(--color-brand)' : 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: isSaved ? '4px' : 0,
                      zIndex: 1,
                    }}
                  >
                    <Bookmark
                      size={14}
                      fill={isSaved ? 'white' : 'none'}
                      color={isSaved ? 'white' : 'white'}
                    />
                  </button>
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                    {resource.title}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      marginTop: '4px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.5',
                    }}
                  >
                    {resource.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        background: 'var(--color-brand-subtle)',
                        color: 'var(--color-text-brand)',
                        fontSize: '10px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {resource.authorInitials}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{resource.author}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>·</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{resource.readTime}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
