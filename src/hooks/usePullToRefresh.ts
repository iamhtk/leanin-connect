'use client'

import { useRef, useState, useCallback } from 'react'

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  maxPull?: number
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const startY = useRef(0)
  const scrollEl = useRef<HTMLElement | null>(null)
  const pulling = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const el = e.currentTarget as HTMLElement
    scrollEl.current = el
    if (el.scrollTop === 0) {
      const touch = e.touches[0]
      if (!touch) return
      startY.current = touch.clientY
      pulling.current = true
    }
  }, [])

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || isRefreshing) return
      const el = e.currentTarget as HTMLElement
      if (el.scrollTop > 0) {
        pulling.current = false
        setPullDistance(0)
        setIsPulling(false)
        return
      }
      const touch = e.touches[0]
      if (!touch) return
      const delta = Math.max(0, touch.clientY - startY.current)
      const distance = Math.min(maxPull, delta * 0.5)
      if (distance > 0) {
        e.preventDefault()
        setIsPulling(true)
        setPullDistance(distance)
      }
    },
    [isRefreshing, maxPull]
  )

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return
    pulling.current = false
    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      setPullDistance(threshold)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setIsPulling(false)
        setPullDistance(0)
      }
    } else {
      setIsPulling(false)
      setPullDistance(0)
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh])

  const progress = Math.min(1, pullDistance / threshold)

  return {
    pullDistance,
    isPulling,
    isRefreshing,
    progress,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  }
}
