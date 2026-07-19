'use client'

import { useCallback } from 'react'
import { useSwipe } from './useSwipe'

interface SwipeTabsOptions {
  tabs: string[]
  activeIndex: number
  onChange: (index: number) => void
}

export function useSwipeTabs({ tabs, activeIndex, onChange }: SwipeTabsOptions) {
  const goNext = useCallback(() => {
    if (activeIndex < tabs.length - 1) onChange(activeIndex + 1)
  }, [activeIndex, tabs.length, onChange])

  const goPrev = useCallback(() => {
    if (activeIndex > 0) onChange(activeIndex - 1)
  }, [activeIndex, onChange])

  const swipeHandlers = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
    threshold: 60,
    preventScroll: true,
  })

  return swipeHandlers
}
