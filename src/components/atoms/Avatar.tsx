export interface AvatarProps {
  initials: string
  color: string
  size?: number
}

export function Avatar({ initials, color, size = 36 }: AvatarProps) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: 'var(--radius-full)',
        backgroundColor: color,
        color: 'var(--color-text-inverse)',
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
