'use client'

import { Search, Bell, Sparkles } from 'lucide-react'

export function Topbar() {
  return (
    <header
      style={{
        height: '52px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}
    >
      {/* Search */}
      <div
        className="hover:[border-color:var(--color-border-strong)]"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-subtle)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-full)',
          padding: '7px 14px',
          width: '340px',
          cursor: 'text',
        }}
      >
        <Search size={14} style={{ color: 'var(--color-text-muted)' }} />
        <span style={{
          fontSize: '14px',
          color: 'var(--color-text-muted)',
        }}>
          Search topics, members, Circles...
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: '1px 5px',
        }}>
          ⌘K
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
          className="hover:bg-subtle"
        >
          <Sparkles size={16} />
        </button>

        <button
          style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
          }}
          className="hover:bg-subtle"
        >
          <Bell size={16} />
        </button>

        {/* Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '600',
          color: 'var(--color-text-inverse)',
          cursor: 'pointer',
        }}>
          H
        </div>
      </div>
    </header>
  )
}
