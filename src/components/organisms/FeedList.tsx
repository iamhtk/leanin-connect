'use client'

import { useEffect } from 'react'
import { Bookmark, Users } from 'lucide-react'
import { PostCard } from '@/components/molecules/PostCard'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import type { Post } from '@/lib/types'

export interface FeedListProps {
  selectedTag: string
  scopeTab?: 'all' | 'network' | 'circle' | 'saved'
  savedPostIds?: string[]
  onSave?: (postId: string) => void
  onAddPostReady?: (addPost: (post: Post) => void) => void
}

const NETWORK_AUTHOR_NAMES = [
  'Priya Sharma',
  'Sarah Chen',
  'Jennifer Park',
  'Lucia Fernandez',
  'Divya Menon',
]

const CIRCLE_AUTHOR_NAMES = ['Amara Okafor', 'Fatima Al-Hassan', 'Kezia Williams']

function getEmptyCopy(scopeTab: FeedListProps['scopeTab']): { title: string; subtitle: string } {
  if (scopeTab === 'network') {
    return {
      title: 'No posts from your network yet.',
      subtitle: 'Connect with more women to see their updates here.',
    }
  }

  if (scopeTab === 'circle') {
    return {
      title: 'No posts from your Circle yet.',
      subtitle: "Circle members' posts will appear here.",
    }
  }

  if (scopeTab === 'saved') {
    return {
      title: 'No saved posts yet.',
      subtitle: 'Tap the bookmark on any post to save it for later.',
    }
  }

  return {
    title: 'Nothing here yet.',
    subtitle: 'Be the first to share something.',
  }
}

export function FeedList({
  selectedTag,
  scopeTab = 'all',
  savedPostIds = [],
  onSave,
  onAddPostReady,
}: FeedListProps) {
  const { posts, isLoading, isFetchingMore, hasMore, sentinelRef, addPost } =
    useInfiniteScroll(selectedTag)

  useEffect(() => {
    onAddPostReady?.(addPost)
  }, [addPost, onAddPostReady])

  const displayPosts = posts.filter((post) => {
    if (scopeTab === 'all') return true
    if (scopeTab === 'network') return NETWORK_AUTHOR_NAMES.includes(post.author_name)
    if (scopeTab === 'circle') return CIRCLE_AUTHOR_NAMES.includes(post.author_name)
    if (scopeTab === 'saved') return savedPostIds.includes(post.id)
    return true
  })

  if (isLoading) {
    return (
      <div>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="skeleton"
            style={{
              height: '160px',
              borderRadius: '14px',
              marginBottom: '8px',
            }}
          />
        ))}
      </div>
    )
  }

  if (displayPosts.length === 0) {
    const { title, subtitle } = getEmptyCopy(scopeTab)
    const EmptyIcon = scopeTab === 'saved' ? Bookmark : Users

    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '9999px',
            backgroundColor: 'var(--color-brand-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}
        >
          <EmptyIcon size={20} style={{ color: 'var(--color-brand)' }} />
        </div>
        <p
          style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--color-text-default)',
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginTop: '8px',
          }}
        >
          {subtitle}
        </p>
      </div>
    )
  }

  return (
    <div>
      {displayPosts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} onSave={onSave} />
      ))}

      <div ref={sentinelRef} style={{ height: '1px' }} aria-hidden="true" />

      {isFetchingMore && (
        <div>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="skeleton"
              style={{
                height: '160px',
                borderRadius: '14px',
                marginBottom: '8px',
              }}
            />
          ))}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            padding: '24px',
          }}
        >
          You are all caught up
        </p>
      )}
    </div>
  )
}
