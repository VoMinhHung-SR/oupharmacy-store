/**
 * Shared homepage merchandising helpers (display-only, D-01).
 * Not checkout / voucher_engine.
 */

import type { ProductCardPayload } from './products'

export const HOME_MERCH_TZ = 'Asia/Ho_Chi_Minh'

/** Calendar day key YYYY-MM-DD in Asia/Ho_Chi_Minh. */
export function homeMerchDayKey(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: HOME_MERCH_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/**
 * Apply display discount badge + synthetic compare_at (does not change catalog price engine).
 * When `preferExisting`, keep catalog compare_at already on the card.
 */
export function withMerchDisplayDiscount(
  card: ProductCardPayload,
  percent: number,
  options?: { preferExisting?: boolean }
): ProductCardPayload {
  if (
    options?.preferExisting &&
    card.discount &&
    card.discount > 0 &&
    card.originalPrice &&
    card.originalPrice > card.price
  ) {
    return card
  }
  if (!(percent > 0)) return card
  const price = card.price
  if (!(price > 0)) return card
  const originalPrice = Math.max(price + 1, Math.round(price / (1 - percent / 100)))
  return {
    ...card,
    discount: percent,
    originalPrice,
  }
}

/**
 * Mask flash upcoming price by digit groups only (no trailing-digit reveal).
 * e.g. 471350 → xxx.xxxđ; 12500000 → xx.xxx.xxxđ
 */
export function formatUpcomingPriceTeaser(amount: number): string {
  const n = Math.max(0, Math.round(amount))
  if (n === 0) return 'xxx.000đ'

  const digits = String(n).length
  const groups: string[] = []
  let head = ((digits - 1) % 3) + 1
  groups.push('x'.repeat(Math.min(3, head)))

  for (let pos = head; pos < digits; pos += 3) {
    groups.push('x'.repeat(Math.min(3, digits - pos)))
  }

  if (groups.length === 1) return `${groups[0]}.000đ`
  return `${groups.join('.')}đ`
}

export type FlashWindowTemplate = {
  /** Stable id suffix; final id = `win-d{day_offset}` if omitted. */
  id?: string
  /** 0 = today (VN), 1 = tomorrow, … */
  day_offset: number
  /** Local hour 0–23 in Asia/Ho_Chi_Minh */
  start_hour: number
  end_hour: number
}

export type FlashSaleWindowBuilt = {
  id: string
  label: string
  starts_at: string
  ends_at: string
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/** VN has no DST — fixed UTC+7. */
function vnLocalToUtcIso(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0
): string {
  const ms = Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0)
  return new Date(ms).toISOString()
}

function addCalendarDays(year: number, month: number, day: number, offset: number) {
  const utc = Date.UTC(year, month - 1, day + offset)
  const d = new Date(utc)
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  }
}

/**
 * Build absolute flash windows from day-offset templates (Asia/Ho_Chi_Minh wall clock).
 */
export function buildFlashSaleWindowsFromTemplates(
  templates: FlashWindowTemplate[],
  now: Date = new Date()
): FlashSaleWindowBuilt[] {
  const dayKey = homeMerchDayKey(now)
  const [y0, m0, d0] = dayKey.split('-').map((part) => Number(part))
  if (![y0, m0, d0].every((n) => Number.isFinite(n) && n > 0)) return []

  return templates
    .filter((t) => Number.isFinite(t.day_offset) && t.day_offset >= 0)
    .map((t) => {
      const { year, month, day } = addCalendarDays(y0, m0, d0, t.day_offset)
      const startHour = Math.min(23, Math.max(0, Math.floor(t.start_hour)))
      const endHour = Math.min(23, Math.max(0, Math.floor(t.end_hour)))
      const id = t.id?.trim() || `win-d${t.day_offset}`
      const label = `${pad2(startHour)}:00 - ${pad2(endHour)}:00, ${pad2(day)}/${pad2(month)}`
      return {
        id,
        label,
        starts_at: vnLocalToUtcIso(year, month, day, startHour, 0),
        ends_at: vnLocalToUtcIso(year, month, day, endHour, 0),
      }
    })
    .sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at))
}

export function findNextUpcomingFlashWindow(
  templates: FlashWindowTemplate[],
  now: Date = new Date()
): FlashSaleWindowBuilt | null {
  const windows = buildFlashSaleWindowsFromTemplates(templates, now)
  return windows.find((win) => Date.parse(win.starts_at) > now.getTime()) ?? null
}
