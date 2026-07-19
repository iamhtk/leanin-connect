'use client'

import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'

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
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all')

  const circles = activeTab === 'my' ? MOCK_CIRCLES.filter((circle) => circle.status === 'Leading') : MOCK_CIRCLES

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Circles</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Small peer groups that meet regularly to connect, learn, and support one another.
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
            placeholder="Search Circles..."
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
        <button
          type="button"
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
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '20px',
        }}
      >
        {circles.map((circle) => (
          <div
            key={circle.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: 'none',
            }}
          >
            <div style={{ height: '100px', background: circle.color, position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  fontSize: '10px',
                  fontWeight: '600',
                  color: 'white',
                  textTransform: 'uppercase',
                  padding: '8px 10px',
                }}
              >
                {circle.category}
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-default)' }}>{circle.name}</p>
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
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {circle.members} {circle.members === 1 ? 'member' : 'members'}
                </span>
                <button
                  type="button"
                  style={{
                    background: 'var(--color-brand)',
                    color: 'white',
                    padding: '4px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {circle.status}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
