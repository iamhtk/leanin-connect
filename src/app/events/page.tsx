'use client'

import { useState } from 'react'
import { Search, Filter, Plus, Calendar, Users } from 'lucide-react'

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Women in Leadership Summit 2026',
    date: 'August 15, 2026',
    time: '10:00 AM PST',
    type: 'Virtual',
    host: 'Lean In',
    attendees: 342,
    color: '#7B2335',
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
  },
]

type EventsTab = 'my' | 'circles' | 'networks' | 'leanin'
type TimeFilter = 'upcoming' | 'past'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventsTab>('my')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming')

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Events</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Join us for in-person and virtual events to connect and gain practical insights.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
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
          <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search events..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              background: 'transparent',
              color: 'var(--color-text-default)',
              fontFamily: 'inherit',
            }}
          />
        </div>
        <button
          type="button"
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
          <Plus size={14} />
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
                  color: isActive ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
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
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  border: isActive ? 'none' : '1px solid var(--color-border-default)',
                  background: isActive ? 'var(--color-muted)' : 'transparent',
                  color: isActive ? 'var(--color-text-default)' : 'var(--color-text-muted)',
                }}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>

      {activeTab === 'my' && (
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

      {(activeTab === 'circles' || activeTab === 'networks') && (
        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
            padding: '48px 0',
          }}
        >
          No {activeTab === 'circles' ? 'Circle meetings' : 'Network events'} scheduled right now.
        </div>
      )}

      {activeTab === 'leanin' && timeFilter === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          {MOCK_EVENTS.map((event) => (
            <div
              key={event.id}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderLeft: `3px solid ${event.color}`,
                borderRadius: '14px',
                padding: '16px',
                boxShadow: 'none',
              }}
            >
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
                  style={{
                    background: 'var(--color-brand)',
                    color: 'white',
                    borderRadius: '9999px',
                    padding: '4px 14px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  RSVP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'leanin' && timeFilter === 'past' && (
        <div
          style={{
            marginTop: '32px',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: '14px',
            padding: '48px 0',
          }}
        >
          No past Lean In events to show.
        </div>
      )}
    </div>
  )
}
