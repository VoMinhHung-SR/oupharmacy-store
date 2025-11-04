export interface Product {
  id: string
  name: string
  slug?: string
  price: number
  salePrice?: number
  images?: string[]
  brand?: string
  categorySlugs?: string[]
  shortDescription?: string
}


