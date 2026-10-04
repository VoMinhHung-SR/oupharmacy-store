import { cache } from 'react'
import type { ResolvedStorePath } from './types'

function storeApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8000/api/store'
  return raw.replace(/\/$/, '')
}

const NOT_FOUND: ResolvedStorePath = {
  page: 'not_found',
  category_path: '',
  product_slug: null,
  product_id: null,
  default_variant_id: null,
}

async function resolveStorePathServerUncached(path: string): Promise<ResolvedStorePath> {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  if (!normalized) return NOT_FOUND

  const url = `${storeApiBaseUrl()}/resolve-path/${normalized}/`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return NOT_FOUND
    const data = (await res.json()) as Partial<ResolvedStorePath>
    if (!data?.page) return NOT_FOUND
    return {
      page: data.page,
      category_path: data.category_path ?? '',
      product_slug: data.product_slug ?? null,
      product_id: data.product_id ?? null,
      default_variant_id: data.default_variant_id ?? null,
      category_id: data.category_id ?? null,
      category_name: data.category_name ?? null,
      product_count: data.product_count,
      has_subcategories: data.has_subcategories,
      subcategories: data.subcategories,
      over_limit: data.over_limit,
    }
  } catch {
    return NOT_FOUND
  }
}

/**
 * Server-only resolve-path (ISR). Mirrors client `resolveStorePath` without axios.
 * `cache()` dedupes layout `generateMetadata` + page RSC in the same request.
 */
export const resolveStorePathServer = cache(resolveStorePathServerUncached)
