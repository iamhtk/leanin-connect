'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { MobileNav } from '@/components/organisms/MobileNav'
import { AIAssistant } from '@/components/organisms/AIAssistant'

export function AppChrome() {
  const [showAssistant, setShowAssistant] = useState(false)

  useEffect(() => {
    const open = () => setShowAssistant(true)
    window.addEventListener('open-assistant', open)
    return () => window.removeEventListener('open-assistant', open)
  }, [])

  return (
    <>
      <button
        type="button"
        className="mobile-ai-fab"
        aria-label="Open AI Assistant"
        onClick={() => setShowAssistant(true)}
      >
        <Sparkles size={22} aria-hidden="true" />
      </button>

      <MobileNav />

      <AIAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} />
    </>
  )
}
