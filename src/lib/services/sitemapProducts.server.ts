type SitemapProductRow = {
  slug?: string
  path?: string
  updated_at?: string | null
}

type SitemapFeedPage = {
  next?: string | null
  results?: SitemapProductRow[]
}

function storeApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8000/api/store'
  return raw.replace(/\/$/, '')
}

export type SitemapProductEntry = {
  path: string
  lastModified?: Date
}

const MAX_PRODUCTS = 50_000
const PAGE_SIZE = 1000

/**
 * Fetch lightweight product paths from BE `/products/sitemap/` for sitemap.xml.
 * Failures return [] so static + category URLs still ship.
 */
export async function getProductSitemapEntriesSSG(): Promise<SitemapProductEntry[]> {
  const out: SitemapProductEntry[] = []
  let url: string | null = `${storeApiBaseUrl()}/products/sitemap/?page_size=${PAGE_SIZE}`

  try {
    while (url && out.length < MAX_PRODUCTS) {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        next: { revalidate: 86_400 },
      })
      if (!res.ok) break

      const data = (await res.json()) as SitemapFeedPage
      for (const row of data.results ?? []) {
        const path = (row.path || '').replace(/^\/+|\/+$/g, '')
        if (!path) continue
        out.push({
          path,
          lastModified: row.updated_at ? new Date(row.updated_at) : undefined,
        })
        if (out.length >= MAX_PRODUCTS) break
      }

      const next = data.next?.trim() || null
      url = next && next !== url ? next : null
    }
  } catch {
    return out
  }

  return out
}
