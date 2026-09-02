import { CatalogDiscountBadge } from '@/components/badges/CatalogDiscountBadge'
import { formatVnd } from '@/lib/utils/currency'

interface ProductDetailPriceDisplayProps {
  priceValue: number
  compareAtPrice: number | null
  discountPercent: number
  unitName?: string
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
      <div className="min-w-0 max-w-[42%] shrink text-right sm:max-w-none">
        <p className="truncate text-sm font-bold tabular-nums leading-tight text-primary-700 md:text-base">
          {formatVnd(priceValue)}
        </p>
        {showDiscount ? (
          <p className="mt-0.5 truncate text-[10px] tabular-nums text-gray-400 line-through md:text-xs">
            {formatVnd(compareAtPrice)}
          </p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="min-w-0">
      <div className="text-lg font-bold tabular-nums text-primary-700 sm:text-2xl md:text-3xl">
        <span className="break-words">{formatVnd(priceValue)}</span>
        {unitName ? (
          <span className="mt-0.5 block text-sm font-semibold text-primary-700 sm:mt-0 sm:inline sm:text-xl md:text-2xl">
            {' '}
            / {unitName}
          </span>
        ) : null}
      </div>
      {showDiscount ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs tabular-nums text-gray-500 line-through sm:text-sm md:text-base">
            {formatVnd(compareAtPrice)}
          </span>
          <CatalogDiscountBadge percent={discountPercent} />
        </div>
      ) : null}
    </div>
  )
}
