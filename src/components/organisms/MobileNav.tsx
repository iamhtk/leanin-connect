'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, MessageSquare, Users, Search } from 'lucide-react'

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/feed', icon: Home },
  { label: 'Jobs', href: '/jobs', icon: Briefcase },
  { label: 'Search', href: '/directory', icon: Search },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Community', href: '/circles', icon: Users },
] as const

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border-default)',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      className="mobile-nav"
    >
      {MOBILE_NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || (item.href === '/feed' && pathname === '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
              textDecoration: 'none',
              fontSize: '10px',
              fontWeight: isActive ? '600' : '400',
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
