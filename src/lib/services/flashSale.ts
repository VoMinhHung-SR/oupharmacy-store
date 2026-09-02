/**
 * Homepage flash-sale rail — daily priced product pool (display merch only, D-01 / D-23).
 * Pool is computed at fetch/SSG from calendar `dayKey` (Asia/Ho_Chi_Minh): same day → same
 * shuffle; new day → new set. No cron / no Flash DB tables (Option 1).
 */

import {
  homeMerchDayKey,
  withMerchDisplayDiscount,
} from './homeMerch'
import { buildProductCardPayload, normalizeProduct, type Product, type ProductCardPayload } from './products'
import { isPricedForHotSale } from './search'

const FLASH_POOL_MIN = 40
const FLASH_POOL_MAX = 60
const FLASH_POOL_TARGET = 48
/** Fetch extra so CONSULT / zero-price rows can be filtered out. */
const FLASH_FETCH_SIZE = 96
export const FLASH_SALE_RAIL_SIZE = 12

/** Display merch tiers 10–35% (pre-window badge only). */
export const FLASH_MERCH_TIERS = [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 35] as const

export type FlashSaleRailProduct = ProductCardPayload & {
  /** Assigned 10–35% for upcoming-window badge (not applied to live catalog price). */
  flashMerchPercent: number
}

export type FlashSaleProductsPayload = {
  products: FlashSaleRailProduct[]
  dayKey: string
}

function storeApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/store'
}

/** @deprecated Prefer `homeMerchDayKey` — kept for existing imports. */
export function flashSaleDayKey(now: Date = new Date()): string {
  return homeMerchDayKey(now)
}

function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Mulberry32 — deterministic PRNG from seed. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleWithSeed<T>(items: T[], seedKey: string): T[] {
  const out = [...items]
  const rand = mulberry32(hashString(seedKey))
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/**
 * Merch % 10–35 by product “type” (category / brand) + day — stable within a day.
 */
export function flashMerchPercentForProduct(product: Product, dayKey: string): number {
  const kind =
    product.category?.slug?.trim() ||
    product.category?.name?.trim() ||
    product.brand?.name?.trim() ||
    'other'
  const h = hashString(`${dayKey}|${kind.toLowerCase()}|${product.id}`)
  return FLASH_MERCH_TIERS[h % FLASH_MERCH_TIERS.length]
}

/** Apply flash merch % when window is live (display only). */
export function withFlashMerchDisplay(
  card: ProductCardPayload,
  percent: number
): ProductCardPayload {
  if (!(percent >= 10 && percent <= 35)) return card
  return withMerchDisplayDiscount(card, percent)
}

/** Upcoming flash window — teaser badge + masked price only (D-01). */
export function withFlashMerchTeaser(card: ProductCardPayload): ProductCardPayload {
  return {
    ...card,
    discount: undefined,
    originalPrice: undefined,
    discountTeaser: true,
  }
}

/**
 * Slice up to `limit` products from the daily pool for a window (no wrap when pool >= limit).
 */
export function pickFlashSaleWindowProducts(
  pool: FlashSaleRailProduct[],
  windowId: string,
  dayKey: string,
  limit: number = FLASH_SALE_RAIL_SIZE
): FlashSaleRailProduct[] {
  if (!pool.length || limit <= 0) return []
  if (pool.length <= limit) return pool
  const maxStart = pool.length - limit
  const start = hashString(`${dayKey}|window|${windowId}`) % (maxStart + 1)
  return pool.slice(start, start + limit)
}

function productPoolId(product: Product): string {
  return String(product.product_entity_id ?? product.product?.id ?? product.id)
}

function buildFlashSalePool(
  products: Product[],
  dayKey: string,
  poolSize: number = FLASH_POOL_TARGET,
  excludeIds?: Set<string>
): FlashSaleRailProduct[] {
  const sized = Math.min(FLASH_POOL_MAX, Math.max(FLASH_POOL_MIN, poolSize))
  const priced = products.filter((product) => {
    if (!isPricedForHotSale(product)) return false
    if (!excludeIds?.size) return true
    return !excludeIds.has(productPoolId(product))
  })
  const shuffled = shuffleWithSeed(priced, `flash-pool|${dayKey}`)
  return shuffled.slice(0, sized).map((product) => {
    const flashMerchPercent = flashMerchPercentForProduct(product, dayKey)
    return {
      ...buildProductCardPayload(product),
      flashMerchPercent,
    }
  })
}

export type GetFlashSaleProductsOptions = {
  /** Skip IDs already on home hot-sale rail (avoid duplicate cards). */
  excludeIds?: Iterable<string | number>
}

/**
 * Daily flash-sale pool (40–60 priced products). Empty → hide section.
 */
export async function getFlashSaleProductsSSG(
  poolSize: number = FLASH_POOL_TARGET,
  options?: GetFlashSaleProductsOptions
): Promise<FlashSaleProductsPayload> {
  const dayKey = homeMerchDayKey()
  const excludeIds = new Set(
    Array.from(options?.excludeIds ?? [], (id) => String(id)).filter(Boolean)
  )
  const qs = new URLSearchParams({
    q: '',
    page: '1',
    page_size: String(FLASH_FETCH_SIZE),
    sort: 'popular',
    include_facets: 'false',
  })
  const url = `${storeApiBase()}/search/?${qs}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 3600 },
    })
    if (!response.ok) {
      console.warn(`[getFlashSaleProductsSSG] BE returned ${response.status} for ${url}`)
      return { products: [], dayKey }
    }
    const body = (await response.json()) as { items?: Record<string, unknown>[] }
    const items = Array.isArray(body.items) ? body.items : []
    const products = buildFlashSalePool(
      items.map((item) => normalizeProduct(item)),
      dayKey,
      poolSize,
      excludeIds
    )
    return { products, dayKey }
  } catch (error) {
    console.warn('[getFlashSaleProductsSSG] Fetch failed:', error)
    return { products: [], dayKey }
  }
}
