"use client"
import React, { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/Button'
import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/Container'
import { ImagePlaceholderIcon } from '@/components/icons'

export default function CartPage() {
  const { items, remove, total, clear, updateQuantity } = useCart()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set(items.map(i => i.id)))

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map(i => i.id)))
    }
  }

  // Toggle select item
  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  // Calculate subtotal for selected items
  const selectedTotal = items
    .filter(item => selectedItems.has(item.id))
    .reduce((sum, item) => sum + item.price * item.qty, 0)

  // Update quantity
  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty < 1) return
    updateQuantity(id, newQty)
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
          <h1 className="text-2xl font-semibold text-gray-900">Giỏ hàng</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Chưa có sản phẩm nào trong giỏ hàng</p>
            <Link 
              href="/" 
              className="inline-block rounded-lg bg-primary-600 px-6 py-2.5 text-white font-semibold hover:bg-primary-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            {/* Free Shipping Banner */}
            <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3">
              <p className="text-sm text-primary-800">
                <span className="font-semibold">Miễn phí vận chuyển</span> đối với đơn hàng trên 300.000₫
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              {/* Cart Items */}
              <div className="space-y-4">
                {/* Select All Header */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === items.length && items.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Chọn tất cả ({items.length})
                    </span>
                  </label>
                </div>

                {/* Product Items */}
                <div className="space-y-3">
                  {items.map((item) => {
                    const isSelected = selectedItems.has(item.id)
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4"
                      >
                        {/* Checkbox */}
                        <label className="flex items-start pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                        </label>

                        {/* Product Image */}
                        <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              width={96}
                              height={96}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              <ImagePlaceholderIcon className="h-8 w-8" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                          
                          <div className="flex items-center gap-4 mb-3">
                            <div className="text-lg font-semibold text-primary-700">
                              {(item.price * item.qty).toLocaleString('vi-VN')}₫
                            </div>
                          </div>

                          {/* Quantity and Unit */}
                          <div className="flex items-center gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">Số lượng:</span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                                  className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                  disabled={item.qty <= 1}
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                  </svg>
                                </button>
                                <span className="px-3 py-1.5 text-sm font-medium min-w-[3rem] text-center">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                                  className="px-2 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Unit */}
                            {item.packaging && (
                              <div className="text-sm text-gray-600">
                                Đơn vị: <span className="font-medium">{item.packaging}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => remove(item.id)}
                          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Xóa sản phẩm"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:sticky lg:top-24 h-fit">
                <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tạm tính</h2>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tổng tiền</span>
                      <span className="text-gray-900 font-medium">
                        {total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-gray-900">Thành tiền</span>
                      <span className="text-2xl font-bold text-primary-700">
                        {selectedTotal > 0 ? selectedTotal.toLocaleString('vi-VN') : total.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href="/don-hang/thanh-toan"
                        className="block w-full rounded-lg bg-primary-600 px-4 py-3 text-center font-semibold text-white hover:bg-primary-700 transition-colors"
                      >
                        Thanh toán
                      </Link>
                      <Button
                        variant="outline"
                        onClick={clear}
                        className="w-full"
                      >
                        Xóa giỏ hàng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
