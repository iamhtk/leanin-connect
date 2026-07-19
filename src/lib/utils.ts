import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    return `${mins}m ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function showToast(message: string) {
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; 
    transform: translateX(-50%);
    background: oklch(.18 .008 40); color: white;
    padding: 10px 20px; border-radius: 9999px;
    font-size: 13px; font-weight: 500;
    z-index: 9999; font-family: inherit;
    animation: fadeInUp 0.2s ease-out;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  `
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.2s'
    setTimeout(() => document.body.removeChild(toast), 200)
  }, 2500)
}