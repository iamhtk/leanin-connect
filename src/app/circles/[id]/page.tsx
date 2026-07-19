'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Users, Calendar, Send } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { CoverImage } from '@/components/atoms/CoverImage'
import { COVER_IMAGES, getPortraitUrl } from '@/lib/cover-images'
import { showToast, formatRelativeTime } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useCircleMessages } from '@/hooks/useCircleMessages'

const CIRCLE_DETAILS: Record<
  string,
  {
    id: number
    name: string
    category: string
    color: string
    cover_url: string
    description: string
    members: Array<{
      name: string
      role: string
      company: string
      initials: string
      color: string
    }>
    nextMeeting: string
    posts: Array<{
      id: string
      author: string
      initials: string
      color: string
      content: string
      time: string
    }>
  }
> = {
  '1': {
    id: 1,
    name: 'Women in Finance',
    category: 'FINANCE',
    color: '#7B2335',
    cover_url: COVER_IMAGES.womenFinance,
    description:
      'We get together on the 3rd Tuesday of every month to talk about our careers, our aspirations and how we can best support each other.',
    members: [
      { name: 'Priya Sharma', role: 'Senior PM', company: 'Stripe', initials: 'PS', color: '#7B2D8B' },
      {
        name: 'Jennifer Park',
        role: 'VP Operations',
        company: 'Rippling',
        initials: 'JP',
        color: '#065F46',
      },
      {
        name: 'Lucia Fernandez',
        role: 'Sales Director',
        company: 'HubSpot',
        initials: 'LF',
        color: '#7C2D12',
      },
    ],
    nextMeeting: 'Tuesday, August 19, 2026 at 7:00 PM PST',
    posts: [
      {
        id: '1',
        author: 'Priya Sharma',
        initials: 'PS',
        color: '#7B2D8B',
        content: 'Excited for our next meeting! Anyone have topics they want to discuss?',
        time: '2h ago',
      },
      {
        id: '2',
        author: 'Jennifer Park',
        initials: 'JP',
        color: '#065F46',
        content: 'I would love to talk about navigating Q4 performance reviews.',
        time: '1h ago',
      },
    ],
  },
  '2': {
    id: 2,
    name: 'The Balance Collective',
    category: 'LEADERSHIP',
    color: '#1A6B3C',
    cover_url: COVER_IMAGES.womenBalance,
    description: 'A monthly Circle for women working through the work-life balance question.',
    members: [
      {
        name: 'Fatima Al-Hassan',
        role: 'UX Research Lead',
        company: 'Airbnb',
        initials: 'FA',
        color: '#0F4C81',
      },
      {
        name: 'Maya Rodriguez',
        role: 'Software Engineer',
        company: 'Linear',
        initials: 'MR',
        color: '#6B21A8',
      },
      {
        name: 'Kezia Williams',
        role: 'APM',
        company: 'Salesforce',
        initials: 'KW',
        color: '#1E40AF',
      },
    ],
    nextMeeting: 'Thursday, August 7, 2026 at 6:00 PM PST',
    posts: [
      {
        id: '1',
        author: 'Fatima Al-Hassan',
        initials: 'FA',
        color: '#0F4C81',
        content: 'Who is joining the next session? We will be discussing boundaries with managers.',
        time: '3h ago',
      },
    ],
  },
  '3': {
    id: 3,
    name: 'Leaning into AI',
    category: 'TECH',
    color: '#1E4A8C',
    cover_url: COVER_IMAGES.womenCoding,
    description: 'An open virtual Circle for women curious about AI.',
    members: [
      {
        name: 'Zoe Mitchell',
        role: 'Design Engineer',
        company: 'Anthropic',
        initials: 'ZM',
        color: '#3730A3',
      },
      {
        name: 'Aisha Patel',
        role: 'Head of Product',
        company: 'Vercel',
        initials: 'AP',
        color: '#9F1239',
      },
      {
        name: 'Nina Okonkwo',
        role: 'Staff Engineer',
        company: 'Shopify',
        initials: 'NO',
        color: '#164E63',
      },
    ],
    nextMeeting: 'Wednesday, August 13, 2026 at 5:00 PM PST',
    posts: [
      {
        id: '1',
        author: 'Zoe Mitchell',
        initials: 'ZM',
        color: '#3730A3',
        content: 'Anyone tried Claude for design work? Would love to share notes.',
        time: '4h ago',
      },
      {
        id: '2',
        author: 'Aisha Patel',
        initials: 'AP',
        color: '#9F1239',
        content: 'Yes! I have been using it for product specs. Game changer.',
        time: '2h ago',
      },
    ],
  },
  '4': {
    id: 4,
    name: 'Early-career professionals',
    category: 'CAREER',
    color: '#6B21A8',
    cover_url: COVER_IMAGES.womenEarlyCareer,
    description: 'Starting your career can feel exciting, overwhelming, and everything in between.',
    members: [
      {
        name: 'Kezia Williams',
        role: 'APM',
        company: 'Salesforce',
        initials: 'KW',
        color: '#1E40AF',
      },
      {
        name: 'Maya Rodriguez',
        role: 'Software Engineer',
        company: 'Linear',
        initials: 'MR',
        color: '#6B21A8',
      },
    ],
    nextMeeting: 'Monday, August 11, 2026 at 6:00 PM PST',
    posts: [
      {
        id: '1',
        author: 'Kezia Williams',
        initials: 'KW',
        color: '#1E40AF',
        content: 'Six months in and I finally feel like I belong. Anyone else had this moment?',
        time: '1d ago',
      },
    ],
  },
  '5': {
    id: 5,
    name: 'The Latina Coalition of Silicon Valley',
    category: 'LEADERSHIP',
    color: '#B45309',
    cover_url: COVER_IMAGES.womenLeadership,
    description: 'Part of the Lean In Latinas Network. Bay Area Latinas in tech, finance, and beyond.',
    members: [
      {
        name: 'Lucia Fernandez',
        role: 'Sales Director',
        company: 'HubSpot',
        initials: 'LF',
        color: '#7C2D12',
      },
    ],
    nextMeeting: 'Saturday, August 16, 2026 at 10:00 AM PST',
    posts: [
      {
        id: '1',
        author: 'Lucia Fernandez',
        initials: 'LF',
        color: '#7C2D12',
        content: 'Thrilled to be building this community. Who is joining us this month?',
        time: '2d ago',
      },
    ],
  },
  '6': {
    id: 6,
    name: 'Mechanical Engineering Circle Delhi',
    category: 'TECH',
    color: '#065F46',
    cover_url: COVER_IMAGES.womenIndia,
    description: 'A Circle for Mechanical Engineering students at IGDTUW in Delhi.',
    members: [
      {
        name: 'Divya Menon',
        role: 'Chief of Staff',
        company: 'OpenAI',
        initials: 'DM',
        color: '#065F46',
      },
    ],
    nextMeeting: 'Sunday, August 17, 2026 at 11:00 AM IST',
    posts: [
      {
        id: '1',
        author: 'Divya Menon',
        initials: 'DM',
        color: '#065F46',
        content: 'Welcome to our Circle! Let us start by sharing what we are working on.',
        time: '3d ago',
      },
    ],
  },
}

