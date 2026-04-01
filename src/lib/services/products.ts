import { apiGet, ApiResponse } from '../api'

export interface Product {
  id: number
  price_value: number 
  price_display?: string  
  in_stock: number
  image?: string
  image_url?: string
  images?: string[]  
  package_size?: string  
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
  product?: {
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

export interface Subcategory {
  slug: string
  name: string
  productCount: number
  level: number
}

export interface CategoryProductsResponse extends ProductListResponse {
  categorySlug: string
  categoryName: string
  productCount: number
  hasSubcategories: boolean
  subcategories: Subcategory[]
  overLimit: boolean
  // Pagination fields from ProductListResponse
  count: number
  next?: string
  previous?: string
  results: Product[]
}

export interface FilterOption {
  id: string
  label: string
  count?: number
  value: string | number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'single' | 'multiple' | 'range'
  options: FilterOption[]
  showMore?: boolean
  maxVisible?: number
}

export interface DynamicFiltersResponse {
  categorySlug: string
  categoryName: string
  productCount: number
  hasSubcategories: boolean
  subcategories: Subcategory[]
  overLimit: boolean
  variants?: {
    brands?: string[]
    priceRanges?: Array<{ min: number; max?: number; label: string }>
    targetAudiences?: string[]
    flavors?: string[]
    countries?: string[]
    [key: string]: any
  }
  filters?: FilterGroup[]
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

type RawProduct = any

export function getProductEntity(product: Product) {
  return product?.product || product?.medicine || ({} as NonNullable<Product["medicine"]>)
}

export function getProductName(product: Product) {
  const entity = getProductEntity(product)
  return entity.web_name || entity.name || 'Sản phẩm'
}

export function getProductSlug(product: Product) {
  const entity = getProductEntity(product)
  if (entity.slug) return entity.slug
  if (!entity.name) return undefined
  return entity.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function getProductPackaging(product: Product) {
  return product.package_size || (product as any).packing || (product as any).packaging || ''
}

function normalizeProduct(raw: RawProduct): Product {
  const entity = raw?.product || raw?.medicine || {}
  const packageSize = raw?.package_size ?? raw?.packing ?? raw?.packaging ?? null
  const normalized: Product = {
    ...raw,
    medicine: entity,
    product: entity,
    package_size: packageSize,
    price_value: Number(raw?.price_value ?? 0) || 0,
    in_stock: Number(raw?.in_stock ?? 0) || 0,
  }
  return normalized
}

function normalizeProductListPayload(payload: ProductListResponse | CategoryProductsResponse | undefined) {
  if (!payload) return payload
  if (Array.isArray((payload as any).results)) {
    return {
      ...payload,
      results: (payload as any).results.map(normalizeProduct),
    }
  }
  return payload
}

/**
 * Build URLSearchParams from filters object
 */
function buildSearchParams(filters?: ProductFilters): URLSearchParams {
  const params = new URLSearchParams()
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
  }
  
  return params
}

export async function getProducts(filters?: ProductFilters) {
  const params = buildSearchParams(filters)
  const queryString = params.toString()
  const path = `/products/${queryString ? `?${queryString}` : ''}`
  
  const res = await apiGet<ProductListResponse>(path)
  return {
    ...res,
    data: normalizeProductListPayload(res.data as ProductListResponse | undefined) as ProductListResponse | undefined,
  }
}

export async function getProduct(id: number) {
  const res = await apiGet<Product>(`/products/${id}/`)
  return {
    ...res,
    data: res.data ? normalizeProduct(res.data as RawProduct) : undefined,
  }
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
): Promise<ApiResponse<CategoryProductsResponse>> {
  const params = buildSearchParams(filters)
  const queryString = params.toString()
  const path = `/${categorySlug}${queryString ? `?${queryString}` : ''}`
  
  const res = await apiGet<CategoryProductsResponse>(path)
  return {
    ...res,
    data: normalizeProductListPayload(res.data as CategoryProductsResponse | undefined) as CategoryProductsResponse | undefined,
  }
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
  const res = await apiGet<Product>(path)
  return {
    ...res,
    data: res.data ? normalizeProduct(res.data as RawProduct) : undefined,
  }
}

