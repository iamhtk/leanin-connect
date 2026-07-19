export interface AvatarProps {
  initials: string
  color: string
  size?: number
  textColor?: string
}

export function Avatar({ initials, color, size = 36, textColor = 'var(--color-text-inverse)' }: AvatarProps) {
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
