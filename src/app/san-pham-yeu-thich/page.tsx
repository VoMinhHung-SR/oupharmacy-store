'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { Container } from '@/components/Container'
import Image from 'next/image'
import Link from 'next/link'
import { ImagePlaceholderIcon } from '@/components/icons'
import { Button } from '@/components/Button'
import { toastSuccess } from '@/lib/utils/toast'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { PRICE_CONSULT } from '@/lib/constant'

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const { items, remove, clear } = useWishlist()
  const { add: addToCart } = useCart()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Only open modal if not loading, not authenticated, and modal is not already open
    if (!loading && !isAuthenticated && !isOpen) {
      openModal('/san-pham-yeu-thich')
    }
  }, [isAuthenticated, loading, openModal, isOpen])

  // Filter out consult products from selectable items
  const selectableItems = useMemo(() => {
    return items.filter(item => {
      const isConsultPrice = item.price_display === PRICE_CONSULT || String(item.price) === PRICE_CONSULT || item.price === 0
      return !isConsultPrice
    })
  }, [items])

  const toggleSelectAll = () => {
    if (selectedItems.size === selectableItems.length && selectableItems.length > 0) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(selectableItems.map(i => i.id)))
    }
  }

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const handleMoveToCart = (item: typeof items[0]) => {
    // Kiểm tra sản phẩm tư vấn - không cho phép add to cart
    const isConsultPrice = item.price_display === PRICE_CONSULT || String(item.price) === PRICE_CONSULT || item.price === 0
    if (isConsultPrice) {
      return
    }

    addToCart({
      id: item.id,
      medicine_unit_id: item.medicine_unit_id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      packaging: item.packaging,
    }, 1)
    toastSuccess(`Đã thêm ${item.name} vào giỏ hàng`)
  }

  const handleMoveSelectedToCart = () => {
    // Only add non-consult products
    const selected = items.filter(item => {
      const isSelected = selectedItems.has(item.id)
      const isConsultPrice = item.price_display === PRICE_CONSULT || String(item.price) === PRICE_CONSULT || item.price === 0
      return isSelected && !isConsultPrice
    })
    
    selected.forEach(item => {
      addToCart({
        id: item.id,
        medicine_unit_id: item.medicine_unit_id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        packaging: item.packaging,
      }, 1)
    })
    toastSuccess(`Đã thêm ${selected.length} sản phẩm vào giỏ hàng`)
    setSelectedItems(new Set())
  }

  const handleShareWishlist = () => {
    const wishlistText = items.map(item => `- ${item.name}`).join('\n')
    const shareText = `Danh sách sản phẩm yêu thích của tôi:\n\n${wishlistText}\n\nXem tại: ${typeof window !== 'undefined' ? window.location.href : ''}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Danh sách sản phẩm yêu thích',
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard
        copyToClipboard(shareText)
      })
    } else {
      copyToClipboard(shareText)
    }
  }

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      toastSuccess('Đã sao chép danh sách yêu thích vào clipboard!')
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toastSuccess('Đã sao chép danh sách yêu thích vào clipboard!')
    }
  }

  const getProductLink = (item: typeof items[0]) => {
    if (item.category_slug && item.medicine_slug) {
      return `/${item.category_slug}/${item.medicine_slug}`
    }
    return '#'
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <Container className="py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Tiếp tục mua sắm</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Sản phẩm yêu thích</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Chưa có sản phẩm nào trong danh sách yêu thích</p>
            <Link 
              href="/" 
              className="inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === selectableItems.length && selectableItems.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Chọn tất cả ({selectableItems.length})
                  </span>
                </label>
                {selectedItems.size > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleMoveSelectedToCart}
                    className="ml-4"
                  >
                    Thêm {selectedItems.size} sản phẩm vào giỏ hàng
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareWishlist}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Chia sẻ</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                >
                  Xóa tất cả
                </Button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((item) => {
                const isSelected = selectedItems.has(item.id)
                const productLink = getProductLink(item)
                const isConsultPrice = item.price_display === PRICE_CONSULT || String(item.price) === PRICE_CONSULT || item.price === 0
                
                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Checkbox - Only show for non-consult products */}
                    {!isConsultPrice && (
                      <label className="absolute top-2 left-2 z-10 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectItem(item.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </label>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => remove(item.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Xóa khỏi danh sách yêu thích"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Product Image */}
                    <Link href={productLink}>
                      <div className="w-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.name}
                            width={300}
                            height={300}
                            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-48 w-full items-center justify-center text-gray-400">
                            <ImagePlaceholderIcon className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex flex-col flex-1 p-4 space-y-3">
                      <Link href={productLink}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-primary-700 transition-colors">
                          {item.name}
                        </h3>
                      </Link>

                      {item.packaging && (
                        <p className="text-xs text-gray-500">
                          Đơn vị: {item.packaging}
                        </p>
                      )}

                      <div className="mt-auto">
                        {isConsultPrice ? (
                          <>
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 mb-3 min-h-[3rem] flex items-center">
                              <p className="text-xs text-amber-800">
                                <strong>Sản phẩm cần tư vấn từ dược sĩ.</strong>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  window.location.href = productLink
                                }}
                                className="flex-1"
                              >
                                Tư vấn ngay
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-3 min-h-[3rem]">
                              <div className="text-lg font-semibold text-primary-700">
                                {item.price.toLocaleString('vi-VN')}₫
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleMoveToCart(item)}
                                className="flex-1"
                              >
                                Thêm vào giỏ
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
