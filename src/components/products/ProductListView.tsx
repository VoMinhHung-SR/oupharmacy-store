'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Product } from '@/lib/services/products'
import { ImagePlaceholderIcon } from '@/components/icons'

interface ProductListViewProps {
  products: Product[]
}

// Helper function để tạo product link từ Product data
const getProductLink = (product: Product): string | null => {
  // Nếu có đủ category và medicine slug, sử dụng format mới
  if (product.category && product.medicine.slug) {
    const categorySlug = product.category.path_slug || product.category.slug || product.category.name.toLowerCase().replace(/\s+/g, '-')
    return `/${categorySlug}/${product.medicine.slug}`
  }
  // Fallback: sử dụng ID nếu không có slug
  if (product.id) {
    return `/products/${product.id}`
  }
  return null
}

export const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => {
        const productLink = getProductLink(product)
        
        // Nếu không có link, bỏ qua product này
        if (!productLink) {
          return null
        }
        
        return (
          <Link
            key={product.id}
            href={productLink}
            className="group flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-all"
          >
            {/* Product image */}
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded bg-gray-100">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.medicine.name}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <ImagePlaceholderIcon className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-700 mb-2">
                  {product.medicine.name}
                </h3>
                {product.package_size && (
                  <p className="text-sm text-gray-500 mb-2">{product.package_size}</p>
                )}
                {product.medicine.usage && (
                  <p className="text-sm text-gray-600 line-clamp-2">{product.medicine.usage}</p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-primary-700 font-bold text-xl">
                  {product.price_value.toLocaleString('vi-VN')}₫
                </div>
                <button
                  type="button"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    window.location.href = productLink
                  }}
                >
                  Chọn mua
                </button>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

