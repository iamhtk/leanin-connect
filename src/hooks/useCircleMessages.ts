import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface CircleMessage {
  id: string
  circle_id: number
  user_id: string
  author_name: string
  author_initials: string
  author_color: string
  content: string
  created_at: string
}

export function useCircleMessages(
  circleId: number,
  initialMessages: CircleMessage[] = []
) {
  const [messages, setMessages] = useState<CircleMessage[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchMessages = useCallback(async () => {
    if (!Number.isFinite(circleId) || circleId <= 0) {
      setMessages([])
      setIsLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('circle_messages')
        .select('*')
        .eq('circle_id', circleId)
        .order('created_at', { ascending: true })
        .limit(50)
      if (data) setMessages(data as CircleMessage[])
    } catch (err) {
      console.error('Failed to fetch circle messages:', err)
    } finally {
      setIsLoading(false)
    }
  }, [circleId, supabase])

  const sendMessage = useCallback(
    async ({
      userId,
      authorName,
      authorInitials,
      authorColor,
      content,
    }: {
      userId: string
      authorName: string
      authorInitials: string
      authorColor: string
      content: string
    }) => {
      try {
        const { error } = await supabase.from('circle_messages').insert({
          circle_id: circleId,
          user_id: userId,
          author_name: authorName,
          author_initials: authorInitials,
          author_color: authorColor,
          content,
        })
        return !error
      } catch (err) {
        console.error('Failed to send circle message:', err)
        return false
      }
    },
    [circleId, supabase]
  )

  useEffect(() => {
    void fetchMessages()

    if (!Number.isFinite(circleId) || circleId <= 0) {
      return
    }

    const channel: RealtimeChannel = supabase
      .channel('circle_messages:' + circleId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'circle_messages',
          filter: 'circle_id=eq.' + circleId,
        },
        (payload) => {
          const newMsg = payload.new as CircleMessage
          setMessages((previous) => {
            const exists = previous.some((message) => message.id === newMsg.id)
            if (exists) return previous
            return [...previous, newMsg]
          })
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [circleId, fetchMessages, supabase])

  return { messages, isLoading, sendMessage }
}
