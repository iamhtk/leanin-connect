'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function DemoPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const signInDemo = async () => {
      const supabase = createClient()

      const email = process.env.NEXT_PUBLIC_DEMO_EMAIL
      const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD

      if (!email || !password) {
        setStatus('error')
        return
      }

      await supabase.auth.signOut()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setStatus('error')
        return
      }

      router.push('/feed')
    }

    void signInDemo()
  }, [router])

  if (status === 'error') {
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
          Demo account unavailable. Please sign in directly.
        </p>
        <a
          href="/auth/login"
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
          Go to sign in
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
        Preparing your demo...
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
