'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Search, Send, Sparkles, X, Loader2 } from 'lucide-react'
import { MOCK_CONVERSATIONS } from '@/data/conversations'
import type { Conversation, Message } from '@/lib/types'
import { Avatar } from '@/components/atoms/Avatar'
import { formatRelativeTime } from '@/lib/utils'

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CONVERSATIONS[0].id)
  const [messageInput, setMessageInput] = useState('')
  const [aiStarters, setAiStarters] = useState<string[]>([])
  const [isLoadingStarters, setIsLoadingStarters] = useState(false)
  const [showStarters, setShowStarters] = useState(false)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [memberSearch, setMemberSearch] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const selectedConversation = conversations.find((conversation) => conversation.id === selectedId)

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
      console.error(error)
    } finally {
      setIsLoadingStarters(false)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedId || !selectedConversation) return

    const userMsg: Message = {
      id: Date.now().toString(),
      content: messageInput.trim(),
      sent_at: new Date().toISOString(),
      is_sent: true,
    }

    const currentInput = messageInput.trim()
    const typingId = `typing-${Date.now()}`
    const conversationId = selectedId
    const currentConv = conversations.find((conversation) => conversation.id === selectedId)
    const history = currentConv?.messages.slice(-6) || []

    setMessageInput('')

    setConversations((previous) =>
      previous.map((conversation) => {
        if (conversation.id !== conversationId) return conversation
        return {
          ...conversation,
          messages: [
            ...conversation.messages,
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
    }, 50)

    try {
      const response = await fetch('/api/ai/chat-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participantName: selectedConversation.participant_name,
          participantRole: selectedConversation.participant_role,
          participantCompany: selectedConversation.participant_company,
          userMessage: currentInput,
          conversationHistory: history,
        }),
      })

      const data = await response.json()
      const replyText = data.data || 'Thanks for reaching out!'

      const replyMsg: Message = {
        id: Date.now().toString(),
        content: replyText,
        sent_at: new Date().toISOString(),
        is_sent: false,
      }

      setConversations((previous) =>
        previous.map((conversation) => {
          if (conversation.id !== conversationId) return conversation
          return {
            ...conversation,
            messages: conversation.messages.filter((message) => message.id !== typingId).concat(replyMsg),
            last_message: replyText,
            last_message_at: new Date().toISOString(),
          }
        })
      )

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    } catch (error) {
      console.error(error)
      setConversations((previous) =>
        previous.map((conversation) => {
          if (conversation.id !== conversationId) return conversation
          return {
            ...conversation,
            messages: conversation.messages.filter((message) => message.id !== typingId),
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
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 52px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '300px',
          minWidth: '300px',
          borderRight: '1px solid var(--color-border-default)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-surface)',
        }}
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
          <h2
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--color-text-default)',
            }}
          >
            Messages
          </h2>
          <button
            type="button"
            onClick={() => setShowNewMessage(true)}
            style={{
              width: '28px',
              height: '28px',
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
            <Plus size={16} />
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
            <Search size={13} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search messages"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
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
          {['All', 'Unread'].map((tab) => (
            <button
              key={tab}
              type="button"
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontWeight: tab === 'All' ? '600' : '400',
                color: tab === 'All' ? 'var(--color-text-default)' : 'var(--color-text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom:
                  tab === 'All' ? '2px solid var(--color-text-default)' : '2px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedId(conversation.id)}
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                padding: '12px 16px',
                cursor: 'pointer',
                background: selectedId === conversation.id ? 'var(--color-subtle)' : 'transparent',
                borderBottom: '1px solid var(--color-border-default)',
                transition: 'background 0.12s',
              }}
            >
              <Avatar
                initials={conversation.participant_initials}
                color={conversation.participant_avatar_color}
                size={38}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
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
                    {conversation.participant_name}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      flexShrink: 0,
                      marginLeft: '8px',
                    }}
                  >
                    {formatRelativeTime(conversation.last_message_at)}
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
                    {conversation.last_message}
                  </span>
                  {conversation.unread_count > 0 && (
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
                      {conversation.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border-default)',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            Manage blocked
          </span>
        </div>
      </div>

      {selectedConversation ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-background)',
            minWidth: 0,
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              borderBottom: '1px solid var(--color-border-default)',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Avatar
              initials={selectedConversation.participant_initials}
              color={selectedConversation.participant_avatar_color}
              size={36}
            />
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
                  onClick={() => setShowStarters(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <X size={14} />
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
                  <Avatar
                    initials={selectedConversation.participant_initials}
                    color={selectedConversation.participant_avatar_color}
                    size={28}
                  />
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
                    }}
                  >
                    {!message.is_sent && message.content === '...' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: '18px' }}>
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
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
                placeholder="Write a message..."
                rows={1}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
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
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
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
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setShowNewMessage(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: 'white',
              width: '400px',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-modal)',
            }}
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
                onClick={() => setShowNewMessage(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <input
              value={memberSearch}
              onChange={(event) => setMemberSearch(event.target.value)}
              placeholder="Search for a member..."
              style={{
                width: '100%',
                border: '1px solid var(--color-border-default)',
                borderRadius: '9999px',
                padding: '10px 16px',
                marginTop: '16px',
                fontSize: '14px',
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
                      setShowNewMessage(false)
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
                    <Avatar
                      initials={conversation.participant_initials}
                      color={conversation.participant_avatar_color}
                      size={36}
                    />
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
    </div>
  )
}
