'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

export function useHorizontalScrollEdges(
  scrollerRef: RefObject<HTMLDivElement | null>,
  deps: unknown[] = []
) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const update = useCallback(() => {
    const el = scrollerRef.current
    if (!el) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const { scrollLeft, scrollWidth, clientWidth } = el
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [scrollerRef])

  const scrollPage = useCallback(
    (dir: -1 | 1) => {
      const el = scrollerRef.current
      if (!el) return
      el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
    },
    [scrollerRef]
  )

  useEffect(() => {
    update()
    const el = scrollerRef.current
    if (!el) return

    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const observer = new ResizeObserver(update)
    observer.observe(el)

    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remeasure when rail content changes
  }, [update, ...deps])

  return { canScrollLeft, canScrollRight, scrollPage }
}
