'use client'

import Image from 'next/image'

export interface AvatarProps {
  initials: string
  color: string
  size?: number
  textColor?: string
  src?: string | null
  alt?: string
}

export function Avatar({
  initials,
  color,
  size = 36,
  textColor = 'var(--color-text-inverse)',
  src,
  alt,
}: AvatarProps) {
  if (src) {
    return (
      <div
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: 'var(--color-muted)',
        }}
      >
        <Image
          src={src}
          alt={alt || initials}
          fill
          sizes={`${size}px`}
          style={{ objectFit: 'cover' }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-full)',
        backgroundColor: color,
        color: textColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '600',
        fontSize: `${size / 2.8}px`,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}
