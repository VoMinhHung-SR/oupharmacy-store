import { CatalogDiscountBadge } from '@/components/badges/CatalogDiscountBadge'
import { formatVnd } from '@/lib/utils/currency'

interface ProductDetailPriceDisplayProps {
  priceValue: number
  compareAtPrice: number | null
  discountPercent: number
  unitName?: string
  /** Compact row for sticky bar. */
  compact?: boolean
}

export function ProductDetailPriceDisplay({
  priceValue,
  compareAtPrice,
  discountPercent,
  unitName,
  compact = false,
}: ProductDetailPriceDisplayProps) {
  const showDiscount =
    discountPercent > 0 && compareAtPrice != null && compareAtPrice > priceValue

  if (compact) {
    return (
      <div className="min-w-0 shrink-0 text-right">
        <p className="text-sm font-bold tabular-nums leading-tight text-primary-700 md:text-base">
          {formatVnd(priceValue)}
        </p>
        {showDiscount ? (
          <p className="mt-0.5 text-[10px] tabular-nums text-gray-400 line-through md:text-xs">
            {formatVnd(compareAtPrice)}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div>
      <div className="text-xl font-bold tabular-nums text-primary-700 sm:text-2xl md:text-3xl">
        {formatVnd(priceValue)}
        {unitName ? (
          <span className="text-base font-semibold text-primary-700 sm:text-xl md:text-2xl">
            {' '}
            / {unitName}
          </span>
        ) : null}
      </div>
      {showDiscount ? (
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <span className="text-sm tabular-nums text-gray-500 line-through sm:text-base">
            {formatVnd(compareAtPrice)}
          </span>
          <CatalogDiscountBadge percent={discountPercent} />
        </div>
      ) : null}
    </div>
  )
}
