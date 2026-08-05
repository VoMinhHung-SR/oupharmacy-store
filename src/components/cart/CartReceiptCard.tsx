'use client'

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'

type CartReceiptCardProps = {
  children: React.ReactNode
  className?: string
  /** Decorative bottom edge. Dock and sticky variants can omit it. */
  showScallop?: boolean
}

/** Base dimensions used to calculate the responsive scallop geometry. */
const SCALLOP_PERIOD = 41.2
const SCALLOP_RADIUS = 11.52
const SCALLOP_HEIGHT = 24
const SCALLOP_LIFT = 15.45
const SCALLOP_SINK = 5.15
const SCALLOP_QUARTER = 10.3

/**
 * Builds an edge-to-edge scallop mask from the measured container width.
 * A fixed period and centered mask can leave flat remnants at either side.
 */
function buildScallopMask(width: number) {
  const n = Math.max(1, Math.round(width / SCALLOP_PERIOD))
  const p = width / n
  const scale = p / SCALLOP_PERIOD
  const r = SCALLOP_RADIUS * scale
  const half = p / 2
  const quarter = SCALLOP_QUARTER * scale
  const lift = SCALLOP_LIFT * scale
  const sink = SCALLOP_SINK * scale
  const height = SCALLOP_HEIGHT * scale

  // Anchor at x=0 so the first and last curves meet the container edges.
  const mask = [
    `radial-gradient(${r}px at 50% calc(100% - ${lift}px), #000 99%, #0000 101%) ${-half}px 0 / ${p}px 100% repeat-x`,
    `radial-gradient(${r}px at 50% calc(100% + ${sink}px), #0000 99%, #000 101%) 0 calc(100% - ${quarter}px) / ${p}px 100% repeat-x`,
  ].join(', ')

  return { height, mask }
}

/**
 * Cart order-summary receipt card.
 * The decorative edge uses a dual radial-gradient mask sized to the card.
 */
export function CartReceiptCard({
  children,
  className = '',
  showScallop = true,
}: CartReceiptCardProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return

    const measure = () => {
      // Exact width so n * period === element width (no L/R sliver)
      setWidth(el.getBoundingClientRect().width)
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scallop = useMemo(
    () => (showScallop && width > 0 ? buildScallopMask(width) : null),
    [showScallop, width]
  )

  return (
    <div ref={rootRef} className={`cart-receipt ${className}`.trim()}>
      <div
        className={
          showScallop ? 'cart-receipt__body' : 'cart-receipt__body cart-receipt__body--dock'
        }
      >
        {children}
      </div>
      {showScallop ? (
        <div
          className="cart-receipt__scallop"
          aria-hidden
          style={
            scallop
              ? {
                  height: scallop.height,
                  WebkitMask: scallop.mask,
                  mask: scallop.mask,
                }
              : { height: SCALLOP_HEIGHT }
          }
        />
      ) : null}
    </div>
  )
}

export default CartReceiptCard
