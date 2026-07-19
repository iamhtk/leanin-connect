'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, MessageSquare, Users, Search } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', href: '/feed', icon: Home },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Search', href: '/directory', icon: Search },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Community', href: '/circles', icon: Users },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation" style={{ alignItems: 'stretch' }}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href === '/feed' && pathname === '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: '12px',
              fontWeight: isActive ? '600' : '500',
              minHeight: '44px',
              letterSpacing: '-0.01em',
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
