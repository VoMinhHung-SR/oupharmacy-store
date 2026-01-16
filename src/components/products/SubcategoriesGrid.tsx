'use client'
import React from 'react'
import Link from 'next/link'
import { Subcategory } from '@/lib/services/products'
import { CategoryIcon } from '@/components/icons'

interface SubcategoriesGridProps {
  subcategories: Subcategory[]
  currentCategorySlug: string
}

export function SubcategoriesGrid({
  subcategories,
  currentCategorySlug,
}: SubcategoriesGridProps) {
  if (!subcategories || subcategories.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Danh mục sản phẩm
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {subcategories.map((subcat) => (
          <Link
            key={subcat.slug}
            href={`/${subcat.slug}`}
            className="group flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
          >
            {/* Icon */}
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-primary-50 transition-colors">
              <CategoryIcon 
                categorySlug={subcat.slug}
                className="w-8 h-8 text-gray-600 group-hover:text-primary-600"
              />
            </div>
            
            {/* Category Name */}
            <div className="text-sm font-medium text-gray-900 text-center mb-1 line-clamp-2 group-hover:text-primary-600 min-h-[2.5rem] flex items-center justify-center">
              {subcat.name}
            </div>
            
            {/* Product Count */}
            <div className="text-xs text-gray-500">
              {subcat.productCount.toLocaleString('vi-VN')} sản phẩm
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
