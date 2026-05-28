import { apiGet, ApiResponse } from '@/lib/api'
import { normalizeProduct, type Product } from './products'

export type StoreSearchSort = 'relevance' | 'price_asc' | 'price_desc' | 'popular'

export type StoreSearchParams = {
  q: string
  page?: number
  page_size?: number
  sort?: StoreSearchSort
  category?: string | number
  brand?: string | number
  price_range?: string
  in_stock?: boolean
}

export type StoreSearchMeta = {
  total: number
  page: number
  page_size: number
  has_more: boolean
  took_ms?: number
}

export type StoreSearchResponse = {
  items: Product[]
  meta: StoreSearchMeta
}

function buildSearchQueryParams(params: StoreSearchParams): URLSearchParams {
  const qs = new URLSearchParams()
  qs.set('q', params.q)
  if (params.page != null) qs.set('page', String(params.page))
  if (params.page_size != null) qs.set('page_size', String(params.page_size))
  if (params.sort) qs.set('sort', params.sort)
  if (params.category != null && params.category !== '') qs.set('category', String(params.category))
  if (params.brand != null && params.brand !== '') qs.set('brand', String(params.brand))
  if (params.price_range) qs.set('price_range', params.price_range)
  if (params.in_stock === true) qs.set('in_stock', 'true')
  if (params.in_stock === false) qs.set('in_stock', 'false')
  return qs
}

export async function searchStoreProducts(
  params: StoreSearchParams
): Promise<ApiResponse<StoreSearchResponse>> {
  const query = buildSearchQueryParams(params).toString()
  const res = await apiGet<{
    items: Record<string, unknown>[]
    meta: StoreSearchMeta
  }>(`/search/?${query}`)

  if (res.error || !res.data) {
    return { ...res, data: undefined }
  }

  return {
    ...res,
    data: {
      items: res.data.items.map((item) => normalizeProduct(item)),
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
