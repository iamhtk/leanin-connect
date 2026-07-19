export interface TagProps {
  label: string
}

export function Tag({ label }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        color: 'var(--color-brand)',
        fontSize: '12px',
        fontWeight: '600',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      {label}
    </span>
  )
}
