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
  status: 'upcoming' | 'live' | 'ended' | string
}

export type FlashSaleResponse = {
  enabled?: boolean
  title: string
  cta_label: string
  cta_url: string
  windows: FlashSaleWindow[]
  active_window_id: string
  /** Default / fallback product list. */
  products: HomeRailProduct[]
  /** Optional per-window products for UI mock switching. */
  products_by_window?: Record<string, HomeRailProduct[]>
}

export type HotSaleResponse = {
  title: string
  products: HomeRailProduct[]
}

export type FeaturedCategoriesResponse = {
  title: string
  categories: Array<{ name: string; icon: string; count: number; href: string }>
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
