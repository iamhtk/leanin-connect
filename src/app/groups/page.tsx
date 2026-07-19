'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { showToast } from '@/lib/utils'

const MOCK_GROUPS = [
  {
    id: 1,
    name: 'Growing careers and families',
    color: '#6B21A8',
    members: 71,
    posts: 1,
    description: "We're navigating deadlines, daycare, and everything in between.",
  },
  {
    id: 2,
    name: 'Early-career professionals',
    color: '#065F46',
    members: 64,
    posts: 1,
    description: 'Starting your career can feel exciting, overwhelming, and everything in between.',
  },
  {
    id: 3,
    name: "Let's talk AI",
    color: '#7B2335',
    members: 163,
    posts: 8,
    description: 'A space to explore AI together — honestly, practically, and without judgment.',
  },
  {
    id: 4,
    name: 'Circle Leaders Hub',
    color: '#1E4A8C',
    members: 1,
    posts: 1,
    description: 'A space for Circle Leaders to learn from one another, share ideas, and connect.',
  },
]

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set())

  const filteredGroups = MOCK_GROUPS.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const myGroups = filteredGroups.filter((group) => joinedIds.has(group.id))

  const handleJoinToggle = (group: (typeof MOCK_GROUPS)[number], event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    setJoinedIds((previous) => {
      const next = new Set(previous)
      if (next.has(group.id)) {
        next.delete(group.id)
        showToast(`Left ${group.name}`)
      } else {
        next.add(group.id)
        showToast(`Joined ${group.name}!`)
      }
      return next
    })
  }

  return (
    <main aria-label="Groups" style={{ padding: '24px 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Groups</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Everyone is welcome to join public discussion groups.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: '9999px',
          padding: '0 16px',
          height: '40px',
          marginBottom: '16px',
        }}
      >
        <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
        <label htmlFor="groups-search" className="sr-only">
          Search Groups
        </label>
        <input
          id="groups-search"
          type="search"
          placeholder="Search Groups..."
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

      <div role="tablist" aria-label="Group scope" style={{ display: 'flex', gap: '8px' }}>
        {(
          [
            { label: 'My Groups', value: 'my' },
            { label: 'All Groups', value: 'all' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.value
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
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

      {activeTab === 'my' && myGroups.length === 0 ? (
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
            You haven&apos;t joined any groups yet.
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
            Browse all Groups
          </button>
        </div>
      ) : (
        <div
          role="list"
          style={{
            display: 'grid',
            gridTemplateColumns: 'var(--grid-cols-3)',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          {(activeTab === 'my' ? myGroups : filteredGroups).map((group) => {
            const isJoined = joinedIds.has(group.id)

            return (
              <div
                key={group.id}
                role="listitem"
                aria-label={`${group.name}. ${group.description}`}
                className="hover:[border-color:var(--color-border-strong)] hover:-translate-y-px"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: 'none',
                  transition: 'border-color 0.12s, transform 0.12s',
                  cursor: 'pointer',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    height: '160px',
                    background: group.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.15)',
                    }}
                  />
                  <p
                    style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '700',
                      textAlign: 'center',
                      lineHeight: '1.3',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {group.name}
                  </p>
                </div>
                <div style={{ padding: '16px' }}>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-text-muted)',
                      lineHeight: '1.5',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {group.description}
                  </p>
                  <div
                    style={{
                      marginTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {group.members} members · {group.posts} posts
                    </span>
                    <button
                      type="button"
                      aria-label={isJoined ? `Leave ${group.name}` : `Join ${group.name}`}
                      onClick={(event) => handleJoinToggle(group, event)}
                      style={
                        isJoined
                          ? {
                              background: 'transparent',
                              border: '1px solid var(--color-border-default)',
                              borderRadius: '9999px',
                              padding: '4px 14px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--color-text-default)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }
                          : {
                              background: 'var(--color-brand)',
                              color: 'white',
                              borderRadius: '9999px',
                              padding: '4px 14px',
                              fontSize: '12px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                            }
                      }
                    >
                      {isJoined ? 'Joined' : 'Join'}
                    </button>
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
