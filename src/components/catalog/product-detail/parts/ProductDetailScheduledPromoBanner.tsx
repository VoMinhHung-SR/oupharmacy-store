import { PromoIcon } from '@/components/icons'
import { buildCatalogPromoScheduledCopy } from '@/lib/utils/catalogPromoCopy'

type ProductDetailScheduledPromoBannerProps = {
  maskedPrice: string
  startsAt: string
  unitName?: string
}

export function ProductDetailScheduledPromoBanner({
  maskedPrice,
  startsAt,
  unitName,
}: ProductDetailScheduledPromoBannerProps) {
  const copy = buildCatalogPromoScheduledCopy(maskedPrice, startsAt, unitName)

  return (
    <div
      className="flex items-start gap-2 rounded-xl border border-sky-200/90 bg-gradient-to-r from-sky-50 to-primary-50/40 px-2.5 py-2 sm:gap-2.5 sm:px-3 sm:py-2.5"
      role="note"
      aria-label={copy.fullMessage}
    >
      <PromoIcon size="sm" tone="soft" className="mt-0.5 shrink-0" />
      <p className="min-w-0 text-xs leading-snug text-slate-800 sm:text-sm">
        {copy.prefix}
        <span className="font-bold tabular-nums text-primary-700">{copy.priceLabel}</span>
        {copy.suffix}
      </p>
    </div>
  )
}
