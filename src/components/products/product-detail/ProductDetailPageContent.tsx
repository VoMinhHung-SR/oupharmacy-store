'use client'

import { Product } from '@/lib/services/products'
import Breadcrumb from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import { useProductDetailPage } from '@/components/products/product-detail/hooks/useProductDetailPage'
import {
  ProductDetailLayout,
  ProductDetailLoadingLayout,
  ProductDetailErrorLayout,
} from '@/components/products/product-detail/layout'

interface ProductDetailPageContentProps {
  product: Product | undefined
  categorySlug: string
  productSlug: string
  loading?: boolean
  error?: Error | null
}

export function ProductDetailPageContent({
  product,
  categorySlug,
  productSlug,
  loading = false,
  error = null,
}: ProductDetailPageContentProps) {
  const state = useProductDetailPage({ product, categorySlug, productSlug, loading })

  if (loading) {
    return <ProductDetailLoadingLayout />
  }

  if (error || !product) {
    return <ProductDetailErrorLayout message={error?.message} />
  }

  return (
    <Container className="pb-28 md:pb-32">
      <Breadcrumb items={state.breadcrumbItems} className="py-4" />
      <ProductDetailLayout product={product} state={state} />
    </Container>
  )
}
