import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/organisms/Sidebar'
import { Topbar } from '@/components/organisms/Topbar'
import { MobileNav } from '@/components/organisms/MobileNav'

export const metadata: Metadata = {
  title: 'Lean In Connect',
  description: 'A community platform helping women grow their careers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            height: '100svh',
            overflow: 'hidden',
            backgroundColor: 'var(--color-background)',
          }}
        >
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
          <MobileNav />
        </div>
      </body>
    </html>
  )
}
