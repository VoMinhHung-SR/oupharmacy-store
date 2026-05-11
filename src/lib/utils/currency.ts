
export type VndSymbol = '₫' | 'đ' | 'none'

/** Parse API / form values to a safe integer VND amount. */
export function parseVndInteger(value: unknown): number {
  if (value == null || value === '') return 0
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.round(value) : 0
  }
  const s = String(value).trim().replace(/\s/g, '').replace(/,/g, '')
  const n = Number(s)
  return Number.isFinite(n) ? Math.round(n) : 0
}

export interface FormatVndOptions {
  /** Suffix; default `₫` (no space). Use `none` for number only. */
  symbol?: VndSymbol
}

export function formatVnd(value: unknown, options?: FormatVndOptions): string {
  const amount = parseVndInteger(value)
  const formatted = amount.toLocaleString('vi-VN')
  const symbol = options?.symbol ?? '₫'
  if (symbol === 'none') return formatted
  return `${formatted}${symbol}`
}
