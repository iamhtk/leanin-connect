'use client'

import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import { CoverImage } from '@/components/atoms/CoverImage'
import { COVER_IMAGES } from '@/lib/cover-images'
import { showToast } from '@/lib/utils'

const MOCK_NETWORKS = [
  {
    id: 1,
    name: 'Lean In Network, San Francisco',
    region: 'Americas',
    members: 311,
    circles: 0,
    color: '#7B2335',
    cover_url: COVER_IMAGES.womenCity,
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
    cover_url: COVER_IMAGES.womenIndia,
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
    cover_url: COVER_IMAGES.womenLeadership,
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
    cover_url: COVER_IMAGES.womenLondon,
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
    cover_url: COVER_IMAGES.womenSingapore,
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
    cover_url: COVER_IMAGES.womenNyc,
    description: 'NYC Network bringing together Lean In Circles and women in the Lean In community.',
  },
]

export default function NetworksPage() {
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set())

  const filteredNetworks = MOCK_NETWORKS.filter((network) =>
    network.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRequestClick = (network: (typeof MOCK_NETWORKS)[number], event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()

    setRequestedIds((previous) => {
      const next = new Set(previous)
      if (next.has(network.id)) {
        next.delete(network.id)
      } else {
        next.add(network.id)
        showToast(`Request sent to ${network.name}`)
      }
      return next
    })
  }

  return (
    <main className="page-shell" aria-label="Networks">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Networks</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Networks connect Circles and individuals to local events, speakers, and opportunities.
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
            <label htmlFor="networks-search" className="sr-only">
              Search Networks
            </label>
            <input
              id="networks-search"
              type="search"
              placeholder="Search Networks..."
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
          <button
            type="button"
            onClick={() => showToast('Starting a Network — coming soon')}
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
                  color: isActive ? 'var(--color-background)' : 'var(--color-text-secondary)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
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
            You haven&apos;t joined any Networks yet.
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
            Browse all Networks
          </button>
        </div>
      ) : (
        <div className="page-grid-2" style={{ marginTop: '20px' }}>
          {filteredNetworks.map((network) => {
            const isRequested = requestedIds.has(network.id)

            return (
              <div
                key={network.id}
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
                  <CoverImage src={network.cover_url} alt="" height={160} />
                  <div style={{ position: 'absolute', inset: 0 }}>
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
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      <span>{network.members} members</span>
                      <span>{network.circles} Circles</span>
                      <span>{network.region}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => handleRequestClick(network, event)}
                      style={
                        isRequested
                          ? {
                              background: 'var(--color-subtle)',
                              border: 'none',
                              borderRadius: '9999px',
                              padding: '4px 14px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--color-text-secondary)',
                              cursor: 'pointer',
                              fontFamily: 'inherit',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }
                          : {
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
                            }
                      }
                    >
                      {isRequested ? 'Requested' : 'Request to Join'}
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
