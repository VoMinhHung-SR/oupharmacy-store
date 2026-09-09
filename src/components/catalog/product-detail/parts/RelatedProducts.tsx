'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getProducts,
  Product,
  ProductFilters,
  buildProductCardPayload,
  getListProductKey,
} from '@/lib/services/products'
import { ProductCard } from '@/components/cards/ProductCard'
import { ProductGridSkeleton } from '@/components/skeletons'
import { PAGE_Y_SECTION } from '@/lib/layout/pageLayout'

interface RelatedProductsProps {
  currentProduct: Product
  limit?: number
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  limit = 6,
}) => {
  const categoryId = currentProduct.category?.id

  const { data, isLoading } = useQuery({
    queryKey: ['related-products', categoryId, currentProduct.id],
    queryFn: async () => {
      if (!categoryId) return { results: [], count: 0 }
      
      const filters: ProductFilters = {
        category: categoryId,
        page_size: limit + 1,
        page: 1,
      }
      
      const response = await getProducts(filters)
      return response.data
    },
    enabled: !!categoryId,
  })

  const currentEntityId =
    currentProduct.product_entity_id ?? currentProduct.product?.id ?? currentProduct.id
  const relatedProducts =
    data?.results
      ?.filter((p) => (p.product_entity_id ?? p.product?.id ?? p.id) !== currentEntityId)
      .slice(0, limit) || []

  if (!categoryId) {
    return null
  }

  if (isLoading) {
    return (
      <section className={PAGE_Y_SECTION} aria-label="Sản phẩm liên quan">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Sản phẩm liên quan</h2>
        <ProductGridSkeleton count={6} columns="related" />
      </section>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className={PAGE_Y_SECTION} aria-label="Sản phẩm liên quan">
      <h2 className="mb-6 text-2xl font-semibold text-gray-900">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={getListProductKey(product)}
            product={buildProductCardPayload(product)}
          />
        ))}
      </div>
    </section>
  )
}
