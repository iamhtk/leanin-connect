'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, Loader2 } from 'lucide-react'
import { useBottomSheetDismiss } from '@/hooks/useBottomSheetDismiss'

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
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { handlers: dismissHandlers, sheetStyle } = useBottomSheetDismiss({
    onDismiss: onClose,
    threshold: 100,
  })

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024)
    const handler = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 280)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

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
    <div className="ai-assistant-root" role="dialog" aria-modal="true" aria-label="AI Assistant">
      <div className="ai-assistant-backdrop" onClick={onClose} />

      <div className="ai-assistant-panel" style={isMobile ? sheetStyle : undefined}>
        <div
          className="ai-assistant-grabber"
          aria-hidden="true"
          {...dismissHandlers}
          style={{ cursor: 'grab', touchAction: 'none' }}
        >
          <span />
        </div>

        <div className="ai-assistant-header">
          <div className="ai-assistant-title-row">
            <div className="ai-assistant-avatar">
              <Sparkles size={14} style={{ color: 'var(--color-brand)' }} />
            </div>
            <div>
              <p className="ai-assistant-title">Assistant</p>
              <p className="ai-assistant-subtitle">Lean In Connect</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ai-assistant-close icon-btn"
            aria-label="Close assistant"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <div className="ai-assistant-messages" aria-live="polite" aria-atomic="false">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`ai-bubble-row ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}
            >
              {msg.role === 'assistant' && (
                <div className="ai-bubble-avatar">
                  <Sparkles size={11} style={{ color: 'var(--color-brand)' }} />
                </div>
              )}
              <div className={`ai-bubble ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="ai-bubble-row is-assistant">
              <div className="ai-bubble-avatar">
                <Sparkles size={11} style={{ color: 'var(--color-brand)' }} />
              </div>
              <div className="ai-bubble is-assistant ai-typing">
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
            <div className="ai-suggestions">
              <p className="ai-suggestions-label">Try asking</p>
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="ai-suggestion-chip"
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="ai-assistant-composer">
          <div className="ai-assistant-input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="Ask anything..."
              aria-label="Message assistant"
            />
          </div>
          <button
            type="button"
            className="ai-assistant-send btn-primary"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" />
            ) : (
              <Send size={16} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
