import { StorePage } from '@/components/catalog/StorePage'
import { resolveStorePathServer } from '@/lib/store-path/resolve.server'

type StorePathPageProps = {
  params: { 'category-slug': string; slug?: string[] }
}

function buildStorePath(params: StorePathPageProps['params']): string {
  const head = params['category-slug']
  const rest = params.slug ?? []
  return [head, ...rest].filter(Boolean).join('/')
}

/**
 * Cold load: resolve on the server (deduped with layout metadata), then hydrate
 * the client catalog shell. Soft-nav keeps useStorePage client resolve.
 */
export default async function StorePathPage({ params }: StorePathPageProps) {
  const storePath = buildStorePath(params)
  const initialResolved = await resolveStorePathServer(storePath)

  return (
    <StorePage
      minSegments={1}
      initialStorePath={storePath}
      initialResolved={initialResolved}
    />
  )
}
