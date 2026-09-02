/** Red −% pill for catalog promo (PDP — Long Châu style). */

type CatalogDiscountBadgeProps = {
  percent: number
  className?: string
}

export function CatalogDiscountBadge({ percent, className = '' }: CatalogDiscountBadgeProps) {
  if (!(percent > 0)) return null
  return (
    <span
      className={`inline-flex min-h-[22px] min-w-[3.25rem] shrink-0 items-center justify-center rounded px-2.5 py-1 text-xs font-bold leading-none text-white bg-gradient-to-b from-red-500 to-red-600 shadow-[0_1px_2px_rgba(185,28,28,0.3)] sm:min-h-[24px] sm:min-w-[3.5rem] sm:px-3 sm:text-sm ${className}`.trim()}
    >
      -{percent}%
    </span>
  )
}
