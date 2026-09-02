const PROMO_TZ = 'Asia/Ho_Chi_Minh'

/** End promo day label — dd/mm (VN). */
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

/** Promo start label — `08:00 ngày 31/08` (VN). */
export function formatPromoStartDateTimeLabel(startAt: string): string | null {
  const d = new Date(startAt)
  if (Number.isNaN(d.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: PROMO_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    day: '2-digit',
    month: '2-digit',
  }).formatToParts(d)
  const hour = parts.find((p) => p.type === 'hour')?.value
  const minute = parts.find((p) => p.type === 'minute')?.value
  const day = parts.find((p) => p.type === 'day')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  if (!hour || !minute || !day || !month) return null
  return `${hour}:${minute} ngày ${day}/${month}`
}

/** PDP scheduled flash teaser copy (display-only, D-01). */
export type CatalogPromoScheduledCopy = {
  prefix: string
  priceLabel: string
  suffix: string
  fullMessage: string
}

const SCHEDULED_PROMO_PREFIX = 'Ưu đãi sản phẩm chỉ từ '

export function buildCatalogPromoScheduledCopy(
  maskedPrice: string,
  startsAt: string,
  unitName?: string
): CatalogPromoScheduledCopy {
  const when = formatPromoStartDateTimeLabel(startsAt)
  const priceLabel = unitName ? `${maskedPrice} / ${unitName}` : maskedPrice
  const suffix = when ? ` từ ${when}.` : ' trong khung ưu đãi sắp tới.'
  return {
    prefix: SCHEDULED_PROMO_PREFIX,
    priceLabel,
    suffix,
    fullMessage: `${SCHEDULED_PROMO_PREFIX}${priceLabel}${suffix}`,
  }
}

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
