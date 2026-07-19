'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Send, Sparkles, X, Loader2, ArrowLeft, Archive } from 'lucide-react'
import { MOCK_CONVERSATIONS } from '@/data/conversations'
import type { Conversation, Message } from '@/lib/types'
import { PortraitImage } from '@/components/atoms/PortraitImage'
import { formatRelativeTime, showToast } from '@/lib/utils'
import { getPortraitUrl } from '@/lib/cover-images'
import { useSwipeReveal } from '@/hooks/useSwipeReveal'
import { useSwipe } from '@/hooks/useSwipe'

function ConversationAvatar({
  conversation,
  size,
}: {
  conversation: Conversation
  size: number
}) {
  return (
    <PortraitImage
      src={
        conversation.participant_avatar_url ||
        getPortraitUrl(conversation.participant_name || conversation.participant_initials)
      }
      alt={conversation.participant_name}
      size={size}
    />
  )
}

interface ConversationRowProps {
  conv: Conversation
  isSelected: boolean
  onSelect: () => void
  onArchive: () => void
  onRemove: () => void
}

function ConversationRow({
  conv,
  isSelected,
  onSelect,
  onArchive,
  onRemove,
}: ConversationRowProps) {
  const { handlers: convHandlers, style: convStyle, close } = useSwipeReveal({
    revealWidth: 80,
    threshold: 55,
    onDelete: onRemove,
    onArchive,
  })

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '80px',
          display: 'flex',
        }}
      >
        <button
          type="button"
          onClick={() => {
            onArchive()
            close()
          }}
          aria-label="Archive conversation"
          style={{
            flex: 1,
            background: 'oklch(.6 .12 230)',
            border: 'none',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Archive size={18} />
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelect()
          }
        }}
        {...convHandlers}
        style={{
          ...convStyle,
          display: 'flex',
          gap: '10px',
          alignItems: 'flex-start',
          padding: '12px 16px',
          cursor: 'pointer',
          width: '100%',
          boxSizing: 'border-box',
          background: isSelected ? 'var(--color-subtle)' : 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border-default)',
        }}
        className={`conv-item${isSelected ? ' is-selected' : ''}`}
      >
        <ConversationAvatar conversation={conv} size={38} />
        <div style={{ flex: 1, minWidth: 0, pointerEvents: 'none' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--color-text-default)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '140px',
              }}
            >
              {conv.participant_name}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-text-muted)',
                flexShrink: 0,
                marginLeft: '8px',
              }}
            >
              {formatRelativeTime(conv.last_message_at)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '2px',
            }}
          >
            <span
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '170px',
              }}
            >
              {conv.last_message}
            </span>
            {conv.unread_count > 0 && (
              <span
                style={{
                  background: 'var(--color-brand)',
                  color: 'white',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  marginLeft: '6px',
                  flexShrink: 0,
                }}
              >
                {conv.unread_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CONVERSATIONS[0].id)
  const [messageInput, setMessageInput] = useState('')
  const [aiStarters, setAiStarters] = useState<string[]>([])
  const [isLoadingStarters, setIsLoadingStarters] = useState(false)
  const [showStarters, setShowStarters] = useState(false)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')
  const [listTab, setListTab] = useState<'All' | 'Unread'>('All')
  const [leftPanelWidth, setLeftPanelWidth] = useState(300)
  const [isResizing, setIsResizing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const layoutRef = useRef<HTMLElement>(null)
  const leftPanelWidthRef = useRef(300)
  const newMessageTriggerRef = useRef<HTMLButtonElement>(null)

  const closeNewMessageModal = () => {
    setShowNewMessage(false)
    setTimeout(() => newMessageTriggerRef.current?.focus(), 50)
  }

  const selectedConversation = conversations.find((c) => c.id === selectedId)

  const { onTouchStart, onTouchMove, onTouchEnd } = useSwipe({
    onSwipeDown: () => setSelectedId(null),
    threshold: 60,
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lean_in_messages_left_width')
      if (saved) {
        const parsed = Number(saved)
        if (!Number.isNaN(parsed) && parsed >= 220 && parsed <= 520) {
          setLeftPanelWidth(parsed)
          leftPanelWidthRef.current = parsed
        }
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (event: MouseEvent) => {
      const layout = layoutRef.current
      if (!layout) return
      const bounds = layout.getBoundingClientRect()
      const nextWidth = Math.min(520, Math.max(220, event.clientX - bounds.left))
      leftPanelWidthRef.current = nextWidth
      setLeftPanelWidth(nextWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      try {
        localStorage.setItem('lean_in_messages_left_width', String(leftPanelWidthRef.current))
      } catch {
        // ignore
      }
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId])

  useEffect(() => {
    if (!selectedConversation) return
    setAiStarters([])
    setShowStarters(false)
  }, [selectedId, selectedConversation])

  const fetchStarters = async () => {
    if (!selectedConversation) return
    setIsLoadingStarters(true)
    setShowStarters(true)
    try {
      const response = await fetch('/api/ai/conversation-starter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName: selectedConversation.participant_name,
          recipientRole: selectedConversation.participant_role,
          recipientCompany: selectedConversation.participant_company,
        }),
      })
      const result = await response.json()
      if (result.data) setAiStarters(result.data)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error(error)
    } finally {
      setIsLoadingStarters(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedId || !selectedConversation) return

    const currentInput = messageInput.trim()
    setMessageInput('')

    const conversationId = selectedId
    const participant = selectedConversation
    const recentHistory = (conversations.find((c) => c.id === conversationId)?.messages || []).slice(-6)

    const userMsg: Message = {
      id: 'user-' + Date.now().toString(),
      content: currentInput,
      sent_at: new Date().toISOString(),
      is_sent: true,
    }

    const typingId = 'typing-' + Date.now()

    // Add user message + typing indicator in one update (avoids React 18 batch overwrite)
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        return {
          ...c,
          messages: [
            ...c.messages,
            userMsg,
            {
              id: typingId,
              content: '...',
              sent_at: new Date().toISOString(),
              is_sent: false,
            },
          ],
          last_message: currentInput,
          last_message_at: new Date().toISOString(),
          unread_count: 0,
        }
      })
    )

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    try {
      const res = await fetch('/api/ai/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantName: participant.participant_name,
          participantRole: participant.participant_role,
          participantCompany: participant.participant_company,
          userMessage: currentInput,
          conversationHistory: recentHistory,
        }),
      })

      const data = (await res.json()) as { data?: string; error?: string }
      const replyText = data.data || 'Thanks for your message!'

      const replyMsg: Message = {
        id: 'reply-' + Date.now().toString(),
        content: replyText,
        sent_at: new Date().toISOString(),
        is_sent: false,
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== typingId).concat(replyMsg),
            last_message: replyText,
            last_message_at: new Date().toISOString(),
          }
        })
      )

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('AI reply failed:', err)
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c
          return {
            ...c,
            messages: c.messages.filter((m) => m.id !== typingId),
          }
        })
      )
    }
  }

  const handleStarterClick = (starter: string) => {
    setMessageInput(starter)
    setShowStarters(false)
  }

  return (
    <main
      ref={layoutRef}
      className="messages-layout"
      aria-label="Messages"
      data-selected={selectedId ? 'true' : 'false'}
    >
      <div
        className="messages-left-panel"
        style={{ width: leftPanelWidth, minWidth: leftPanelWidth, maxWidth: leftPanelWidth }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-text-default)',
            }}
          >
            Messages
          </h1>
          <button
            type="button"
            ref={newMessageTriggerRef}
            aria-label="New message"
            onClick={() => setShowNewMessage(true)}
            className="icon-btn"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              width: '44px',
              height: '44px',
              borderRadius: '9999px',
              background: 'var(--color-brand)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>

        <div style={{ padding: '10px 12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--color-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '9999px',
              padding: '7px 12px',
            }}
          >
            <Search size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} aria-hidden="true" />
            <label htmlFor="messages-search" className="sr-only">
              Search messages
            </label>
            <input
              id="messages-search"
              type="search"
              placeholder="Search messages"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '16px',
                background: 'transparent',
                color: 'var(--color-text-default)',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            padding: '0 12px',
            borderBottom: '1px solid var(--color-border-default)',
          }}
        >
          {(['All', 'Unread'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setListTab(tab)}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: listTab === tab ? '600' : '400',
                color: listTab === tab ? 'var(--color-text-default)' : 'var(--color-text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom:
                  listTab === tab ? '2px solid var(--color-text-default)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations
            .filter((conversation) => listTab === 'All' || conversation.unread_count > 0)
            .map((conv) => (
              <ConversationRow
                key={conv.id}
                conv={conv}
                isSelected={selectedId === conv.id}
                onSelect={() => setSelectedId(conv.id)}
                onArchive={() => showToast('Conversation archived')}
                onRemove={() => {
                  setConversations((previous) => previous.filter((item) => item.id !== conv.id))
                  if (selectedId === conv.id) setSelectedId(null)
                  showToast('Conversation removed')
                }}
              />
            ))}
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border-default)',
          }}
        >
          <button
            type="button"
            onClick={() => showToast('Blocking tools coming soon')}
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            Manage blocked
          </button>
        </div>
      </div>

      <div
        className="messages-resize-handle"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize conversation list"
        onMouseDown={(event) => {
          event.preventDefault()
          setIsResizing(true)
        }}
      />

      {selectedConversation ? (
        <div className="messages-right-panel">
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--color-border-default)',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              touchAction: 'pan-x',
            }}
          >
            <button
              type="button"
              className="mobile-back-btn"
              onClick={() => setSelectedId(null)}
              aria-label="Back to conversations"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-text-muted)',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <ConversationAvatar conversation={selectedConversation} size={36} />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text-default)',
                }}
              >
                {selectedConversation.participant_name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                }}
              >
                {selectedConversation.participant_role} ·{' '}
                {selectedConversation.participant_company}
              </div>
            </div>
            <button
              type="button"
              onClick={fetchStarters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-brand-subtle)',
                color: 'var(--color-text-brand)',
                border: '1px solid var(--color-border-brand)',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <Sparkles size={13} />
              AI Conversation Starter
            </button>
          </div>

          {showStarters && (
            <div
              style={{
                background: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border-default)',
                padding: '12px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  ✦ AI Suggested Openers
                </span>
                <button
                  type="button"
                  aria-label="Close conversation starters"
                  onClick={() => setShowStarters(false)}
                  className="icon-btn"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
              {isLoadingStarters ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--color-text-muted)',
                    fontSize: '13px',
                  }}
                >
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating personalized openers...
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {aiStarters.map((starter) => (
                    <button
                      key={starter}
                      type="button"
                      onClick={() => handleStarterClick(starter)}
                      className="ai-suggestion-chip"
                      style={{
                        textAlign: 'left',
                        background: 'var(--color-background)',
                        border: '1px solid var(--color-border-default)',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: 'var(--color-text-default)',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        lineHeight: '1.5',
                        transition: 'border-color 0.12s',
                      }}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {selectedConversation.messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.is_sent ? 'flex-end' : 'flex-start',
                }}
              >
                {!message.is_sent && (
                  <ConversationAvatar conversation={selectedConversation} size={28} />
                )}
                <div
                  style={{
                    maxWidth: '65%',
                    marginLeft: message.is_sent ? '0' : '8px',
                  }}
                >
                  <div
                    style={{
                      background: message.is_sent ? 'var(--color-brand)' : 'var(--color-surface)',
                      color: message.is_sent ? 'white' : 'var(--color-text-default)',
                      borderRadius: message.is_sent ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      padding: '10px 14px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      border: message.is_sent ? 'none' : '1px solid var(--color-border-default)',
                      boxShadow: message.is_sent ? 'none' : '0 2px 4px rgba(43, 33, 24, 0.06)',
                    }}
                  >
                    {!message.is_sent && message.content === '...' ? (
                      <span
                        role="status"
                        aria-live="polite"
                        aria-label="Recipient is typing"
                        style={{ display: 'inline-flex', alignItems: 'center', minHeight: '18px' }}
                      >
                        <span
                          className="typing-dot"
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '9999px',
                            background: 'var(--color-text-muted)',
                            display: 'inline-block',
                            margin: '0 2px',
                            animation: 'bounce 1.2s ease-in-out infinite',
                            animationDelay: '0s',
                          }}
                        />
                        <span
                          className="typing-dot"
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '9999px',
                            background: 'var(--color-text-muted)',
                            display: 'inline-block',
                            margin: '0 2px',
                            animation: 'bounce 1.2s ease-in-out infinite',
                            animationDelay: '0.2s',
                          }}
                        />
                        <span
                          className="typing-dot"
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '9999px',
                            background: 'var(--color-text-muted)',
                            display: 'inline-block',
                            margin: '0 2px',
                            animation: 'bounce 1.2s ease-in-out infinite',
                            animationDelay: '0.4s',
                          }}
                        />
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                  {!(!message.is_sent && message.content === '...') && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        marginTop: '4px',
                        textAlign: message.is_sent ? 'right' : 'left',
                      }}
                    >
                      {formatRelativeTime(message.sent_at)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--color-border-default)',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
            }}
          >
            <div
              style={{
                flex: 1,
                background: 'var(--color-background)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '14px',
                padding: '10px 14px',
                minHeight: '42px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <textarea
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSendMessage()
                  }
                }}
                aria-label="Write a message"
                placeholder="Write a message..."
                rows={1}
                className="input-field"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  background: 'transparent',
                  color: 'var(--color-text-default)',
                  fontFamily: 'inherit',
                  resize: 'none',
                  lineHeight: '1.5',
                }}
              />
            </div>
            <button
              type="button"
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="btn-primary"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '9999px',
                background: messageInput.trim() ? 'var(--color-brand)' : 'var(--color-muted)',
                border: 'none',
                cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexShrink: 0,
                transition: 'background 0.12s',
              }}
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="messages-right-panel"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '9999px',
              background: 'var(--color-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Send size={20} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <p
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--color-text-default)',
            }}
          >
            Your messages will appear here
          </p>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              marginTop: '4px',
              textAlign: 'center',
              maxWidth: '240px',
            }}
          >
            Use the + button to start your first conversation.
          </p>
        </div>
      )}

      {showNewMessage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New message"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeNewMessageModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeNewMessageModal()
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              width: '400px',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-modal)',
            }}
            className="responsive-modal"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'var(--color-text-default)',
                }}
              >
                New Message
              </h3>
              <button
                type="button"
                aria-label="Close new message dialog"
                onClick={closeNewMessageModal}
                className="icon-btn"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <label htmlFor="messages-member-search" className="sr-only">
              Search for a member
            </label>
            <input
              id="messages-member-search"
              type="search"
              value={memberSearch}
              onChange={(event) => setMemberSearch(event.target.value)}
              placeholder="Search for a member..."
              style={{
                width: '100%',
                border: '1px solid var(--color-border-default)',
                borderRadius: '9999px',
                padding: '10px 16px',
                marginTop: '16px',
                fontSize: '16px',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                color: 'var(--color-text-default)',
                background: 'var(--color-surface)',
              }}
            />

            <p
              style={{
                fontSize: '10px',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: 'var(--color-text-muted)',
                marginTop: '16px',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              Suggested
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {conversations
                .filter((conversation) => {
                  if (!memberSearch.trim()) return true
                  return conversation.participant_name
                    .toLowerCase()
                    .includes(memberSearch.trim().toLowerCase())
                })
                .slice(0, 4)
                .map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(conversation.id)
                      closeNewMessageModal()
                      setMemberSearch('')
                    }}
                    className="hover:bg-subtle"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                    }}
                  >
                    <ConversationAvatar conversation={conversation} size={36} />
                    <div>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: 'var(--color-text-default)',
                        }}
                      >
                        {conversation.participant_name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {conversation.participant_role}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
