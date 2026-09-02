/** Catalog direct savings per cart line (D-PRC-05 / P3). */

export function parseMoney(value: unknown): number {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export function catalogDiscountPercentFromListSale(listPrice: unknown, salePrice: unknown): number {
  const list = parseMoney(listPrice)
  const sale = parseMoney(salePrice)
  if (!(list > sale) || list <= 0) return 0
  return Math.round(((list - sale) / list) * 100)
}

export function catalogSavingsFromSnapshots(
  listPriceSnapshot: unknown,
  salePriceSnapshot: unknown,
  quantity: unknown,
): number {
  const sale = parseMoney(salePriceSnapshot)
  const listRaw = listPriceSnapshot
  if (listRaw == null || listRaw === '') return 0
  const list = parseMoney(listRaw)
  if (list <= sale) return 0
  const qty = Math.max(1, parseInt(String(quantity), 10) || 1)
  return (list - sale) * qty
}
