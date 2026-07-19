import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Notification {
  id: string
  type: string
  content: string
  from_user_name: string | null
  from_user_initials: string
  from_user_color: string
  post_id: string | null
  is_read: boolean
  created_at: string
}

export function useRealtimeNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setNotifications([])
      setUnreadCount(0)
      setIsLoading(false)
      return
    }
    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)
      if (data) {
        const rows = data as Notification[]
        setNotifications(rows)
        setUnreadCount(rows.filter((notification) => !notification.is_read).length)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }, [userId, supabase])

  const markAllRead = useCallback(async () => {
    if (!userId) return
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
      setNotifications((previous) =>
        previous.map((notification) => ({ ...notification, is_read: true }))
      )
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark notifications read:', err)
    }
  }, [userId, supabase])

  useEffect(() => {
    if (!userId) {
      setNotifications([])
      setUnreadCount(0)
      setIsLoading(false)
      return
    }
    void fetchNotifications()

    const channel: RealtimeChannel = supabase
      .channel('notifications:' + userId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: 'user_id=eq.' + userId,
        },
        (payload) => {
          const newNotif = payload.new as Notification
          setNotifications((previous) => [newNotif, ...previous])
          setUnreadCount((previous) => previous + 1)
        }
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [userId, fetchNotifications, supabase])

  return {
    notifications,
    unreadCount,
    isLoading,
    markAllRead,
    refetch: fetchNotifications,
  }
}
