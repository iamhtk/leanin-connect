'use client'

import { motion } from 'framer-motion'
import { TOPIC_TAGS } from '@/lib/types'

export interface TopicFilterProps {
  selectedTag: string
  onTagChange: (tag: string) => void
}

export function TopicFilter({ selectedTag, onTagChange }: TopicFilterProps) {
  return (
    <div style={{ position: 'relative', marginBottom: '20px' }}>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
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
              whileTap={{ scale: 0.97 }}
              onClick={() => onTagChange(tag.value)}
              style={{
                backgroundColor: isActive ? 'var(--color-brand)' : 'var(--color-brand-subtle)',
                color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-brand)',
                fontSize: '12px',
                fontWeight: '500',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {tag.label}
            </motion.button>
          )
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '48px',
          background: 'linear-gradient(to right, transparent, var(--color-background))',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
