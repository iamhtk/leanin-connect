'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const MAX_ATTEMPTS = 6
const RETRY_DELAY_MS = 5000

type DemoStatus = 'loading' | 'waking' | 'unreachable' | 'error'

const isNetworkFailure = (error: { message?: string; status?: number } | null) => {
  if (!error) return false
  if (error.status !== undefined && error.status >= 500) return true
  const message = error.message?.toLowerCase() ?? ''
  return (
    message.includes('failed to fetch') ||
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('load failed')
  )
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export default function DemoPage() {
  const router = useRouter()
  const [status, setStatus] = useState<DemoStatus>('loading')

  useEffect(() => {
    let cancelled = false

    const signInDemo = async () => {
      const supabase = createClient()

      const email = process.env.NEXT_PUBLIC_DEMO_EMAIL
      const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD

      if (!email || !password) {
        setStatus('error')
        return
      }

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        if (cancelled) return

        try {
          await supabase.auth.signOut({ scope: 'local' })
        } catch {
          // A stale local session is not fatal; sign-in below replaces it.
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (!error) {
          router.push('/feed')
          router.refresh()
          return
        }

        if (!isNetworkFailure(error)) {
          setStatus('error')
          return
        }

        if (attempt === MAX_ATTEMPTS) {
          setStatus('unreachable')
          return
        }

        setStatus('waking')
        await wait(RETRY_DELAY_MS)
      }
    }

    void signInDemo()

    return () => {
      cancelled = true
    }
  }, [router])

  if (status === 'error' || status === 'unreachable') {
    const message =
      status === 'unreachable'
        ? 'The demo backend is not responding right now. Please try again in a minute.'
        : 'Demo account unavailable. Please sign in directly.'

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'DM Sans, sans-serif',
          background: '#FAF9F7',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '15px',
            color: '#9C9089',
            marginBottom: '20px',
          }}
        >
          {message}
        </p>
        <a
          href={status === 'unreachable' ? '/demo' : '/auth/login'}
          style={{
            background: '#7B2335',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '10px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '600',
            fontFamily: 'inherit',
          }}
        >
          {status === 'unreachable' ? 'Try again' : 'Go to sign in'}
        </a>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
        background: '#FAF9F7',
        gap: '20px',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2.5px solid #EDD5D8',
          borderTopColor: '#7B2335',
          animation: 'spin 0.7s linear infinite',
        }}
        aria-hidden="true"
      />
      <p
        style={{
          fontSize: '15px',
          color: '#7A6E65',
          margin: 0,
          fontWeight: '500',
        }}
      >
        {status === 'waking' ? 'Waking up the demo backend...' : 'Preparing your demo...'}
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
