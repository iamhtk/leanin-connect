'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { Tag } from '@/components/atoms/Tag'
import { formatRelativeTime } from '@/lib/utils'
import type { Post } from '@/lib/types'

export interface PostCardProps {
  post: Post
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.06 }}
      className="hover:[border-color:var(--color-border-strong)]"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: '8px',
        cursor: 'pointer',
        transition: 'border-color 0.12s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <Avatar initials={post.author_initials} color={post.author_avatar_color} size={38} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            {post.author_name}
          </p>
          <p style={{ fontSize: '13px', fontWeight: '400', color: 'var(--color-text-muted)' }}>
            {post.author_role} · {post.author_company}
          </p>
        </div>
        <Tag label={post.topic_tag} />
      </div>

      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
        {formatRelativeTime(post.created_at)}
      </p>

      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-text-default)',
          lineHeight: '1.5',
          marginTop: '10px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {post.content}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border-default)',
        }}
      >
        <span
          className="hover:text-[var(--color-text-default)]"
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <Heart size={15} />
          {post.likes_count}
        </span>
        <span
          className="hover:text-[var(--color-text-default)]"
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <MessageCircle size={15} />
          {post.replies_count}
        </span>
        <span
          className="hover:text-[var(--color-text-default)]"
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--color-text-muted)', cursor: 'pointer' }}
        >
          <Bookmark size={15} />
        </span>
      </div>
    </motion.div>
  )
}
