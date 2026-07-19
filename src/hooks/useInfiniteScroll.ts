import { useState, useEffect, useCallback, useRef } from 'react'
import type { Post } from '@/lib/types'

interface FetchResult {
  data: Post[]
  nextCursor: string | null
  hasMore: boolean
}

export function useInfiniteScroll(selectedTag: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const fetchPosts = useCallback(
    async (
      cursor: string | null = null,
      tag: string = selectedTag,
      append: boolean = false
    ) => {
      if (append) setIsFetchingMore(true)
      else setIsLoading(true)

      try {
        const params = new URLSearchParams({ limit: '10' })
        if (cursor) params.set('cursor', cursor)
        if (tag && tag !== 'all' && tag !== 'All') params.set('tag', tag)

        const response = await fetch('/api/posts?' + params.toString())
        const result = (await response.json()) as FetchResult & { error?: string }

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch posts')
        }

        if (append) {
          setPosts((previous) => [...previous, ...(result.data ?? [])])
        } else {
          setPosts(result.data ?? [])
        }

        setNextCursor(result.nextCursor ?? null)
        setHasMore(Boolean(result.hasMore))
      } catch {
        if (!append) {
          setPosts([])
          setHasMore(false)
          setNextCursor(null)
        }
      } finally {
        setIsLoading(false)
        setIsFetchingMore(false)
      }
    },
    [selectedTag]
  )

  const addPost = useCallback((post: Post) => {
    setPosts((previous) => [post, ...previous])
  }, [])

  useEffect(() => {
    void fetchPosts(null, selectedTag, false)
  }, [selectedTag, fetchPosts])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && hasMore && !isFetchingMore && nextCursor) {
          void fetchPosts(nextCursor, selectedTag, true)
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.unobserve(sentinel)
  }, [hasMore, isFetchingMore, nextCursor, selectedTag, fetchPosts])

  return {
    posts,
    isLoading,
    isFetchingMore,
    hasMore,
    sentinelRef,
    addPost,
    refetch: () => fetchPosts(null, selectedTag, false),
  }
}
