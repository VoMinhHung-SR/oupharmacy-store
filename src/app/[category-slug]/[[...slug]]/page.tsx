import { StorePage } from '@/components/catalog/StorePage'
import { PAGINATION } from '@/lib/constant'
import { getProductByPathSSG } from '@/lib/services/products.server'
import { searchStoreProductsServer } from '@/lib/services/search.server'
import { sortOptionToStoreSearchSort } from '@/lib/services/search'
import { resolveStorePathServer } from '@/lib/store-path/resolve.server'
import { parseVariantIdFromSearch } from '@/lib/store-path'

type StorePathPageProps = {
  params: { 'category-slug': string; slug?: string[] }
  searchParams?: Record<string, string | string[] | undefined>
}

function buildStorePath(params: StorePathPageProps['params']): string {
  const head = params['category-slug']
  const rest = params.slug ?? []
  return [head, ...rest].filter(Boolean).join('/')
}

function searchParamsToQuery(searchParams?: StorePathPageProps['searchParams']): URLSearchParams {
  const qs = new URLSearchParams()
  if (!searchParams) return qs
  for (const [key, value] of Object.entries(searchParams)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const item of value) qs.append(key, item)
    } else {
      qs.set(key, value)
    }
  }
  return qs
}

/**
 * Cold load: resolve + first listing/product payload on the server, then hydrate
 * the client catalog shell. Soft-nav keeps useStorePage client fetches.
 */
export default async function StorePathPage({ params, searchParams }: StorePathPageProps) {
  const storePath = buildStorePath(params)
  const initialResolved = await resolveStorePathServer(storePath)

  let initialListing = null
  let initialProduct = null
  let initialVariantId: number | undefined

  if (initialResolved.page === 'category' && initialResolved.over_limit !== true) {
    const categoryId = initialResolved.category_id
    if (categoryId != null) {
      initialListing = await searchStoreProductsServer({
        q: '',
        category: categoryId,
        page: PAGINATION.DEFAULT_PAGE,
        page_size: PAGINATION.DEFAULT_PAGE_SIZE,
        sort: sortOptionToStoreSearchSort('bestselling'),
        include_facets: true,
      })
    }
  }

  if (initialResolved.page === 'product') {
    const categoryPath =
      initialResolved.category_path || storePath.split('/').slice(0, -1).join('/')
    const productSlug =
      initialResolved.product_slug || storePath.split('/').filter(Boolean).pop() || ''
    const fromQuery = parseVariantIdFromSearch(searchParamsToQuery(searchParams))
    initialVariantId = fromQuery ?? initialResolved.default_variant_id ?? undefined
    initialProduct = await getProductByPathSSG(categoryPath, productSlug, initialVariantId)
  }

  return (
    <StorePage
      minSegments={1}
      initialStorePath={storePath}
      initialResolved={initialResolved}
      initialListing={initialListing ?? undefined}
      initialProduct={initialProduct ?? undefined}
      initialVariantId={initialVariantId}
    />
  )
}
