/**
 * Home fixed-section fixture contracts.
 * Each section imports only its own `*.response.json` — do not barrel all payloads.
 */

export type HomeRailProduct = {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image_url?: string
  packaging?: string
  href: string
  brand_country?: string | null
  in_stock?: number
}

export type FlashSaleWindow = {
  id: string
  label: string
  starts_at: string
  ends_at: string
  status?: 'upcoming' | 'live' | 'ended' | string
}

/** Relative day template — runtime expands to Asia/Ho_Chi_Minh absolute windows. */
export type FlashSaleWindowTemplate = {
  id?: string
  day_offset: number
  start_hour: number
  end_hour: number
}

/** Chrome only — products from `getFlashSaleProductsSSG` (not this fixture). */
export type FlashSaleResponse = {
  enabled?: boolean
  title: string
  cta_label: string
  cta_url: string
  /** Preferred: day_offset templates (no hard-coded calendar dates). */
  window_templates?: FlashSaleWindowTemplate[]
  /** Legacy absolute windows (optional fallback). */
  windows?: FlashSaleWindow[]
  active_window_id?: string
}

export type HotSaleResponse = {
  title: string
  products: HomeRailProduct[]
}

export type FeaturedCategoriesResponse = {
  title: string
  categories: Array<{
    name: string
    /** @deprecated Prefer CategoryIcon via href slug; kept for mock compatibility. */
    icon?: string
    count: number
    href: string
  }>
}

export type FavoriteBrandsResponse = {
  title: string
  brands: Array<{
    id: string
    name: string
    href: string
    productImage?: string
    discountPercent: number
  }>
}
