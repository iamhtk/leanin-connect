export interface TagProps {
  label: string
}

export function Tag({ label }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: 'var(--color-brand-subtle)',
        color: 'var(--color-text-brand)',
        fontSize: '11px',
        fontWeight: '500',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
      }}
    >
      {label}
    </span>
  )
}
