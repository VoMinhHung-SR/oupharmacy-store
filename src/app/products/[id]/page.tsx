"use client"
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb, { CrumbItem } from '@/components/Breadcrumb'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { useProduct } from '@/lib/hooks/useProducts'
import { useCart } from '@/contexts/CartContext'
import { toastWarning } from '@/lib/utils/toast'
import { ProductImageGallery } from '@/components/products/ProductImageGallery'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = params
  const router = useRouter()
  const { add, items } = useCart()
  const { data: product, isLoading: loading, error } = useProduct(id)
  const [quantity, setQuantity] = useState(1)
  const pendingBuyNowRef = useRef<{ productId: number; expectedQty: number } | null>(null)

  // Helper function để tạo cart item object
  const getCartItem = () => ({
    id: product!.id.toString(),
    medicine_unit_id: product!.id,
    name: product!.medicine.name,
    price: product!.price,
    image_url: product!.image_url,
    packaging: product!.packaging,
  })

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
      <Container className="pb-6" >
          <div className="py-4">
            <Breadcrumb
              items={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Sản phẩm', href: '/products' },
                { label: 'Đang tải...' },
              ]}
            />
          </div>
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

  if (error) {
    return (
      <Container className="pb-6">
        <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Sản phẩm', href: '/products' },
              { label: 'Lỗi' },
            ]}
            className="py-4"
          />
         <div className="bg-white rounded-lg p-6 space-y-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error.message || 'Không tìm thấy sản phẩm'}
          </div>
        </div>
      </Container>
    )
  }

  if (!product) {
    return null
  }

  // Build breadcrumb items
  const breadcrumbItems: CrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
  ]
  
  if (product.category) {
    breadcrumbItems.push({
      label: product.category.name,
      href: `/categories/${product.category.name.toLowerCase().replace(/\s+/g, '-')}`,
    })
  }
  
  breadcrumbItems.push({ label: product.medicine.name })

  return (
    <Container className="pb-6">
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
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
                {/* {product.packaging && ` (${product.packaging})`} */}
              </h1>
            </div>

            {/* Product ID & Rating (Placeholder) */}
            {/* TODO: Add rating and comments */}
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

            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-primary-700">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              {/* <div className="text-sm text-gray-500">/ Hộp</div> */}
            </div>

            {/* Unit Selection (if multiple units available) */}
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

            {/* Product Information */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Tên chính hãng:</span>{' '}
                <span className="text-gray-600">{product.medicine.name}</span>
              </div>

              {product.category && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Danh mục:</span>{' '}
                  <Link href={`/categories/${product.category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="text-primary-500 hover:text-primary-700">{product.category.name}</span>
                  </Link>
                </div>
              )}

              {product.packaging && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Quy cách:</span>{' '}
                  <span className="text-gray-600">{product.packaging}</span>
                </div>
              )}

              {product.medicine.effect && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Thành phần:</span>{' '}
                  <span className="text-gray-600">{product.medicine.effect}</span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-medium text-gray-700">
                Tồn kho: {product.in_stock > 0 ? `${product.in_stock} sản phẩm` : 'Hết hàng'}
              </div>
            </div>

            {/* Quantity Selector */}
            {product.in_stock > 0 && (
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
            {/* TODO: Add quantity selector */}
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

            {/* Additional Info */}
            {product.medicine.contraindications && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-amber-900">Chống chỉ định:</h3>
                <p className="text-sm text-amber-800">{product.medicine.contraindications}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}