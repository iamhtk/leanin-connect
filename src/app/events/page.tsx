'use client'

import { useMemo, useState, useRef } from 'react'
import { Search, Filter, Plus, Calendar, Users, X } from 'lucide-react'
import { showToast } from '@/lib/utils'
import { COVER_IMAGES } from '@/lib/cover-images'
import { CoverImage } from '@/components/atoms/CoverImage'

interface MockEvent {
  id: number
  title: string
  date: string
  time: string
  type: string
  host: string
  attendees: number
  color: string
  cover_url: string
}

const MOCK_EVENTS: MockEvent[] = [
  {
    id: 1,
    title: 'Women in Leadership Summit 2026',
    date: 'August 15, 2026',
    time: '10:00 AM PST',
    type: 'Virtual',
    host: 'Lean In',
    attendees: 342,
    color: '#7B2335',
    cover_url: COVER_IMAGES.womenConference,
  },
  {
    id: 2,
    title: 'Negotiation Workshop: Know Your Worth',
    date: 'August 22, 2026',
    time: '12:00 PM PST',
    type: 'Virtual',
    host: 'Lean In Network SF',
    attendees: 89,
    color: '#1E4A8C',
    cover_url: COVER_IMAGES.womenVirtual,
  },
  {
    id: 3,
    title: 'Circle Leaders Annual Conference',
    date: 'September 10, 2026',
    time: '9:00 AM PST',
    type: 'In Person · San Francisco',
    host: 'Lean In',
    attendees: 500,
    color: '#065F46',
    cover_url: COVER_IMAGES.womenPanel,
  },
]

type EventsTab = 'my' | 'circles' | 'networks' | 'leanin'
type TimeFilter = 'upcoming' | 'past'
type EventFormat = 'Virtual' | 'In person'

