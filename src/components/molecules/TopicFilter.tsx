'use client'

import { motion } from 'framer-motion'
import { TOPIC_TAGS } from '@/lib/types'

export interface TopicFilterProps {
  selectedTag: string
  onTagChange: (tag: string) => void
}

export function TopicFilter({ selectedTag, onTagChange }: TopicFilterProps) {
  return (
    <nav aria-label="Filter by topic">
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '12px',
          scrollbarWidth: 'none',
        }}
        className="[&::-webkit-scrollbar]:hidden"
      >
        {TOPIC_TAGS.map((tag) => {
          const isActive = tag.value === selectedTag

          return (
            <motion.button
              key={tag.value}
              type="button"
              role="tab"
              aria-selected={selectedTag === tag.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => onTagChange(tag.value)}
              className={
                isActive
                  ? undefined
                  : 'hover:bg-muted hover:[color:var(--color-text-default)]'
              }
              style={{
                backgroundColor: isActive ? 'var(--color-text-default)' : 'transparent',
                color: isActive ? 'var(--color-background)' : 'var(--color-text-secondary)',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.12s',
              }}
            >
              {tag.label}
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
