'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export interface BackdropLoadingProps {
  isOpen: boolean
  loadingText?: string
  /** Overlay opacity 0–1. Default 0.3. */
  opacity?: number
  size?: 'sm' | 'md' | 'lg'
  zIndex?: number
  /**
   * Lock body scroll while open (default true).
   * Set false for in-place loads (e.g. “Xem thêm”) so the viewport does not jump.
   */
  lockScroll?: boolean
}

/**
 * App-wide full-screen loading overlay (portal to `document.body`).
 * Use for navigations, form submits, load-more, etc.
 */
export function BackdropLoading({
  isOpen,
  loadingText,
  opacity = 0.3,
  size = 'md',
  zIndex = 9999,
  lockScroll = true,
}: BackdropLoadingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen || !lockScroll) return

    const scrollY = window.scrollY
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [isOpen, lockScroll])

  if (!mounted || !isOpen) {
    return null
  }

  const sizeClasses = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-[3px]',
    lg: 'h-16 w-16 border-4',
  }

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex,
      }}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={loadingText || 'Đang tải'}
    >
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-gray-100 border-t-primary-500 shadow-sm`}
          style={{ borderTopColor: '#0284c7' }}
        />
        {loadingText ? (
          <p className="max-w-xs text-sm font-medium text-slate-700">{loadingText}</p>
        ) : null}
      </div>
    </div>,
    document.body
  )
}

export default BackdropLoading
