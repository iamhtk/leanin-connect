'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface TrendingTopic {
  topic: string
  count: string
}

const TRENDING_TOPICS: TrendingTopic[] = [
  { topic: 'Negotiation', count: '24 posts' },
  { topic: 'Bias at Work', count: '18 posts' },
  { topic: 'Promotions', count: '15 posts' },
  { topic: 'Leadership', count: '12 posts' },
  { topic: 'Early Career', count: '9 posts' },
]

export function TrendingTopics() {
  const router = useRouter()

  const handleTopicClick = (topic: string) => {
    router.push('/feed?topic=' + encodeURIComponent(topic))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
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
        Trending in your network
      </p>

      <div>
        {TRENDING_TOPICS.map((item, index) => (
          <div
            key={item.topic}
            role="button"
            tabIndex={0}
            onClick={() => handleTopicClick(item.topic)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleTopicClick(item.topic)
              }
            }}
            className="group link-interactive"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index === TRENDING_TOPICS.length - 1 ? 'none' : '1px solid var(--color-border-default)',
              cursor: 'pointer',
              transition: 'color 0.12s',
            }}
          >
            <span
              className="group-hover:text-[var(--color-brand)]"
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--color-text-default)',
                transition: 'color 0.12s',
              }}
            >
              {item.topic}
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{item.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
