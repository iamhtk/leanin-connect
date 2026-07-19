'use client'

import { useEffect, useCallback, useRef } from 'react'

interface EdgeSwipeOptions {
  onSwipeRight: () => void
  edgeWidth?: number
  threshold?: number
}

export function useEdgeSwipe({
  onSwipeRight,
  edgeWidth = 24,
  threshold = 80,
}: EdgeSwipeOptions) {
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const isEdgeDragRef = useRef(false)

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      startXRef.current = touch.clientX
      startYRef.current = touch.clientY
      isEdgeDragRef.current = touch.clientX <= edgeWidth
    },
    [edgeWidth]
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!isEdgeDragRef.current) return
      const touch = e.changedTouches[0]
      if (!touch) return
      const dx = touch.clientX - startXRef.current
      const dy = Math.abs(touch.clientY - startYRef.current)
      if (dx >= threshold && dy < 80) {
        onSwipeRight()
      }
      isEdgeDragRef.current = false
    },
    [threshold, onSwipeRight]
  )

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchEnd])
}
