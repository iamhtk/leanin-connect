'use client'

import { User, Bell, Mail, Lock, Shield, Link, Download, Globe, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SETTINGS_ROWS = [
  {
    icon: User,
    title: 'Profile and identity',
    subtitle: 'Update your name, photo, bio, and email.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    subtitle: 'Choose which notifications reach your inbox.',
  },
  {
    icon: Mail,
    title: 'Marketing emails',
    subtitle: 'Newsletters, event invites, and partner stories.',
  },
  {
    icon: Lock,
    title: 'Privacy and visibility',
    subtitle: 'Manage who can see your profile and activity.',
  },
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
]

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div style={{ padding: '24px 32px 48px 32px' }}>
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
        {SETTINGS_ROWS.map((row, index) => {
          const Icon = row.icon
          return (
            <button
              key={row.title}
              type="button"
              onClick={() => {
                if (row.title === 'Notifications') router.push('/notifications')
                if (row.title === 'Profile and identity') router.push('/profile')
              }}
              className="hover:bg-subtle"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                border: 'none',
                borderBottom:
                  index === SETTINGS_ROWS.length - 1 ? 'none' : '1px solid var(--color-border-default)',
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
        <button
          type="button"
          className="hover:bg-subtle"
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
    </div>
  )
}
