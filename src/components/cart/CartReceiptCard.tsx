'use client'

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react'

type CartReceiptCardProps = {
  children: React.ReactNode
  className?: string
  /** Bottom Long Châu scallop. Dock/sticky bars often omit it. */
  showScallop?: boolean
}

/** Long Châu base period (px) — used only to pick wave count / scale ratios. */
const LC_PERIOD = 41.2
const LC_RADIUS = 11.52
const LC_HEIGHT = 24
const LC_LIFT = 15.45
const LC_SINK = 5.15
const LC_QUARTER = 10.3

/**
 * Pixel-perfect LC scallop. Never use fixed 41.2px + 50% mask position —
 * that leaves flat remnants on L/R when width % 41.2 ≠ 0.
 */
function buildLcMask(width: number) {
  const n = Math.max(1, Math.round(width / LC_PERIOD))
  const p = width / n
  const scale = p / LC_PERIOD
  const r = LC_RADIUS * scale
  const half = p / 2
  const quarter = LC_QUARTER * scale
  const lift = LC_LIFT * scale
  const sink = LC_SINK * scale
  const height = LC_HEIGHT * scale

  // Phase locked to x=0 (not 50%) so first/last teeth meet the side edges.
  const mask = [
    `radial-gradient(${r}px at 50% calc(100% - ${lift}px), #000 99%, #0000 101%) ${-half}px 0 / ${p}px 100% repeat-x`,
    `radial-gradient(${r}px at 50% calc(100% + ${sink}px), #0000 99%, #000 101%) 0 calc(100% - ${quarter}px) / ${p}px 100% repeat-x`,
  ].join(', ')

  return { height, mask }
}

/**
 * Cart order-summary receipt card.
 * Scallop = LC dual radial-gradient mask, sized from measured width.
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
    () => (showScallop && width > 0 ? buildLcMask(width) : null),
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
              : { height: LC_HEIGHT }
          }
        />
      ) : null}
    </div>
  )
}

export default CartReceiptCard
