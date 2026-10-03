'use client'

import React, { useEffect, useRef, useState } from 'react'

const DEFAULT_EAGER = 3

type ProgressiveRailItemProps = {
  index: number
  eagerCount?: number
  children: React.ReactNode
  className?: string
  rootSelector?: string
}

function RailCardSkeleton() {
  return (
    <div
      className="flex h-full min-h-[16.5rem] flex-col rounded-xl bg-white p-2.5 sm:min-h-[18rem] sm:p-3"
      aria-hidden
    >
      <div className="mb-2 aspect-square w-full animate-pulse rounded-lg bg-gray-100" />
      <div className="mt-1 h-3 w-[80%] animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
    </div>
  )
}

/** First `eagerCount` items mount immediately; the rest wait until near the rail viewport. */
export function ProgressiveRailItem({
  index,
  eagerCount = DEFAULT_EAGER,
  children,
  className,
  rootSelector = '.hot-sale-track',
}: ProgressiveRailItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(index < eagerCount)

  useEffect(() => {
    if (mounted) return
    const el = ref.current
    if (!el) return

    const root = el.closest(rootSelector)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setMounted(true)
          observer.disconnect()
        }
      },
      {
        root: root instanceof Element ? root : null,
        rootMargin: '160px',
        threshold: 0.01,
      }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted, rootSelector])

  return <div ref={ref} className={className}>{mounted ? children : <RailCardSkeleton />}</div>
}

type DeferredRailMountProps = {
  children: React.ReactNode
  minHeightClassName?: string
  rootMargin?: string
}

/** Mount below-fold rail content when it nears the viewport. */
export function DeferredRailMount({
  children,
  minHeightClassName = 'min-h-[22rem]',
  rootMargin = '240px 0px',
}: DeferredRailMountProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true)
          observer.disconnect()
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin])

  if (!active) {
    return <div ref={ref} className={minHeightClassName} aria-hidden />
  }

  return <>{children}</>
}

export { RailCardSkeleton }
