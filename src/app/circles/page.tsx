'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Plus, X, Sparkles } from 'lucide-react'
import { showToast } from '@/lib/utils'

interface CircleRecommendation {
  id: number
  reason: string
}

const MOCK_CIRCLES = [
  {
    id: 1,
    name: 'Women in Finance',
    category: 'FINANCE',
    description:
      'We get together on the 3rd Tuesday of every month to talk about our careers, our aspirations and how we can best support each other.',
    members: 1,
    status: 'Leading',
    color: '#7B2335',
  },
  {
    id: 2,
    name: 'The Balance Collective',
    category: 'LEADERSHIP',
    description:
      'A monthly Circle for women working through the work-life balance question — childcare, energy, partner conversations, and what enough looks like this season.',
    members: 3,
    status: 'Join',
    color: '#1A6B3C',
  },
  {
    id: 3,
    name: 'Leaning into AI',
    category: 'TECH',
    description:
      'An open virtual Circle for women who are curious about AI, experimenting with it at work or in life.',
    members: 108,
    status: 'Join',
    color: '#1E4A8C',
  },
  {
    id: 4,
    name: 'Early-career professionals',
    category: 'CAREER',
    description: 'Starting your career can feel exciting, overwhelming, and everything in between.',
    members: 64,
    status: 'Join',
    color: '#6B21A8',
  },
  {
    id: 5,
    name: 'The Latina Coalition of Silicon Valley',
    category: 'LEADERSHIP',
    description: 'Part of the Lean In Latinas Network. Bay Area Latinas in tech, finance, and beyond.',
    members: 37,
    status: 'Join',
    color: '#B45309',
  },
  {
    id: 6,
    name: 'Mechanical Engineering Circle Delhi',
    category: 'TECH',
    description: 'A Circle for Mechanical Engineering students at IGDTUW in Delhi.',
    members: 12,
    status: 'Join',
    color: '#065F46',
  },
]

