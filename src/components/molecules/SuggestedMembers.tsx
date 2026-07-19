'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/atoms/Avatar'
import { MOCK_CONVERSATIONS } from '@/data/conversations'

interface SuggestedMember {
  id: string
  name: string
  role: string
  company: string
  initials: string
  color: string
}

const SUGGESTED_MEMBERS: SuggestedMember[] = [
  ...MOCK_CONVERSATIONS.slice(0, 3).map((conversation) => ({
    id: conversation.id,
    name: conversation.participant_name,
    role: conversation.participant_role,
    company: conversation.participant_company,
    initials: conversation.participant_initials,
    color: conversation.participant_avatar_color,
  })),
  {
    id: 'extra-nina-okonkwo',
    name: 'Nina Okonkwo',
    role: 'Staff Engineer',
    company: 'Shopify',
    initials: 'NO',
    color: '#164E63',
  },
]

export function SuggestedMembers() {
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())

  const toggleFollow = (id: string) => {
    setFollowingIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '16px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
          marginBottom: '12px',
        }}
      >
        Women to follow
      </p>

      <div>
        {SUGGESTED_MEMBERS.map((member, index) => {
          const isFollowing = followingIds.has(member.id)

          return (
            <div
              key={member.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                borderBottom: index === SUGGESTED_MEMBERS.length - 1 ? 'none' : '1px solid var(--color-border-default)',
              }}
            >
              <Avatar initials={member.initials} color={member.color} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  {member.name}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {member.role} · {member.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleFollow(member.id)}
                style={{
                  backgroundColor: isFollowing ? 'var(--color-subtle)' : 'var(--color-brand-subtle)',
                  color: isFollowing ? 'var(--color-text-muted)' : 'var(--color-text-brand)',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '11px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
