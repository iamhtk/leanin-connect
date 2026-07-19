import React from 'react'
import Link from 'next/link'

export default function NotFound() {
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
          fontSize: '48px',
          fontWeight: '700',
          color: 'var(--color-brand)',
          marginBottom: '8px',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--color-text-default)',
          marginBottom: '8px',
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          marginBottom: '24px',
          maxWidth: '280px',
          lineHeight: '1.5',
        }}
      >
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/feed"
        style={{
          background: 'var(--color-brand)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '10px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '600',
        }}
      >
        Back to Feed
      </Link>
    </div>
  )
}
