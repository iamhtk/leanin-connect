'use client'

import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { CareerPulseCard as CareerPulseData } from '@/lib/types'
import { CoverImage } from '@/components/atoms/CoverImage'
import { getTopicCoverUrl } from '@/lib/cover-images'

export interface CareerPulseCardProps {
  data: CareerPulseData | null
}

const CONTAINER_STYLE: CSSProperties = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border-default)',
  borderLeft: '3px solid var(--color-brand)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'none',
  marginBottom: '12px',
  overflow: 'hidden',
}

export function CareerPulseCard({ data }: CareerPulseCardProps) {
  const handleQuestionClick = (question: string) => {
    window.dispatchEvent(new CustomEvent('open-composer', { detail: { prefill: question } }))
  }

  if (!data) {
    return (
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{ ...CONTAINER_STYLE, padding: '16px' }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '12px',
          }}
        >
          ✦ AI CAREER PULSE
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="skeleton" style={{ height: '12px', width: '90%' }} />
          <div className="skeleton" style={{ height: '12px', width: '75%' }} />
          <div className="skeleton" style={{ height: '12px', width: '60%' }} />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={CONTAINER_STYLE}
    >
      <CoverImage
        src={getTopicCoverUrl(data.theme)}
        alt=""
        height={88}
        overlayOpacity={0.4}
        sizes="(max-width: 1279px) 100vw, 320px"
      />
      <div style={{ padding: '16px' }} aria-live="polite">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            ✦ AI CAREER PULSE
          </p>
          <span
            style={{
              fontSize: '12px',
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

        <p
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-text-default)',
            lineHeight: '1.4',
            marginBottom: '4px',
          }}
        >
          {data.stat}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
          {data.stat_source}
        </p>

        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6',
            marginBottom: '12px',
          }}
        >
          {data.insight}
        </p>

        <div style={{ borderTop: '1px solid var(--color-border-default)' }} />

        <p
          style={{
            fontSize: '12px',
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
            <button
              key={question}
              type="button"
              onClick={() => handleQuestionClick(question)}
              className="hover:text-[var(--color-brand)] link-interactive"
              style={{
                fontSize: '12px',
                color: 'var(--color-text-default)',
                lineHeight: '1.5',
                padding: '7px 0',
                border: 'none',
                borderBottom:
                  index === data.questions.length - 1
                    ? 'none'
                    : '1px solid var(--color-border-default)',
                background: 'none',
                cursor: 'pointer',
                transition: 'color 0.12s',
                textAlign: 'left',
                fontFamily: 'inherit',
                width: '100%',
              }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
