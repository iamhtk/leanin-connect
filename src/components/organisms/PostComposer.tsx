'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Sparkles, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { TOPIC_TAGS } from '@/lib/types'
import type { Post } from '@/lib/types'

export interface PostComposerProps {
  onPostCreated: (post: Post) => void
}

const MAX_LENGTH = 1000
const AUTHOR_NAME = 'Hrithik Sanyal'
const AUTHOR_ROLE = 'Design Engineer'
const AUTHOR_COMPANY = 'Lean In Connect'
const AUTHOR_INITIALS = 'HS'
const AUTHOR_COLOR = '#CC3D55'

const SELECTABLE_TOPICS = TOPIC_TAGS.filter((tag) => tag.value !== 'all')

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVoiceCoachOpen, setIsVoiceCoachOpen] = useState(false)
  const [voiceCoachNotes, setVoiceCoachNotes] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const resetForm = () => {
    setContent('')
    setSelectedTopic(null)
    setIsVoiceCoachOpen(false)
    setVoiceCoachNotes('')
  }

  const handleGenerateDraft = async () => {
    if (!voiceCoachNotes.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/voice-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roughNotes: voiceCoachNotes, topic: selectedTopic }),
      })

      if (!response.body) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setContent(accumulated.slice(0, MAX_LENGTH))
      }

      setIsVoiceCoachOpen(false)
      setVoiceCoachNotes('')
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  const handleSubmit = async () => {
    if (!content.trim() || !selectedTopic) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: AUTHOR_NAME,
          author_role: AUTHOR_ROLE,
          author_company: AUTHOR_COMPANY,
          author_initials: AUTHOR_INITIALS,
          author_avatar_color: AUTHOR_COLOR,
          content,
          topic_tag: selectedTopic,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error(result.error)
        return
      }

      onPostCreated(result.data)
      closeModal()
      resetForm()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const charsRemaining = MAX_LENGTH - content.length
  const isSubmitDisabled = !content.trim() || !selectedTopic || isSubmitting

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="hover:[border-color:var(--color-border-strong)]"
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          padding: '10px 14px',
          cursor: 'pointer',
          marginBottom: '12px',
          transition: 'border-color 0.12s',
        }}
      >
        <Avatar initials={AUTHOR_INITIALS} color={AUTHOR_COLOR} size={36} />
        <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
          Share something with the community...
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(26,21,20,0.4)',
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                backgroundColor: 'var(--color-surface)',
                width: '480px',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                boxShadow: 'var(--shadow-modal)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                  Create a post
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
                <Avatar initials={AUTHOR_INITIALS} color={AUTHOR_COLOR} size={36} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-text-default)' }}>
                    {AUTHOR_NAME}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{AUTHOR_ROLE}</p>
                </div>
              </div>

              <AnimatePresence>
                {isVoiceCoachOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: '16px' }}>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                        Describe your experience in rough notes
                      </p>
                      <textarea
                        value={voiceCoachNotes}
                        onChange={(event) => setVoiceCoachNotes(event.target.value)}
                        placeholder="e.g. got promoted after 3 years, almost didn't apply, manager didn't believe in me at first..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          border: 'none',
                          outline: 'none',
                          resize: 'none',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          color: 'var(--color-text-default)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleGenerateDraft}
                        disabled={isGenerating || !voiceCoachNotes.trim()}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--color-brand)',
                          color: 'var(--color-text-inverse)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          padding: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: isGenerating || !voiceCoachNotes.trim() ? 'not-allowed' : 'pointer',
                          opacity: isGenerating || !voiceCoachNotes.trim() ? 0.6 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Generating...
                          </>
                        ) : (
                          'Generate draft'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value.slice(0, MAX_LENGTH))}
                placeholder="Share something with the community..."
                style={{
                  marginTop: '16px',
                  width: '100%',
                  minHeight: '120px',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  color: 'var(--color-text-default)',
                }}
              />

              <p
                style={{
                  textAlign: 'right',
                  fontSize: '12px',
                  color: charsRemaining < 50 ? 'var(--color-status-error)' : 'var(--color-text-muted)',
                }}
              >
                {charsRemaining}
              </p>

              <div style={{ borderTop: '1px solid var(--color-border-default)', margin: '16px 0' }} />

              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                Choose a topic
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SELECTABLE_TOPICS.map((tag) => {
                  const isSelected = selectedTopic === tag.value

                  return (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => setSelectedTopic(tag.value)}
                      style={{
                        backgroundColor: isSelected ? 'var(--color-brand)' : 'var(--color-subtle)',
                        color: isSelected ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        padding: '6px 14px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      {tag.label}
                    </button>
                  )
                })}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setIsVoiceCoachOpen((previous) => !previous)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-brand)',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  <Sparkles size={14} />
                  AI Voice Coach
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  style={{
                    backgroundColor: 'var(--color-brand)',
                    color: 'var(--color-text-inverse)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                    opacity: isSubmitDisabled ? 0.4 : 1,
                  }}
                >
                  Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
