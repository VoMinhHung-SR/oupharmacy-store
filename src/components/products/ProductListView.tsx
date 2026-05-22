'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import {
  Product,
  getProductEntity,
  getProductName,
  getProductSlug,
  getProductPackaging,
  getProductCategorySlug,
  buildProductHref,
  mapProductUnitOptionsForCart,
} from '@/lib/services/products'
import { ImagePlaceholderIcon } from '@/components/icons'
import { PRICE_CONSULT } from '@/lib/constant'
import { useCart } from '@/contexts/CartContext'
import { toastWarning } from '@/lib/utils/toast'

export const ProductListViewSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
          {/* Product image skeleton */}
          <div className="w-32 h-32 flex-shrink-0 animate-pulse rounded-lg bg-gray-200" />
          
          {/* Product info skeleton */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="h-7 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface ProductListViewProps {
  products: Product[]
}

const getProductLink = (product: Product): string | null => {
  const productSlug = getProductSlug(product)
  if (!productSlug) return null
  return buildProductHref(getProductCategorySlug(product), productSlug)
}

const getProductImageUrl = (product: Product): string | undefined => {
  return product.image_url || (product.images?.[0])
}

export const ProductListView: React.FC<ProductListViewProps> = ({ products }) => {
  const { add, items } = useCart()
  const [selectedUnitByVariant, setSelectedUnitByVariant] = useState<Record<number, number>>({})

  const getSelectedUnit = (product: Product) => {
    const unitOptions = product.unit_options || []
    if (!unitOptions.length) return null
    const selectedId = selectedUnitByVariant[product.id]
    return (
      unitOptions.find((unit) => unit.unit_id === selectedId) ||
      unitOptions.find((unit) => unit.is_default) ||
      unitOptions[0]
    )
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    e.stopPropagation()

    const isConsultPrice = product.price_display === PRICE_CONSULT || String(product.price_value) === PRICE_CONSULT || product.price_value === 0
    if (isConsultPrice) {
      return
    }

    const selectedUnit = getSelectedUnit(product)
    const inStock = product.in_stock ?? 0
    const selectedUnitId = selectedUnit?.unit_id ?? product.default_unit_id ?? null
    const existingItem = items.find(
      (i) => i.variant_unit_id === product.id && (i.product_variant_unit_id ?? null) === selectedUnitId
    )
    const currentQtyInCart = existingItem?.qty ?? 0
    const totalQty = currentQtyInCart + 1

    if (inStock === 0) {
      toastWarning('Sản phẩm đã hết hàng')
      return
    }

    if (totalQty > inStock) {
      toastWarning(
        `Số lượng vượt quá tồn kho. Hiện có ${inStock} sản phẩm trong kho. Bạn đã có ${currentQtyInCart} sản phẩm trong giỏ hàng.`
      )
      return
    }

    add(
      {
        id: product.id.toString(),
        variant_unit_id: product.id,
        product_variant_unit_id: selectedUnit?.unit_id ?? product.default_unit_id ?? undefined,
        unit_options: mapProductUnitOptionsForCart(product.unit_options),
        name: getProductName(product),
        price: selectedUnit?.price_value ?? product.price_value,
        image_url: getProductImageUrl(product),
        packaging: selectedUnit?.unit_name || getProductPackaging(product),
      },
      1
    )
  }

  const handleNavigate = (e: React.MouseEvent, productLink: string) => {
    e.preventDefault()
    window.location.href = productLink
  }

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
            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {(() => {
                const imageUrl = getProductImageUrl(product)
                return imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={getProductName(product)}
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
                  {getProductName(product)}
                </h3>
                {(getSelectedUnit(product)?.unit_name || getProductPackaging(product)) && (
                  <p className="text-sm text-gray-500 mb-2">
                    {getSelectedUnit(product)?.unit_name || getProductPackaging(product)}
                  </p>
                )}
                {getProductEntity(product)?.usage && (
                  <p className="text-sm text-gray-600 line-clamp-2">{getProductEntity(product)?.usage}</p>
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
                      onClick={(e) => handleNavigate(e, productLink)}
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
                <div className="flex items-center justify-between mt-4 gap-4">
                  <div className="text-primary-700 font-bold text-xl">
                    {(getSelectedUnit(product)?.price_value ?? product.price_value).toLocaleString('vi-VN')}₫
                  </div>
                  {(product.unit_options?.length || 0) > 1 && (
                    <div className="flex flex-wrap gap-1">
                      {(product.unit_options || []).map((unit) => (
                        <button
                          key={unit.unit_id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedUnitByVariant((prev) => ({ ...prev, [product.id]: unit.unit_id }))
                          }}
                          className={`rounded border px-2 py-1 text-xs ${
                            (getSelectedUnit(product)?.unit_id ?? product.default_unit_id) === unit.unit_id
                              ? 'border-primary-600 text-primary-700 bg-primary-50'
                              : 'border-gray-300 text-gray-600 bg-white'
                          }`}
                        >
                          {unit.unit_name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      Thêm vào giỏ
                    </button>
                    <button
                      type="button"
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      onClick={(e) => handleNavigate(e, productLink)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

