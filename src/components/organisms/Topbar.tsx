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
        padding: '0 20px',
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
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-full)',
          padding: '0 16px',
          height: '36px',
          minHeight: '36px',
          width: '500px',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          cursor: 'text',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <Search size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        <span
          style={{
            fontSize: '14px',
            color: 'var(--color-text-muted)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
            flex: 1,
          }}
        >
          Search topics, members, Circles...
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            backgroundColor: 'var(--color-subtle)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-sm)',
            padding: '1px 5px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          ⌘K
        </span>
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
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
            borderRadius: '8px',
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
          width: '30px',
          height: '30px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-brand)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
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
