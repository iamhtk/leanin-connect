'use client'

import React from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'DM Sans, sans-serif',
        background: 'var(--color-background)',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--color-brand-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          fontSize: '22px',
        }}
      >
        ⚠
      </div>
      <h1
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--color-text-default)',
          marginBottom: '8px',
        }}
      >
        Something went wrong
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          marginBottom: '24px',
          maxWidth: '320px',
          lineHeight: '1.5',
        }}
      >
        We hit an unexpected error. Your data is safe.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          background: 'var(--color-brand)',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Try again
      </button>
    </div>
  )
}
