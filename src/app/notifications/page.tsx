'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'
import { useSwipeReveal } from '@/hooks/useSwipeReveal'
import { formatRelativeTime } from '@/lib/utils'
import { Avatar } from '@/components/atoms/Avatar'
import { getPortraitUrl } from '@/lib/cover-images'

type NotificationsTab = 'all' | 'circles' | 'networks'

interface NotificationItem {
  id: string
  type: string
  content: string
  from_user_name: string | null
  from_user_initials: string
  from_user_color: string
  is_read: boolean
  created_at: string
}

interface NotifRowProps {
  notif: NotificationItem
  onDismiss: () => void
}

function NotifRow({ notif, onDismiss }: NotifRowProps) {
  const { handlers, style } = useSwipeReveal({
    revealWidth: 80,
    threshold: 55,
    onDelete: onDismiss,
  })

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{
            flex: 1,
            background: 'var(--color-status-error-bg)',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-status-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>
      </div>
      <div
        {...handlers}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px 16px',
          borderRadius: '12px',
          border: '1px solid var(--color-border-default)',
          borderLeft: notif.is_read
            ? '1px solid var(--color-border-default)'
            : '3px solid var(--color-brand)',
          background: notif.is_read ? 'var(--color-surface)' : 'var(--color-brand-subtle)',
        }}
        className="notif-item"
      >
        <Avatar
          initials={notif.from_user_initials || '?'}
          color={notif.from_user_color || 'var(--color-brand)'}
          size={40}
          src={getPortraitUrl(notif.from_user_name || notif.from_user_initials || notif.id)}
          alt={notif.from_user_name || 'Member'}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-default)',
              lineHeight: 1.45,
            }}
          >
            {notif.content}
          </p>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
            }}
          >
            {notif.from_user_name || 'Someone'} · {formatRelativeTime(notif.created_at)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { notifications, isLoading, unreadCount, markAllRead } = useRealtimeNotifications(
    user?.id
  )
  const [activeTab, setActiveTab] = useState<NotificationsTab>('all')
  const [dismissed, setDismissed] = useState<string[]>([])

  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : notifications.filter((notification) =>
          notification.type.toLowerCase().includes(activeTab.slice(0, -1))
        )

  const visibleNotifs = filteredNotifications.filter(
    (notification) => !dismissed.includes(notification.id)
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
              className="btn-ghost"
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

      <div className="sticky-nav" style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
      ) : visibleNotifs.length === 0 ? (
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
          {visibleNotifs.map((notification) => (
            <NotifRow
              key={notification.id}
              notif={notification}
              onDismiss={() =>
                setDismissed((previous) =>
                  previous.includes(notification.id)
                    ? previous
                    : [...previous, notification.id]
                )
              }
            />
          ))}
        </div>
      )}
    </main>
  )
}