export default function CirclesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set())
  const [isOpen, setIsOpen] = useState(false)
  const [circleName, setCircleName] = useState('')
  const [circleAbout, setCircleAbout] = useState('')
  const [recommendations, setRecommendations] = useState<CircleRecommendation[]>([])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/ai/circle-recommend', { method: 'POST' })
        const result = (await response.json()) as { data?: CircleRecommendation[] }
        if (result.data) {
          setRecommendations(result.data)
        }
      } catch {
        // Keep empty recommendations on failure
      }
    }

    void fetchRecommendations()
  }, [])

  const filteredCircles = MOCK_CIRCLES.filter((circle) =>
    circle.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const closeModal = () => {
    setIsOpen(false)
    setCircleName('')
    setCircleAbout('')
  }

  const handleCreateCircle = () => {
    showToast('Circle created!')
    closeModal()
  }

  const handleJoinClick = (circle: (typeof MOCK_CIRCLES)[number], event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    if (circle.status === 'Leading') {
      showToast('You are leading this Circle')
      return
    }

    if (joinedIds.has(circle.id)) {
      showToast(`Already joined ${circle.name}`)
      return
    }

    setJoinedIds((previous) => {
      const next = new Set(previous)
      next.add(circle.id)
      return next
    })
    showToast(`Joined ${circle.name}!`)
  }

  return (
    <main className="page-shell" aria-label="Circles">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Circles</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Small peer groups that meet regularly to connect, learn, and support one another.
        </p>
      </div>

      <div className="page-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
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
          <label htmlFor="circles-search" className="sr-only">
            Search Circles
          </label>
          <input
            id="circles-search"
            type="search"
            placeholder="Search Circles..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
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
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--color-brand)',
            color: 'white',
            borderRadius: '9999px',
            padding: '8px 20px',
            fontSize: '13px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Plus size={14} />
          Start a Circle
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {(
          [
            { label: 'My Circles', value: 'my' },
            { label: 'All Circles', value: 'all' },
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

      {activeTab === 'my' ? (
        <div
          style={{
            marginTop: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '8px',
          }}
        >
          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            You&apos;re not in any Circles yet.
          </p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Browse all Circles to find one to join.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            style={{
              marginTop: '8px',
              background: 'var(--color-brand)',
              color: 'white',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Browse all Circles
          </button>
        </div>
      ) : (
        <>
          {recommendations.length > 0 && (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-brand)',
                }}
              >
                <Sparkles size={12} aria-hidden="true" />
                Recommended for you
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  paddingBottom: '4px',
                }}
              >
                {recommendations.map((rec) => {
                  const circle = MOCK_CIRCLES.find((item) => item.id === rec.id)
                  if (!circle) return null

                  const isJoined = joinedIds.has(circle.id)
                  const isLeading = circle.status === 'Leading'

                  return (
                    <div
                      key={rec.id}
                      onClick={() => router.push('/circles/' + circle.id)}
                      style={{
                        width: '260px',
                        minWidth: '260px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-brand-muted)',
                        borderLeft: '3px solid var(--color-brand)',
                        borderRadius: '12px',
                        padding: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--color-brand)',
                          background: 'var(--color-brand-subtle)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        {circle.category}
                      </span>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--color-text-default)',
                          marginTop: '8px',
                        }}
                      >
                        {circle.name}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-text-muted)',
                          marginTop: '4px',
                          lineHeight: '1.4',
                        }}
                      >
                        {rec.reason}
                      </p>
                      <button
                        type="button"
                        onClick={(event) => handleJoinClick(circle, event)}
                        style={{
                          marginTop: '10px',
                          background: isLeading || isJoined ? 'var(--color-brand-subtle)' : 'var(--color-brand)',
                          color: isLeading || isJoined ? 'var(--color-brand)' : 'white',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: '5px 14px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        {isLeading ? 'Leading' : isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="page-grid-2" style={{ marginTop: recommendations.length > 0 ? '0' : '20px' }}>
          {filteredCircles.map((circle) => {
            const isJoined = joinedIds.has(circle.id)
            const isLeading = circle.status === 'Leading'

            return (
              <div
                key={circle.id}
                onClick={() => router.push('/circles/' + circle.id)}
                className="card-hover"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: 'none',
                }}
              >
                <div
                  style={{
                    height: '160px',
                    background: circle.color,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.08em',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {circle.category}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                    {circle.name}
                  </p>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-muted)',
                      lineHeight: '1.5',
                      marginTop: '6px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {circle.description}
                  </p>
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {['var(--color-brand)', 'var(--color-brand-muted)', 'var(--color-muted)'].map(
                          (avatarColor, index) => (
                            <div
                              key={avatarColor}
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '9999px',
                                background:
                                  avatarColor === 'var(--color-muted)' ? 'var(--color-brand-subtle)' : avatarColor,
                                border: '1.5px solid var(--color-surface)',
                                marginLeft: index === 0 ? 0 : '-6px',
                                zIndex: 3 - index,
                              }}
                            />
                          )
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {circle.members} {circle.members === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => handleJoinClick(circle, event)}
                      style={
                        isLeading
                          ? {
                              background: 'var(--color-brand)',
                              color: 'white',
                              padding: '4px 14px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }
                          : isJoined
                            ? {
                                background: 'var(--color-brand-subtle)',
                                color: 'var(--color-brand)',
                                padding: '4px 14px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }
                            : {
                                background: 'var(--color-brand)',
                                color: 'white',
                                padding: '4px 14px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                              }
                      }
                    >
                      {isLeading ? 'Leading' : isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        </>
      )}

      {isOpen && (
        <div
          onClick={closeModal}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              width: '440px',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-modal)',
            }}
            className="responsive-modal"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Start a Circle
              </p>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '12px', lineHeight: '1.5' }}>
              Starting a Circle lets you build a small group of women who meet regularly to support each other.
            </p>

            <input
              type="text"
              placeholder="Circle name"
              value={circleName}
              onChange={(event) => setCircleName(event.target.value)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid var(--color-border-default)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-text-default)',
                boxSizing: 'border-box',
              }}
            />

            <textarea
              placeholder="What is your Circle about?"
              value={circleAbout}
              onChange={(event) => setCircleAbout(event.target.value)}
              rows={4}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid var(--color-border-default)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-text-default)',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-default)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCircle}
                style={{
                  background: 'var(--color-brand)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Create Circle
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
