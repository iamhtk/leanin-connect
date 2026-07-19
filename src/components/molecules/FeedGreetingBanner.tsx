'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

function getTimeGreeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatBannerDate(date: Date): string {
  return date
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase()
}

function getFirstName(fullName: string | null | undefined): string {
  if (!fullName?.trim()) return 'there'
  const [first] = fullName.trim().split(/\s+/)
  return first
}

export function FeedGreetingBanner() {
  const { profile } = useAuth()
  const [now, setNow] = useState<Date | null>(null)
  const firstName = getFirstName(profile?.full_name)

  useEffect(() => {
    setNow(new Date())
  }, [])

  const dateLabel = now ? formatBannerDate(now) : '\u00A0'
  const greeting = now ? getTimeGreeting(now.getHours()) : 'Hello'

  return (
    <section className="feed-greeting-banner" aria-label="Daily greeting">
      <Image
        src="/images/feed-banner.jpg"
        alt=""
        fill
        priority
        className="feed-greeting-banner__image"
        sizes="100vw"
      />
      <div className="feed-greeting-banner__overlay" aria-hidden />
      <div className="feed-greeting-banner__content">
        <p className="feed-greeting-banner__date">{dateLabel}</p>
        <h2 className="feed-greeting-banner__greeting">
          {greeting}, <em>{firstName}.</em>
        </h2>
      </div>
    </section>
  )
}
