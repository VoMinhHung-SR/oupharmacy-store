import type { MetadataRoute } from 'next'
import { getCategoriesSSG } from '@/lib/services/categories'
import { getSiteOrigin } from '@/lib/siteUrls'

const STATIC_PATHS = [
  '/',
  '/tim-kiem',
  '/dat-thuoc',
  '/khuyen-mai',
  '/lien-he',
  '/about',
  '/tro-giup',
  '/dieu-khoan',
  '/chinh-sach-bao-mat',
  '/chinh-sach-doi-tra',
  '/san-pham-yeu-thich',
] as const

function collectCategoryPaths(
  roots: Awaited<ReturnType<typeof getCategoriesSSG>>
): string[] {
  const paths: string[] = []
  for (const l0 of roots) {
    const p0 = (l0.path_slug || l0.slug || '').replace(/^\/+|\/+$/g, '')
    if (p0) paths.push(`/${p0}`)
    for (const l1 of l0.level1 ?? []) {
      const p1 = (l1.path_slug || `${p0}/${l1.slug}`).replace(/^\/+|\/+$/g, '')
      if (p1) paths.push(`/${p1}`)
      for (const l2 of l1.level2 ?? []) {
        const p2 = (l2.path_slug || `${p1}/${l2.slug}`).replace(/^\/+|\/+$/g, '')
        if (p2) paths.push(`/${p2}`)
      }
    }
  }
  return paths
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${origin}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }))

  let categoryEntries: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategoriesSSG()
    categoryEntries = collectCategoryPaths(categories).map((path) => ({
      url: `${origin}${path}`,
      lastModified: now,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch {
    categoryEntries = []
  }

  // Product URLs: Phase 4 BE feed. Static + category paths only for now.
  return [...staticEntries, ...categoryEntries]
}
