'use client'

import { useState, type CSSProperties } from 'react'
import { User, Bell, Mail, Lock, Shield, Link, Download, Globe, ChevronRight, ChevronDown, Moon } from 'lucide-react'
import { showToast } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'

const COMING_SOON = 'This feature is available in the full product.'

const NOTIFICATION_ITEMS = [
  { id: 'dm', title: 'Direct messages', description: 'A member sends you a DM.', defaultOn: true },
  { id: 'mentions', title: 'Mentions', description: 'Someone @mentions you.', defaultOn: true },
  { id: 'invitations', title: 'Invitations', description: "You're invited to a Circle or Network.", defaultOn: true },
  { id: 'events', title: 'Events', description: 'RSVP activity and event reminders.', defaultOn: true },
  { id: 'replies', title: 'Replies and reactions', description: 'Replies to your posts.', defaultOn: false },
  { id: 'groups', title: 'Group activity', description: 'Updates in your groups.', defaultOn: false },
] as const

type ExpandedSection = 'profile' | 'notifications' | 'marketing' | 'privacy' | null

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={(event) => {
        event.stopPropagation()
        onChange(!checked)
      }}
      onKeyDown={(event) => {
        if (event.key === ' ') {
          event.preventDefault()
          event.stopPropagation()
          onChange(!checked)
        }
      }}
      className="toggle-switch"
      style={{
        width: '36px',
        height: '20px',
        borderRadius: '9999px',
        background: checked ? 'var(--color-brand)' : 'var(--color-muted)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        flexShrink: 0,
        padding: 0,
        transition: 'background 0.12s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '18px' : '2px',
          width: '16px',
          height: '16px',
          borderRadius: '9999px',
          background: 'var(--color-text-inverse)',
          transition: 'left 0.12s',
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme()
  const [expanded, setExpanded] = useState<ExpandedSection>(null)
  const [name, setName] = useState('Hrithik Sanyal')
  const [jobTitle, setJobTitle] = useState('Design Engineer')
  const [location, setLocation] = useState('San Francisco, CA, USA')
  const [draftName, setDraftName] = useState(name)
  const [draftJobTitle, setDraftJobTitle] = useState(jobTitle)
  const [draftLocation, setDraftLocation] = useState(location)
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_ITEMS.map((item) => [item.id, item.defaultOn]))
  )
  const [marketingOn, setMarketingOn] = useState(true)
  const [privacy, setPrivacy] = useState<'public' | 'members' | 'private'>('members')

  const toggleSection = (section: ExpandedSection) => {
    setExpanded((previous) => {
      const next = previous === section ? null : section
      if (next === 'profile') {
        setDraftName(name)
        setDraftJobTitle(jobTitle)
        setDraftLocation(location)
      }
      return next
    })
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    border: '1px solid var(--color-border-default)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '16px',
    fontFamily: 'inherit',
    outline: 'none',
    background: 'var(--color-surface)',
    color: 'var(--color-text-default)',
    boxSizing: 'border-box',
  }

  return (
    <main className="page-shell" aria-label="Settings">
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          Manage your account, privacy, notifications, and preferences.
        </p>
      </div>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: '14px',
          overflow: 'hidden',
          marginTop: '24px',
          boxShadow: 'none',
        }}
      >
        {/* Profile */}
        <div style={{ borderBottom: '1px solid var(--color-border-default)' }}>
          <button
            type="button"
            onClick={() => toggleSection('profile')}
            className="hover:bg-subtle settings-row"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background-color 0.12s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  background: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={16} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  Profile and identity
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Update your name, photo, bio, and email.
                </p>
              </div>
            </div>
            {expanded === 'profile' ? (
              <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: expanded === 'profile' ? '400px' : '0',
                transition: 'max-height 0.25s ease',
              }}
            >
            <div
              style={{
                borderTop: '1px solid var(--color-border-default)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                aria-label="Name"
                placeholder="Name"
                className="input-field"
                style={inputStyle}
                onFocus={(event) => {
                  event.currentTarget.style.borderColor = 'var(--color-border-focus)'
                }}
                onBlur={(event) => {
                  event.currentTarget.style.borderColor = 'var(--color-border-default)'
                }}
              />
              <input
                value={draftJobTitle}
                onChange={(event) => setDraftJobTitle(event.target.value)}
                aria-label="Job title"
                placeholder="Job title"
                className="input-field"
                style={inputStyle}
                onFocus={(event) => {
                  event.currentTarget.style.borderColor = 'var(--color-border-focus)'
                }}
                onBlur={(event) => {
                  event.currentTarget.style.borderColor = 'var(--color-border-default)'
                }}
              />
              <input
                value={draftLocation}
                onChange={(event) => setDraftLocation(event.target.value)}
                aria-label="Location"
                placeholder="Location"
                className="input-field"
                style={inputStyle}
                onFocus={(event) => {
                  event.currentTarget.style.borderColor = 'var(--color-border-focus)'
                }}
                onBlur={(event) => {
                  event.currentTarget.style.borderColor = 'var(--color-border-default)'
                }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setName(draftName)
                    setJobTitle(draftJobTitle)
                    setLocation(draftLocation)
                    showToast('Changes saved!')
                    setExpanded(null)
                  }}
                  className="btn-primary"
                  style={{
                    background: 'var(--color-brand)',
                    color: 'var(--color-text-inverse)',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded(null)}
                  className="btn-ghost"
                  style={{
                    background: 'var(--color-subtle)',
                    color: 'var(--color-text-default)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '9999px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
            </div>
        </div>

        {/* Notifications */}
        <div style={{ borderBottom: '1px solid var(--color-border-default)' }}>
          <button
            type="button"
            onClick={() => toggleSection('notifications')}
            className="hover:bg-subtle settings-row"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background-color 0.12s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  background: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bell size={16} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  Notifications
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Choose which notifications reach your inbox.
                </p>
              </div>
            </div>
            {expanded === 'notifications' ? (
              <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: expanded === 'notifications' ? '400px' : '0',
                transition: 'max-height 0.25s ease',
              }}
            >
            <div
              style={{
                borderTop: '1px solid var(--color-border-default)',
                padding: '16px',
              }}
            >
              {NOTIFICATION_ITEMS.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom:
                      index === NOTIFICATION_ITEMS.length - 1
                        ? 'none'
                        : '1px solid var(--color-border-default)',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                      {item.title}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {item.description}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={notifToggles[item.id]}
                    onChange={(checked) =>
                      setNotifToggles((previous) => ({ ...previous, [item.id]: checked }))
                    }
                  />
                </div>
              ))}
            </div>
            </div>
        </div>

        {/* Marketing */}
        <div style={{ borderBottom: '1px solid var(--color-border-default)' }}>
          <button
            type="button"
            onClick={() => toggleSection('marketing')}
            className="hover:bg-subtle settings-row"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background-color 0.12s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  background: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Mail size={16} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  Marketing emails
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Newsletters, event invites, and partner stories.
                </p>
              </div>
            </div>
            {expanded === 'marketing' ? (
              <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: expanded === 'marketing' ? '400px' : '0',
                transition: 'max-height 0.25s ease',
              }}
            >
            <div
              style={{
                borderTop: '1px solid var(--color-border-default)',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Send me newsletters and event invites
              </p>
              <ToggleSwitch checked={marketingOn} onChange={setMarketingOn} />
            </div>
            </div>
        </div>

        {/* Privacy */}
        <div style={{ borderBottom: '1px solid var(--color-border-default)' }}>
          <button
            type="button"
            onClick={() => toggleSection('privacy')}
            className="hover:bg-subtle settings-row"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'background-color 0.12s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  background: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={16} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  Privacy and visibility
                </p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Manage who can see your profile and activity.
                </p>
              </div>
            </div>
            {expanded === 'privacy' ? (
              <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />
            ) : (
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            )}
          </button>
            <div
              style={{
                overflow: 'hidden',
                maxHeight: expanded === 'privacy' ? '400px' : '0',
                transition: 'max-height 0.25s ease',
              }}
            >
            <div
              style={{
                borderTop: '1px solid var(--color-border-default)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {(
                [
                  { value: 'public' as const, label: 'Public — Anyone can see your profile' },
                  {
                    value: 'members' as const,
                    label: 'Members only — Only Lean In members can see your profile',
                  },
                  { value: 'private' as const, label: 'Private — Only people you approve' },
                ] as const
              ).map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--color-text-default)',
                  }}
                >
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '9999px',
                      border: `2px solid ${privacy === option.value ? 'var(--color-brand)' : 'var(--color-border-strong)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {privacy === option.value && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          background: 'var(--color-brand)',
                        }}
                      />
                    )}
                  </span>
                  <input
                    type="radio"
                    name="privacy"
                    checked={privacy === option.value}
                    onChange={() => setPrivacy(option.value)}
                    style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            </div>
        </div>

        {/* Coming soon rows */}
        {(
          [
            {
              icon: Shield,
              title: 'Login and devices',
              subtitle: "Review where you're signed in.",
            },
            {
              icon: Link,
              title: 'Connected accounts',
              subtitle: 'Link a Google account for faster sign in.',
            },
            {
              icon: Download,
              title: 'Data and downloads',
              subtitle: 'Request a copy of your data or delete your account.',
            },
          ] as const
        ).map((row, index, array) => {
          const Icon = row.icon
          return (
            <button
              key={row.title}
              type="button"
              onClick={() => showToast(COMING_SOON)}
              className="hover:bg-subtle settings-row"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: 'none',
                borderBottom:
                  index === array.length - 1 ? 'none' : '1px solid var(--color-border-default)',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9999px',
                    background: 'var(--color-brand-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={16} style={{ color: 'var(--color-brand)' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                    {row.title}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {row.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            </button>
          )
        })}
      </div>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: '14px',
          overflow: 'hidden',
          marginTop: '12px',
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                background: 'var(--color-brand-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Moon size={16} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Appearance
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Use dark mode across Lean In Connect.
              </p>
            </div>
          </div>
          <ToggleSwitch checked={theme === 'dark'} onChange={() => toggleTheme()} />
        </div>
      </div>

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: '14px',
          overflow: 'hidden',
          marginTop: '12px',
          boxShadow: 'none',
        }}
      >
        <button
          type="button"
          onClick={() => {
            window.location.href = 'mailto:support@leanin.org'
          }}
          className="hover:bg-subtle settings-row"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9999px',
                background: 'var(--color-brand-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Globe size={16} style={{ color: 'var(--color-brand)' }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Help and support
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Get help, review community guidelines, or contact us.
              </p>
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        </button>
      </div>

      <div style={{ padding: '16px 0', marginTop: '4px' }}>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to sign out?')) {
              showToast('You have been signed out.')
            }
          }}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontSize: '14px',
            color: 'var(--color-brand)',
            fontWeight: '500',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Sign out
        </button>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Sign out of Lean In Connect on this device.
        </p>
      </div>
    </main>
  )
}
