'use client'

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

/**
 * Sticky ↔ in-flow receipt hand-off (phone / tablet).
 * Dock stays pinned until the in-flow target top meets the dock band.
 */
export function useStickyReceiptHandoff(
  targetRef: RefObject<HTMLElement | null>,
  onPinnedChange?: (pinned: boolean) => void
) {
  const dockRef = useRef<HTMLDivElement>(null)
  const onPinnedChangeRef = useRef(onPinnedChange)
  const [pinned, setPinned] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [dockHeight, setDockHeight] = useState(0)

  onPinnedChangeRef.current = onPinnedChange

  useLayoutEffect(() => {
    const el = dockRef.current
    if (!el || !pinned) return

    const measure = () => setDockHeight(el.getBoundingClientRect().height)
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [pinned, expanded])

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setPinned(!entry.isIntersecting),
      {
        threshold: 0,
        rootMargin: `0px 0px -${Math.max(dockHeight, 1)}px 0px`,
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [targetRef, dockHeight])

  useEffect(() => {
    onPinnedChangeRef.current?.(pinned)
  }, [pinned])

  useEffect(() => {
    if (!pinned) setExpanded(false)
  }, [pinned])

  return { dockRef, pinned, expanded, setExpanded }
}
