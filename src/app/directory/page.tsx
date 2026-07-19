'use client'

import { useMemo, useState } from 'react'
import { Search, Filter, UserPlus, MapPin, X } from 'lucide-react'
import { showToast } from '@/lib/utils'

interface Member {
  id: number
  name: string
  role: string
  company: string
  location: string
  initials: string
  color: string
}

const MOCK_MEMBERS: Member[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Senior Product Manager',
    company: 'Stripe',
    location: 'San Jose, CA, USA',
    initials: 'PS',
    color: '#7B2D8B',
  },
  {
    id: 2,
    name: 'Amara Okafor',
    role: 'Engineering Manager',
    company: 'Notion',
    location: 'San Francisco, CA, USA',
    initials: 'AO',
    color: '#1A6B3C',
  },
  {
    id: 3,
    name: 'Sarah Chen',
    role: 'Director of Marketing',
    company: 'Figma',
    location: 'San Francisco, CA, USA',
    initials: 'SC',
    color: '#B45309',
  },
  {
    id: 4,
    name: 'Fatima Al-Hassan',
    role: 'UX Research Lead',
    company: 'Airbnb',
    location: 'San Francisco, CA, USA',
    initials: 'FA',
    color: '#0F4C81',
  },
  {
    id: 5,
    name: 'Maya Rodriguez',
    role: 'Software Engineer',
    company: 'Linear',
    location: 'Remote',
    initials: 'MR',
    color: '#6B21A8',
  },
  {
    id: 6,
    name: 'Jennifer Park',
    role: 'VP of Operations',
    company: 'Rippling',
    location: 'San Francisco, CA, USA',
    initials: 'JP',
    color: '#065F46',
  },
  {
    id: 7,
    name: 'Aisha Patel',
    role: 'Head of Product',
    company: 'Vercel',
    location: 'San Francisco, CA, USA',
    initials: 'AP',
    color: '#9F1239',
  },
  {
    id: 8,
    name: 'Kezia Williams',
    role: 'Associate Product Manager',
    company: 'Salesforce',
    location: 'San Francisco, CA, USA',
    initials: 'KW',
    color: '#1E40AF',
  },
  {
    id: 9,
    name: 'Nina Okonkwo',
    role: 'Staff Engineer',
    company: 'Shopify',
    location: 'Remote',
    initials: 'NO',
    color: '#164E63',
  },
  {
    id: 10,
    name: 'Lucia Fernandez',
    role: 'Sales Director',
    company: 'HubSpot',
    location: 'Boston, MA, USA',
    initials: 'LF',
    color: '#7C2D12',
  },
  {
    id: 11,
    name: 'Zoe Mitchell',
    role: 'Design Engineer',
    company: 'Anthropic',
    location: 'San Francisco, CA, USA',
    initials: 'ZM',
    color: '#3730A3',
  },
  {
    id: 12,
    name: 'Divya Menon',
    role: 'Chief of Staff',
    company: 'OpenAI',
    location: 'San Francisco, CA, USA',
    initials: 'DM',
    color: '#065F46',
  },
]

type DirectoryTab = 'all' | 'circles' | 'networks'

function filterMembersBySearch(members: Member[], query: string): Member[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return members

  return members.filter(
    (member) =>
      member.name.toLowerCase().includes(normalizedQuery) ||
      member.role.toLowerCase().includes(normalizedQuery) ||
      member.company.toLowerCase().includes(normalizedQuery),
  )
}

export default function DirectoryPage() {
  const [activeTab, setActiveTab] = useState<DirectoryTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')
  const [connectedIds, setConnectedIds] = useState<Set<number>>(new Set())

  const baseMembers = useMemo(() => {
    if (activeTab === 'circles') return MOCK_MEMBERS.slice(0, 3)
    if (activeTab === 'networks') return MOCK_MEMBERS.slice(2, 6)
    return MOCK_MEMBERS
  }, [activeTab])

  const members = useMemo(
    () => filterMembersBySearch(baseMembers, searchQuery),
    [baseMembers, searchQuery],
  )

  const closeInviteModal = () => {
    setIsInviteOpen(false)
    setInviteEmail('')
    setInviteMessage('')
  }

  const handleSendInvitation = () => {
    showToast('Invitation sent!')
    closeInviteModal()
  }

  const toggleConnect = (member: Member) => {
    setConnectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(member.id)) {
        next.delete(member.id)
      } else {
        next.add(member.id)
        showToast('Connected with ' + member.name + '!')
      }
      return next
    })
  }

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Directory</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          All members can decide whether to opt-in to the directory in their privacy settings.
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
            placeholder="Search members..."
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
          onClick={() => setIsInviteOpen(true)}
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
          <UserPlus size={14} />
          Invite a new member
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {(
          [
            { label: 'All', value: 'all' },
            { label: 'In your Circles', value: 'circles' },
            { label: 'In your Networks', value: 'networks' },
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
          gap: '12px',
          marginTop: '20px',
        }}
      >
        {members.map((member) => {
          const isConnected = connectedIds.has(member.id)
          return (
            <div
              key={member.id}
              className="hover:[border-color:var(--color-border-strong)] hover:-translate-y-px"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '12px',
                boxShadow: 'none',
                transition: 'border-color 0.12s, transform 0.12s',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '9999px',
                  background: member.color,
                  color: 'white',
                  fontSize: '15px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {member.initials}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  {member.name}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {member.role} · {member.company}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <MapPin size={12} />
                  {member.location}
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleConnect(member)
                }}
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'flex-start',
                  border: isConnected ? 'none' : '1px solid var(--color-border-default)',
                  borderRadius: '9999px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  color: isConnected ? 'var(--color-text-brand)' : 'var(--color-text-secondary)',
                  background: isConnected ? 'var(--color-brand-subtle)' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  fontWeight: isConnected ? '600' : '400',
                }}
              >
                {isConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
          )
        })}
      </div>

      {isInviteOpen && (
        <div
          onClick={closeInviteModal}
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
              background: 'white',
              width: '440px',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-modal)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Invite a new member
              </p>
              <button
                type="button"
                onClick={closeInviteModal}
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

            <input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
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
              placeholder="Personal message (optional)"
              value={inviteMessage}
              onChange={(event) => setInviteMessage(event.target.value)}
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
                onClick={closeInviteModal}
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
                onClick={handleSendInvitation}
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
                Send invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
