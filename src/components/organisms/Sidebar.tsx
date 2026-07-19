'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Network,
  MessageSquare,
  Calendar,
  BookOpen,
  Briefcase,
  Circle,
} from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  external?: boolean
}

const NAV_SECTIONS = [
  {
    title: 'MAIN',
    items: [
      { label: 'Home', href: '/feed', icon: Home },
    ] as NavItem[],
  },
  {
    title: 'COMMUNITY',
    items: [
      { label: 'Circles', href: 'https://connect.leanin.org/circles', icon: Circle, external: true },
      { label: 'Networks', href: 'https://connect.leanin.org/networks', icon: Network, external: true },
      { label: 'Groups', href: 'https://connect.leanin.org/groups', icon: Users, external: true },
    ] as NavItem[],
  },
  {
    title: 'OPPORTUNITIES',
    items: [
      { label: 'Jobs', href: '/jobs', icon: Briefcase },
    ] as NavItem[],
  },
  {
    title: 'CONNECT',
    items: [
      { label: 'Messages', href: '/messages', icon: MessageSquare },
      { label: 'Events', href: 'https://connect.leanin.org/events', icon: Calendar, external: true },
    ] as NavItem[],
  },
  {
    title: 'LEARN',
    items: [
      { label: 'Resources', href: 'https://connect.leanin.org/resources', icon: BookOpen, external: true },
    ] as NavItem[],
  },
]

interface NavLinkProps {
  item: NavItem
  isActive: boolean
}

function NavLink({ item, isActive }: NavLinkProps) {
  const Icon = item.icon

  const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 10px',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    fontWeight: isActive ? '500' : '400',
    textDecoration: 'none',
    backgroundColor: isActive ? 'var(--color-muted)' : 'transparent',
    color: isActive ? 'var(--color-text-default)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
  }

  return (
    <Link
      href={item.href}
      style={linkStyle}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      <Icon size={16} strokeWidth={1.5} color={isActive ? 'var(--color-brand)' : 'var(--color-text-muted)'} />
      <span>{item.label}</span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '208px',
        minWidth: '208px',
        backgroundColor: 'var(--color-sidebar)',
        borderRight: '1px solid var(--color-sidebar-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '20px', padding: '0 10px' }}>
        <span style={{ fontSize: '13px', color: 'var(--color-text-default)' }}>
          <span style={{ fontWeight: 400, letterSpacing: '0.06em' }}>LEAN </span>
          <span style={{ fontWeight: 700 }}>IN</span>
          <span style={{ fontWeight: 400, letterSpacing: '0.06em' }}> CONNECT</span>
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                padding: '0 10px',
                marginBottom: '4px',
              }}
            >
              {section.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
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
          paddingTop: '16px',
          borderTop: '1px solid var(--color-sidebar-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px' }}>
          <Avatar initials="HS" color="var(--color-brand-subtle)" textColor="var(--color-brand)" size={32} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-text-default)' }}>Hrithik Sanyal</p>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Design Engineer</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
