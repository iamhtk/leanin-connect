'use client'

import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { CareerPulseCard as CareerPulseData } from '@/lib/types'

export interface CareerPulseCardProps {
  data: CareerPulseData | null
}

const CONTAINER_STYLE: CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border-default)',
  borderLeft: '3px solid var(--color-brand)',
  borderRadius: 'var(--radius-lg)',
  padding: '16px',
  marginBottom: '12px',
}

export function CareerPulseCard({ data }: CareerPulseCardProps) {
  const handleQuestionClick = (question: string) => {
    window.alert(question)
  }

  if (!data) {
    return (
      <div style={CONTAINER_STYLE} className="animate-career-pulse-loading">
        <p
          style={{
            fontSize: '10px',
            fontWeight: '600',
            letterSpacing: '0.08em',
            color: 'var(--color-brand)',
          }}
        >
          ✦ AI CAREER PULSE
        </p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          Fetching community insights...
        </p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={CONTAINER_STYLE}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', color: 'var(--color-brand)' }}>
          ✦ AI CAREER PULSE
        </p>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '500',
            backgroundColor: 'var(--color-brand-subtle)',
            color: 'var(--color-brand)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {data.theme}
        </span>
      </div>

      <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)', lineHeight: '1.4', marginBottom: '4px' }}>
        {data.stat}
      </p>
      <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>{data.stat_source}</p>

      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
        {data.insight}
      </p>

      <div style={{ borderTop: '1px solid var(--color-border-default)' }} />

      <p
        style={{
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
          marginTop: '12px',
          marginBottom: '8px',
        }}
      >
        What&apos;s your community asking?
      </p>

      <div>
        {data.questions.map((question, index) => (
          <p
            key={question}
            onClick={() => handleQuestionClick(question)}
            className="hover:text-[var(--color-brand)]"
            style={{
              fontSize: '12px',
              color: 'var(--color-text-default)',
              lineHeight: '1.5',
              padding: '7px 0',
              borderBottom: index === data.questions.length - 1 ? 'none' : '1px solid var(--color-border-default)',
              cursor: 'pointer',
            }}
          >
            {question}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
