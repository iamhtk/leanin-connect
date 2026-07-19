import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { AuthenticatedShell } from '@/components/organisms/AuthenticatedShell'

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
        <AuthProvider>
          <AuthenticatedShell>{children}</AuthenticatedShell>
        </AuthProvider>
      </body>
    </html>
  )
}
