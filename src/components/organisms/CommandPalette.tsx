'use client'

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Home,
  Briefcase,
  MessageSquare,
  Users,
  Globe,
  Grid,
  BookOpen,
  Calendar,
  Bell,
  User,
  Settings,
  Sparkles,
  Moon,
  Sun,
  LogOut,
  ArrowRight,
  Hash,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'

interface Command {
  id: string
  label: string
  description?: string
  icon: ReactNode
  action: () => void
  group: string
  keywords?: string[]
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const lastFocusRef = useRef<HTMLElement | null>(null)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { signOut } = useAuth()

  const navigate = useCallback(
    (path: string) => {
      router.push(path)
      setIsOpen(false)
      setQuery('')
    },
    [router]
  )

  const commands: Command[] = [
    {
      id: 'feed',
      label: 'Go to Feed',
      icon: <Home size={15} aria-hidden="true" />,
      action: () => navigate('/feed'),
      group: 'Navigation',
      keywords: ['home', 'posts', 'community'],
    },
    {
      id: 'jobs',
      label: 'Go to Opportunities',
      description: 'Browse jobs and apply',
      icon: <Briefcase size={15} aria-hidden="true" />,
      action: () => navigate('/jobs'),
      group: 'Navigation',
      keywords: ['jobs', 'career', 'work', 'hiring'],
    },
    {
      id: 'messages',
      label: 'Go to Messages',
      icon: <MessageSquare size={15} aria-hidden="true" />,
      action: () => navigate('/messages'),
      group: 'Navigation',
      keywords: ['chat', 'dm', 'inbox'],
    },
    {
      id: 'circles',
      label: 'Go to Circles',
      icon: <Users size={15} aria-hidden="true" />,
      action: () => navigate('/circles'),
      group: 'Navigation',
      keywords: ['groups', 'community', 'teams'],
    },
    {
      id: 'networks',
      label: 'Go to Networks',
      icon: <Globe size={15} aria-hidden="true" />,
      action: () => navigate('/networks'),
      group: 'Navigation',
      keywords: ['community', 'region'],
    },
    {
      id: 'groups',
      label: 'Go to Groups',
      icon: <Grid size={15} aria-hidden="true" />,
      action: () => navigate('/groups'),
      group: 'Navigation',
    },
    {
      id: 'directory',
      label: 'Go to Directory',
      description: 'Find members',
      icon: <Users size={15} aria-hidden="true" />,
      action: () => navigate('/directory'),
      group: 'Navigation',
      keywords: ['members', 'people', 'find'],
    },
    {
      id: 'events',
      label: 'Go to Events',
      icon: <Calendar size={15} aria-hidden="true" />,
      action: () => navigate('/events'),
      group: 'Navigation',
      keywords: ['meetups', 'webinars'],
    },
    {
      id: 'resources',
      label: 'Go to Resources',
      icon: <BookOpen size={15} aria-hidden="true" />,
      action: () => navigate('/resources'),
      group: 'Navigation',
      keywords: ['articles', 'videos', 'learn'],
    },
    {
      id: 'notifications',
      label: 'Go to Notifications',
      icon: <Bell size={15} aria-hidden="true" />,
      action: () => navigate('/notifications'),
      group: 'Navigation',
    },
    {
      id: 'profile',
      label: 'Go to Profile',
      icon: <User size={15} aria-hidden="true" />,
      action: () => navigate('/profile'),
      group: 'Navigation',
      keywords: ['account', 'me'],
    },
    {
      id: 'settings',
      label: 'Go to Settings',
      icon: <Settings size={15} aria-hidden="true" />,
      action: () => navigate('/settings'),
      group: 'Navigation',
      keywords: ['preferences', 'account'],
    },
    {
      id: 'theme',
      label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      icon: theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />,
      action: () => {
        toggleTheme()
        setIsOpen(false)
      },
      group: 'Actions',
      keywords: ['dark', 'light', 'theme', 'appearance'],
    },
    {
      id: 'post',
      label: 'Create a Post',
      description: 'Share with the community',
      icon: <Hash size={15} aria-hidden="true" />,
      action: () => {
        navigate('/feed')
        window.setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-composer'))
        }, 300)
      },
      group: 'Actions',
      keywords: ['write', 'share', 'compose'],
    },
    {
      id: 'ai',
      label: 'Open AI Assistant',
      description: 'Chat with your community guide',
      icon: <Sparkles size={15} aria-hidden="true" />,
      action: () => {
        navigate('/feed')
        window.setTimeout(() => {
          window.dispatchEvent(new CustomEvent('open-ai-assistant'))
        }, 300)
      },
      group: 'Actions',
      keywords: ['assistant', 'help', 'chat', 'claude'],
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: <LogOut size={15} aria-hidden="true" />,
      action: () => {
        void signOut()
        setIsOpen(false)
      },
      group: 'Account',
      keywords: ['logout', 'exit'],
    },
    {
      id: 'topic-negotiation',
      label: 'Browse Negotiation posts',
      icon: <Hash size={15} aria-hidden="true" />,
      action: () => navigate('/feed?topic=Negotiation'),
      group: 'Topics',
      keywords: ['salary', 'negotiate', 'pay'],
    },
    {
      id: 'topic-promotions',
      label: 'Browse Promotions posts',
      icon: <Hash size={15} aria-hidden="true" />,
      action: () => navigate('/feed?topic=Promotions'),
      group: 'Topics',
    },
    {
      id: 'topic-leadership',
      label: 'Browse Leadership posts',
      icon: <Hash size={15} aria-hidden="true" />,
      action: () => navigate('/feed?topic=Leadership'),
      group: 'Topics',
    },
    {
      id: 'topic-bias',
      label: 'Browse Bias at Work posts',
      icon: <Hash size={15} aria-hidden="true" />,
      action: () => navigate('/feed?topic=Bias%20at%20Work'),
      group: 'Topics',
    },
  ]

  const filtered =
    query.trim() === ''
      ? commands.slice(0, 10)
      : commands.filter((command) => {
          const search = query.toLowerCase()
          return (
            command.label.toLowerCase().includes(search) ||
            command.description?.toLowerCase().includes(search) ||
            command.group.toLowerCase().includes(search) ||
            command.keywords?.some((keyword) => keyword.toLowerCase().includes(search))
          )
        })

  const groups = filtered.reduce<Record<string, Command[]>>((accumulator, command) => {
    if (!accumulator[command.group]) accumulator[command.group] = []
    accumulator[command.group].push(command)
    return accumulator
  }, {})

  const flatFiltered = Object.values(groups).flat()

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const handler = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen((previous) => !previous)
        setQuery('')
      }
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (isOpen) {
      lastFocusRef.current = document.activeElement as HTMLElement
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen && lastFocusRef.current) {
      lastFocusRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((previous) => (previous < flatFiltered.length - 1 ? previous + 1 : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((previous) => (previous > 0 ? previous - 1 : flatFiltered.length - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      flatFiltered[activeIndex]?.action()
    }
  }

  useEffect(() => {
    const activeElement = listRef.current?.querySelector('[data-active="true"]') as
      | HTMLElement
      | null
    activeElement?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '15vh',
            background: 'color-mix(in srgb, var(--color-text-default) 50%, transparent)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: 'var(--color-surface)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-modal)',
              border: '1px solid var(--color-border-default)',
              overflow: 'hidden',
              margin: '0 16px',
            }}
          >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border-default)',
          }}
        >
          <Search
            size={16}
            style={{
              color: 'var(--color-text-muted)',
              flexShrink: 0,
            }}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions, topics..."
            aria-label="Command palette search"
            role="combobox"
            aria-expanded={true}
            aria-controls="command-list"
            aria-activedescendant={
              flatFiltered[activeIndex] ? 'cmd-' + flatFiltered[activeIndex].id : undefined
            }
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              background: 'transparent',
              color: 'var(--color-text-default)',
              fontFamily: 'inherit',
            }}
          />
          <kbd
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              background: 'var(--color-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '6px',
              padding: '2px 8px',
              fontFamily: 'inherit',
            }}
          >
            ESC
          </kbd>
        </div>

        <div
          ref={listRef}
          id="command-list"
          role="listbox"
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '8px',
          }}
        >
          {flatFiltered.length === 0 && (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                fontSize: '14px',
                color: 'var(--color-text-muted)',
              }}
            >
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {Object.entries(groups).map(([group, groupCommands]) => (
            <div key={group}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  padding: '8px 10px 4px',
                }}
              >
                {group}
              </div>
              {groupCommands.map((command) => {
                const globalIndex = flatFiltered.indexOf(command)
                const isActive = globalIndex === activeIndex
                return (
                  <button
                    key={command.id}
                    id={'cmd-' + command.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-active={isActive}
                    onClick={command.action}
                    onMouseEnter={() => setActiveIndex(globalIndex)}
                    className="btn-ghost"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '9px 10px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isActive ? 'var(--color-subtle)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      color: 'var(--color-text-default)',
                      transition: 'background 0.08s',
                    }}
                  >
                    <span
                      style={{
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isActive ? 'var(--color-brand-subtle)' : 'var(--color-muted)',
                        borderRadius: '8px',
                        color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
                        flexShrink: 0,
                      }}
                    >
                      {command.icon}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'block',
                          color: 'var(--color-text-default)',
                        }}
                      >
                        {command.label}
                      </span>
                      {command.description && (
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-text-muted)',
                            display: 'block',
                          }}
                        >
                          {command.description}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <ArrowRight
                        size={14}
                        style={{
                          color: 'var(--color-text-muted)',
                          flexShrink: 0,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-border-default)',
            padding: '8px 16px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          {(
            [
              { keys: ['↑', '↓'], label: 'Navigate' },
              { keys: ['↵'], label: 'Select' },
              { keys: ['⌘', 'K'], label: 'Toggle' },
            ] as const
          ).map(({ keys, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {keys.map((key) => (
                <kbd
                  key={key}
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    background: 'var(--color-subtle)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '4px',
                    padding: '1px 5px',
                    fontFamily: 'inherit',
                  }}
                >
                  {key}
                </kbd>
              ))}
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
