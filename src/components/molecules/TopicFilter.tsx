'use client'

import { motion } from 'framer-motion'
import { TOPIC_TAGS } from '@/lib/types'

export interface TopicFilterProps {
  selectedTag: string
  onTagChange: (tag: string) => void
}

export function TopicFilter({ selectedTag, onTagChange }: TopicFilterProps) {
  return (
    <nav aria-label="Filter by topic" style={{ width: '100%' }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          overflowX: 'auto',
          paddingBottom: '0',
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
                fontSize: '13px',
                fontWeight: '600',
                padding: '6px 10px',
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
