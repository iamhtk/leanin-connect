'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Loader2 } from 'lucide-react'

interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface AIAssistantProps {
  isOpen: boolean
  onClose: () => void
}

const SUGGESTED_PROMPTS = [
  'How do I join a Circle?',
  'Find me negotiation resources',
  'What events are coming up?',
  'How do I connect with mentors?',
]

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi there! I'm here to help you navigate Lean In Connect and find what you need. Whether you're looking to join a Circle, find resources, connect with others, or explore the platform — just let me know!",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMsg: AIMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = (await res.json()) as { data?: string }

      setMessages((prev) => [
        ...prev,
        {
          id: 'assistant-' + Date.now(),
          role: 'assistant',
          content:
            data.data ||
            "I'm here to help! Could you tell me more about what you're looking for?",
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I had trouble connecting. Please try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 40,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '380px',
          height: '100vh',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border-default)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '9999px',
                background: 'var(--color-brand-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-brand)' }} />
            </div>
            <span
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'var(--color-text-default)',
              }}
            >
              Assistant
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'assistant' && (
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '9999px',
                    background: 'var(--color-brand-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '8px',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Sparkles size={11} style={{ color: 'var(--color-brand)' }} />
                </div>
              )}
              <div
                style={{
                  maxWidth: '80%',
                  background: msg.role === 'user' ? 'var(--color-brand)' : 'var(--color-subtle)',
                  color: msg.role === 'user' ? 'white' : 'var(--color-text-default)',
                  borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '9999px',
                  background: 'var(--color-brand-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={11} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div
                style={{
                  background: 'var(--color-subtle)',
                  borderRadius: '14px 14px 14px 4px',
                  padding: '10px 14px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '9999px',
                      background: 'var(--color-text-muted)',
                      display: 'inline-block',
                      animation: 'bounce 1.2s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {messages.length === 1 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginTop: '8px',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-muted)',
                  marginBottom: '4px',
                }}
              >
                Try asking
              </p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  style={{
                    textAlign: 'left',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    color: 'var(--color-text-default)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    lineHeight: '1.4',
                    transition: 'border-color 0.12s',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--color-border-default)',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-end',
            background: 'var(--color-surface)',
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'var(--color-background)',
              border: '1px solid var(--color-border-default)',
              borderRadius: '14px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="Ask the assistant..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                background: 'transparent',
                color: 'var(--color-text-default)',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '9999px',
              background: input.trim() && !isLoading ? 'var(--color-brand)' : 'var(--color-muted)',
              border: 'none',
              cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              flexShrink: 0,
              transition: 'background 0.12s',
            }}
          >
            {isLoading ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </>
  )
}
