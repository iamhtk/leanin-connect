'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

type NotificationsTab = 'all' | 'circles' | 'networks'

export default function NotificationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<NotificationsTab>('all')

  return (
    <main className="page-shell" aria-label="Notifications">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
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
          Nothing new since you last looked. We only ping you for things that need a person — not the algorithm.
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
    </main>
  )
}
