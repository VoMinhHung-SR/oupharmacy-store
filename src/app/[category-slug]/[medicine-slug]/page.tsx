"use client"
import React from 'react'
import { useProductByCategoryAndMedicineSlug } from '@/lib/hooks/useProducts'
import { ProductDetailPageContent } from '@/components/products'

interface Props {
  params: { 
    'category-slug': string
    'medicine-slug': string 
  }
}

/**
 * Product Detail Page
 * Route: /{category-slug}/{medicine-slug}
 * Ví dụ: /thuc-pham-chuc-nang/vitamin-c-1000mg
 */
export default function ProductDetailPage({ params }: Props) {
  const categorySlug = params['category-slug']
  const medicineSlug = params['medicine-slug']
  
  const { 
    data: product, 
    isLoading: productLoading, 
    error: productError 
  } = useProductByCategoryAndMedicineSlug(
    categorySlug,
    medicineSlug
  )

  return (
    <ProductDetailPageContent
      product={product}
      categorySlug={categorySlug}
      medicineSlug={medicineSlug}
      loading={productLoading}
      error={productError}
    />
  )
}

