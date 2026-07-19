'use client'

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
          <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
      <AppChrome />
    </>
  )
}
