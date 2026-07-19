'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Sparkles, User, Settings, LogOut } from 'lucide-react'
import { showToast } from '@/lib/utils'
import { AIAssistant } from '@/components/organisms/AIAssistant'

export function Topbar() {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const rightSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (rightSectionRef.current && !rightSectionRef.current.contains(target)) {
        setShowNotifications(false)
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
      }}
    >
      <span
        className="mobile-logo"
        style={{
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.06em',
          color: 'var(--color-text-default)',
        }}
      >
        LEAN <strong>IN</strong> CONNECT
      </span>

      <div
        className="search-bar-desktop hover:[border-color:var(--color-border-strong)]"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-full)',
          padding: '0 16px',
          height: '36px',
          minHeight: '36px',
          width: '500px',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          cursor: 'text',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              showToast('Search feature coming soon')
            }
          }}
          placeholder="Search topics, members, Circles..."
          style={{
            fontSize: '14px',
            color: 'var(--color-text-default)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'inherit',
          }}
        />
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '1px 5px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          ⌘K
        </span>
      </div>

      <div
        ref={rightSectionRef}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}
      >
        <button
          type="button"
          className="search-mobile hover:bg-subtle"
          onClick={() => router.push('/directory')}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
        >
          <Search size={16} />
        </button>

        <button
          type="button"
          onClick={() => setShowAssistant(true)}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: showAssistant ? 'var(--color-subtle)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
          className="hover:bg-subtle"
        >
          <Sparkles size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setShowNotifications((previous) => !previous)
            setShowProfileMenu(false)
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: showNotifications ? 'var(--color-subtle)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
          className="hover:bg-subtle"
        >
          <Bell size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setShowProfileMenu((previous) => !previous)
            setShowNotifications(false)
          }}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-text-inverse)',
            cursor: 'pointer',
            border: 'none',
            fontFamily: 'inherit',
          }}
        >
          H
        </button>

        {showNotifications && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              right: '60px',
              width: '320px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-dropdown)',
              zIndex: 100,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--color-border-default)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                Notifications
              </span>
              <button
                type="button"
                onClick={() => showToast('All notifications marked as read')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  color: 'var(--color-text-brand)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                Mark all read
              </button>
            </div>

            <div style={{ padding: '32px 16px', textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '9999px',
                  background: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                <Bell size={24} style={{ color: 'var(--color-brand)' }} />
              </div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                You&apos;re all caught up
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                New notifications will appear here.
              </p>
            </div>

            <div
              style={{
                padding: '12px 16px',
                borderTop: '1px solid var(--color-border-default)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false)
                  router.push('/notifications')
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  color: 'var(--color-text-brand)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  padding: 0,
                }}
              >
                View all notifications →
              </button>
            </div>
          </div>
        )}

        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              top: '44px',
              right: '0px',
              width: '200px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-dropdown)',
              zIndex: 100,
              padding: '6px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false)
                router.push('/profile')
              }}
              className="hover:bg-subtle"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--color-text-default)',
                background: 'transparent',
                border: 'none',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <User size={15} />
              View profile
            </button>
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false)
                router.push('/settings')
              }}
              className="hover:bg-subtle"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--color-text-default)',
                background: 'transparent',
                border: 'none',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <Settings size={15} />
              Settings
            </button>
            <div
              style={{
                height: '1px',
                background: 'var(--color-border-default)',
                margin: '4px 0',
              }}
            />
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(false)
                showToast('Signed out')
              }}
              className="hover:bg-subtle"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--color-brand)',
                background: 'transparent',
                border: 'none',
                fontFamily: 'inherit',
                textAlign: 'left',
              }}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        )}
      </div>

      <AIAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} />
    </header>
  )
}
