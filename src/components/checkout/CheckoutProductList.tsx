'use client'

import Image from 'next/image'
import React from 'react'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constant'
import { ImagePlaceholderIcon } from '@/components/icons'

export interface CheckoutProductLine {
  id: string
  name: string
  qty: number
  price: number
  packaging?: string
  image_url?: string
}

function formatVnd(n: number) {
  return `${n.toLocaleString('vi-VN')}₫`
}

interface CheckoutProductListProps {
  items: CheckoutProductLine[]
  lineSubtotal: number
  hideProductNames?: boolean
}

export function CheckoutProductList({ items, lineSubtotal, hideProductNames = false }: CheckoutProductListProps) {
  const qualifiesFreeShip = lineSubtotal >= FREE_SHIPPING_THRESHOLD
  const amountToFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - lineSubtotal)

  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
      <div className="border-b border-primary-100/80 bg-gradient-to-r from-primary-50 to-sky-50 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5">
        <p className="text-center text-xs font-medium leading-snug text-slate-700 sm:text-sm">
          <span className="font-semibold text-primary-600">Miễn phí vận chuyển</span> đối với đơn hàng từ{' '}
          {formatVnd(FREE_SHIPPING_THRESHOLD)}.
        </p>
      </div>
      <div className="px-3 py-3.5 sm:px-4 sm:py-4 md:px-5">
        <h2 className="mb-3 text-base font-bold text-slate-900 sm:mb-4">Danh sách sản phẩm</h2>
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 py-3 first:pt-0 sm:gap-3">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white p-1 sm:h-16 sm:w-16 sm:p-1.5">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlaceholderIcon className="h-6 w-6" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-normal leading-snug text-slate-900 line-clamp-2 ${
                    hideProductNames ? 'select-none blur-[4px]' : ''
                  }`}
                >
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  x{item.qty}
                  {item.packaging ? ` · ${item.packaging}` : ''}
                </p>
              </div>
              <p className="shrink-0 self-start text-sm font-semibold tabular-nums text-primary-700">
                {formatVnd(item.price * item.qty)}
              </p>
            </li>
          ))}
        </ul>
        {!qualifiesFreeShip && amountToFreeShip > 0 ? (
          <p className="mt-3 text-xs leading-snug text-slate-500">
            Mua thêm <span className="font-medium text-slate-700">{formatVnd(amountToFreeShip)}</span> để được miễn phí
            vận chuyển.
          </p>
        ) : null}
      </div>
    </section>
  )
}
