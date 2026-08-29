const PROMO_TZ = 'Asia/Ho_Chi_Minh'

/** End-of-promo calendar day as dd/mm (VN). */
export function formatPromoEndDayLabel(endAt: string): string | null {
  const d = new Date(endAt)
  if (Number.isNaN(d.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PROMO_TZ,
    day: '2-digit',
    month: '2-digit',
  }).formatToParts(d)
  const day = parts.find((p) => p.type === 'day')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  if (!day || !month) return null
  return `${day}/${month}`
}

/** PDP promo callout body — with or without known campaign end date. */
export function buildCatalogPromoAppliedMessage(
  discountPercent: number,
  promoEndsAt?: string | null
): string {
  const day = promoEndsAt ? formatPromoEndDayLabel(promoEndsAt) : null
  if (day) {
    return `Giảm ngay ${discountPercent}% áp dụng đến hết ngày ${day}.`
  }
  return `Giảm ngay ${discountPercent}% áp dụng đến hết chương trình.`
}

/** Cart promo bar — compact copy like pharmacy cart reference. */
export function buildCatalogPromoCartBarMessage(
  discountPercent: number,
  promoEndsAt?: string | null
): string {
  const day = promoEndsAt ? formatPromoEndDayLabel(promoEndsAt) : null
  if (day) {
    return `Giảm ngay ${discountPercent}% áp dụng đến ${day}`
  }
  return `Giảm ngay ${discountPercent}% áp dụng đến hết chương trình`
}
