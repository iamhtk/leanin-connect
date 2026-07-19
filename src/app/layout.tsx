import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthenticatedShell } from '@/components/organisms/AuthenticatedShell'
import { CommandPalette } from '@/components/organisms/CommandPalette'

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

const THEME_INIT_SCRIPT = `
try {
  var saved = localStorage.getItem('lean-in-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
} catch(e) {}
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_INIT_SCRIPT,
          }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <ThemeProvider>
            <AuthenticatedShell>{children}</AuthenticatedShell>
            <CommandPalette />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
