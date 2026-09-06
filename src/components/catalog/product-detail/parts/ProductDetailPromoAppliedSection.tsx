import { PromoIcon } from '@/components/icons'
import { buildCatalogPromoAppliedMessage } from '@/lib/utils/catalogPromoCopy'

type ProductDetailPromoAppliedSectionProps = {
  discountPercent: number
  /** ISO end from active catalog campaign / unit promo when known. */
  promoEndsAt?: string | null
}

/** Catalog direct discount callout — shown when selected unit has compare_at promo. */
export function ProductDetailPromoAppliedSection({
  discountPercent,
  promoEndsAt,
}: ProductDetailPromoAppliedSectionProps) {
  if (discountPercent <= 0) return null

  const message = buildCatalogPromoAppliedMessage(discountPercent, promoEndsAt)

  return (
    <section
      className="overflow-hidden rounded-xl border border-orange-100 bg-white"
      aria-label="Khuyến mại được áp dụng"
    >
      <div className="flex items-center gap-2 border-b border-orange-100/80 bg-orange-50 px-3 py-2.5 sm:px-4">
        <span
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white"
          aria-hidden
        >
          %
        </span>
        <h3 className="text-sm font-semibold text-orange-600">Khuyến mại được áp dụng</h3>
      </div>
      <div className="flex items-center gap-2 px-3 py-3 sm:px-4">
        <PromoIcon size="lg" tone="soft" />
        <p className="text-sm leading-snug text-gray-800">{message}</p>
      </div>
    </section>
  )
}
