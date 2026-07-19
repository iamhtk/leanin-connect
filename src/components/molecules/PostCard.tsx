'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { CoverImage } from '@/components/atoms/CoverImage'
import { formatRelativeTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getTopicCoverUrl, shouldShowPostCover, getPortraitUrl } from '@/lib/cover-images'
import { useSwipeReveal } from '@/hooks/useSwipeReveal'
import type { Post } from '@/lib/types'

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/<link[^>]*>/gi, '')
    .replace(/<meta[^>]*>/gi, '')
    .replace(/\bon\w+\s*=\s*(['"])[^'"]*\1/gi, '')
    .replace(/\bon\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/<[a-z][\s\S]*?>/gi, (tag) => {
      const allowed = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'hr', 'b', 'i']
      const tagName = tag.match(/^<([a-z]+)/i)?.[1]?.toLowerCase()
      if (!tagName || !allowed.includes(tagName)) return ''
      return tag.replace(/\s+\w+\s*=\s*(['"])[^'"]*\1/g, '')
    })
}

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

export function PostCard({ post, onSave, onLike }: PostCardProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const [isLiked, setIsLiked] = useState(false)
  const [localLikesCount, setLocalLikesCount] = useState(post.likes_count)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaved, setIsSaved] = useState(() => readSavedIds().includes(post.id))
  const [bookmarkPulse, setBookmarkPulse] = useState(false)
  const isHtml = post.content.trim().startsWith('<')

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

  const [isTouchDevice, setIsTouchDevice] = useState(false)
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window)
  }, [])

  const {
    close,
    handlers: revealHandlers,
    style: revealStyle,
  } = useSwipeReveal({
    revealWidth: 72,
    threshold: 50,
    onBookmark: handleBookmark,
    onLike: () => {
      void handleLike()
    },
  })

  return (
    <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '8px' }}>
      {isTouchDevice ? (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '72px',
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <button
            type="button"
            onClick={() => {
              handleBookmark()
              close()
            }}
            aria-label="Bookmark post"
            style={{
              flex: 1,
              background: 'var(--color-brand-subtle)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-brand)',
            }}
          >
            <Bookmark size={20} />
          </button>
        </div>
      ) : null}

      <motion.article
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="card-hover"
        aria-label={'Post by ' + post.author_name}
        {...(isTouchDevice ? revealHandlers : {})}
        style={{
          ...revealStyle,
          background: 'var(--color-surface)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'none',
          padding: '16px',
          marginBottom: 0,
        }}
      >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Avatar
          initials={post.author_initials}
          color={post.author_avatar_color}
          size={36}
          src={getPortraitUrl(post.author_name || post.author_initials)}
          alt={post.author_name}
        />
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

      {isHtml ? (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content),
          }}
          style={{
            fontSize: '14px',
            color: 'var(--color-text-default)',
            lineHeight: '1.6',
            marginTop: '10px',
          }}
          className="post-content"
        />
      ) : (
        <p
          style={{
            fontSize: '14px',
            color: 'var(--color-text-default)',
            lineHeight: '1.6',
            marginTop: '10px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.content}
        </p>
      )}

      {shouldShowPostCover(post.id) ? (
        <div
          style={{
            marginTop: '12px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          <CoverImage
            src={getTopicCoverUrl(post.topic_tag, post.id)}
            alt=""
            height={180}
            overlay={false}
            sizes="(max-width: 1279px) 100vw, 800px"
          />
        </div>
      ) : null}

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
          className="hover:text-[var(--color-text-default)] action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: isLiked ? 'var(--color-brand)' : 'var(--color-text-muted)',
            cursor: !user || isLiking ? 'not-allowed' : 'pointer',
            background: 'transparent',
            border: 'none',
            padding: '8px',
            minHeight: '36px',
            minWidth: '36px',
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
          className="hover:text-[var(--color-text-default)] action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: '8px',
            minHeight: '36px',
            minWidth: '36px',
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
          className="action-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '13px',
            color: isSaved ? 'var(--color-brand)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: '8px',
            minHeight: '36px',
            minWidth: '36px',
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
    </div>
  )
}
