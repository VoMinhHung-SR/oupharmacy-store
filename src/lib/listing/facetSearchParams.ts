import type { ProductFilters } from '@/lib/services/products'

export function parseInStockFilter(
  raw: ProductFilters['in_stock'] | boolean | string | undefined
): boolean | undefined {
  if (raw === true || raw === 'true') return true
  if (raw === false || raw === 'false') return false
  return undefined
}

/** Sort CSV facet tokens for stable query keys / cache. */
export function normalizeCsvFacetParam(
  raw: string | number | undefined | null
): string | undefined {
  if (raw == null || raw === '') return undefined
  const parts = String(raw)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (!parts.length) return undefined
  const unique = Array.from(new Set(parts))
  unique.sort((a, b) => {
    const na = Number(a)
    const nb = Number(b)
    if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
    return a.localeCompare(b, 'vi')
  })
  return unique.join(',')
}

/** Map active listing filters → GET /search/ facet query params. */
export function pickFacetSearchParams(filters: ProductFilters): {
  brand: string | undefined
  origin_country: string | undefined
  price_range: string | undefined
  in_stock: boolean | undefined
  /** Single category id (BE tree filter); used on /tim-kiem only. */
  category: string | number | undefined
} {
  const brand = normalizeCsvFacetParam(
    filters.brand == null || filters.brand === '' ? undefined : filters.brand
  )
  const origin_country = normalizeCsvFacetParam(filters.origin_country)
  const priceRaw = filters.price_range
  const price_range = priceRaw ? String(priceRaw) : undefined
  const category =
    filters.category == null || filters.category === '' ? undefined : filters.category
  return {
    brand,
    origin_country,
    price_range,
    in_stock: parseInStockFilter(filters.in_stock),
    category,
  }
}
