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
  return `${n.toLocaleString('vi-VN')}đ`
}

interface CheckoutProductListProps {
  items: CheckoutProductLine[]
  lineSubtotal: number
  /** Blur product names (privacy). */
  hideProductNames?: boolean
}

export function CheckoutProductList({ items, lineSubtotal, hideProductNames = false }: CheckoutProductListProps) {
  const qualifiesFreeShipHint = lineSubtotal >= FREE_SHIPPING_THRESHOLD

  return (
    <section className="relative overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-[0_2px_16px_rgba(15,23,42,0.06)]">
      <div className="border-b border-primary-100/80 bg-gradient-to-r from-primary-50 to-sky-50 px-4 py-3 sm:px-5">
        <p className="text-center text-xs font-medium text-slate-700 sm:text-sm">
          {qualifiesFreeShipHint ? (
            <>
              Đơn của bạn đạt mức{' '}
              <span className="font-semibold text-primary-600">miễn phí vận chuyển</span> (từ{' '}
              {formatVnd(FREE_SHIPPING_THRESHOLD)}).
            </>
          ) : (
            <>
              <span className="font-semibold text-primary-600">Miễn phí vận chuyển</span> cho đơn từ{' '}
              <span className="text-slate-900">{formatVnd(FREE_SHIPPING_THRESHOLD)}</span>.
            </>
          )}
        </p>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <h2 className="mb-4 text-base font-bold text-slate-900">Danh sách sản phẩm</h2>
        <ul className="divide-y divide-slate-100">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 py-3 first:pt-0">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt=""
                    fill
                    className="object-contain p-0.5"
                    sizes="56px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-slate-300">
                    <ImagePlaceholderIcon className="h-7 w-7" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium leading-snug text-slate-900 line-clamp-2 ${
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
              <p className="shrink-0 self-start text-sm font-semibold text-slate-900">{formatVnd(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
