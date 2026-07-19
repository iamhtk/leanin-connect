'use client'

import { motion } from 'framer-motion'
import { TOPIC_TAGS } from '@/lib/types'

export interface TopicFilterProps {
  selectedTag: string
  onTagChange: (tag: string) => void
}

export function TopicFilter({ selectedTag, onTagChange }: TopicFilterProps) {
  return (
    <div style={{ position: 'relative', marginBottom: '12px' }}>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '1px',
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
              className={
                isActive
                  ? undefined
                  : 'hover:bg-[var(--color-subtle)] hover:[border-color:var(--color-border-strong)]'
              }
              style={{
                backgroundColor: isActive ? 'var(--color-text-default)' : 'transparent',
                color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                border: isActive ? '1px solid transparent' : '1px solid var(--color-border-default)',
                fontSize: '13px',
                fontWeight: '500',
                padding: '5px 14px',
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
