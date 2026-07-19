'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Briefcase, MapPin, Clock, Sparkles, ExternalLink } from 'lucide-react'
import { MOCK_JOBS } from '@/data/jobs'
import type { Job } from '@/lib/types'
import { showToast } from '@/lib/utils'

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

export default function JobsPage() {
  const [jobs] = useState<Job[]>(MOCK_JOBS)
  const [selectedType, setSelectedType] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [aiMatches, setAiMatches] = useState<AIMatch[]>([])
  const [isMatchLoading, setIsMatchLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/ai/job-match', { method: 'POST' })
        const result = await response.json()
        if (result.data) {
          setAiMatches(result.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsMatchLoading(false)
      }
    }

    fetchMatches()
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
    <div className="jobs-page" style={{ padding: '24px 32px 48px 32px' }}>
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

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '16px',
          flexWrap: 'wrap',
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
            height: '44px',
            minHeight: '44px',
            whiteSpace: 'nowrap',
          }}
        >
          <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search roles or companies..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
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
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '9999px',
            padding: '0 16px',
            height: '44px',
            minHeight: '44px',
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div
        className="pills-scroll"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: '12px',
          marginBottom: '8px',
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
                color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
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
                color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
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
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}

interface JobCardProps {
  job: Job & { is_ai_match?: boolean; match_reason?: string }
}

function JobCard({ job }: JobCardProps) {
  const postedDate = new Date(job.posted_at)
  const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div
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
          <Sparkles size={11} />
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
          <div
            style={{
              width: '40px',
              height: '40px',
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

        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
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
            textDecoration: 'none',
            flexShrink: 0,
            border: 'none',
          }}
        >
          Apply
          <ExternalLink size={12} />
        </a>
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
