import { apiGet, ApiResponse } from '../api'

export interface ProductUnitOption {
  unit_id: number
  unit_name: string
  quantity_in_base: number
  price_value: number
  price_display?: string | null
  compare_at_price?: number | null
  is_default?: boolean
}

/** Cart line unit picker (guest localStorage uses `id`; API cart uses same shape). */
export interface CartLineUnitOption {
  id: number
  unit_name: string
  is_default?: boolean
  price_value?: number
}

export function mapProductUnitOptionsForCart(unitOptions?: ProductUnitOption[]): CartLineUnitOption[] {
  if (!Array.isArray(unitOptions)) return []
  return unitOptions
    .filter((u) => Number.isFinite(u.unit_id) && u.unit_id > 0)
    .map((u) => ({
      id: u.unit_id,
      unit_name: u.unit_name,
      is_default: u.is_default,
      price_value: u.price_value,
    }))
}

export interface Product {
  id: number
  price_value: number
  price_display?: string
  in_stock: number
  image?: string
  image_url?: string
  images?: string[]
  /** Packaging label (storeApp schema). */
  packing?: string | null
  /** Canonical product entity (storeApp schema). */
  product: {
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
    /** Primary category path (canonical SEO); backward compat with legacy API. */
    categorySlug: string
    primary_category_slug?: string
    category_slugs?: string[]
    /** List/category context path from API when product is shown under a specific tree. */
    listed_under_slug?: string
  }
  brand?: {
    id: number
    name: string
    country?: string | null
  } | null
  registration_number?: string
  /** External link (e.g. product disclosure). */
  link?: string
  origin?: string
  manufacturer?: string
  shelf_life?: string
  specifications?: any
  product_ranking?: number
  display_code?: number
  is_published?: boolean
  /** Giá niêm yết / so sánh (default unit), dùng hiển thị giảm giá. */
  compare_at_price?: number | null
  /** % giảm so với compare_at_price (BE tính từ default unit). */
  discount_percent?: number
  default_unit_id?: number | null
  default_unit_name?: string | null
  unit_options?: ProductUnitOption[]
  is_hot?: boolean
  active: boolean
  created_date: string
  updated_date: string
  /** Full store path `{category_path}/{product_slug}` from API when available. */
  web_slug?: string | null
  /** Distinct published variants for this product (list/search cards). */
  variant_count?: number
  product_entity_id?: number
  /** All packaging variants (product detail API). */
  variants?: Array<{
    id: number
    packing?: string | null
    in_stock: number
    price_value: number
    price_display?: string | null
    image_url?: string | null
  }>
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
  /** Lọc variant is_hot=true (store API). */
  is_hot?: boolean
}

type RawProduct = Record<string, unknown>

export interface ProductCardPayload {
  id: string
  name: string
  price_display?: string
  price: number
  originalPrice?: number
  discount?: number
  image_url?: string
  packaging?: string
  /** Product variant unit id (PVU / `ProductVariant.id` in store API). */
  variant_unit_id?: number
  product_variant_unit_id?: number
  unit_options?: ProductUnitOption[]
  default_unit_name?: string
  category_slug?: string
  product_slug?: string
  href?: string
  in_stock?: number
  variant_count?: number
  brand_name?: string
  brand_country?: string | null
}

export function getProductEntity(product: Product) {
  return product?.product ?? ({} as Product['product'])
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
  return product.packing ?? ''
}

export function getProductImageUrl(product: Product) {
  return product.image_url || product.images?.[0]
}

/** Strip leading/trailing slashes and collapse repeated path segments (e.g. a/a/b → a/b). */
export function normalizeCategoryPathSlug(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '').trim()
  if (!trimmed) return ''
  const parts = trimmed.split('/').filter(Boolean)
  const deduped: string[] = []
  for (const part of parts) {
    if (deduped[deduped.length - 1] !== part) {
      deduped.push(part)
    }
  }
  return deduped.join('/')
}

/**
 * Primary category path for canonical URLs and default links (search, wishlist fallback).
 */
export function getPrimaryCategorySlug(product: Product): string {
  const primary = product.category_info?.primary_category_slug?.trim()
  if (primary) {
    return normalizeCategoryPathSlug(primary)
  }

  const fromInfo = product.category_info?.categorySlug?.trim()
  if (fromInfo) {
    return normalizeCategoryPathSlug(fromInfo)
  }

  const fromCategory = product.category?.path_slug?.trim()
  if (fromCategory) {
    return normalizeCategoryPathSlug(fromCategory)
  }

  if (product.category_info?.category?.length) {
    const joined = product.category_info.category
      .map((cat) => cat.slug?.trim())
      .filter(Boolean)
      .join('/')
    if (joined) {
      return normalizeCategoryPathSlug(joined)
    }
  }

  const leafSlug = product.category?.slug?.trim()
  return leafSlug ? normalizeCategoryPathSlug(leafSlug) : ''
}

