'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Bell, Sparkles, User, Settings, LogOut, Loader2, X, Moon, Sun } from 'lucide-react'
import { showToast, formatRelativeTime } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'

interface SearchResultsData {
  results: {
    circles: string[]
    members: string[]
    resources: string[]
    topics: string[]
  }
  summary: string
}

export function Topbar() {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { unreadCount, notifications, markAllRead } = useRealtimeNotifications(user?.id)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResultsData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const rightSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (rightSectionRef.current && !rightSectionRef.current.contains(target)) {
        setShowNotifications(false)
        setShowProfileMenu(false)
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setIsSearching(true)
    setShowResults(true)
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = (await response.json()) as { data?: SearchResultsData }
      if (data.data) {
        setSearchResults(data.data)
      }
    } catch {
      // Keep previous results on failure
    } finally {
      setIsSearching(false)
    }
  }

  const resultCategories: Array<{
    key: keyof SearchResultsData['results']
    label: string
    href: (item: string) => string
  }> = [
    { key: 'circles', label: 'Circles', href: () => '/circles' },
    { key: 'members', label: 'Members', href: () => '/directory' },
    { key: 'resources', label: 'Resources', href: () => '/resources' },
    { key: 'topics', label: 'Topics', href: (topic) => '/feed?topic=' + encodeURIComponent(topic) },
  ]

  return (
    <header
      role="banner"
      aria-label="Site header"
      className="topbar-header"
      style={{
        height: '52px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        gap: '12px',
        minWidth: 0,
      }}
    >
      <div ref={searchRef} style={{ position: 'relative', flex: '1 1 auto', minWidth: 0, maxWidth: '500px' }}>
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
            width: '100%',
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            cursor: 'text',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            transition: 'border-color 0.12s',
          }}
        >
          <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
          <label htmlFor="topbar-search" className="sr-only">
            Search Lean In Connect
          </label>
          <input
            id="topbar-search"
            type="search"
            aria-label="Search Lean In Connect"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void handleSearch()
              }
              if (event.key === 'Escape') {
                setShowResults(false)
                setSearchQuery('')
              }
            }}
            onFocus={() => {
              if (searchResults) setShowResults(true)
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
          <kbd
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              background: 'var(--color-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '6px',
              padding: '2px 7px',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ⌘ K
          </kbd>
        </div>

        {showResults && (
          <div
            style={{
              position: 'absolute',
              top: '46px',
              left: 0,
              width: '400px',
              maxWidth: 'min(400px, calc(100vw - 40px))',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              boxShadow: 'var(--shadow-dropdown)',
              zIndex: 100,
              padding: '12px',
              maxHeight: '380px',
              overflowY: 'auto',
            }}
          >
            <button
              type="button"
              onClick={() => setShowResults(false)}
              aria-label="Close search results"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                display: 'flex',
                padding: '2px',
              }}
            >
              <X size={14} aria-hidden="true" />
            </button>

            {isSearching && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0' }}>
                <Loader2
                  size={14}
                  style={{ color: 'var(--color-brand)', animation: 'spin 1s linear infinite' }}
                  aria-hidden="true"
                />
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Searching...</span>
              </div>
            )}

            {!isSearching && searchResults && (
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    fontStyle: 'italic',
                    marginBottom: '12px',
                    paddingRight: '24px',
                  }}
                >
                  {searchResults.summary}
                </p>

                {resultCategories.map((category) => {
                  const items = searchResults.results[category.key]
                  if (!items || items.length === 0) return null

                  return (
                    <div key={category.key} style={{ marginBottom: '12px' }}>
                      <p
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          color: 'var(--color-text-muted)',
                          marginBottom: '6px',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {category.label}
                      </p>
                      {items.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setShowResults(false)
                            router.push(category.href(item))
                          }}
                          className="hover:bg-subtle"
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-default)',
                            fontFamily: 'inherit',
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <span
        className="search-mobile"
        style={{
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.06em',
          color: 'var(--color-text-default)',
          whiteSpace: 'nowrap',
          alignItems: 'center',
        }}
      >
        LEAN <strong>IN</strong> CONNECT
      </span>

      <div
        ref={rightSectionRef}
        style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative', flexShrink: 0 }}
      >
        <button
          type="button"
          className="topbar-sparkles hover:bg-subtle"
          onClick={() => window.dispatchEvent(new Event('open-assistant'))}
          aria-label="Open AI Assistant"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            transition: 'background-color 0.12s',
          }}
        >
          <Sparkles size={16} />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="hover:bg-subtle"
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'background-color 0.12s',
          }}
        >
          {theme === 'dark' ? (
            <Sun size={16} aria-hidden="true" />
          ) : (
            <Moon size={16} aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowNotifications((previous) => {
              const next = !previous
              if (next) {
                void markAllRead()
              }
              return next
            })
            setShowProfileMenu(false)
          }}
          aria-label="Notifications"
          aria-haspopup="true"
          aria-expanded={showNotifications}
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
            transition: 'background-color 0.12s',
            position: 'relative',
          }}
          className="hover:bg-subtle"
        >
          <Bell size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <span
              aria-label={unreadCount + ' unread notifications'}
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                minWidth: '14px',
                height: '14px',
                borderRadius: '9999px',
                background: 'var(--color-brand)',
                color: 'var(--color-text-inverse)',
                fontSize: '9px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 3px',
                lineHeight: 1,
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowProfileMenu((previous) => !previous)
            setShowNotifications(false)
          }}
          aria-label="User menu"
          aria-haspopup="true"
          aria-expanded={showProfileMenu}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: profile?.color || '#7B2335',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--color-text-inverse)',
            cursor: 'pointer',
            border: 'none',
            fontFamily: 'inherit',
            transition: 'background-color 0.12s',
          }}
        >
          {profile?.initials || 'HS'}
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
                onClick={() => {
                  void markAllRead()
                  showToast('All notifications marked as read')
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
                Mark all read
              </button>
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--color-border-default)',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      background: notification.is_read
                        ? 'transparent'
                        : 'var(--color-brand-subtle)',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '9999px',
                        background: notification.from_user_color || 'var(--color-brand)',
                        color: 'var(--color-text-inverse)',
                        fontSize: '11px',
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
                          fontSize: '13px',
                          color: 'var(--color-text-default)',
                          lineHeight: 1.4,
                        }}
                      >
                        {notification.content}
                      </p>
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          marginTop: '4px',
                        }}
                      >
                        {notification.from_user_name || 'Someone'} ·{' '}
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span
                        aria-label="Unread"
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '9999px',
                          background: 'var(--color-brand)',
                          flexShrink: 0,
                          marginTop: '6px',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

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
            <div
              style={{
                padding: '8px 12px 10px',
                borderBottom: '1px solid var(--color-border-default)',
                marginBottom: '4px',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--color-text-default)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {profile?.full_name || user?.email || 'My Account'}
              </p>
            </div>
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
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false)
                  void signOut()
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
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false)
                  router.push('/auth/login')
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
                <User size={15} />
                Sign in
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
