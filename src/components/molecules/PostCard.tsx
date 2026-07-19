'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { formatRelativeTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import type { Post } from '@/lib/types'

export interface PostCardProps {
  post: Post
  index: number
  onSave?: (postId: string) => void
  onLike?: (postId: string, liked: boolean) => void
}

function readSavedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem('lean_in_saved_posts')
    if (!saved) return []
    const parsed: unknown = JSON.parse(saved)
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : []
  } catch {
    return []
  }
}

export function PostCard({ post, index, onSave, onLike }: PostCardProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const [isLiked, setIsLiked] = useState(false)
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaved, setIsSaved] = useState(() => readSavedIds().includes(post.id))
  const [bookmarkPulse, setBookmarkPulse] = useState(false)

  const handleLike = async () => {
    if (!user || isLiking) return
    setIsLiking(true)

    const optimisticLiked = !isLiked
    const previousCount = localLikesCount
    const optimisticCount = previousCount + (optimisticLiked ? 1 : -1)
    setIsLiked(optimisticLiked)
    setLocalLikesCount(optimisticCount)

    try {
      if (optimisticLiked) {
        const { error } = await supabase
          .from('likes')
          .insert({ post_id: post.id, user_id: user.id })
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ post_id: post.id, user_id: user.id })
        if (error) throw error
      }
      onLike?.(post.id, optimisticLiked)
    } catch {
      setIsLiked(!optimisticLiked)
      setLocalLikesCount(previousCount)
    } finally {
      setIsLiking(false)
    }
  }

  const handleBookmark = () => {
    try {
      const saved = readSavedIds()
      const newSaved = isSaved
        ? saved.filter((id) => id !== post.id)
        : [...saved, post.id]
      localStorage.setItem('lean_in_saved_posts', JSON.stringify(newSaved))
      setIsSaved(!isSaved)
      setBookmarkPulse(true)
      window.setTimeout(() => setBookmarkPulse(false), 200)
      onSave?.(post.id)
    } catch {
      // ignore localStorage errors
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut', delay: index * 0.06 }}
      className="card-hover"
      aria-label={'Post by ' + post.author_name}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'none',
        padding: '16px',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Avatar initials={post.author_initials} color={post.author_avatar_color} size={36} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            {post.author_name}
          </p>
          <p style={{ fontSize: '13px', fontWeight: '400', color: 'var(--color-text-muted)' }}>
            {post.author_role} · {post.author_company}
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {formatRelativeTime(post.created_at)}
          </p>
        </div>
        <span
          style={{
            color: 'var(--color-brand)',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: 'transparent',
          }}
        >
          {post.topic_tag}
        </span>
      </div>

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
          alignItems: 'center',
          gap: '16px',
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border-default)',
        }}
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            void handleLike()
          }}
          aria-label={'Like, ' + localLikesCount + ' likes'}
          aria-pressed={isLiked}
          disabled={!user || isLiking}
          className="hover:text-[var(--color-text-default)]"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: isLiked ? 'var(--color-brand)' : 'var(--color-text-muted)',
            cursor: !user || isLiking ? 'not-allowed' : 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontFamily: 'inherit',
            transition: 'color 0.12s',
            opacity: !user ? 0.5 : 1,
          }}
        >
          <Heart
            size={15}
            fill={isLiked ? 'var(--color-brand)' : 'none'}
            aria-hidden="true"
          />
          {localLikesCount}
        </button>
        <button
          type="button"
          aria-label={'Reply, ' + post.replies_count + ' replies'}
          className="hover:text-[var(--color-text-default)]"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontFamily: 'inherit',
            transition: 'color 0.12s',
          }}
        >
          <MessageCircle size={15} aria-hidden="true" />
          {post.replies_count}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            handleBookmark()
          }}
          aria-label={isSaved ? 'Remove bookmark' : 'Bookmark post'}
          aria-pressed={isSaved}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: isSaved ? 'var(--color-brand)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontFamily: 'inherit',
            transition: 'color 0.12s',
          }}
        >
          <Bookmark
            size={15}
            fill={isSaved ? 'var(--color-brand)' : 'none'}
            color={isSaved ? 'var(--color-brand)' : 'var(--color-text-muted)'}
            aria-hidden="true"
            style={{
              transform: bookmarkPulse ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
          />
        </button>
      </div>
    </motion.article>
  )
}
