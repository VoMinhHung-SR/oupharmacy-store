import { apiGet } from '../api'

export interface Product {
  id: number
  price_value: number 
  price_display?: string  
  in_stock: number
  image?: string
  image_url?: string
  images?: string[]  
  images_urls?: string[]  
  package_size?: string  
  prices?: any[]  
  price_obj?: any  
  medicine: {
    id: number
    name: string
    mid?: string
    slug?: string
    web_name?: string
    description?: string
    ingredients?: string
    usage?: string
    dosage?: string
    adverse_effect?: string
    careful?: string
    preservation?: string
    brand_id?: number
  }
  category?: {
    id: number
    name: string
    slug?: string
    path?: string
    path_slug?: string
    category_array?: Array<{ name: string; slug: string }>
  } | null
  category_info?: {
    category: Array<{ name: string; slug: string }>
    categoryPath: string
    categorySlug: string
  }
  brand?: {
    id: number
    name: string
  } | null
  registration_number?: string
  origin?: string
  manufacturer?: string
  shelf_life?: string
  specifications?: any
  link?: string
  product_ranking?: number
  display_code?: number
  is_published?: boolean
  active: boolean
  created_date: string
  updated_date: string
}

export interface ProductListResponse {
  count: number
  next?: string
  previous?: string
  results: Product[]
}

export interface ProductFilters {
  kw?: string
  category?: number
  brand?: number
  min_price?: number
  max_price?: number
  in_stock?: boolean
  price_sort?: 'asc' | 'desc'
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

export async function getProducts(filters?: ProductFilters) {
  const params = new URLSearchParams()
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
  }
  
  const queryString = params.toString()
  const path = `/products/${queryString ? `?${queryString}` : ''}`
  
  return apiGet<ProductListResponse>(path)
}

export async function getProduct(id: number) {
  return apiGet<Product>(`/products/${id}/`)
}

