import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Sidebar } from '@/components/organisms/Sidebar'
import { Topbar } from '@/components/organisms/Topbar'
import { AppChrome } from '@/components/organisms/AppChrome'

export const metadata: Metadata = {
  title: 'Lean In Connect',
  description: 'A community platform helping women grow their careers.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div
          className="app-shell flex h-screen overflow-hidden"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          <Sidebar />
          <div className="app-shell-content">
            <Topbar />
            <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
              {children}
            </main>
          </div>
        </div>
        <AppChrome />
      </body>
    </html>
  )
}
