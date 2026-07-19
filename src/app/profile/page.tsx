'use client'

import { useState } from 'react'
import { MessageSquare, Edit, Globe } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/utils'

const DEFAULT_NAME = 'Hrithik Sanyal'
const DEFAULT_TITLE = 'Design Engineer'
const DEFAULT_LOCATION = 'San Francisco, CA, USA'

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(DEFAULT_NAME)
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [draftName, setDraftName] = useState(name)
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftLocation, setDraftLocation] = useState(location)

  const startEditing = () => {
    setDraftName(name)
    setDraftTitle(title)
    setDraftLocation(location)
    setIsEditing(true)
  }

  const handleSave = () => {
    setName(draftName)
    setTitle(draftTitle)
    setLocation(draftLocation)
    setIsEditing(false)
    showToast('Profile updated!')
  }

  const handleCancel = () => {
    setDraftName(name)
    setDraftTitle(title)
    setDraftLocation(location)
    setIsEditing(false)
  }

  const inputStyle = {
    width: '100%',
    border: '1px solid var(--color-border-default)',
    borderRadius: '8px',
    padding: '6px 10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'var(--color-surface)',
    color: 'var(--color-text-default)',
    boxSizing: 'border-box' as const,
  }

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
            {isEditing ? (
              <>
                <input
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  style={{ ...inputStyle, fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}
                />
                <input
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  style={{ ...inputStyle, fontSize: '14px', marginTop: '2px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Globe size={13} />
                  <input
                    value={draftLocation}
                    onChange={(event) => setDraftLocation(event.target.value)}
                    style={{ ...inputStyle, fontSize: '13px' }}
                  />
                </div>
              </>
            ) : (
              <>
                <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-default)' }}>
                  {name}
                </p>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {title}
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
                  {location}
                </p>
              </>
            )}
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
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
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
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
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
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startEditing}
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
          )}
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
              {name.split(' ')[0]} hasn&apos;t posted anything yet.
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
                { label: 'JOB TITLE', value: title },
                { label: 'INDUSTRY', value: 'Technology' },
                { label: 'LOCATION', value: location },
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
