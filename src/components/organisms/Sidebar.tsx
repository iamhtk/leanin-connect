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
    gap: '10px',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: isActive ? '500' : '400',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
    backgroundColor: isActive ? 'var(--color-brand-subtle)' : 'transparent',
    color: isActive ? 'var(--color-brand)' : 'var(--color-text-secondary)',
    cursor: 'pointer',
  }

  return (
    <Link
      href={item.href}
      style={linkStyle}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
    >
      <Icon size={16} strokeWidth={1.75} />
      <span>{item.label}</span>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 12px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '24px', padding: '4px 10px' }}>
        <span style={{
          fontSize: '13px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          color: 'var(--color-text-default)',
        }}>
          LEAN IN CONNECT
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p style={{
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              color: 'var(--color-text-muted)',
              marginBottom: '6px',
              padding: '0 10px',
            }}>
              {section.title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}