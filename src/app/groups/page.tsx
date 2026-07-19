'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

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
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set())

  const toggleJoined = (id: number) => {
    setJoinedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const groups =
    activeTab === 'my' ? MOCK_GROUPS.filter((group) => joinedIds.has(group.id)) : MOCK_GROUPS

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
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
        <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search Groups..."
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

      <div style={{ display: 'flex', gap: '8px' }}>
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
        {groups.map((group) => {
          const isJoined = joinedIds.has(group.id)
          return (
            <div
              key={group.id}
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
                  height: '140px',
                  background: group.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                }}
              >
                <p
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    textAlign: 'center',
                    lineHeight: '1.3',
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
                    onClick={() => toggleJoined(group.id)}
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
    </div>
  )
}
