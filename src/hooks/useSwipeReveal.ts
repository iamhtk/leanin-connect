'use client'

import { useRef, useState, useCallback } from 'react'

interface SwipeRevealOptions {
  revealWidth?: number
  threshold?: number
  onDelete?: () => void
  onArchive?: () => void
  onBookmark?: () => void
  onLike?: () => void
}

export function useSwipeReveal({
  revealWidth = 80,
  threshold = 60,
}: SwipeRevealOptions = {}) {
  const [offset, setOffset] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const startX = useRef(0)
  const startOffset = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)
  const lockAxis = useRef<'h' | 'v' | null>(null)

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target?.closest?.(
          'button, a, input, textarea, select, label, [role="button"], [role="menuitem"], [role="link"]'
        )
      ) {
        isDragging.current = false
        lockAxis.current = null
        return
      }

      const touch = e.touches[0]
      if (!touch) return
      startX.current = touch.clientX
      startY.current = touch.clientY
      startOffset.current = isOpen ? -revealWidth : 0
      isDragging.current = true
      lockAxis.current = null
    },
    [isOpen, revealWidth]
  )

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current) return
      const touch = e.touches[0]
      if (!touch) return
      const dx = touch.clientX - startX.current
      const dy = touch.clientY - startY.current
      if (!lockAxis.current) {
        if (Math.abs(dx) > Math.abs(dy) + 8) lockAxis.current = 'h'
        else if (Math.abs(dy) > Math.abs(dx) + 8) {
          lockAxis.current = 'v'
          isDragging.current = false
          return
        } else return
      }
      if (lockAxis.current === 'v') return
      // Only prevent default once a real horizontal swipe is underway
      if (Math.abs(dx) > 6) {
        e.preventDefault()
      }
      const newOffset = Math.min(0, Math.max(-revealWidth, startOffset.current + dx))
      setOffset(newOffset)
    },
    [revealWidth]
  )

  const onTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    if (offset < -threshold) {
      setOffset(-revealWidth)
      setIsOpen(true)
    } else {
      setOffset(0)
      setIsOpen(false)
    }
  }, [offset, threshold, revealWidth])

  const close = useCallback(() => {
    setOffset(0)
    setIsOpen(false)
  }, [])

  return {
    offset,
    isOpen,
    close,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    style: {
      transform: `translateX(${offset}px)`,
      transition: isDragging.current ? 'none' : 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)',
      willChange: 'transform',
      position: 'relative' as const,
    },
  }
}
