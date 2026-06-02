import { RefObject, useEffect, useState } from 'react'

interface UseSectionStickyVisibilityParams {
  targetRef: RefObject<HTMLElement | null>
  enabled: boolean
}

export function useSectionStickyVisibility({
  targetRef,
  enabled,
}: UseSectionStickyVisibilityParams) {
  const [isStickyVisible, setIsStickyVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !enabled) {
      setIsStickyVisible(false)
      return
    }

    let frameId = 0
    const updateVisibility = () => {
      const element = targetRef.current
      if (!element) {
        setIsStickyVisible(false)
        return
      }

      const rect = element.getBoundingClientRect()
      // Sticky appears only after the primary action section has been scrolled past.
      setIsStickyVisible(rect.bottom <= 0)
    }

    const onScrollOrResize = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      frameId = window.requestAnimationFrame(updateVisibility)
    }

    updateVisibility()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [enabled, targetRef])

  return isStickyVisible
}
