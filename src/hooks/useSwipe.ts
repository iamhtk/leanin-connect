'use client'

import { useRef, useCallback } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  velocityThreshold?: number
  preventScroll?: boolean
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  isSwiping: boolean
  direction: 'horizontal' | 'vertical' | null
}

export function useSwipe(options: SwipeOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
    preventScroll = false,
  } = options

  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isSwiping: false,
    direction: null,
  })

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement | null
    if (
      target?.closest?.(
        'button, a, input, textarea, select, label, [role="button"], [role="menuitem"], [role="link"]'
      )
    ) {
      touchState.current.isSwiping = false
      return
    }

    const touch = e.touches[0]
    if (!touch) return
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isSwiping: true,
      direction: null,
    }
  }, [])

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchState.current.isSwiping) return
      const touch = e.touches[0]
      if (!touch) return
      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY

      if (!touchState.current.direction) {
        if (Math.abs(deltaX) > Math.abs(deltaY) + 5) {
          touchState.current.direction = 'horizontal'
        } else if (Math.abs(deltaY) > Math.abs(deltaX) + 5) {
          touchState.current.direction = 'vertical'
        }
      }

      if (preventScroll && touchState.current.direction === 'horizontal') {
        e.preventDefault()
      }
    },
    [preventScroll]
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchState.current.isSwiping) return
      const touch = e.changedTouches[0]
      if (!touch) return
      const deltaX = touch.clientX - touchState.current.startX
      const deltaY = touch.clientY - touchState.current.startY
      const deltaTime = Date.now() - touchState.current.startTime
      const velocityX = Math.abs(deltaX) / deltaTime
      const velocityY = Math.abs(deltaY) / deltaTime
      const dir = touchState.current.direction

      touchState.current.isSwiping = false
      touchState.current.direction = null

      if (dir === 'horizontal' || !dir) {
        if (Math.abs(deltaX) >= threshold || velocityX >= velocityThreshold) {
          if (deltaX < 0) onSwipeLeft?.()
          else onSwipeRight?.()
        }
      } else if (dir === 'vertical') {
        if (Math.abs(deltaY) >= threshold || velocityY >= velocityThreshold) {
          if (deltaY < 0) onSwipeUp?.()
          else onSwipeDown?.()
        }
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold]
  )

  return { onTouchStart, onTouchMove, onTouchEnd }
}
