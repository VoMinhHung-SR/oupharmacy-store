export type StorePageType = 'category' | 'product' | 'not_found'

export type ResolvedStorePath = {
  page: StorePageType
  category_path: string
  product_slug: string | null
  product_id: number | null
  default_variant_id: number | null
}

export type ProductVariantPicker = {
  id: number
  packing?: string | null
  in_stock: number
  price_value: number
  price_display?: string | null
  image_url?: string | null
}
