import { apiGet, ApiResponse } from '@/lib/api'
import { normalizeProduct, type FilterGroup, type FilterOption, type Product } from './products'

export type StoreSearchSort = 'relevance' | 'price_asc' | 'price_desc' | 'popular'

export type StoreSearchParams = {
  /** Empty string allowed for category browse (search-first). */
  q?: string
  page?: number
  page_size?: number
  sort?: StoreSearchSort
  category?: string | number
  brand?: string | number
  price_range?: string
  in_stock?: boolean
  /** Skip facet SQL when only items are needed (header suggest). */
  include_facets?: boolean
}

export type StoreSearchMeta = {
  total: number
  page: number
  page_size: number
  has_more: boolean
  took_ms?: number
  applied_filters?: Record<string, unknown>
}

export type StoreSearchFacetBucket = {
  id?: number | string | boolean | null
  key?: string | boolean | number
  name?: string
  slug?: string
  count: number
}

export type StoreSearchFacets = {
  category?: StoreSearchFacetBucket[]
  brand?: StoreSearchFacetBucket[]
  price_ranges?: StoreSearchFacetBucket[]
  in_stock?: StoreSearchFacetBucket[]
}

export type StoreSearchResponse = {
  items: Product[]
  facets: StoreSearchFacets
  meta: StoreSearchMeta
}

const PRICE_RANGE_LABELS: Record<string, string> = {
  under_100k: 'Dưới 100.000đ',
  '100k_300k': '100.000đ - 300.000đ',
  '300k_500k': '300.000đ - 500.000đ',
  over_500k: 'Trên 500.000đ',
}

function buildSearchQueryParams(params: StoreSearchParams): URLSearchParams {
  const qs = new URLSearchParams()
  qs.set('q', params.q ?? '')
  if (params.page != null) qs.set('page', String(params.page))
  if (params.page_size != null) qs.set('page_size', String(params.page_size))
  if (params.sort) qs.set('sort', params.sort)
  if (params.category != null && params.category !== '') qs.set('category', String(params.category))
  if (params.brand != null && params.brand !== '') qs.set('brand', String(params.brand))
  if (params.price_range) qs.set('price_range', params.price_range)
  if (params.in_stock === true) qs.set('in_stock', 'true')
  if (params.in_stock === false) qs.set('in_stock', 'false')
  if (params.include_facets === false) qs.set('include_facets', 'false')
  return qs
}

function mapFacetOptions(
  buckets: StoreSearchFacetBucket[] | undefined,
  mapOption: (bucket: StoreSearchFacetBucket) => FilterOption | null
): FilterOption[] {
  if (!buckets?.length) return []
  return buckets.map(mapOption).filter((opt): opt is FilterOption => opt != null)
}

/** Map search API facets → FilterGroup[] for CategoryListingSidebar. */
export function mapSearchFacetsToFilterGroups(facets?: StoreSearchFacets | null): FilterGroup[] {
  if (!facets) return []

  const groups: FilterGroup[] = []

  const brandOptions = mapFacetOptions(facets.brand, (bucket) => {
    const id = bucket.id
    if (id == null || !bucket.name) return null
    const value: string | number = typeof id === 'boolean' ? String(id) : id
    return {
      id: String(id),
      label: bucket.name,
      value,
      count: bucket.count,
    }
  })
  if (brandOptions.length) {
    groups.push({
      id: 'brand',
      label: 'Thương hiệu',
      type: 'single',
      options: brandOptions,
      showMore: brandOptions.length > 8,
      maxVisible: 8,
    })
  }

  const priceOptions = mapFacetOptions(facets.price_ranges, (bucket) => {
    const key = String(bucket.key ?? '')
    if (!key) return null
    return {
      id: key,
      label: PRICE_RANGE_LABELS[key] || key,
      value: key,
      count: bucket.count,
    }
  })
  if (priceOptions.length) {
    groups.push({
      id: 'price_range',
      label: 'Khoảng giá',
      type: 'range',
      options: priceOptions,
    })
  }

  const stockOptions = mapFacetOptions(facets.in_stock, (bucket) => {
    const key = bucket.key
    if (key !== true && key !== false && key !== 'true' && key !== 'false') return null
    const inStock = key === true || key === 'true'
    return {
      id: inStock ? 'in_stock' : 'out_of_stock',
      label: inStock ? 'Còn hàng' : 'Hết hàng',
      value: inStock ? 'true' : 'false',
      count: bucket.count,
    }
  })
  if (stockOptions.length) {
    groups.push({
      id: 'in_stock',
      label: 'Tình trạng',
      type: 'single',
      options: stockOptions,
    })
  }

  return groups
}

/**
 * Keep option lists from an unfiltered facet snapshot; update counts from the
 * current (filtered) response. Prevents radios/checkboxes from vanishing when
 * the API returns facets scoped to the active filters.
 */
export function mergeFilterGroupsPreserveOptions(
  base: FilterGroup[],
  current: FilterGroup[]
): FilterGroup[] {
  if (!base.length) return current
  if (!current.length) return base

  const currentById = new Map(current.map((group) => [group.id, group]))

  const merged = base.map((baseGroup) => {
    const curr = currentById.get(baseGroup.id)
    if (!curr) return baseGroup

    const countByValue = new Map(
      curr.options.map((option) => [String(option.value), option.count] as const)
    )

    return {
      ...baseGroup,
      label: curr.label || baseGroup.label,
      type: curr.type || baseGroup.type,
      options: baseGroup.options.map((option) => ({
        ...option,
        count: countByValue.has(String(option.value))
          ? countByValue.get(String(option.value))
          : 0,
      })),
    }
  })

  for (const group of current) {
    if (!base.some((b) => b.id === group.id)) {
      merged.push(group)
    }
  }

  return merged
}

export async function searchStoreProducts(
  params: StoreSearchParams
): Promise<ApiResponse<StoreSearchResponse>> {
  const query = buildSearchQueryParams(params).toString()
  const res = await apiGet<{
    items: Record<string, unknown>[]
    facets?: StoreSearchFacets
    meta: StoreSearchMeta
  }>(`/search/?${query}`)

  if (res.error || !res.data) {
    return { ...res, data: undefined }
  }

  return {
    ...res,
    data: {
      items: res.data.items.map((item) => normalizeProduct(item)),
      facets: res.data.facets ?? {},
      meta: res.data.meta,
    },
  }
}

export function sortOptionToStoreSearchSort(
  sort: 'bestselling' | 'price-low' | 'price-high'
): StoreSearchSort {
  if (sort === 'price-low') return 'price_asc'
  if (sort === 'price-high') return 'price_desc'
  if (sort === 'bestselling') return 'popular'
  return 'relevance'
}
