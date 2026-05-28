import {
  buildProductHref,
  getPrimaryCategorySlug,
  getProductCategorySlug,
  getProductSlug,
  normalizeCategoryPathSlug,
  toStoreProductHref,
  type Product,
} from '@/lib/services/products'

/** Canonical store URL for a product (variant chosen on PDP, not in path). */
export function getProductCanonicalPath(product: Product, fallbackCategorySlug?: string): string | null {
  const fromWebSlug = toStoreProductHref(product.web_slug)
  if (fromWebSlug) return fromWebSlug
  return buildProductHref(getProductCategorySlug(product, fallbackCategorySlug), getProductSlug(product))
}

/** Deep link when switching packaging variant on PDP. */
export function buildProductPathWithVariant(
  categoryPath: string,
  productSlug: string,
  variantId: number
): string {
  const base = buildProductHref(categoryPath, productSlug)
  if (!base) return '/'
  return `${base}?v=${variantId}`
}

export function parseVariantIdFromSearch(searchParams: URLSearchParams): number | undefined {
  const raw = searchParams.get('v') ?? searchParams.get('variant_id')
  if (!raw) return undefined
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? id : undefined
}

export { normalizeCategoryPathSlug, getPrimaryCategorySlug }
