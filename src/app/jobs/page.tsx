'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Briefcase, MapPin, Clock, Sparkles, ExternalLink, X } from 'lucide-react'
import { MOCK_JOBS } from '@/data/jobs'
import type { Job } from '@/lib/types'
import { showToast } from '@/lib/utils'
import Image from 'next/image'

const JOB_TYPES = [
  { label: 'All Jobs', value: 'All' },
  { label: 'Full-time', value: 'Full-time' },
  { label: 'Remote', value: 'Remote' },
  { label: 'Hybrid', value: 'Hybrid' },
  { label: 'Contract', value: 'Contract' },
] as const

const CATEGORIES = ['Design', 'Engineering', 'Research', 'Marketing', 'Operations'] as const

interface AIMatch {
  id: string
  reason: string
}

interface SalaryCoachModalProps {
  job: Job
  onClose: () => void
}

function SalaryCoachModal({ job, onClose }: SalaryCoachModalProps) {
  const [tips, setTips] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await fetch('/api/ai/salary-coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: job.role,
            company: job.company,
            salaryRange: job.salary_range,
            jobType: job.job_type,
          }),
        })
        const result = (await response.json()) as { data?: string[] }
        if (result.data) {
          setTips(result.data)
        }
      } catch {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    void fetchTips()
  }, [job])

  return (
    <div
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Salary Coach"
        onClick={(event) => event.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          width: '460px',
          maxWidth: '100%',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={14} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-default)' }}>
              Salary Coach
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close salary coach"
            className="icon-btn"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              display: 'flex',
              padding: '4px',
            }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div
          style={{
            display: 'inline-flex',
            marginTop: '16px',
            background: 'var(--color-brand-subtle)',
            border: '1px solid var(--color-border-brand)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--color-brand)',
          }}
        >
          {job.role} · {job.company}
        </div>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          {job.salary_range}
        </p>

        <div
          style={{
            height: '1px',
            background: 'var(--color-border-default)',
            margin: '16px 0',
          }}
        />

        {isLoading && (
          <div>
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="animate-pulse-opacity"
                style={{
                  height: '48px',
                  background: 'var(--color-subtle)',
                  borderRadius: '10px',
                  marginBottom: '8px',
                }}
              />
            ))}
          </div>
        )}

        {hasError && !isLoading && tips.length === 0 && (
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              padding: '16px 0',
            }}
          >
            Could not load tips right now. Try again in a moment.
          </p>
        )}

        {!isLoading && tips.length > 0 && (
          <div>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: '12px',
                letterSpacing: '0.06em',
              }}
            >
              3 negotiation tips from Lean In:
            </p>
            {tips.map((tip, index) => (
              <div
                key={tip}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '12px',
                  background: 'var(--color-subtle)',
                  borderRadius: '10px',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '9999px',
                    background: 'var(--color-brand-subtle)',
                    color: 'var(--color-brand)',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-default)',
                    lineHeight: '1.5',
                  }}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-brand)',
              color: 'white',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            Apply now
            <ExternalLink size={12} aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost"
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '8px 18px',
              fontSize: '13px',
              color: 'var(--color-text-default)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

