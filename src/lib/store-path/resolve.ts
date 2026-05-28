import { apiGet } from '@/lib/api'
import type { ResolvedStorePath } from './types'

export function pathnameToStorePath(pathname: string): string {
  return pathname.startsWith('/') ? pathname.slice(1) : pathname
}

export async function resolveStorePath(path: string): Promise<ResolvedStorePath> {
  const normalized = path.replace(/^\/+|\/+$/g, '')
  const res = await apiGet<ResolvedStorePath>(`/resolve-path/${normalized}/`)
  if (res.data && res.data.page) {
    return res.data
  }
  return {
    page: 'not_found',
    category_path: '',
    product_slug: null,
    product_id: null,
    default_variant_id: null,
  }
}
