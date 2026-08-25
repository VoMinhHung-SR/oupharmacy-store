/**
 * Homepage favorite-brands rail + brand campaign merchandising (10–35%).
 * SoT: search facets brand counts (popularity proxy); discount is display/campaign only (D-01).
 */

import {
  buildProductCardPayload,
  getProductImageUrl,
  normalizeProduct,
  type Product,
  type ProductCardPayload,
} from './products'

function storeApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/store'
}

export const FAVORITE_BRANDS_COUNT = 10

/** Descending campaign tiers for top brands (index 0 = bestseller). */
export const BRAND_CAMPAIGN_DISCOUNT_TIERS = [35, 32, 30, 28, 25, 22, 20, 18, 15, 10] as const

export type FavoriteBrandCard = {
  id: string
  name: string
  slug: string
  href: string
  productImage?: string
  /** Brand logo URL when available; card falls back to name in the logo frame. */
  logoUrl?: string
  discountPercent: number
  productCount?: number
  country?: string | null
}

export type FavoriteBrandsPayload = {
  title: string
  brands: FavoriteBrandCard[]
}

export type BrandPageMeta = {
  id: string
  name: string
  slug: string
  country?: string | null
  productCount?: number
  productImage?: string
  discountPercent: number
}

/** URL-safe brand slug (no diacritics). */
export function slugifyBrandName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function clampCampaignPercent(raw: number): number {
  if (!Number.isFinite(raw)) return 0
  return Math.min(35, Math.max(10, Math.round(raw)))
}

export function parseBrandPromoParam(raw: string | null | undefined): number | undefined {
  if (!raw) return undefined
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 10 || n > 35) return undefined
  return n
}

/** Apply brand campaign % onto a product card (display compare_at only). */
export function applyBrandCampaignDiscount(
  card: ProductCardPayload,
  discountPercent: number
): ProductCardPayload {
  const pct = clampCampaignPercent(discountPercent)
  if (pct <= 0) return card
  if (card.discount && card.discount > 0 && card.originalPrice && card.originalPrice > card.price) {
    return card
  }
  const price = card.price
  if (!(price > 0)) return card
  const originalPrice = Math.max(price + 1, Math.round(price / (1 - pct / 100)))
  return {
    ...card,
    discount: pct,
    originalPrice,
  }
}

export function brandPageHref(
  brandId: string | number,
  brandName: string,
  discountPercent: number
): string {
  const slug = slugifyBrandName(brandName) || String(brandId)
  const pct = clampCampaignPercent(discountPercent)
  const qs = new URLSearchParams()
  qs.set('bid', String(brandId))
  qs.set('promo', String(pct))
  return `/thuong-hieu/${encodeURIComponent(slug)}?${qs.toString()}`
}

/** @deprecated Use brandPageHref — kept for older search links. */
export function brandCampaignHref(brandId: string | number, discountPercent: number): string {
  const pct = clampCampaignPercent(discountPercent)
  const qs = new URLSearchParams()
  qs.set('q', '')
  qs.set('brand', String(brandId))
  qs.set('promo', String(pct))
  return `/tim-kiem?${qs.toString()}`
}

function assignBrandCampaignTiers(
  brands: Array<{
    id: string
    name: string
    productImage?: string
    productCount?: number
    country?: string | null
  }>
): FavoriteBrandCard[] {
  return brands.slice(0, FAVORITE_BRANDS_COUNT).map((brand, index) => {
    const discountPercent =
      BRAND_CAMPAIGN_DISCOUNT_TIERS[index] ??
      BRAND_CAMPAIGN_DISCOUNT_TIERS[BRAND_CAMPAIGN_DISCOUNT_TIERS.length - 1]
    const slug = slugifyBrandName(brand.name) || brand.id
    return {
      ...brand,
      slug,
      discountPercent,
      href: brandPageHref(brand.id, brand.name, discountPercent),
    }
  })
}

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 60 },
    })
    if (!response.ok) {
      console.warn(`[brandCampaigns] BE returned ${response.status} for ${url}`)
      return null
    }
    return await response.json()
  } catch (error) {
    console.warn('[brandCampaigns] Fetch failed:', error)
    return null
  }
}

