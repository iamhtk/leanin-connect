'use client'

import { useState } from 'react'
import { Search, Filter, Bookmark } from 'lucide-react'

const MOCK_RESOURCES = [
  {
    id: 1,
    type: 'Workshop',
    title: 'Your first Circle meeting',
    description: 'Get to know each other and lay the groundwork for a successful Circle.',
    author: 'Lean In',
    authorInitials: 'LI',
    readTime: '5 min',
    color: '#7B2335',
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
    featured: false,
  },
]

type ResourcesTab = 'all' | 'library' | 'tips' | 'tracks' | 'saved'

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<ResourcesTab>('all')
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())

  const toggleSaved = (id: number) => {
    setSavedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const resources =
    activeTab === 'saved'
      ? MOCK_RESOURCES.filter((resource) => savedIds.has(resource.id))
      : activeTab === 'library'
        ? MOCK_RESOURCES.filter((resource) => resource.type === 'Article' || resource.type === 'Toolkit')
        : activeTab === 'tips'
          ? MOCK_RESOURCES.filter((resource) => resource.featured)
          : activeTab === 'tracks'
            ? MOCK_RESOURCES.filter((resource) => resource.type === 'Workshop' || resource.type === 'Video')
            : MOCK_RESOURCES

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Resources</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Toolkits, workshops, articles, and videos to help you lead.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
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
          <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search resources..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              background: 'transparent',
              color: 'var(--color-text-default)',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <button
          type="button"
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
                color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {resources.map((resource) => {
          const isSaved = savedIds.has(resource.id)
          return (
            <div
              key={resource.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'none',
              }}
            >
              <div style={{ height: '100px', background: resource.color, position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: 'white',
                    borderRadius: '9999px',
                    padding: '4px 8px',
                    fontSize: '10px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-default)',
                  }}
                >
                  {resource.type}
                </span>
                {resource.featured && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '36px',
                      background: 'white',
                      borderRadius: '9999px',
                      padding: '4px 8px',
                      fontSize: '10px',
                      fontWeight: '600',
                      color: 'var(--color-text-default)',
                    }}
                  >
                    Featured
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => toggleSaved(resource.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    padding: 0,
                  }}
                >
                  <Bookmark
                    size={14}
                    fill={isSaved ? 'white' : 'none'}
                    color="white"
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
    </div>
  )
}
