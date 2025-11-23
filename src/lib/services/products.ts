import { apiGet } from '../api'

export interface Product {
  id: number
  price: number
  in_stock: number
  image?: string
  image_url?: string
  packaging?: string
  medicine: {
    id: number
    name: string
    effect?: string
    contraindications?: string
  }
  category?: {
    id: number
    name: string
  } | null
  brand_id?: number
  brand?: {
    id: number
    name: string
  } | null
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

