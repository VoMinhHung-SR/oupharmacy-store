import { normalizeProduct, type Product } from '@/lib/services/products'

function storeApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.trim() || 'http://localhost:8000/api/store'
  return raw.replace(/\/$/, '')
}

/**
 * Server-only product detail for SEO metadata (ISR). Same path as client PDP fetch.
 */
export async function getProductByPathSSG(
  categoryPath: string,
  productSlug: string
): Promise<Product | null> {
  const cat = categoryPath.replace(/^\/+|\/+$/g, '')
  const slug = productSlug.replace(/^\/+|\/+$/g, '')
  if (!cat || !slug) return null

  const url = `${storeApiBaseUrl()}/${cat}/${slug}`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'vi',
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as Record<string, unknown>
    return normalizeProduct(data)
  } catch {
    return null
  }
}
