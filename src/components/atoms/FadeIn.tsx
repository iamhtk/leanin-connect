'use client'

import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}

export function FadeIn({ children, delay = 0, className, style }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.2,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}