export default function JobsPage() {
  const [jobs] = useState<Job[]>(MOCK_JOBS)
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [aiMatches, setAiMatches] = useState<AIMatch[]>([])
  const [isMatchLoading, setIsMatchLoading] = useState(true)
  const [salaryCoachJob, setSalaryCoachJob] = useState<Job | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/ai/job-match', { method: 'POST' })
        const result = (await response.json()) as { data?: AIMatch[] }
        if (result.data) {
          setAiMatches(result.data)
        }
      } catch {
        // Keep empty matches on failure
      } finally {
        setIsMatchLoading(false)
      }
    }

    void fetchMatches()
  }, [])

  const enrichedJobs = jobs.map((job) => {
    const match = aiMatches.find((item) => item.id === job.id)
    return match
      ? { ...job, is_ai_match: true, match_reason: match.reason }
      : { ...job, is_ai_match: false }
  })

  const filteredJobs = enrichedJobs.filter((job) => {
    const matchesType = selectedType === 'All' || job.job_type === selectedType
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesCategory && matchesSearch
  })

  const sortedJobs = [...filteredJobs].sort((first, second) => {
    if (first.is_ai_match && !second.is_ai_match) return -1
    if (!first.is_ai_match && second.is_ai_match) return 1
    return 0
  })

  return (
    <main className="page-shell jobs-page" aria-label="Job opportunities">
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-text-default)',
          }}
        >
          Opportunities
        </h1>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginTop: '4px',
          }}
        >
          Roles at companies that share Lean In&apos;s commitment to women&apos;s advancement.
        </p>
      </div>

      <div className="sticky-nav">
        <div
          className="page-toolbar"
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '0 16px',
              height: '40px',
              minWidth: 0,
            }}
          >
            <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
            <label htmlFor="jobs-search" className="sr-only">
              Search roles or companies
            </label>
            <input
              id="jobs-search"
              type="search"
              placeholder="Search roles or companies..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="input-field"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                color: 'var(--color-text-default)',
                background: 'transparent',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => showToast('Filters coming soon')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              color: 'var(--color-text-default)',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Filter size={14} aria-hidden="true" />
            Filters
          </button>
        </div>

        <div
          className="pills-scroll"
          style={{
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
        {JOB_TYPES.map((type) => {
          const isActive = selectedType === type.value

          return (
            <button
              key={type.value}
              type="button"
              onClick={() => setSelectedType(type.value)}
              className={
                isActive ? undefined : 'hover:bg-muted hover:[color:var(--color-text-default)]'
              }
              style={{
                backgroundColor: isActive ? 'var(--color-text-default)' : 'transparent',
                color: isActive ? 'var(--color-background)' : 'var(--color-text-secondary)',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.12s',
                fontFamily: 'inherit',
              }}
            >
              {type.label}
            </button>
          )
        })}

        <div
          style={{
            width: '1px',
            height: '16px',
            background: 'var(--color-border-default)',
            margin: '0 8px',
            alignSelf: 'center',
            flexShrink: 0,
          }}
        />

        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(isActive ? 'All' : category)}
              className={
                isActive ? undefined : 'hover:bg-muted hover:[color:var(--color-text-default)]'
              }
              style={{
                backgroundColor: isActive ? 'var(--color-text-default)' : 'transparent',
                color: isActive ? 'var(--color-background)' : 'var(--color-text-secondary)',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                fontWeight: '600',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.12s',
                fontFamily: 'inherit',
              }}
            >
              {category}
            </button>
          )
        })}
      </div>
      </div>

      {isMatchLoading && (
        <div
          style={{
            background: 'var(--color-brand-subtle)',
            border: '1px solid var(--color-border-brand)',
            borderLeft: '3px solid var(--color-brand)',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--color-brand)', flexShrink: 0 }} />
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            AI is analyzing your profile to find the best matches...
          </span>
        </div>
      )}

      <p
        style={{
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          marginBottom: '12px',
        }}
      >
        {sortedJobs.length} role{sortedJobs.length !== 1 ? 's' : ''} found
        {aiMatches.length > 0 && ` · ${aiMatches.length} AI matches`}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {sortedJobs.map((job) => (
          <JobCard key={job.id} job={job} onApply={() => setSalaryCoachJob(job)} />
        ))}
      </div>

      {salaryCoachJob && (
        <SalaryCoachModal job={salaryCoachJob} onClose={() => setSalaryCoachJob(null)} />
      )}
    </main>
  )
}

interface JobCardProps {
  job: Job & { is_ai_match?: boolean; match_reason?: string }
  onApply: () => void
}

function JobCard({ job, onApply }: JobCardProps) {
  const postedDate = new Date(job.posted_at)
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div
      className="hover:[border-color:var(--color-border-strong)] job-card"
      style={{
        background: 'var(--color-surface)',
        border: job.is_ai_match
          ? '1px solid var(--color-border-brand)'
          : '1px solid var(--color-border-default)',
        borderLeft: job.is_ai_match
          ? '3px solid var(--color-brand)'
          : '1px solid var(--color-border-default)',
        borderRadius: '14px',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.12s',
      }}
    >
      {job.is_ai_match && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--color-brand-subtle)',
            color: 'var(--color-text-brand)',
            borderRadius: '9999px',
            padding: '3px 10px',
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '10px',
          }}
        >
          <Sparkles size={11} style={{ flexShrink: 0 }} aria-hidden="true" />
          AI Match · {job.match_reason}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {job.company_logo_url ? (
            <div
              style={{
                position: 'relative',
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '10px',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--color-muted)',
              }}
            >
              <Image
                src={job.company_logo_url}
                alt={`${job.company} logo`}
                fill
                sizes="40px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                minWidth: '40px',
                minHeight: '40px',
                borderRadius: '10px',
                background: job.company_logo_color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              {job.company_logo_initials}
            </div>
          )}
          <div>
            <div
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--color-text-default)',
              }}
            >
              {job.role}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                marginTop: '2px',
              }}
            >
              {job.company}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onApply}
          className="btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'var(--color-brand)',
            color: 'white',
            borderRadius: '9999px',
            padding: '7px 16px',
            fontSize: '13px',
            fontWeight: '600',
            flexShrink: 0,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Apply
          <ExternalLink size={12} aria-hidden="true" />
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '12px',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          <MapPin size={12} />
          {job.location}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          <Briefcase size={12} />
          {job.job_type}
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
          }}
        >
          <Clock size={12} />
          {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            marginLeft: 'auto',
            textAlign: 'right',
            flexShrink: 0,
          }}
        >
          {job.salary_range}
        </span>
      </div>

      <p
        style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.5',
          marginTop: '10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {job.description}
      </p>
    </div>
  )
}
