'use client'

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { MessageSquare, Edit, Globe, Sparkles, Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Avatar } from '@/components/atoms/Avatar'
import { useRouter } from 'next/navigation'
import { showToast } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { COVER_IMAGES, getPortraitUrl } from '@/lib/cover-images'
import { CoverImage } from '@/components/atoms/CoverImage'

const DEFAULT_NAME = 'Hrithik Sanyal'
const DEFAULT_TITLE = 'Design Engineer'
const DEFAULT_LOCATION = 'San Francisco, CA, USA'

interface ProfileStrength {
  score: number
  suggestions: Array<{
    title: string
    description: string
    impact: string
    action: string
  }>
}

export default function ProfilePage() {
  const router = useRouter()
  const { profile, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(DEFAULT_NAME)
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [location, setLocation] = useState(DEFAULT_LOCATION)
  const [draftName, setDraftName] = useState(name)
  const [draftTitle, setDraftTitle] = useState(title)
  const [draftLocation, setDraftLocation] = useState(location)
  const [profileStrength, setProfileStrength] = useState<ProfileStrength | null>(null)
  const [isLoadingStrength, setIsLoadingStrength] = useState(true)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile?.full_name) setName(profile.full_name)
    if (profile?.role) setTitle(profile.role)
  }, [profile])

  useEffect(() => {
    const fetchStrength = async () => {
      try {
        const response = await fetch('/api/ai/profile-strength', { method: 'POST' })
        const result = (await response.json()) as { data?: ProfileStrength }
        if (result.data) {
          setProfileStrength(result.data)
        }
      } catch {
        // Keep null strength on failure
      } finally {
        setIsLoadingStrength(false)
      }
    }

    void fetchStrength()
  }, [])

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploadingPhoto(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/profile-photo', {
        method: 'POST',
        body: formData,
      })
      const data = (await response.json()) as { data?: { url: string }; error?: string }
      if (data.data?.url) {
        await refreshProfile()
        showToast('Profile photo updated')
      } else {
        showToast('Upload failed: ' + (data.error || 'Unknown error'))
      }
    } catch {
      showToast('Upload failed')
    } finally {
      setIsUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleAvatarMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.background = 'color-mix(in srgb, var(--color-text-default) 40%, transparent)'
    const icon = event.currentTarget.querySelector('svg')
    if (icon) icon.style.opacity = '1'
  }

  const handleAvatarMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.style.background = 'transparent'
    const icon = event.currentTarget.querySelector('svg')
    if (icon && !isUploadingPhoto) icon.style.opacity = '0'
  }

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

  const avatarInitials = profile?.initials || 'HS'
  const avatarColor = profile?.color || '#7B2335'

  return (
    <main aria-label="Profile">
      <CoverImage
        src={COVER_IMAGES.profileCover}
        alt=""
        height={140}
        priority
        overlayOpacity={0.2}
      />

      <div
        className="profile-header-card"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: '14px',
          margin: '-48px 16px 0 16px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          boxShadow: 'none',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
              aria-label="Upload profile photo"
            />
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={name + ' profile photo'}
                width={56}
                height={56}
                unoptimized
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Avatar
                initials={avatarInitials}
                color={avatarColor}
                size={56}
                src={getPortraitUrl(name)}
                alt={name}
              />
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              aria-label="Change profile photo"
              onMouseEnter={handleAvatarMouseEnter}
              onMouseLeave={handleAvatarMouseLeave}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'transparent',
                border: 'none',
                cursor: isUploadingPhoto ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s',
              }}
            >
              {isUploadingPhoto ? (
                <Loader2
                  size={20}
                  color="white"
                  style={{ animation: 'spin 1s linear infinite' }}
                  aria-hidden="true"
                />
              ) : (
                <Camera size={20} color="white" style={{ opacity: 0 }} aria-hidden="true" />
              )}
            </button>
          </div>
          <div>
            {isEditing ? (
              <>
                <input
                  aria-label="Display name"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                  style={{ ...inputStyle, fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}
                />
                <input
                  aria-label="Job title"
                  value={draftTitle}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  style={{ ...inputStyle, fontSize: '14px', marginTop: '2px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Globe size={13} />
                  <input
                    aria-label="Location"
                    value={draftLocation}
                    onChange={(event) => setDraftLocation(event.target.value)}
                    style={{ ...inputStyle, fontSize: '13px' }}
                  />
                </div>
              </>
            ) : (
              <>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-text-default)' }}>
                  {name}
                </h1>
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

        <div className="profile-header-actions" style={{ display: 'flex', gap: '8px' }}>
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

      <div className="profile-layout">
        <div style={{ flex: 1, minWidth: 0 }}>
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

        <div className="profile-sidebar">
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderLeft: '3px solid var(--color-brand)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '12px',
              boxShadow: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Profile Strength
              </span>
              {profileStrength && (
                <span
                  style={{
                    marginLeft: 'auto',
                    background: 'var(--color-brand-subtle)',
                    color: 'var(--color-brand)',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {profileStrength.score}%
                </span>
              )}
            </div>

            <div
              style={{
                height: '6px',
                background: 'var(--color-muted)',
                borderRadius: '9999px',
                marginTop: '8px',
                marginBottom: '12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${profileStrength?.score ?? 0}%`,
                  background: 'var(--color-brand)',
                  borderRadius: '9999px',
                  height: '100%',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>

            {isLoadingStrength && (
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

            {!isLoadingStrength &&
              profileStrength?.suggestions.map((suggestion, index, suggestions) => (
                <div
                  key={suggestion.title}
                  style={{
                    padding: '10px 0',
                    borderBottom:
                      index === suggestions.length - 1 ? 'none' : '1px solid var(--color-border-default)',
                  }}
                >
                  <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                    {suggestion.title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {suggestion.description}
                  </p>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-brand)',
                      fontWeight: '600',
                      marginTop: '3px',
                    }}
                  >
                    {suggestion.impact}
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast('Opening ' + suggestion.action)}
                    style={{
                      marginTop: '6px',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'var(--color-brand)',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {suggestion.action}
                  </button>
                </div>
              ))}
          </div>

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
    </main>
  )
}