function filterEventsByTitle(events: MockEvent[], query: string): MockEvent[] {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return events

  return events.filter((event) => event.title.toLowerCase().includes(normalizedQuery))
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventsTab>('my')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [isProposeOpen, setIsProposeOpen] = useState(false)
  const [proposeTitle, setProposeTitle] = useState('')
  const [proposeDateTime, setProposeDateTime] = useState('')
  const [proposeFormat, setProposeFormat] = useState<EventFormat>('Virtual')
  const [proposeDescription, setProposeDescription] = useState('')
  const [rsvpIds, setRsvpIds] = useState<Set<number>>(new Set())
  const triggerRef = useRef<HTMLButtonElement>(null)

  const filteredEvents = useMemo(
    () => filterEventsByTitle(MOCK_EVENTS, searchQuery),
    [searchQuery],
  )

  const closeProposeModal = () => {
    setIsProposeOpen(false)
    setProposeTitle('')
    setProposeDateTime('')
    setProposeFormat('Virtual')
    setProposeDescription('')
    setTimeout(() => triggerRef.current?.focus(), 50)
  }

  const handleSubmitProposal = () => {
    showToast('Event proposal submitted!')
    closeProposeModal()
  }

  const toggleRsvp = (event: MockEvent) => {
    setRsvpIds((previous) => {
      const next = new Set(previous)
      if (next.has(event.id)) {
        next.delete(event.id)
      } else {
        next.add(event.id)
        showToast("You're going to " + event.title + '!')
      }
      return next
    })
  }

  const openProposeModal = () => {
    setIsProposeOpen(true)
  }

  return (
    <main className="page-shell" aria-label="Events">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Events</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Join us for in-person and virtual events to connect and gain practical insights.
        </p>
      </div>

      <div className="sticky-nav">
        <div className="page-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
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
            }}
          >
            <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
            <label htmlFor="events-search" className="sr-only">
              Search events
            </label>
            <input
              id="events-search"
              type="search"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                background: 'transparent',
                color: 'var(--color-text-default)',
                fontFamily: 'inherit',
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
            <Filter size={14} />
            Filters
          </button>
          <button
            type="button"
            ref={triggerRef}
            onClick={openProposeModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--color-brand)',
              color: 'white',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <Plus size={14} aria-hidden="true" />
            New event
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(
              [
                { label: 'My Events', value: 'my' },
                { label: 'Circle Meetings', value: 'circles' },
                { label: 'Network Events', value: 'networks' },
                { label: 'Lean In Events', value: 'leanin' },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.value
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    border: isActive ? 'none' : '1px solid var(--color-border-default)',
                    background: isActive ? 'var(--color-text-default)' : 'transparent',
                    color: isActive ? 'var(--color-background)' : 'var(--color-text-secondary)',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'inline-flex',
              background: 'var(--color-subtle)',
              borderRadius: '9999px',
              padding: '2px',
              flexShrink: 0,
            }}
          >
            {(
              [
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Past', value: 'past' },
              ] as const
            ).map((option) => {
              const isActive = timeFilter === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimeFilter(option.value)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    border: 'none',
                    background: isActive ? 'var(--color-surface)' : 'transparent',
                    color: isActive ? 'var(--color-text-default)' : 'var(--color-text-muted)',
                    boxShadow: isActive ? 'var(--shadow-card)' : 'none',
                  }}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {timeFilter === 'past' && (
        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
            padding: '48px 0',
          }}
        >
          No past events to show.
        </div>
      )}

      {timeFilter === 'upcoming' && activeTab === 'my' && (
        <div
          style={{
            marginTop: '32px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '14px',
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '9999px',
              background: 'var(--color-brand-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Calendar size={40} style={{ color: 'var(--color-brand)' }} />
          </div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
            }}
          >
            MY EVENTS
          </p>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)', marginTop: '8px' }}>
            You haven&apos;t RSVP&apos;d yet.
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={openProposeModal}
              style={{
                background: 'var(--color-brand)',
                color: 'white',
                borderRadius: '9999px',
                padding: '8px 20px',
                fontSize: '13px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Propose an event
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('circles')}
              style={{
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
              Browse Circle Meetings
            </button>
          </div>
        </div>
      )}

      {timeFilter === 'upcoming' && activeTab === 'circles' && (
        <div
          style={{
            marginTop: '32px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '14px',
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '9999px',
              background: 'var(--color-brand-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Calendar size={40} style={{ color: 'var(--color-brand)' }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            No upcoming Circle meetings.
          </p>
          <button
            type="button"
            onClick={() => showToast('Meeting scheduling coming soon')}
            style={{
              marginTop: '20px',
              background: 'var(--color-brand)',
              color: 'white',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Schedule a meeting
          </button>
        </div>
      )}

      {timeFilter === 'upcoming' && activeTab === 'networks' && (
        <div
          style={{
            marginTop: '32px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '14px',
            padding: '48px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '9999px',
              background: 'var(--color-brand-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <Calendar size={40} style={{ color: 'var(--color-brand)' }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            No upcoming Network events.
          </p>
          <button
            type="button"
            onClick={() => showToast('Meeting scheduling coming soon')}
            style={{
              marginTop: '20px',
              background: 'var(--color-brand)',
              color: 'white',
              borderRadius: '9999px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Schedule an event
          </button>
        </div>
      )}

      {timeFilter === 'upcoming' && activeTab === 'leanin' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          {filteredEvents.map((event) => {
            const isRsvpd = rsvpIds.has(event.id)
            return (
              <div
                key={event.id}
                className="card-hover"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderLeft: `3px solid ${event.color}`,
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: 'none',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'stretch',
                }}
              >
                <div
                  style={{
                    width: '96px',
                    height: '72px',
                    flexShrink: 0,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    alignSelf: 'center',
                  }}
                >
                  <CoverImage
                    src={event.cover_url}
                    alt={event.title}
                    height={72}
                    overlay={false}
                    sizes="96px"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: 'var(--color-brand-subtle)',
                        color: 'var(--color-text-brand)',
                        borderRadius: '9999px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {event.date} · {event.time}
                    </span>
                    <span
                      style={{
                        background: 'var(--color-subtle)',
                        color: 'var(--color-text-secondary)',
                        borderRadius: '9999px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: 'var(--color-text-default)',
                      marginTop: '8px',
                    }}
                  >
                    {event.title}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Hosted by {event.host}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '12px',
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
                      <Users size={12} />
                      {event.attendees} attendees
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleRsvp(event)}
                      style={{
                        background: isRsvpd ? 'var(--color-status-success)' : 'var(--color-brand)',
                        color: 'white',
                        borderRadius: '9999px',
                        padding: '4px 14px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        transition: 'background 0.12s',
                      }}
                    >
                      {isRsvpd ? 'RSVPd ✓' : 'RSVP'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {isProposeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Propose an event"
          onClick={closeProposeModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeProposeModal()
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              width: '440px',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-modal)',
            }}
            className="responsive-modal"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Propose an event
              </p>
              <button
                type="button"
                aria-label="Close propose event dialog"
                onClick={closeProposeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <input
              type="text"
              aria-label="Event title"
              placeholder="Event title"
              value={proposeTitle}
              onChange={(event) => setProposeTitle(event.target.value)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px 14px',
                fontSize: '16px',
                border: '1px solid var(--color-border-default)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-text-default)',
                boxSizing: 'border-box',
              }}
            />

            <input
              type="text"
              aria-label="Event date and time"
              placeholder="Date and time"
              value={proposeDateTime}
              onChange={(event) => setProposeDateTime(event.target.value)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 14px',
                fontSize: '16px',
                border: '1px solid var(--color-border-default)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-text-default)',
                boxSizing: 'border-box',
              }}
            />

            <select
              aria-label="Event format"
              value={proposeFormat}
              onChange={(event) => setProposeFormat(event.target.value as EventFormat)}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 14px',
                fontSize: '14px',
                border: '1px solid var(--color-border-default)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-text-default)',
                boxSizing: 'border-box',
                background: 'var(--color-surface)',
              }}
            >
              <option value="Virtual">Virtual</option>
              <option value="In person">In person</option>
            </select>

            <textarea
              aria-label="Event description"
              placeholder="Description"
              value={proposeDescription}
              onChange={(event) => setProposeDescription(event.target.value)}
              rows={4}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px 14px',
                fontSize: '16px',
                border: '1px solid var(--color-border-default)',
                borderRadius: '10px',
                outline: 'none',
                fontFamily: 'inherit',
                color: 'var(--color-text-default)',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={closeProposeModal}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-default)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitProposal}
                style={{
                  background: 'var(--color-brand)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Submit proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
