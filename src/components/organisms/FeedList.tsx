import { PostCard } from '@/components/molecules/PostCard'
import type { Post } from '@/lib/types'

export interface FeedListProps {
  posts: Post[]
}

export function FeedList({ posts }: FeedListProps) {
  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '60px' }}>
        Nothing here yet. Be the first to share something.
      </div>
    )
  }

  return (
    <div>
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  )
}
