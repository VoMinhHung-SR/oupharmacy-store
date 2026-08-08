import { searchStoreProducts } from '@/lib/services/search'
import {
  getListProductKey,
  getProductsByCategorySlug,
  type Product,
} from '@/lib/services/products'
import type { PublicCampaignDetail } from '@/lib/services/campaign'

const MID_FETCH_CAP = 48
const CATEGORY_PAGE_SIZE = 48

function productMid(product: Product): string {
  return (product.product?.mid || '').trim().toLowerCase()
}

/**
 * Resolve landing products from campaign scope via existing catalog/search APIs.
 * Inactive / missing MIDs are silently skipped (EC-13).
 */
export async function loadCampaignScopedProducts(
  campaign: Pick<PublicCampaignDetail, 'product_mids' | 'category_slugs'>
): Promise<Product[]> {
  const mids = (campaign.product_mids || []).map((m) => m.trim()).filter(Boolean)
  const categorySlugs = (campaign.category_slugs || [])
    .map((s) => s.trim())
    .filter(Boolean)

  if (!mids.length && !categorySlugs.length) {
    return []
  }

  const midSlice = mids.slice(0, MID_FETCH_CAP)
  const midHits = await Promise.all(
    midSlice.map(async (mid) => {
      const res = await searchStoreProducts({
        q: mid,
        page: 1,
        page_size: 12,
        include_facets: false,
      })
      if (res.error || !res.data?.items?.length) return null
      const needle = mid.toLowerCase()
      return (
        res.data.items.find((item) => productMid(item) === needle) ||
        res.data.items.find((item) => productMid(item).includes(needle)) ||
        null
      )
    })
  )

  const categoryBatches = await Promise.all(
    categorySlugs.map(async (slug) => {
      const res = await getProductsByCategorySlug(slug, {
        page: 1,
        page_size: CATEGORY_PAGE_SIZE,
      })
      if (res.error || !res.data?.results?.length) return [] as Product[]
      return res.data.results
    })
  )

  const merged: Product[] = []
  const seen = new Set<string>()
  const add = (product: Product | null) => {
    if (!product) return
    const key = getListProductKey(product)
    if (!key || seen.has(key)) return
    seen.add(key)
    merged.push(product)
  }

  for (const product of midHits) add(product)
  for (const batch of categoryBatches) {
    for (const product of batch) add(product)
  }

  return merged
}
