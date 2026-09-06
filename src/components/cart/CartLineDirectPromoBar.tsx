import { PromoIcon } from '@/components/icons'
import {
  buildCatalogPromoCartBarMessage,
  formatPromoEndDayLabel,
} from '@/lib/utils/catalogPromoCopy'
import { catalogDiscountPercentFromListSale } from '@/lib/utils/cartPricing'

type CartLineDirectPromoBarProps = {
  unitPrice: number
  listPriceSnapshot?: number | null
  promoEndsAt?: string | null
  className?: string
}

function CatalogPromoCartBarText({
  discountPercent,
  promoEndsAt,
}: {
  discountPercent: number
  promoEndsAt?: string | null
}) {
  const endDay = promoEndsAt ? formatPromoEndDayLabel(promoEndsAt) : null

  return (
    <>
      Giảm ngay{' '}
      <span className="font-semibold text-slate-800">{discountPercent}%</span>
      {endDay ? (
        <>
          {' '}
          áp dụng đến <span className="font-medium">{endDay}</span>
        </>
      ) : (
        ' áp dụng đến hết chương trình'
      )}
    </>
  )
}

export function cartLineHasDirectPromo(
  unitPrice: number,
  listPriceSnapshot?: number | null,
): boolean {
  if (listPriceSnapshot == null || listPriceSnapshot <= unitPrice) return false
  return catalogDiscountPercentFromListSale(listPriceSnapshot, unitPrice) > 0
}

export function CartLineDirectPromoBar({
  unitPrice,
  listPriceSnapshot,
  promoEndsAt,
  className = '',
}: CartLineDirectPromoBarProps) {
  const discountPercent = catalogDiscountPercentFromListSale(
    listPriceSnapshot,
    unitPrice,
  )
  if (discountPercent <= 0) return null

  const ariaLabel = buildCatalogPromoCartBarMessage(discountPercent, promoEndsAt)

  return (
    <div
      className={`flex w-full min-h-[1.625rem] items-center gap-1 rounded-md bg-slate-100/90 px-2 py-1 ${className}`.trim()}
      role="note"
      aria-label={ariaLabel}
    >
      <PromoIcon size="sm" tone="brand" />
      <p className="min-w-0 text-[11px] leading-tight text-slate-700">
        <CatalogPromoCartBarText
          discountPercent={discountPercent}
          promoEndsAt={promoEndsAt}
        />
      </p>
    </div>
  )
}
