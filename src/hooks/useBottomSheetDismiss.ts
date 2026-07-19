'use client'

import { useRef, useState, useCallback } from 'react'

interface BottomSheetDismissOptions {
  onDismiss: () => void
  threshold?: number
}

export function useBottomSheetDismiss({
  onDismiss,
  threshold = 100,
}: BottomSheetDismissOptions) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    startY.current = touch.clientY
    isDragging.current = true
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    const touch = e.touches[0]
    if (!touch) return
    const delta = Math.max(0, touch.clientY - startY.current)
    setDragY(delta)
  }, [])

  const onTouchEnd = useCallback(() => {
    isDragging.current = false
    if (dragY >= threshold) {
      setDragY(0)
      onDismiss()
    } else {
      setDragY(0)
    }
  }, [dragY, threshold, onDismiss])

  const opacity = Math.max(0.3, 1 - dragY / (threshold * 2))
  const translateY = dragY

  return {
    dragY,
    opacity,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
    sheetStyle: {
      transform: `translateY(${translateY}px)`,
      opacity,
      transition: isDragging.current
        ? 'none'
        : 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease',
      willChange: 'transform, opacity',
      touchAction: 'none' as const,
    },
  }
}
