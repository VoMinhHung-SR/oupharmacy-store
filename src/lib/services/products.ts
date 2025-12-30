import { apiGet, ApiResponse } from '../api'

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

/**
 * Lấy danh sách sản phẩm theo category slug từ URL path
 * Ví dụ: getProductsByCategorySlug('thuc-pham-chuc-nang/vitamin-khoang-chat')
 * 
 * @param categorySlug - Category slug (có thể là nested path như 'thuc-pham-chuc-nang/vitamin-khoang-chat')
 * @param filters - Optional filters (min_price, max_price, in_stock, page, page_size, etc.)
 * @returns ProductListResponse với danh sách sản phẩm thuộc category
 */
export async function getProductsByCategorySlug(
  categorySlug: string,
  filters?: Omit<ProductFilters, 'category'>
): Promise<ApiResponse<ProductListResponse>> {
  const params = new URLSearchParams()
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
  }
  
  const queryString = params.toString()
  const path = `/${categorySlug}${queryString ? `?${queryString}` : ''}`
  
  return apiGet<ProductListResponse>(path)
}

/**
 * Lấy chi tiết sản phẩm theo category slug và medicine slug
 * Ví dụ: getProductByCategoryAndMedicineSlug('thuc-pham-chuc-nang', 'vitamin-c-1000mg')
 * 
 * @param categorySlug - Category slug (ví dụ: 'thuc-pham-chuc-nang')
 * @param medicineSlug - Medicine slug (ví dụ: 'vitamin-c-1000mg')
 * @returns Product với chi tiết sản phẩm
 */
export async function getProductByCategoryAndMedicineSlug(
  categorySlug: string,
  medicineSlug: string
): Promise<ApiResponse<Product>> {
  const path = `/${categorySlug}/${medicineSlug}`
  return apiGet<Product>(path)
}

