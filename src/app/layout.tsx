import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/organisms/Sidebar'
import { Topbar } from '@/components/organisms/Topbar'

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
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}