export default function CircleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const circle = CIRCLE_DETAILS[id]
  const { user, profile } = useAuth()
  const circleIdNum = parseInt(id, 10)
  const { messages, isLoading: messagesLoading, sendMessage } = useCircleMessages(circleIdNum)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'resources'>('feed')
  const [postInput, setPostInput] = useState('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!circle) {
    return (
      <div style={{ padding: '48px 32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>Circle not found.</p>
        <button
          type="button"
          onClick={() => router.push('/circles')}
          className="btn-ghost"
          style={{
            marginTop: '16px',
            color: 'var(--color-brand)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontFamily: 'inherit',
          }}
        >
          Back to Circles
        </button>
      </div>
    )
  }

  const handlePost = async () => {
    if (!postInput.trim() || !user || !profile) return
    const success = await sendMessage({
      userId: user.id,
      authorName: profile.full_name || 'Community Member',
      authorInitials: profile.initials || 'CM',
      authorColor: profile.color || '#7B2335',
      content: postInput.trim(),
    })
    if (success) {
      setPostInput('')
    } else {
      showToast('Could not send message. Try again.')
    }
  }

  return (
    <div style={{ padding: '24px 32px 48px' }}>
      <button
        type="button"
        onClick={() => router.push('/circles')}
        aria-label="Back to Circles"
        className="btn-ghost"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-muted)',
          fontSize: '13px',
          marginBottom: '20px',
          fontFamily: 'inherit',
          padding: '0',
        }}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to Circles
      </button>

      <div
        style={{
          borderRadius: '14px',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CoverImage
          src={circle.cover_url}
          alt=""
          height={220}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.2)',
              padding: '3px 10px',
              borderRadius: '9999px',
              backdropFilter: 'blur(4px)',
              alignSelf: 'flex-start',
            }}
          >
            {circle.category}
          </span>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: 'white',
              marginTop: '10px',
            }}
          >
            {circle.name}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.85)',
              marginTop: '6px',
              lineHeight: '1.5',
              maxWidth: '500px',
            }}
          >
            {circle.description}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '16px',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
              }}
            >
              <Users size={13} aria-hidden="true" />
              {circle.members.length} members
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '13px',
              }}
            >
              <Calendar size={13} aria-hidden="true" />
              Next: {circle.nextMeeting}
            </span>
          </div>
        </div>
      </div>

      <div
        className="sticky-nav"
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--color-border-default)',
          marginBottom: '20px',
          paddingBottom: 0,
        }}
        role="tablist"
        aria-label="Circle sections"
      >
        {(['feed', 'members', 'resources'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            className="tab-item"
            style={{
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: activeTab === tab ? '600' : '400',
              color:
                activeTab === tab ? 'var(--color-text-default)' : 'var(--color-text-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom:
                activeTab === tab
                  ? '2px solid var(--color-text-default)'
                  : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <div style={{ maxWidth: '600px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                background: 'var(--color-status-success)',
              }}
            />
            <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--color-text-muted)' }}>
              Live
            </span>
          </div>

          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Avatar
                initials={profile?.initials || 'HS'}
                color={profile?.color || '#7B2335'}
                size={36}
                src={profile?.avatar_url || getPortraitUrl(profile?.full_name || 'Hrithik Sanyal')}
                alt={profile?.full_name || 'You'}
              />
              <textarea
                value={postInput}
                onChange={(event) => setPostInput(event.target.value)}
                placeholder="Share something with the circle..."
                aria-label="Write a post for this circle"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: 'var(--color-text-default)',
                  background: 'transparent',
                  resize: 'none',
                  minHeight: '60px',
                  lineHeight: '1.5',
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid var(--color-border-default)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  void handlePost()
                }}
                disabled={!postInput.trim() || !user}
                aria-label="Post to circle"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background:
                    postInput.trim() && user ? 'var(--color-brand)' : 'var(--color-muted)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '7px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: postInput.trim() && user ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                }}
              >
                <Send size={13} aria-hidden="true" />
                Post to Circle
              </button>
            </div>
          </div>

          {messagesLoading ? (
            <div>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="skeleton"
                  style={{
                    height: '96px',
                    marginBottom: '8px',
                    borderRadius: '14px',
                  }}
                />
              ))}
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <article
                  key={message.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '8px',
                  }}
                  aria-label={'Post by ' + message.author_name}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Avatar
                      initials={message.author_initials}
                      color={message.author_color}
                      size={36}
                      src={getPortraitUrl(message.author_name || message.author_initials)}
                      alt={message.author_name}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'var(--color-text-default)',
                        }}
                      >
                        {message.author_name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {formatRelativeTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-text-default)',
                      lineHeight: '1.6',
                      marginTop: '10px',
                    }}
                  >
                    {message.content}
                  </p>
                </article>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
            gap: '12px',
            maxWidth: '800px',
          }}
          role="list"
          aria-label="Circle members"
        >
          {circle.members.map((member) => (
            <div
              key={member.name}
              className="member-item"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
              role="listitem"
            >
              <Avatar
                initials={member.initials}
                color={member.color}
                size={40}
                src={getPortraitUrl(member.name || member.initials)}
                alt={member.name}
              />
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-default)',
                  }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '2px',
                  }}
                >
                  {member.role} · {member.company}
                </div>
              </div>
            </div>
          ))}
          <div
            style={{
              background: 'var(--color-brand-subtle)',
              border: '1px solid var(--color-border-brand)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
            role="listitem"
          >
            <Avatar
              initials="HS"
              color="#7B2335"
              size={40}
              src={getPortraitUrl('Hrithik Sanyal')}
              alt="Hrithik Sanyal"
            />
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text-default)',
                }}
              >
                Hrithik Sanyal
                <span
                  style={{
                    marginLeft: '8px',
                    fontSize: '10px',
                    background: 'var(--color-brand-muted)',
                    color: 'var(--color-brand)',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    fontWeight: '600',
                  }}
                >
                  You
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                  marginTop: '2px',
                }}
              >
                Design Engineer · Lean In Connect
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div style={{ maxWidth: '600px' }}>
          {[
            {
              title: 'Circle Meeting Guide',
              type: 'Toolkit',
              desc: 'Everything you need to run a great Circle meeting.',
            },
            {
              title: 'Negotiation Prep Template',
              type: 'Toolkit',
              desc: 'Walk into your next salary conversation prepared.',
            },
            {
              title: 'Leadership Curriculum',
              type: 'Course',
              desc: '6-month curriculum designed for Circle discussions.',
            },
          ].map((resource) => (
            <div
              key={resource.title}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: 'var(--color-brand)',
                    background: 'var(--color-brand-subtle)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    letterSpacing: '0.06em',
                  }}
                >
                  {resource.type}
                </span>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text-default)',
                    marginTop: '6px',
                  }}
                >
                  {resource.title}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '3px',
                  }}
                >
                  {resource.desc}
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Opening ' + resource.title)}
                aria-label={'Open ' + resource.title}
                className="btn-secondary"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: 'var(--color-text-default)',
                  fontFamily: 'inherit',
                  marginLeft: '16px',
                  flexShrink: 0,
                }}
              >
                Open
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
