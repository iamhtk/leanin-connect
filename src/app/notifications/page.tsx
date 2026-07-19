'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'
import { formatRelativeTime } from '@/lib/utils'

type NotificationsTab = 'all' | 'circles' | 'networks'

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { notifications, isLoading, unreadCount, markAllRead } = useRealtimeNotifications(
    user?.id
  )
  const [activeTab, setActiveTab] = useState<NotificationsTab>('all')

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter((notification) =>
          notification.type.toLowerCase().includes(activeTab.slice(0, -1))
        )

  return (
    <main className="page-shell" aria-label="Notifications">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '16px',
        }}
      >
        <div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginBottom: '8px',
            }}
          >
            INBOX
          </p>
          <h1 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--color-text-default)' }}>
            Notifications
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Everything happening in your Circles and Networks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => {
                void markAllRead()
              }}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border-brand)',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '12px',
                color: 'var(--color-text-brand)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                fontWeight: '600',
              }}
            >
              Mark all read
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push('/settings')}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '6px 14px',
              fontSize: '12px',
              color: 'var(--color-text-default)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            Notification settings
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
        {(
          [
            { label: 'All', value: 'all' },
            { label: 'Circles', value: 'circles' },
            { label: 'Networks', value: 'networks' },
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

      {isLoading ? (
        <div style={{ marginTop: '24px' }}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="skeleton"
              style={{ height: '60px', marginBottom: '8px', borderRadius: '12px' }}
            />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div
          style={{
            marginTop: '24px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '14px',
            padding: '48px 24px',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxShadow: 'none',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '9999px',
              background: 'var(--color-status-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={20} color="white" />
          </div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-muted)',
              marginTop: '16px',
            }}
          >
            ALL CAUGHT UP
          </p>
          <p
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--color-text-default)',
              marginTop: '8px',
            }}
          >
            You&apos;re all read through.
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
              maxWidth: '320px',
              marginTop: '8px',
              lineHeight: '1.5',
            }}
          >
            Nothing new since you last looked. We only ping you for things that need a person — not
            the algorithm.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => router.push('/feed')}
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
              Open feed
            </button>
            <button
              type="button"
              onClick={() => router.push('/settings')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-brand)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: '500',
              }}
            >
              Notification settings →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border-default)',
                borderLeft: notification.is_read
                  ? '1px solid var(--color-border-default)'
                  : '3px solid var(--color-brand)',
                background: notification.is_read
                  ? 'var(--color-surface)'
                  : 'var(--color-brand-subtle)',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '9999px',
                  background: notification.from_user_color || 'var(--color-brand)',
                  color: 'var(--color-text-inverse)',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {notification.from_user_initials || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--color-text-default)',
                    lineHeight: 1.45,
                  }}
                >
                  {notification.content}
                </p>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                  }}
                >
                  {notification.from_user_name || 'Someone'} ·{' '}
                  {formatRelativeTime(notification.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
