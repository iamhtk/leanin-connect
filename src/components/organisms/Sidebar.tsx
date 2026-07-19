'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  Users,
  Network,
  MessageSquare,
  Calendar,
  BookOpen,
  Briefcase,
  Circle,
  Contact,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { getPortraitUrl } from '@/lib/cover-images'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [{ label: 'Home', href: '/feed', icon: Home }] as NavItem[],
  },
  {
    title: 'COMMUNITY',
    items: [
      { label: 'Circles', href: '/circles', icon: Circle },
      { label: 'Networks', href: '/networks', icon: Network },
      { label: 'Groups', href: '/groups', icon: Users },
      { label: 'Directory', href: '/directory', icon: Contact },
    ] as NavItem[],
  },
  {
    title: 'OPPORTUNITIES',
    items: [{ label: 'Jobs', href: '/jobs', icon: Briefcase }] as NavItem[],
  },
  {
    title: 'CONNECT',
    items: [
      { label: 'Messages', href: '/messages', icon: MessageSquare },
      { label: 'Events', href: '/events', icon: Calendar },
    ] as NavItem[],
  },
  {
    title: 'LEARN',
    items: [{ label: 'Resources', href: '/resources', icon: BookOpen }] as NavItem[],
  },
]

const SIDEBAR_COLLAPSED_KEY = 'lean_in_sidebar_collapsed'

interface NavLinkProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
}

function NavLink({ item, isActive, collapsed }: NavLinkProps) {
  const Icon = item.icon

  const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: collapsed ? '0' : '8px',
    padding: collapsed ? '8px' : '6px 8px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: isActive ? '500' : '400',
    textDecoration: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-default)',
    cursor: 'pointer',
    transition: 'background-color 0.12s',
    position: 'relative',
  }

  return (
    <Link
      href={item.href}
      style={linkStyle}
      className="hover:bg-muted"
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? item.label : undefined}
      aria-label={item.label}
    >
      {isActive && (
        <motion.span
          layoutId="sidebar-active"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-muted)',
            borderRadius: '9px',
            zIndex: 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          aria-hidden="true"
        />
      )}
      <Icon
        size={16}
        strokeWidth={1.5}
        color={isActive ? 'var(--color-brand)' : 'var(--color-text-secondary)'}
        style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
      />
      {!collapsed ? <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span> : null}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { profile } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (saved === 'true') setCollapsed(true)
    } catch {
      // ignore
    }
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      } catch {
        // ignore
      }
      return next
    })
  }

  const displayName = profile?.full_name || 'Hrithik Sanyal'
  const displayRole = profile?.role || 'Design Engineer'
  const avatarSrc = profile?.avatar_url || getPortraitUrl(displayName)
  const avatarInitials = profile?.initials || 'HS'

  return (
    <aside
      className={`desktop-sidebar${collapsed ? ' desktop-sidebar--collapsed' : ''}`}
      style={{
        width: collapsed ? '64px' : '208px',
        minWidth: collapsed ? '64px' : '208px',
        flexShrink: 0,
        backgroundColor: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: collapsed ? '12px 6px' : '16px 8px',
        transition: 'width 0.2s ease, min-width 0.2s ease, padding 0.2s ease',
      }}
    >
      <div
        style={{
          marginBottom: '12px',
          padding: collapsed ? '4px 0' : '4px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: '8px',
        }}
      >
        {!collapsed ? (
          <span style={{ fontSize: '13px', letterSpacing: '0.06em', color: 'var(--color-text-default)' }}>
            <span style={{ fontWeight: 400, letterSpacing: '0.06em' }}>LEAN </span>
            <span style={{ fontWeight: 700 }}>IN</span>
            <span style={{ fontWeight: 400, letterSpacing: '0.06em' }}> CONNECT</span>
          </span>
        ) : null}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hover:bg-muted"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {collapsed ? <PanelLeft size={16} strokeWidth={1.5} /> : <PanelLeftClose size={16} strokeWidth={1.5} />}
        </button>
      </div>

      <nav aria-label="Main navigation" style={{ display: 'flex', flexDirection: 'column' }}>
        {NAV_SECTIONS.map((section, index) => (
          <div key={section.title} style={{ marginTop: index === 0 ? 0 : collapsed ? '8px' : '16px' }}>
            {!collapsed ? (
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  padding: '0 8px',
                  marginBottom: '2px',
                }}
              >
                {section.title}
              </p>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  isActive={pathname === item.href || (item.href === '/feed' && pathname === '/')}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div
        style={{
          marginTop: 'auto',
          padding: collapsed ? '10px 0' : '12px 8px',
          borderTop: '1px solid var(--color-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '10px',
        }}
      >
        <Avatar
          initials={avatarInitials}
          color="var(--color-brand-subtle)"
          textColor="var(--color-brand)"
          size={32}
          src={avatarSrc}
          alt={displayName}
        />
        {!collapsed ? (
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-text-default)',
                lineHeight: '1.3',
              }}
            >
              {displayName}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
              {displayRole}
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  )
}