/**
 * Href category segment: list context (listed_under / route) before primary.
 */
export function getProductCategorySlug(product: Product, fallbackCategorySlug?: string): string {
  const listed = product.category_info?.listed_under_slug?.trim()
  if (listed) {
    return normalizeCategoryPathSlug(listed)
  }

  if (fallbackCategorySlug?.trim()) {
    return normalizeCategoryPathSlug(fallbackCategorySlug)
  }

  return getPrimaryCategorySlug(product)
}

/** Breadcrumb segments from URL category path (multi-category context). */
export function buildCategoryBreadcrumbFromPath(
  categoryPath: string,
  product?: Product
): Array<{ name: string; href: string }> {
  const normalized = normalizeCategoryPathSlug(categoryPath)
  if (!normalized) return []

  const parts = normalized.split('/').filter(Boolean)
  const primaryTrail = product?.category_info?.category ?? []
  let acc = ''

  return parts.map((part, index) => {
    acc = index === 0 ? part : `${acc}/${part}`
    const matched = primaryTrail[index]?.slug === part ? primaryTrail[index] : null
    const name =
      matched?.name ||
      part
        .split('-')
        .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ''))
        .join(' ')
    return { name, href: `/${acc}` }
  })
}

export function buildProductCanonicalHref(product: Product): string | null {
  return getProductDetailHref(product)
}

/** Canonical product URL (one per Product; variant selected on detail page). */
export function getProductDetailHref(product: Product, fallbackCategorySlug?: string): string | null {
  const fromWebSlug = toStoreProductHref(product.web_slug)
  if (fromWebSlug) return fromWebSlug
  return buildProductHref(getProductCategorySlug(product, fallbackCategorySlug), getProductSlug(product))
}

export function buildProductHref(categorySlug: string | undefined, productSlug: string | undefined): string | null {
  const cat = categorySlug ? normalizeCategoryPathSlug(categorySlug) : ''
  const slug = productSlug?.trim()
  if (!cat || !slug) return null
  return `/${cat}/${slug}`
}

/** Stable React key / identity for list cards (one row per Product). */
export function getListProductKey(product: Product): string {
  return String(product.product_entity_id ?? product.product?.id ?? product.id)
}

/** Store route href from BE `web_slug` (full category path + product slug). */
export function toStoreProductHref(webSlug?: string | null): string | null {
  if (!webSlug?.trim()) return null
  const path = normalizeCategoryPathSlug(webSlug)
  return path ? `/${path}` : null
}

export function buildProductCardPayload(product: Product, fallbackCategorySlug?: string): ProductCardPayload {
  const categorySlug = getProductCategorySlug(product, fallbackCategorySlug)
  const productSlug = getProductSlug(product)
  const detailHref = getProductDetailHref(product, fallbackCategorySlug)
  const variantCount = product.variant_count ?? 1
  const compare = product.compare_at_price
  const hasCompare = typeof compare === 'number' && compare > (product.price_value || 0)
  const discountPct =
    typeof product.discount_percent === 'number' && product.discount_percent > 0
      ? product.discount_percent
      : undefined
  const unitOptions = Array.isArray(product.unit_options) ? product.unit_options : []
  const defaultUnit =
    unitOptions.find((unit) => unit.is_default) ||
    unitOptions[0] ||
    (product.default_unit_id
      ? {
          unit_id: product.default_unit_id,
          unit_name: product.default_unit_name || '',
          quantity_in_base: 1,
          price_value: product.price_value || 0,
          price_display: product.price_display,
          compare_at_price: product.compare_at_price,
          is_default: true,
        }
      : undefined)
  return {
    id: String(product.product_entity_id ?? product.product?.id ?? product.id),
    name: getProductName(product),
    price_display: (defaultUnit?.price_display || product.price_display) || undefined,
    price: defaultUnit?.price_value ?? product.price_value ?? 0,
    originalPrice: hasCompare ? compare : undefined,
    discount: discountPct,
    image_url: getProductImageUrl(product),
    packaging: getProductPackaging(product) || undefined,
    variant_unit_id: product.id,
    product_variant_unit_id: defaultUnit?.unit_id,
    unit_options: unitOptions,
    default_unit_name: defaultUnit?.unit_name || product.default_unit_name || undefined,
    category_slug: categorySlug || undefined,
    product_slug: productSlug,
    href: detailHref ?? undefined,
    in_stock: product.in_stock,
    variant_count: variantCount > 1 ? variantCount : undefined,
    brand_name: product.brand?.name,
    brand_country: product.brand?.country ?? undefined,
  }
}

