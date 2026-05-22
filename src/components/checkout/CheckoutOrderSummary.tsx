'use client'

import Link from 'next/link'
import React from 'react'
import { InfoIcon, SpinnerIcon } from '@/components/icons'

function formatVnd(n: number) {
  return `${Math.round(n).toLocaleString('vi-VN')}₫`
}

interface CheckoutOrderSummaryProps {
  subtotal: number
  shippingFee: number
  total: number
  hasShippingSelected: boolean
  qualifiesFreeShipping?: boolean
  discountAmount?: number
  shippingDiscountAmount?: number
  directDiscount?: number
  onPlaceOrder: () => void
  isSubmitting: boolean
  canSubmit: boolean
  embedded?: boolean
}

export function CheckoutOrderSummary({
  subtotal,
  shippingFee,
  total,
  hasShippingSelected,
  qualifiesFreeShipping = false,
  discountAmount = 0,
  shippingDiscountAmount = 0,
  directDiscount = 0,
  onPlaceOrder,
  isSubmitting,
  canSubmit,
  embedded = false,
}: CheckoutOrderSummaryProps) {
  const voucherDiscount = discountAmount + shippingDiscountAmount
  const savingsTotal = directDiscount + voucherDiscount
  const hasSavings = savingsTotal > 0
  const preDiscountApprox = total + voucherDiscount + directDiscount
  const showStrikethrough = hasSavings && preDiscountApprox > total

  const shippingIsFree = qualifiesFreeShipping || (hasShippingSelected && shippingFee <= 0)
  const shippingLabel = !hasShippingSelected
    ? 'Chọn phương thức'
    : shippingIsFree
      ? 'Miễn phí'
      : formatVnd(shippingFee)

  const shell = embedded
    ? 'flex min-h-0 flex-col border-0 bg-transparent shadow-none'
    : 'flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm'

  return (
    <div className={shell}>
      <div className={`px-4 py-3 ${embedded ? 'border-t border-slate-100' : 'border-b border-slate-100'}`}>
        <h2 className="sr-only">Chi tiết thanh toán</h2>
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Tổng tiền</dt>
            <dd className="font-semibold text-slate-900">{formatVnd(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Giảm giá trực tiếp</dt>
            <dd className="font-medium text-orange-600">
              {directDiscount > 0 ? `-${formatVnd(directDiscount)}` : formatVnd(0)}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="flex items-center gap-1 text-slate-600">
              Giảm giá voucher
              <span
                className="inline-flex text-slate-400"
                title="Bao gồm mã giảm đơn hàng và mã giảm phí vận chuyển (nếu có)."
              >
                <InfoIcon className="h-4 w-4" />
              </span>
            </dt>
            <dd className="font-medium text-orange-600">
              {voucherDiscount > 0 ? `-${formatVnd(voucherDiscount)}` : formatVnd(0)}
            </dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-dashed border-slate-200 pt-3">
            <dt className="font-medium text-slate-700">Tiết kiệm được</dt>
            <dd className="font-semibold text-orange-600">{hasSavings ? formatVnd(savingsTotal) : formatVnd(0)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Phí vận chuyển</dt>
            <dd
              className={
                shippingIsFree ? 'text-xs font-semibold text-primary-600' : 'font-medium text-slate-900'
              }
            >
              {shippingLabel}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-slate-200 px-4 py-4">
        <div className="flex items-end justify-between gap-3">
          <span className="text-base font-bold text-slate-900">Thành tiền</span>
          <div className="text-right">
            {showStrikethrough && (
              <p className="text-sm text-slate-400 line-through">{formatVnd(preDiscountApprox)}</p>
            )}
            <p className="text-2xl font-bold leading-tight text-primary-700">{formatVnd(total)}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-2 border-t border-slate-100 px-4 pb-5 pt-3">
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={!canSubmit}
          aria-busy={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        <p className="text-center text-[11px] leading-relaxed text-slate-500">
          Nhấn Hoàn tất đồng nghĩa bạn đồng ý với{' '}
          <Link href="/chinh-sach-doi-tra" className="font-medium text-primary-600 underline-offset-2 hover:underline">
            chính sách đổi trả
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
