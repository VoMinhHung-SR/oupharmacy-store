"use client"
import React from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/Button'
import Link from 'next/link'

export default function CartPage() {
  const { items, remove, total, clear } = useCart()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Giỏ hàng</h1>
      {items.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-gray-600">
          Chưa có sản phẩm nào. <Link href="/products" className="text-primary-700">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">{i.name}</div>
                  <div className="text-sm text-gray-600">x{i.qty}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 text-right">{(i.price * i.qty).toLocaleString('vi-VN')}₫</div>
                  <Button variant="outline" onClick={() => remove(i.id)}>Xóa</Button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>Tạm tính</div>
              <div className="text-lg font-semibold">{total.toLocaleString('vi-VN')}₫</div>
            </div>
            <div className="mt-4 grid gap-3">
              <Link href="/checkout" className="rounded-lg bg-primary-600 px-4 py-2 text-center font-semibold text-white hover:bg-primary-700">Thanh toán</Link>
              <Button variant="outline" onClick={clear}>Xóa giỏ hàng</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


