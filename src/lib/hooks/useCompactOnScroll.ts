'use client'

import { useEffect, useState } from 'react'

const COLLAPSE_AFTER_PX = 36
const EXPAND_BEFORE_PX = 8

/**
 * Mobile header compact mode with scroll hysteresis (avoids flicker near top).
 */
export function useCompactOnScroll(
  collapseAfterPx = COLLAPSE_AFTER_PX,
  expandBeforePx = EXPAND_BEFORE_PX
) {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    let raf = 0

    const sync = () => {
      raf = 0
      const y = window.scrollY
      setCompact((prev) => {
        if (!prev && y > collapseAfterPx) return true
        if (prev && y < expandBeforePx) return false
        return prev
      })
    }

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(sync)
    }

    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [collapseAfterPx, expandBeforePx])

  return compact
}
