/** Catalog price row on PDP — sale price, compare-at strikethrough, red −% pill. */

interface ProductDetailPriceDisplayProps {
  priceValue: number
  compareAtPrice: number | null
  discountPercent: number
  unitName?: string
}

export function ProductDetailPriceDisplay({
  priceValue,
  compareAtPrice,
  discountPercent,
  unitName,
}: ProductDetailPriceDisplayProps) {
  const showDiscount = discountPercent > 0 && compareAtPrice != null && compareAtPrice > priceValue

  return (
    <div>
      <div className="text-xl font-bold tabular-nums text-primary-700 sm:text-2xl md:text-3xl">
        {priceValue.toLocaleString('vi-VN')}₫
        {unitName ? (
          <span className="text-base font-semibold text-primary-700 sm:text-xl md:text-2xl">
            {' '}
            / {unitName}
          </span>
        ) : null}
      </div>
      {showDiscount ? (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="text-sm tabular-nums text-gray-400 line-through sm:text-base">
            {compareAtPrice.toLocaleString('vi-VN')}₫
          </span>
          <span className="inline-flex items-center rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold leading-none text-white sm:text-sm">
            -{discountPercent}%
          </span>
        </div>
      ) : null}
    </div>
  )
}
