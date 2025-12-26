'use client'

import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Product } from '@/lib/services/products'
import { ImagePlaceholderIcon } from '@/components/icons'
import { PRICE_CONSULT } from '@/lib/constant'

interface ProductListViewProps {
  products: Product[]
}

const getProductLink = (product: Product): string | null => {
  if (product.category && product.medicine.slug) {
    const categoryArray = product.category_info?.category
    const categorySlug = categoryArray && categoryArray.length > 0 
      ? categoryArray.map(cat => cat.slug).join('/')
      : product.category_info?.categorySlug
    return categorySlug ? `/${categorySlug}/${product.medicine.slug}` : null
  }
  return null
}

export const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  return (
    <div className="space-y-4">
      {products.map((product) => {
        const productLink = getProductLink(product)
        
        if (!productLink) {
          return null
        }
        
        const isConsultPrice = product.price_display === PRICE_CONSULT || String(product.price_value) === PRICE_CONSULT || product.price_value === 0
        
        return (
          <Link
            key={product.id}
            href={productLink}
            className="group flex gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-all"
          >
            {/* Product image */}
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded bg-gray-100">
              {(() => {
                const imageUrl = product.image_url || (product.images && product.images.length > 0 ? product.images[0] : null)
                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.medicine.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <ImagePlaceholderIcon className="h-12 w-12" />
                  </div>
                )
              })()}
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

              {isConsultPrice ? (
                <div className="mt-4 space-y-2">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs text-amber-800">
                      <strong>Sản phẩm cần tư vấn từ dược sĩ.</strong>
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        window.location.href = productLink
                      }}
                    >
                      Tư vấn ngay
                    </button>
                    <button
                      type="button" 
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      onClick={(e) => {
                        e.preventDefault()
                        // TODO: Navigate to pharmacy finder
                      }}
                    >
                      Tìm nhà thuốc
                    </button>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

