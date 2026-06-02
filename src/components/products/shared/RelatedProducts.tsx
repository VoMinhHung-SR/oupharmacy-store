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
import { Container } from '@/components/Container'

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

  if (!categoryId || relatedProducts.length === 0) {
    return null
  }

  if (isLoading) {
    return (
      <Container className="py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {relatedProducts.map((product) => {
          return (
            <ProductCard
              key={getListProductKey(product)}
              product={buildProductCardPayload(product)}
            />
          )
        })}
      </div>
    </Container>
  )
}
