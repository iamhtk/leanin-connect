'use client'

import { motion } from 'framer-motion'
import type { CareerPulseCard as CareerPulseData } from '@/lib/types'

export interface CareerPulseCardProps {
  data: CareerPulseData | null
}

export function CareerPulseCard({ data }: CareerPulseCardProps) {
  const handleQuestionClick = (question: string) => {
    window.alert(question)
  }

  if (!data) {
    return (
      <div
        className="animate-career-pulse-loading"
        style={{
          backgroundColor: 'var(--color-brand-subtle)',
          border: '1px solid var(--color-border-brand)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
        }}
      >
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
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
          Fetching community insights...
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        backgroundColor: 'var(--color-brand-subtle)',
        border: '1px solid var(--color-border-brand)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.08em', color: 'var(--color-brand)' }}>
          ✦ AI CAREER PULSE
        </p>
        <span
          style={{
            fontSize: '10px',
            backgroundColor: 'var(--color-brand-muted)',
            color: 'var(--color-text-brand)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
          }}
        >
          {data.theme}
        </span>
      </div>

      <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)', lineHeight: '1.4', marginBottom: '4px' }}>
        {data.stat}
      </p>
      <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>{data.stat_source}</p>

      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
        {data.insight}
      </p>

      <div style={{ borderTop: '1px solid var(--color-border-brand)', marginBottom: '12px' }} />

      <p
        style={{
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: '0.06em',
          color: 'var(--color-text-muted)',
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
            style={{
              fontSize: '12px',
              color: 'var(--color-text-default)',
              lineHeight: '1.5',
              padding: '8px 0',
              borderBottom: index === data.questions.length - 1 ? 'none' : '1px solid var(--color-border-brand)',
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
