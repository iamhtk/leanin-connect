'use client'

import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'

const MOCK_NETWORKS = [
  {
    id: 1,
    name: 'Lean In Network, San Francisco',
    region: 'Americas',
    members: 311,
    circles: 0,
    color: '#7B2335',
    description:
      "Empowering women to lead by bringing Lean In's mission to life locally through Circles, events, and resources.",
  },
  {
    id: 2,
    name: 'Women in Tech India',
    region: 'APAC',
    members: 4,
    circles: 0,
    color: '#1E4A8C',
    description:
      'WiTi focuses on the technology sector and supports women in technology with various backgrounds.',
  },
  {
    id: 3,
    name: 'Network Leaders Hub',
    region: 'Global',
    members: 130,
    circles: 0,
    color: '#065F46',
    description:
      'This space is exclusively built just for our volunteers who are running existing Lean In Networks.',
  },
  {
    id: 4,
    name: 'Lean In Network, London',
    region: 'EMEA',
    members: 89,
    circles: 2,
    color: '#6B21A8',
    description:
      "Empowering women to lead by bringing Lean In's mission to life locally through Circles, events, and resources.",
  },
  {
    id: 5,
    name: 'Women in Tech Singapore',
    region: 'APAC',
    members: 214,
    circles: 0,
    color: '#B45309',
    description:
      'Lean In Women in Tech Singapore aims to connect extraordinary women across the tech industry.',
  },
  {
    id: 6,
    name: 'Lean In Network, New York City',
    region: 'Americas',
    members: 420,
    circles: 5,
    color: '#1A6B3C',
    description: 'NYC Network bringing together Lean In Circles and women in the Lean In community.',
  },
]

export default function NetworksPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all')

  const networks = activeTab === 'my' ? MOCK_NETWORKS.slice(0, 2) : MOCK_NETWORKS

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Networks</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Networks connect Circles and individuals to local events, speakers, and opportunities.
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
            placeholder="Search Networks..."
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
          Start a Network
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {(
          [
            { label: 'My Networks', value: 'my' },
            { label: 'All Networks', value: 'all' },
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
        {networks.map((network) => (
          <div
            key={network.id}
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
              style={{
                height: '160px',
                background: network.color,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 60%)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.9)',
                  textTransform: 'uppercase',
                }}
              >
                LEAN IN NETWORK
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                {network.name}
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
                {network.description}
              </p>
              <div
                style={{
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {network.members} members · {network.circles} Circles · {network.region}
                </span>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '9999px',
                    padding: '4px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--color-text-default)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  Request to Join
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
