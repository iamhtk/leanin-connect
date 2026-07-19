'use client'

import { MessageSquare, Edit, Globe } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div>
      <div
        style={{
          height: '140px',
          background: 'linear-gradient(135deg, oklch(.90 .025 17) 0%, oklch(.95 .018 17) 100%)',
        }}
      />

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: '14px',
          margin: '-40px 24px 0 24px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          boxShadow: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
          <Avatar initials="HS" color="#7B2335" size={56} />
          <div>
            <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-default)' }}>
              Hrithik Sanyal
            </p>
            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Design Engineer
            </p>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Globe size={13} />
              San Francisco, CA, USA
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => router.push('/messages')}
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
            <MessageSquare size={14} />
            Messages
          </button>
          <button
            type="button"
            onClick={() => router.push('/settings')}
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
            <Edit size={14} />
            Edit profile
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          padding: '24px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              padding: '32px',
              textAlign: 'center',
              boxShadow: 'none',
            }}
          >
            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-text-default)' }}>
              No posts yet.
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Hrithik hasn&apos;t posted anything yet.
            </p>
          </div>
        </div>

        <div style={{ width: '260px' }}>
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              padding: '16px',
              boxShadow: 'none',
            }}
          >
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginBottom: '12px',
              }}
            >
              ABOUT
            </p>
            {(
              [
                { label: 'JOB TITLE', value: 'Design Engineer' },
                { label: 'INDUSTRY', value: 'Technology' },
                { label: 'LOCATION', value: 'San Francisco, CA, USA' },
              ] as const
            ).map((row, index, rows) => (
              <div
                key={row.label}
                style={{
                  padding: '8px 0',
                  borderBottom: index === rows.length - 1 ? 'none' : '1px solid var(--color-border-default)',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.06em',
                    fontWeight: '600',
                  }}
                >
                  {row.label}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--color-text-default)', marginTop: '4px' }}>
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
