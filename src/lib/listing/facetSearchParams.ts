import type { ProductFilters } from '@/lib/services/products'

export function parseInStockFilter(
  raw: ProductFilters['in_stock'] | boolean | string | undefined
): boolean | undefined {
  if (raw === true || raw === 'true') return true
  if (raw === false || raw === 'false') return false
  return undefined
}

/** Map active listing filters → GET /search/ facet query params. */
export function pickFacetSearchParams(filters: ProductFilters): {
  brand: ProductFilters['brand'] | undefined
  price_range: string | undefined
  in_stock: boolean | undefined
} {
  const brand =
    filters.brand == null || filters.brand === '' ? undefined : filters.brand
  const priceRaw = filters.price_range
  const price_range = priceRaw ? String(priceRaw) : undefined
  return {
    brand,
    price_range,
    in_stock: parseInStockFilter(filters.in_stock),
  }
}
