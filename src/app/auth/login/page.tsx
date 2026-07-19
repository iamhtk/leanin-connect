'use client'

import { Suspense, useEffect, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/feed'
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        router.push(redirectTo)
      }
    }

    void checkSession()
  }, [redirectTo, router, supabase.auth])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin + redirectTo,
          },
        })
        if (signUpError) throw signUpError
        setSuccessMessage('Account created. Check your email to confirm, then sign in.')
        setMode('login')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        router.push(redirectTo)
        router.refresh()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'oklch(.98 .005 60)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'oklch(.42 .13 17)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: 'white',
                  letterSpacing: '-0.02em',
                }}
              >
                L
              </span>
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '700',
                letterSpacing: '0.06em',
                color: 'oklch(.15 .01 17)',
              }}
            >
              LEAN IN CONNECT
            </span>
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'oklch(.15 .01 17)',
              marginBottom: '6px',
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'oklch(.45 .01 17)',
            }}
          >
            {mode === 'login' ? 'Sign in to your Lean In community' : 'Join the Lean In community today'}
          </p>
        </div>

        <div
          style={{
            background: 'white',
            border: '1px solid oklch(.92 .005 17)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          {error && (
            <div
              style={{
                background: 'oklch(.97 .02 17)',
                border: '1px solid oklch(.90 .04 17)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'oklch(.42 .13 17)',
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: 'oklch(.97 .05 150)',
                border: '1px solid oklch(.88 .08 150)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'oklch(.35 .10 150)',
              }}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '14px' }}>
                <label
                  htmlFor="fullName"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'oklch(.45 .01 17)',
                    marginBottom: '6px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required={mode === 'signup'}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Your name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid oklch(.92 .005 17)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: 'oklch(.15 .01 17)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'white',
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'oklch(.45 .01 17)',
                  marginBottom: '6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid oklch(.92 .005 17)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'oklch(.15 .01 17)',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  background: 'white',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'oklch(.45 .01 17)',
                  marginBottom: '6px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={mode === 'signup' ? 8 : undefined}
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    border: '1px solid oklch(.92 .005 17)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: 'oklch(.15 .01 17)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'white',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'oklch(.55 .01 17)',
                    display: 'flex',
                    padding: '4px',
                  }}
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px',
                background: isLoading ? 'oklch(.70 .08 17)' : 'oklch(.42 .13 17)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading && (
                <Loader2
                  size={15}
                  style={{ animation: 'spin 1s linear infinite' }}
                  aria-hidden="true"
                />
              )}
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'oklch(.45 .01 17)',
            }}
          >
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login')
                setError('')
                setSuccessMessage('')
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'oklch(.42 .13 17)',
                fontWeight: '600',
                fontSize: '13px',
                fontFamily: 'inherit',
              }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'oklch(.98 .005 60)',
          }}
        >
          <Loader2
            size={20}
            style={{ color: 'oklch(.42 .13 17)', animation: 'spin 1s linear infinite' }}
            aria-hidden="true"
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
