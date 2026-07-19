'use client'

import Image from 'next/image'

export interface PortraitImageProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function PortraitImage({ src, alt, size = 44, className }: PortraitImageProps) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '9999px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--color-muted)',
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${size}px`}
        style={{ objectFit: 'cover' }}
      />
    </div>
  )
}
