'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb, { CrumbItem } from '@/components/Breadcrumb'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import { useCart } from '@/contexts/CartContext'
import { toastWarning } from '@/lib/utils/toast'
import Link from 'next/link'
import { PRICE_CONSULT } from '@/lib/constant'
import { Product } from '@/lib/services/products'

interface ProductDetailPageContentProps {
  product: Product | undefined
  categorySlug: string
  medicineSlug: string
  loading?: boolean
  error?: Error | null
}

export function ProductDetailPageContent({
  product,
  categorySlug,
  medicineSlug,
  loading = false,
  error = null,
}: ProductDetailPageContentProps) {
  const router = useRouter()
  const { add, items } = useCart()
  const [quantity, setQuantity] = useState(1)
  const pendingBuyNowRef = useRef<{ productId: number; expectedQty: number } | null>(null)

  // Helper function để tạo cart item object
  const getCartItem = () => {
    if (!product) throw new Error('Product is not available')
    return {
      id: product.id.toString(),
      medicine_unit_id: product.id,
      name: product.medicine.name,
      price: product.price_value,
      image_url: product.image_url,
      packaging: product.package_size,
    }
  }

  // Helper function để validate stock
  const validateStock = () => {
    if (!product) return false
    const existingItem = items.find((i) => i.medicine_unit_id === product.id)
    const currentQtyInCart = existingItem?.qty ?? 0
    const totalQty = currentQtyInCart + quantity

    if (product.in_stock === 0) {
      toastWarning('Sản phẩm đã hết hàng')
      return false
    }

    if (totalQty > product.in_stock) {
      toastWarning(
        `Số lượng vượt quá tồn kho. Hiện có ${product.in_stock} sản phẩm trong kho. Bạn đã có ${currentQtyInCart} sản phẩm trong giỏ hàng.`
      )
      return false
    }

    return { currentQtyInCart, totalQty }
  }

  const handleAddToCart = () => {
    if (!product) return
    const validation = validateStock()
    if (!validation) return
    add(getCartItem(), quantity)
  }

  // Watch for cart update after "Buy Now" action
  useEffect(() => {
    if (pendingBuyNowRef.current) {
      const { productId, expectedQty } = pendingBuyNowRef.current
      const itemInCart = items.find((i) => i.medicine_unit_id === productId)
      
      if (itemInCart && itemInCart.qty >= expectedQty) {
        pendingBuyNowRef.current = null
        router.push('/checkout')
      }
    }
  }, [items, router])

  const handleBuyNow = () => {
    if (!product) return
    const validation = validateStock()
    if (!validation) return

    pendingBuyNowRef.current = { productId: product.id, expectedQty: validation.totalQty }
    add(getCartItem(), quantity)
  }

  if (loading) {
    return (
      <Container className="pb-6">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/products' },
            { label: 'Đang tải...' },
          ]}
          className="py-4"
        />
        <div className="bg-white rounded-lg p-6 space-y-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square w-full animate-pulse rounded-lg bg-gray-200" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-6 w-1/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (error || !product) {
    return (
      <Container className="pb-6">
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/products' },
          ]}
          className="py-4"
        />
        <div className="bg-white rounded-lg p-6 space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-amber-800 font-medium text-lg mb-2">
              {error ? 'Không thể tải thông tin sản phẩm' : 'Không tìm thấy sản phẩm'}
            </p>
            <p className="text-sm text-amber-700 mb-4">
              {error?.message || 'Sản phẩm bạn đang tìm có thể không tồn tại hoặc đã bị xóa.'}
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/"
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Về trang chủ
              </a>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm"
              >
                Tải lại
              </button>
            </div>
          </div>
        </div>
      </Container>
    )
  }

  const breadcrumbItems: CrumbItem[] = [{ label: 'Trang chủ', href: '/' }]

  if (product.category_info?.category?.length) {
    let accumulatedSlug = ''

    product.category_info.category.forEach((cat, index) => {
      accumulatedSlug += index === 0 ? cat.slug : `/${cat.slug}`

      breadcrumbItems.push({
        label: cat.name,
        href: `/${accumulatedSlug}`,
      })
    })
  } else if (product.category) {
    const categoryArray =
      product.category.category_array && product.category.category_array.length
        ? product.category.category_array
        : [
            {
              name: product.category.name,
              slug:
                product.category.path_slug ||
                product.category.slug ||
                product.category.name.toLowerCase().replace(/\s+/g, '-'),
            },
          ]

    let accumulatedSlug = ''

    categoryArray.forEach((cat, index) => {
      accumulatedSlug += index === 0 ? cat.slug : `/${cat.slug}`

      breadcrumbItems.push({
        label: cat.name,
        href: `/${accumulatedSlug}`,
      })
    })
  }

  breadcrumbItems.push({
    label: product.medicine.name,
    href: `/${categorySlug}/${medicineSlug}`,
  })

  const isConsultPrice = product.price_display === PRICE_CONSULT || String(product.price_value) === PRICE_CONSULT

  return (
    <Container className="pb-6">
      <Breadcrumb items={breadcrumbItems} className="py-4" />
      <div className="bg-white rounded-lg p-6 space-y-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left: Product Images */}
          <div>
            <ProductImageGallery
              mainImage={product.image_url}
              productName={product.medicine.name}
            />
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Brand */}
            {product.brand && (
              <div className="text-sm text-gray-600">
                Thương hiệu: <span className="font-medium text-gray-900">{product.brand.name}</span>
              </div>
            )}

            {/* Product Name */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
                {product.medicine.name}
              </h1>
            </div>

            {/* Product ID & Rating (Placeholder) */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{product.id.toString().padStart(8, '0')}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span>5</span>
              </span>
              <span>•</span>
              <span>1 đánh giá</span>
              <span>•</span>
              <span>9 bình luận</span>
            </div>

            {/* Price or Consult Notice */}
            {isConsultPrice ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800">
                  <strong>Sản phẩm cần tư vấn từ dược sĩ.</strong>
                </p>
              </div>
            ) : (
              <>
                <div>
                  <div className="text-3xl font-bold text-primary-700">
                    {product.price_value.toLocaleString('vi-VN')}₫
                  </div>
                </div>

                {/* Unit Selection */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Chọn đơn vị tính
                  </label>
                  <div className="flex gap-2">
                    <button className="rounded-full border-2 border-primary-600 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
                      Hộp
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Product Information */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Tên chính hãng:</span>{' '}
                <span className="text-gray-600">{product.medicine.name}</span>
              </div>

              {product.category && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Danh mục:</span>{' '}
                  <Link href={`/${product.category.path_slug || product.category.slug || product.category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="text-primary-500 hover:text-primary-700">{product.category.name}</span>
                  </Link>
                </div>
              )}

              {product.package_size && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Quy cách:</span>{' '}
                  <span className="text-gray-600">{product.package_size}</span>
                </div>
              )}

              {product.medicine.ingredients && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Thành phần:</span>{' '}
                  <span className="text-gray-600">{product.medicine.ingredients}</span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-medium text-gray-700">
                Tồn kho: {product.in_stock > 0 ? `${product.in_stock} sản phẩm` : 'Hết hàng'}
              </div>
            </div>

            {/* Quantity Selector - Only show if not consult price */}
            {!isConsultPrice && product.in_stock > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Chọn số lượng
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <span className="text-lg text-gray-900">−</span>
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.in_stock}
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1
                      setQuantity(Math.max(1, Math.min(product.in_stock, val)))
                    }}
                    className="h-10 w-20 rounded-lg border border-gray-300 bg-white text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.in_stock, quantity + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= product.in_stock}
                  >
                    <span className="text-lg text-gray-900">+</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isConsultPrice ? (
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={() => {
                    // TODO: Navigate to consultation page or open consultation modal
                  }}
                  className="w-full"
                  size="lg"
                >
                  Tư vấn ngay
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // TODO: Navigate to pharmacy finder
                  }}
                  className="w-full"
                  size="lg"
                >
                  Tìm nhà thuốc
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.in_stock === 0}
                  className="flex-1"
                  size="lg"
                >
                  Thêm vào giỏ
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={product.in_stock === 0}
                  className="flex-1"
                  size="lg"
                >
                  Mua ngay
                </Button>
              </div>
            )}

            {/* Additional Info */}
            {product.medicine.adverse_effect && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-amber-900">Chống chỉ định:</h3>
                <p className="text-sm text-amber-800">{product.medicine.adverse_effect}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

