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
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [fullName, setFullName] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // useEffect(() => {
  //   const checkSession = async () => {
  //     const {
  //       data: { session },
  //     } = await supabase.auth.getSession()
  //     if (session) {
  //       router.push(redirectTo)
  //     }
  //   }

  //   void checkSession()
  // }, [redirectTo, router, supabase.auth])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    if (mode === 'signup' && password.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

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
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('too many')) {
        setError(
          'Too many attempts. Please wait a few minutes and try again, or use the demo link.'
        )
      } else if (
        msg.toLowerCase().includes('invalid email') ||
        msg.toLowerCase().includes('unable to validate')
      ) {
        setError('Please enter a valid email address.')
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setError('Please check your email and click the confirmation link, then sign in.')
      } else if (
        msg.toLowerCase().includes('invalid login') ||
        msg.toLowerCase().includes('invalid credentials')
      ) {
        setError('Incorrect email or password. Please try again.')
      } else if (msg.toLowerCase().includes('user already registered')) {
        setError('An account with this email already exists. Sign in instead.')
      } else {
        setError(msg || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-background)',
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
                background: 'var(--color-brand)',
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
                  color: 'var(--color-text-inverse)',
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
                color: 'var(--color-text-default)',
              }}
            >
              LEAN IN CONNECT
            </span>
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: 'var(--color-text-default)',
              marginBottom: '6px',
            }}
          >
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-muted)',
            }}
          >
            {mode === 'login' ? 'Sign in to your Lean In community' : 'Join the Lean In community today'}
          </p>
        </div>

        <div
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: '16px',
            padding: '28px',
          }}
        >
          {error && (
            <div
              style={{
                background: 'var(--color-brand-subtle)',
                border: '1px solid var(--color-border-brand)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--color-brand)',
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                background: 'var(--color-status-success-bg)',
                border: '1px solid var(--color-status-success)',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--color-status-success)',
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
                    color: 'var(--color-text-muted)',
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
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: 'var(--color-text-default)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'var(--color-surface)',
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
                  color: 'var(--color-text-muted)',
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
                className="input-field"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'var(--color-text-default)',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  background: 'var(--color-surface)',
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
                  color: 'var(--color-text-muted)',
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
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (passwordError) setPasswordError('')
                  }}
                  onBlur={() => {
                    if (mode === 'signup' && password.length > 0 && password.length < 8) {
                      setPasswordError('Password must be at least 8 characters')
                    } else {
                      setPasswordError('')
                    }
                  }}
                  placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={mode === 'signup' ? 8 : undefined}
                  className="input-field"
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: 'var(--color-text-default)',
                    outline: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    background: 'var(--color-surface)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="icon-btn"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
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
              {passwordError && (
                <p
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-status-error)',
                    marginTop: '6px',
                    marginBottom: '0',
                  }}
                >
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || (mode === 'signup' && password.length < 8)}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                background:
                  isLoading || (mode === 'signup' && password.length < 8)
                    ? 'oklch(.70 .08 17)'
                    : 'oklch(.42 .13 17)',
                color: 'var(--color-text-inverse)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor:
                  isLoading || (mode === 'signup' && password.length < 8)
                    ? 'not-allowed'
                    : 'pointer',
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
              color: 'var(--color-text-muted)',
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
              className="link-interactive"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-brand)',
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
            background: 'var(--color-background)',
          }}
        >
          <Loader2
            size={20}
            style={{ color: 'var(--color-brand)', animation: 'spin 1s linear infinite' }}
            aria-hidden="true"
          />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
