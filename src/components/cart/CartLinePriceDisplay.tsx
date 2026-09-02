'use client'

import { formatVnd } from '@/lib/utils/currency'

type CartLinePriceDisplayProps = {
  /** Sale unit or line total (caller decides). */
  saleAmount: number
  /** List/compare reference for the same scope as saleAmount (unit or line). */
  listAmount?: number | null
  /** Primary price typography. */
  size?: 'sm' | 'md'
  className?: string
}

/** Sale price + optional strikethrough list (PDP / hot-sale card pattern). */
export function CartLinePriceDisplay({
  saleAmount,
  listAmount,
  size = 'md',
  className = '',
}: CartLinePriceDisplayProps) {
  const list =
    listAmount != null && Number.isFinite(listAmount) && listAmount > saleAmount
      ? listAmount
      : null
  const saleClass =
    size === 'md'
      ? 'text-base font-bold leading-none text-primary-700 sm:text-sm'
      : 'text-sm font-bold text-primary-700'

  return (
    <div className={className}>
      <p className={`tabular-nums ${saleClass}`}>{formatVnd(saleAmount)}</p>
      {list != null ? (
        <p className="mt-0.5 text-xs tabular-nums text-slate-400 line-through">{formatVnd(list)}</p>
      ) : null}
    </div>
  )
}
