'use client'

import Link from 'next/link'
import React from 'react'
import { InfoIcon, SpinnerIcon } from '@/components/icons'

function formatVnd(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`
}

interface CheckoutOrderSummaryProps {
  subtotal: number
  shippingFee: number
  total: number
  hasShippingSelected: boolean
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
  discountAmount = 0,
  shippingDiscountAmount = 0,
  directDiscount = 0,
  onPlaceOrder,
  isSubmitting,
  canSubmit,
  embedded = false,
}: CheckoutOrderSummaryProps) {
  const voucherFromCodes = discountAmount + shippingDiscountAmount
  const savingsTotal = directDiscount + voucherFromCodes
  const preDiscountApprox = total + voucherFromCodes + directDiscount
  const showStrikethrough = savingsTotal > 0 && preDiscountApprox > total

  const shippingLabel =
    !hasShippingSelected ? 'Chọn phương thức' : shippingFee <= 0 ? 'Miễn phí' : formatVnd(shippingFee)

  const shell = embedded
    ? 'flex min-h-0 flex-col border-0 bg-transparent shadow-none'
    : 'flex min-h-0 flex-col rounded-xl border border-gray-200 bg-white shadow-sm'

  return (
    <div className={shell}>
      <div className={`space-y-2 px-4 py-3 text-sm ${embedded ? 'border-t border-slate-100' : 'border-b border-slate-100'}`}>
        <h2 className="sr-only">Chi tiết thanh toán</h2>
        <div className="flex justify-between gap-2">
          <span className="text-slate-600">Tổng tiền</span>
          <span className="font-medium text-slate-900">{formatVnd(subtotal)}</span>
        </div>
        {directDiscount > 0 && (
          <div className="flex justify-between gap-2">
            <span className="text-slate-600">Giảm giá trực tiếp</span>
            <span className="font-medium text-orange-600">-{formatVnd(directDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-slate-600">
            Giảm giá voucher
            <span
              className="inline-flex text-slate-400"
              title="Bao gồm mã giảm đơn hàng và mã giảm phí vận chuyển (nếu có)."
            >
              <InfoIcon className="h-3.5 w-3.5" />
            </span>
          </span>
          <span className={voucherFromCodes > 0 ? 'font-medium text-orange-600' : 'text-slate-900'}>
            {voucherFromCodes > 0 ? `-${formatVnd(voucherFromCodes)}` : formatVnd(0)}
          </span>
        </div>
        {savingsTotal > 0 && (
          <div className="flex justify-between gap-2">
            <span className="text-slate-600">Tiết kiệm được</span>
            <span className="font-semibold text-orange-600">{formatVnd(savingsTotal)}</span>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-slate-600">Phí vận chuyển</span>
          <span className="font-medium text-slate-900">{shippingLabel}</span>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <span className="text-sm font-semibold text-slate-900">Thành tiền</span>
          <div className="text-right">
            {showStrikethrough && (
              <div className="text-xs text-slate-400 line-through">{formatVnd(preDiscountApprox)}</div>
            )}
            <div className="text-xl font-bold text-primary-700">{formatVnd(total)}</div>
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
