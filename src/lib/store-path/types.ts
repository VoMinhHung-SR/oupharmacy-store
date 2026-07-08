export type StorePageType = 'category' | 'product' | 'not_found'

export type ResolvedStoreSubcategory = {
  slug: string
  name: string
  productCount: number
  level: number
}

export type ResolvedStorePath = {
  page: StorePageType
  category_path: string
  product_slug: string | null
  product_id: number | null
  default_variant_id: number | null
  /** Present for category (and product with category context) — used by search-first browse. */
  category_id?: number | null
  category_name?: string | null
  product_count?: number
  has_subcategories?: boolean
  subcategories?: ResolvedStoreSubcategory[]
  over_limit?: boolean
}

export type ProductVariantPicker = {
  id: number
  packing?: string | null
  in_stock: number
  price_value: number
  price_display?: string | null
  image_url?: string | null
}
