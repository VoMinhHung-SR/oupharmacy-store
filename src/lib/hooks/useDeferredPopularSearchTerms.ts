'use client'

import { usePopularSearchTerms } from '@/lib/hooks/usePopularSearchTerms'
import { useEffect, useState } from 'react'

export function useDeferredPopularSearchTerms(limit = 20) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let idleId: number | undefined
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const enable = () => setEnabled(true)

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(enable, { timeout: 2500 })
    } else {
      timeoutId = setTimeout(enable, 1800)
    }

    return () => {
      if (idleId != null && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
      if (timeoutId != null) clearTimeout(timeoutId)
    }
  }, [])

  return usePopularSearchTerms(limit, enabled)
}
