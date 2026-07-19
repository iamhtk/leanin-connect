'use client'

import { useState, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { showToast } from '@/lib/utils'
import { Avatar } from '@/components/atoms/Avatar'
import { PortraitImage } from '@/components/atoms/PortraitImage'
import { COVER_IMAGES } from '@/lib/cover-images'
import { MOCK_CONVERSATIONS } from '@/data/conversations'

interface SuggestedMember {
  id: string
  name: string
  role: string
  company: string
  initials: string
  color: string
  avatar_url?: string
}

const SUGGESTED_MEMBERS: SuggestedMember[] = [
  ...MOCK_CONVERSATIONS.slice(0, 3).map((conversation) => ({
    id: conversation.id,
    name: conversation.participant_name,
    role: conversation.participant_role,
    company: conversation.participant_company,
    initials: conversation.participant_initials,
    color: conversation.participant_avatar_color,
    avatar_url: conversation.participant_avatar_url,
  })),
  {
    id: 'extra-nina-okonkwo',
    name: 'Nina Okonkwo',
    role: 'Staff Engineer',
    company: 'Shopify',
    initials: 'NO',
    color: 'var(--color-status-info)',
    avatar_url: COVER_IMAGES.portrait4,
  },
]

export function SuggestedMembers() {
  const router = useRouter()
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set())

  const toggleFollow = (member: SuggestedMember, event: MouseEvent) => {
    event.stopPropagation()
    const isFollowing = followingIds.has(member.id)
    setFollowingIds((previous) => {
      const next = new Set(previous)
      if (next.has(member.id)) {
        next.delete(member.id)
      } else {
        next.add(member.id)
      }
      return next
    })
    if (isFollowing) {
      showToast('Unfollowed ' + member.name)
    } else {
      showToast('Following ' + member.name + '!')
    }
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
        padding: '16px',
        boxShadow: 'none',
        marginBottom: '12px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
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
              onClick={() => router.push('/directory')}
              className="hover:bg-subtle"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
                margin: '0 -8px',
                borderRadius: '8px',
                borderBottom: index === SUGGESTED_MEMBERS.length - 1 ? 'none' : '1px solid var(--color-border-default)',
                cursor: 'pointer',
                transition: 'background-color 0.12s',
              }}
            >
              {member.avatar_url ? (
                <PortraitImage src={member.avatar_url} alt={member.name} size={32} />
              ) : (
                <Avatar initials={member.initials} color={member.color} size={32} />
              )}
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
                onClick={(event) => toggleFollow(member, event)}
                className="hover:[border-color:var(--color-brand)] hover:[color:var(--color-brand)]"
                style={{
                  backgroundColor: isFollowing ? 'var(--color-brand-subtle)' : 'transparent',
                  color: isFollowing ? 'var(--color-brand)' : 'var(--color-text-secondary)',
                  border: `1px solid ${isFollowing ? 'var(--color-brand-muted)' : 'var(--color-border-default)'}`,
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginLeft: 'auto',
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
