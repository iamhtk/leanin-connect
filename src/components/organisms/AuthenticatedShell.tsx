'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/organisms/Sidebar'
import { Topbar } from '@/components/organisms/Topbar'
import { AppChrome } from '@/components/organisms/AppChrome'
import { PageTransition } from '@/components/providers/PageTransition'

interface AuthenticatedShellProps {
  children: React.ReactNode
}

export function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  const pathname = usePathname()
  const isAuthRoute = pathname.startsWith('/auth')
  const mainRef = useRef<HTMLElement>(null)
  const scrollHideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isAuthRoute) return

    const main = mainRef.current
    if (!main) return

    const handleScroll = () => {
      main.classList.add('is-scrolling')
      if (scrollHideTimeoutRef.current) {
        clearTimeout(scrollHideTimeoutRef.current)
      }
      scrollHideTimeoutRef.current = setTimeout(() => {
        main.classList.remove('is-scrolling')
      }, 900)
    }

    main.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      main.removeEventListener('scroll', handleScroll)
      if (scrollHideTimeoutRef.current) {
        clearTimeout(scrollHideTimeoutRef.current)
      }
    }
  }, [isAuthRoute])

  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <>
      <div
        className="app-shell flex h-screen overflow-hidden"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        <Sidebar />
        <div className="app-shell-content">
          <Topbar />
          <main
            ref={mainRef}
            id="main-content"
            className="flex-1 overflow-y-auto overflow-x-clip min-w-0"
          >
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <AppChrome />
    </>
  )
}
