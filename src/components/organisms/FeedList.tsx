import { Bookmark, Users } from 'lucide-react'
import { PostCard } from '@/components/molecules/PostCard'
import type { Post } from '@/lib/types'

export interface FeedListProps {
  posts: Post[]
  scopeTab?: 'all' | 'network' | 'circle' | 'saved'
  onSave?: (postId: string) => void
}

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

export function FeedList({ posts, scopeTab = 'all', onSave }: FeedListProps) {
  if (posts.length === 0) {
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
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} onSave={onSave} />
      ))}
    </div>
  )
}
