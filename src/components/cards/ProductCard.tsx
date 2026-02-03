'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useMemo } from 'react'
import { ImagePlaceholderIcon } from '@/components/icons'
import { PRICE_CONSULT } from '@/lib/constant'
import { useCart } from '@/contexts/CartContext'
import { toastWarning } from '@/lib/utils/toast'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price_display?: string
    price: number
    originalPrice?: number
    discount?: number
    image_url?: string
    packaging?: string
    medicine_unit_id?: number
    category_slug?: string
    medicine_slug?: string
    in_stock?: number
  }
}

const getProductLink = (product: ProductCardProps['product']): string | null => {
  if (product.category_slug && product.medicine_slug) {
    return `/${product.category_slug}/${product.medicine_slug}`
  }
  return null
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productLink = useMemo(() => getProductLink(product), [product])
  const { add, items } = useCart()
  const discount = useMemo(() => {
    if (product.discount) return product.discount
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    return 0
  }, [product])

  const isConsultPrice = useMemo(
    () => product.price_display === PRICE_CONSULT || String(product.price) === PRICE_CONSULT,
    [product]
  )

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isConsultPrice) {
      return
    }

    if (!product.medicine_unit_id) return

    const inStock = product.in_stock ?? 0
    const existingItem = items.find((i) => i.medicine_unit_id === product.medicine_unit_id)
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
        id: product.id,
        medicine_unit_id: product.medicine_unit_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        packaging: product.packaging,
      },
      1
    )
  }

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault()
    if (productLink) {
      window.location.href = productLink
    }
  }
  // Nếu không có link, hiển thị thông báo thay vì crash
  if (!productLink) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Sản phẩm tạm thời không khả dụng</p>
          <p className="text-xs text-gray-500">Thông tin sản phẩm đang được cập nhật</p>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={productLink}
      className="group relative flex flex-col h-full rounded-lg border border-gray-200 bg-white p-4 hover:shadow-lg transition-all"
    >
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </div>
      )}

      {/* Product image */}
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-3">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImagePlaceholderIcon className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="space-y-2 flex-shrink-0">
          <div className="line-clamp-2 text-sm font-medium text-gray-900 group-hover:text-primary-700 min-h-[2.5rem]">
            {product.name}
          </div>
          {isConsultPrice ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-800">
                <strong>Sản phẩm cần tư vấn từ dược sĩ.</strong>
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="text-primary-700 font-bold text-base">
                  {product.price.toLocaleString('vi-VN')}₫
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="text-gray-400 text-sm line-through ml-auto">
                    {product.originalPrice.toLocaleString('vi-VN')}₫
                  </div>
                )}
              </div>

              {product.packaging && (
                <div className="text-xs text-gray-500">{product.packaging}</div>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1.5 mt-auto pt-2">
          {isConsultPrice ? (
            <>
              <button
                type="button"
                className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                onClick={handleNavigate}
              >
                Tư vấn ngay
              </button>
              <button
                type="button"
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  // TODO: Navigate to pharmacy finder
                }}
              >
                Tìm nhà thuốc
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ
              </button>
              <button
                type="button"
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                onClick={handleNavigate}
              >
                Chi tiết
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ProductCard


