import { normalizeProduct } from '@/lib/services/products'
import {
  buildSearchQueryParams,
  type StoreSearchFacets,
  type StoreSearchMeta,
  type StoreSearchParams,
  type StoreSearchResponse,
} from '@/lib/services/search'

function storeApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8000/api/store'
  return raw.replace(/\/$/, '')
}

/**
 * Server-only store search (ISR 60s). Mirrors client `searchStoreProducts` without axios.
 */
export async function searchStoreProductsServer(
  params: StoreSearchParams
): Promise<StoreSearchResponse | null> {
  const qs = buildSearchQueryParams(params).toString()
  const url = `${storeApiBaseUrl()}/search/?${qs}`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      items?: Record<string, unknown>[]
      facets?: StoreSearchFacets
      meta?: StoreSearchMeta
    }
    if (!data?.meta || !Array.isArray(data.items)) return null
    return {
      items: data.items.map((item) => normalizeProduct(item)),
      facets: data.facets ?? {},
      meta: data.meta,
    }
  } catch {
    return null
  }
}
