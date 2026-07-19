import { PostCard } from '@/components/molecules/PostCard'
import type { Post } from '@/lib/types'

export interface FeedListProps {
  posts: Post[]
}

function CareerPulseCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-brand-subtle)',
        border: '1px solid var(--color-brand-muted)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '12px',
      }}
    >
      <p
        style={{
          fontSize: '10px',
          fontWeight: '600',
          color: 'var(--color-text-brand)',
          letterSpacing: '0.08em',
        }}
      >
        ✦ AI CAREER PULSE
      </p>
      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
        Fetching community insights...
      </p>
    </div>
  )
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
        <div key={post.id}>
          <PostCard post={post} index={index} />
          {index === 1 && <CareerPulseCard />}
        </div>
      ))}
    </div>
  )
}
