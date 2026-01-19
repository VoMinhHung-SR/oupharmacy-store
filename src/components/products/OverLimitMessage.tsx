'use client'
import React from 'react'
import { SubcategoriesGrid } from './SubcategoriesGrid'
import { Subcategory } from '@/lib/services/products'
import { Breadcrumb, CrumbItem } from '@/components/Breadcrumb'

interface OverLimitMessageProps {
  categoryName: string
  productCount: number
  subcategories: Subcategory[]
  categorySlug: string
  loading?: boolean
}

export function OverLimitMessage({
  categoryName,
  productCount,
  subcategories,
  categorySlug,
  loading = false,
}: OverLimitMessageProps) {
  // Build breadcrumbs from category slug
  const breadcrumbs: CrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    { label: categoryName, href: `/${categorySlug}` },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb skeleton */}
          <div className="mb-6 h-6 w-48 bg-gray-200 rounded animate-pulse" />
          
          {/* Category Header skeleton */}
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-6 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Subcategories skeleton */}
          <SubcategoriesGrid
            subcategories={[]}
            currentCategorySlug={categorySlug}
            loading={true}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbs} className="mb-6" />
        
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-600">
            Vui lòng chọn danh mục con để xem sản phẩm cụ thể.
          </p>
        </div>
        
        {/* Subcategories Grid */}
        <SubcategoriesGrid
          subcategories={subcategories}
          currentCategorySlug={categorySlug}
          loading={false}
        />
      </div>
    </div>
  )
}
