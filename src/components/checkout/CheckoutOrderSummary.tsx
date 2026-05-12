'use client'

import Link from 'next/link'
import React from 'react'
import { InfoIcon, SpinnerIcon } from '@/components/icons'

export interface CartItemForSummary {
  id: string
  name: string
  qty: number
  price: number
}

function formatVnd(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`
}

interface CheckoutOrderSummaryProps {
  items: CartItemForSummary[]
  subtotal: number
  shippingFee: number
  total: number
  hasShippingSelected: boolean
  discountAmount?: number
  shippingDiscountAmount?: number
  /** Giảm giá trực tiếp từ sản phẩm (khi API có list/origin price). */
  directDiscount?: number
  onPlaceOrder: () => void
  isSubmitting: boolean
  canSubmit: boolean
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingFee,
  total,
  hasShippingSelected,
  discountAmount = 0,
  shippingDiscountAmount = 0,
  directDiscount = 0,
  onPlaceOrder,
  isSubmitting,
  canSubmit,
}: CheckoutOrderSummaryProps) {
  const voucherFromCodes = discountAmount + shippingDiscountAmount
  const savingsTotal = directDiscount + voucherFromCodes
  const preDiscountApprox = total + voucherFromCodes + directDiscount
  const showStrikethrough = savingsTotal > 0 && preDiscountApprox > total

  const shippingLabel =
    !hasShippingSelected ? 'Chọn phương thức' : shippingFee <= 0 ? 'Miễn phí' : formatVnd(shippingFee)

  return (
    <div className="flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-base font-semibold text-gray-900">Tóm tắt đơn hàng</h2>
      </div>

      <div className="max-h-[min(40vh,320px)] overflow-y-auto overscroll-contain px-4 py-3">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <div className="font-medium leading-snug text-gray-900">{item.name}</div>
                <div className="text-gray-500">x{item.qty}</div>
              </div>
              <div className="shrink-0 text-right font-medium text-gray-900">{formatVnd(item.price * item.qty)}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 border-t border-gray-100 px-4 py-3 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-gray-600">Tổng tiền</span>
          <span className="font-medium text-gray-900">{formatVnd(subtotal)}</span>
        </div>
        {directDiscount > 0 && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Giảm giá trực tiếp</span>
            <span className="font-medium text-emerald-700">-{formatVnd(directDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-gray-600">
            Giảm giá voucher
            <span className="inline-flex text-gray-400" title="Bao gồm mã giảm đơn hàng và mã giảm phí vận chuyển (nếu có).">
              <InfoIcon className="h-3.5 w-3.5" />
            </span>
          </span>
          <span className={voucherFromCodes > 0 ? 'font-medium text-emerald-700' : 'text-gray-900'}>
            {voucherFromCodes > 0 ? `-${formatVnd(voucherFromCodes)}` : formatVnd(0)}
          </span>
        </div>
        {savingsTotal > 0 && (
          <div className="flex justify-between gap-2">
            <span className="text-gray-600">Tiết kiệm được</span>
            <span className="font-medium text-primary-700">{formatVnd(savingsTotal)}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">{shippingLabel}</span>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900">Thành tiền</span>
          <div className="text-right">
            {showStrikethrough && (
              <div className="text-xs text-gray-400 line-through">{formatVnd(preDiscountApprox)}</div>
            )}
            <div className="text-lg font-bold text-primary-700">{formatVnd(total)}</div>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2 border-t border-gray-100 px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={!canSubmit}
          aria-busy={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="h-5 w-5 shrink-0 animate-spin text-white" />
              Đang xử lý...
            </>
          ) : (
            'Hoàn tất'
          )}
        </button>
        <p className="text-center text-[11px] leading-relaxed text-gray-500">
          Nhấn Hoàn tất đồng nghĩa bạn đồng ý với{' '}
          <Link href="/chinh-sach-doi-tra" className="text-primary-600 underline-offset-2 hover:underline">
            chính sách đổi trả
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
