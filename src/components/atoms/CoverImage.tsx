'use client'

import Image from 'next/image'

export interface CoverImageProps {
  src: string
  alt?: string
  height?: number | string
  overlay?: boolean
  overlayOpacity?: number
  className?: string
  priority?: boolean
  sizes?: string
  objectPosition?: string
}

export function CoverImage({
  src,
  alt = '',
  height = 160,
  overlay = true,
  overlayOpacity = 0.35,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
  objectPosition = 'center',
}: CoverImageProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        height: typeof height === 'number' ? `${height}px` : height,
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--color-muted)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        style={{ objectFit: 'cover', objectPosition }}
      />
      {overlay ? (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(26,21,20,${overlayOpacity * 0.4}) 0%, rgba(26,21,20,${overlayOpacity}) 100%)`,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  )
}
