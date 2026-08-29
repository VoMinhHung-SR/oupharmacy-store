import { formatPromoEndDayLabel } from './catalogPromoCopy'

export function buildVoucherOfferTitle(
  offer: { type: 'FIXED' | 'PERCENT'; value: string; end_at?: string | null; description?: string | null }
): string {
  const day = offer.end_at ? formatPromoEndDayLabel(offer.end_at) : null
  if (offer.type === 'PERCENT') {
    const pct = Number(offer.value)
    const label = Number.isFinite(pct) ? Math.round(pct) : offer.value
    if (day) {
      return `Giảm ngay ${label}% áp dụng đến hết ngày ${day}`
    }
    return `Giảm ngay ${label}% áp dụng đến hết chương trình`
  }
  const amount = Number(offer.value)
  const amountLabel = Number.isFinite(amount) ? `${Math.round(amount).toLocaleString('vi-VN')}₫` : offer.value
  if (day) {
    return `Giảm ngay ${amountLabel} áp dụng đến hết ngày ${day}`
  }
  return `Giảm ngay ${amountLabel} áp dụng đến hết chương trình`
}

export function formatVoucherExpiryLabel(endAt?: string | null): string | null {
  if (!endAt) return null
  const d = new Date(endAt)
  if (Number.isNaN(d.getTime())) return null
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(d)
  const day = parts.find((p) => p.type === 'day')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const year = parts.find((p) => p.type === 'year')?.value
  if (!day || !month || !year) return null
  return `Hạn sử dụng: ${day}/${month}/${year}`
}
