import type { Metadata } from 'next'
import { resolveStorePathServer } from '@/lib/store-path/resolve.server'
import { getProductByPathSSG } from '@/lib/services/products.server'
import {
  buildProductCanonicalHref,
  getProductImageUrl,
  getProductName,
} from '@/lib/services/products'

type CatalogLayoutProps = {
  children: React.ReactNode
  params: { 'category-slug': string; slug?: string[] }
}

function buildStorePath(params: CatalogLayoutProps['params']): string {
  const head = params['category-slug']
  const rest = params.slug ?? []
  return [head, ...rest].filter(Boolean).join('/')
}

export async function generateMetadata({
  params,
}: CatalogLayoutProps): Promise<Metadata> {
  const storePath = buildStorePath(params)
  const resolved = await resolveStorePathServer(storePath)

  if (resolved.page === 'not_found') {
    return {
      title: 'Không tìm thấy — OUPharmacy',
      robots: { index: false, follow: false },
    }
  }

  if (resolved.page === 'category') {
    const name = resolved.category_name?.trim() || storePath
    const title = `${name} | OUPharmacy`
    const description = `Mua ${name} chính hãng tại nhà thuốc OUPharmacy. Giao hàng nhanh, tư vấn dược sĩ.`
    const canonical = `/${resolved.category_path || storePath}`
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: 'website',
      },
    }
  }

  // product
  const categoryPath = resolved.category_path || storePath.split('/').slice(0, -1).join('/')
  const productSlug =
    resolved.product_slug || storePath.split('/').filter(Boolean).pop() || ''
  const product = await getProductByPathSSG(categoryPath, productSlug)
  const name = product ? getProductName(product) : productSlug.replace(/-/g, ' ')
  const title = `${name} | OUPharmacy`
  const description =
    product?.product?.description?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160) ||
    `Mua ${name} tại nhà thuốc OUPharmacy. Hàng chính hãng, tư vấn dược sĩ.`
  const canonical =
    (product && buildProductCanonicalHref(product)) ||
    `/${categoryPath}/${productSlug}`.replace(/\/+/g, '/')
  const image = product ? getProductImageUrl(product) : undefined

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

export default function CatalogLayout({ children }: CatalogLayoutProps) {
  return children
}
