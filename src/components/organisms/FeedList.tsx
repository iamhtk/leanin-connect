'use client'

import { useEffect, type TouchEvent } from 'react'
import { Bookmark, Users } from 'lucide-react'
import { PostCard } from '@/components/molecules/PostCard'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { usePullToRefresh } from '@/hooks/usePullToRefresh'
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

function PullIndicator({
  pullDistance,
  isRefreshing,
  progress,
}: {
  pullDistance: number
  isRefreshing: boolean
  progress: number
}) {
  return (
    <div
      aria-live="polite"
      aria-label={isRefreshing ? 'Refreshing feed' : 'Pull to refresh'}
      style={{
        height: `${pullDistance}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: isRefreshing ? 'none' : 'height 0.2s ease',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          border: '2px solid var(--color-border-default)',
          borderTopColor: 'var(--color-brand)',
          animation: isRefreshing ? 'spin 0.7s linear infinite' : 'none',
          transform: `rotate(${progress * 180}deg)`,
          transition: isRefreshing ? 'none' : 'transform 0.1s linear',
          opacity: progress,
        }}
        aria-hidden="true"
      />
    </div>
  )
}

export function FeedList({
  selectedTag,
  scopeTab = 'all',
  savedPostIds = [],
  onSave,
  onAddPostReady,
}: FeedListProps) {
  const { posts, isLoading, isFetchingMore, hasMore, sentinelRef, addPost, refetch } =
    useInfiniteScroll(selectedTag)

  const { pullDistance, isPulling, isRefreshing, progress, handlers } = usePullToRefresh({
    onRefresh: async () => {
      await refetch()
    },
    threshold: 80,
  })

  const pullHandlers = {
    onTouchStart: (event: TouchEvent) => {
      const main = document.getElementById('main-content')
      if (main && main.scrollTop > 0) return
      handlers.onTouchStart(event)
    },
    onTouchMove: handlers.onTouchMove,
    onTouchEnd: handlers.onTouchEnd,
  }

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

  const showPullIndicator = isPulling || isRefreshing

  if (isLoading) {
    return (
      <div {...pullHandlers} style={{ overscrollBehavior: 'none' }}>
        {showPullIndicator ? (
          <PullIndicator
            pullDistance={pullDistance}
            isRefreshing={isRefreshing}
            progress={progress}
          />
        ) : null}
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
        {...pullHandlers}
        style={{
          overscrollBehavior: 'none',
          textAlign: 'center',
          padding: '48px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {showPullIndicator ? (
          <PullIndicator
            pullDistance={pullDistance}
            isRefreshing={isRefreshing}
            progress={progress}
          />
        ) : null}
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
    <div {...pullHandlers} style={{ overscrollBehavior: 'none' }}>
      {showPullIndicator ? (
        <PullIndicator
          pullDistance={pullDistance}
          isRefreshing={isRefreshing}
          progress={progress}
        />
      ) : null}

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