/** Normalize a single API product payload (list/detail/category). */
export function normalizeProduct(raw: RawProduct): Product {
  const entity = (raw.product ?? raw.medicine ?? {}) as Product['product']
  const packing =
    (raw.packing as string | null | undefined) ??
    (raw.package_size as string | null | undefined) ??
    (raw.packaging as string | null | undefined) ??
    null
  const compareRaw = raw.compare_at_price
  const compareAt =
    compareRaw === null || compareRaw === undefined
      ? undefined
      : Number(compareRaw)
  const normalized: Product = {
    ...(raw as unknown as Product),
    product: entity,
    packing,
    price_value: Number(raw.price_value ?? 0) || 0,
    in_stock: Number(raw.in_stock ?? 0) || 0,
    compare_at_price: compareAt !== undefined && !Number.isNaN(compareAt) ? compareAt : undefined,
    discount_percent: Number(raw.discount_percent ?? 0) || 0,
    default_unit_id:
      raw.default_unit_id == null ? null : Number(raw.default_unit_id),
    default_unit_name: (raw.default_unit_name as string | undefined) ?? null,
    unit_options: Array.isArray(raw.unit_options)
      ? raw.unit_options.map((unit) => ({
          unit_id: Number((unit as Record<string, unknown>).unit_id ?? 0) || 0,
          unit_name: String((unit as Record<string, unknown>).unit_name ?? ''),
          quantity_in_base: Number((unit as Record<string, unknown>).quantity_in_base ?? 1) || 1,
          price_value: Number((unit as Record<string, unknown>).price_value ?? 0) || 0,
          price_display: ((unit as Record<string, unknown>).price_display as string | undefined) ?? null,
          compare_at_price:
            (unit as Record<string, unknown>).compare_at_price == null
              ? null
              : Number((unit as Record<string, unknown>).compare_at_price),
          is_default: Boolean((unit as Record<string, unknown>).is_default),
        }))
      : [],
    is_hot: Boolean(raw.is_hot),
    product_entity_id:
      raw.product_entity_id == null
        ? entity?.id
        : Number(raw.product_entity_id) || entity?.id,
    variant_count:
      raw.variant_count == null ? undefined : Number(raw.variant_count) || undefined,
    variants: Array.isArray(raw.variants)
      ? (raw.variants as Product['variants'])
      : undefined,
  }
  return normalized
}

function isProductDetailPayload(payload: unknown): payload is RawProduct {
  if (!payload || typeof payload !== 'object') return false
  const record = payload as Record<string, unknown>
  return 'product' in record && !Array.isArray(record.results)
}

function normalizeProductListPayload(payload: ProductListResponse | CategoryProductsResponse | undefined) {
  if (!payload) return payload
  if (isProductDetailPayload(payload)) {
    return undefined
  }
  if (Array.isArray((payload as ProductListResponse).results)) {
    return {
      ...payload,
      results: (payload as ProductListResponse).results.map((p) => normalizeProduct(p as unknown as RawProduct)),
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
      if (value === undefined || value === null || value === '') return
      if (key === 'is_hot' && value !== true) return
      params.append(key, String(value))
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
    data: res.data ? normalizeProduct(res.data as unknown as RawProduct) : undefined,
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
    data: normalizeProductListPayload(res.data as CategoryProductsResponse | undefined) as
      | CategoryProductsResponse
      | undefined,
  }
}

/**
 * Chi tiết sản phẩm theo category path + product slug (URL segment cuối).
 */
export async function getProductByCategoryAndProductSlug(
  categorySlug: string,
  productSlug: string,
  variantId?: number
): Promise<ApiResponse<Product>> {
  const params = new URLSearchParams()
  if (variantId != null && variantId > 0) {
    params.set('v', String(variantId))
  }
  const qs = params.toString()
  const path = `/${categorySlug}/${productSlug}${qs ? `?${qs}` : ''}`
  const res = await apiGet<Product>(path)
  return {
    ...res,
    data: res.data ? normalizeProduct(res.data as unknown as RawProduct) : undefined,
  }
}