async function fetchBrandSampleProduct(brandId: string): Promise<{
  image?: string
  country?: string | null
} | null> {
  const qs = new URLSearchParams({
    q: '',
    brand: brandId,
    sort: 'popular',
    page: '1',
    page_size: '1',
    include_facets: 'false',
  })
  const body = (await fetchJson(`${storeApiBase()}/search/?${qs}`)) as {
    items?: Record<string, unknown>[]
  } | null
  const raw = body?.items?.[0]
  if (!raw) return null
  const product = normalizeProduct(raw)
  return {
    image: getProductImageUrl(product) || undefined,
    country: product.brand?.country ?? null,
  }
}

/**
 * Top N brands by search facet product count + campaign discount 10–35%.
 * Empty brands → caller should hide the section.
 */
export async function getFavoriteBrandsSSG(
  limit: number = FAVORITE_BRANDS_COUNT
): Promise<FavoriteBrandsPayload> {
  const title = 'Thương hiệu yêu thích'
  const qs = new URLSearchParams({
    q: '',
    page: '1',
    page_size: '1',
    include_facets: 'true',
  })
  const body = (await fetchJson(`${storeApiBase()}/search/?${qs}`)) as {
    facets?: { brand?: Array<{ id?: number | string; name?: string; count?: number }> }
  } | null

  const buckets = Array.isArray(body?.facets?.brand) ? body!.facets!.brand! : []
  const top = buckets
    .filter((b) => b?.id != null && b?.name)
    .slice(0, limit)
    .map((b) => ({
      id: String(b.id),
      name: String(b.name),
      productCount: typeof b.count === 'number' ? b.count : undefined,
    }))

  if (!top.length) {
    return { title, brands: [] }
  }

  const withMeta = await Promise.all(
    top.map(async (brand) => {
      const sample = await fetchBrandSampleProduct(brand.id)
      return {
        ...brand,
        productImage: sample?.image,
        country: sample?.country,
      }
    })
  )

  return {
    title,
    brands: assignBrandCampaignTiers(withMeta),
  }
}

/** Resolve brand page meta from bid (preferred) or slug match against top facets. */
export async function getBrandPageMetaSSG(options: {
  slug: string
  brandId?: string
  promo?: number
}): Promise<BrandPageMeta | null> {
  const slug = options.slug.trim().toLowerCase()
  const bid = options.brandId?.trim()

  const favorite = await getFavoriteBrandsSSG(FAVORITE_BRANDS_COUNT)
  const fromFavorite =
    (bid ? favorite.brands.find((b) => b.id === bid) : undefined) ||
    favorite.brands.find((b) => b.slug === slug)

  if (fromFavorite) {
    return {
      id: fromFavorite.id,
      name: fromFavorite.name,
      slug: fromFavorite.slug,
      country: fromFavorite.country,
      productCount: fromFavorite.productCount,
      productImage: fromFavorite.productImage,
      discountPercent: options.promo ?? fromFavorite.discountPercent,
    }
  }

  if (!bid) return null

  const brandRes = (await fetchJson(`${storeApiBase()}/brands/${encodeURIComponent(bid)}/`)) as {
    id?: number
    name?: string
    country?: string | null
  } | null
  if (!brandRes?.id || !brandRes.name) return null

  const sample = await fetchBrandSampleProduct(String(brandRes.id))
  const discountPercent =
    options.promo ?? BRAND_CAMPAIGN_DISCOUNT_TIERS[BRAND_CAMPAIGN_DISCOUNT_TIERS.length - 1]

  return {
    id: String(brandRes.id),
    name: brandRes.name,
    slug: slugifyBrandName(brandRes.name) || String(brandRes.id),
    country: brandRes.country ?? sample?.country,
    productImage: sample?.image,
    discountPercent,
  }
}

/** Build product cards with a fixed brand campaign % (search ?promo=). */
export function buildBrandCampaignProductCards(
  products: Product[],
  discountPercent: number
): ProductCardPayload[] {
  const pct = clampCampaignPercent(discountPercent)
  return products.map((product) =>
    applyBrandCampaignDiscount(buildProductCardPayload(product), pct)
  )
}
