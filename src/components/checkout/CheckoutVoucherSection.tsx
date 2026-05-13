'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { ChevronRightIcon, EmptyOfferIllustration } from '@/components/icons'
import { OfferSheet } from '@/components/sheets'

interface CheckoutVoucherSectionProps {
  onApplyVoucher: (payload: { order_voucher_code?: string; shipping_voucher_code?: string }) => Promise<void>
  onRemoveVoucher: (target: 'order' | 'shipping' | 'all') => Promise<void>
  isApplying: boolean
  orderVoucherCode?: string
  shippingVoucherCode?: string
}

export function CheckoutVoucherSection({
  onApplyVoucher,
  onRemoveVoucher,
  isApplying,
  orderVoucherCode,
  shippingVoucherCode,
}: CheckoutVoucherSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [orderCode, setOrderCode] = useState('')
  const [shippingCode, setShippingCode] = useState('')
  const titleId = useId()
  const orderInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!sheetOpen) return
    const t = window.setTimeout(() => orderInputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [sheetOpen])

  const apply = async (payload: { order_voucher_code?: string; shipping_voucher_code?: string }) => {
    try {
      await onApplyVoucher(payload)
      setSheetOpen(false)
    } catch {
      /* parent shows toast */
    }
  }

  return (
    <>
      <button
        type="button"
        title="Áp dụng ưu đãi để được giảm giá"
        onClick={() => setSheetOpen(true)}
        className="flex w-full min-w-0 items-center justify-between gap-1.5 overflow-hidden rounded-lg border border-primary-100 bg-primary-50 px-2.5 py-2 text-left text-xs font-medium leading-none tracking-tight text-primary-800 transition-colors hover:bg-primary-100/80 xl:gap-2 xl:px-4 xl:py-3 xl:text-sm xl:leading-normal xl:tracking-normal"
      >
        <span className="min-w-0 flex-1 truncate">Áp dụng ưu đãi để được giảm giá</span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-primary-600 xl:h-5 xl:w-5" />
      </button>

      <OfferSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        titleId={titleId}
        title="Ưu đãi dành cho bạn"
        footer={
          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-base font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              Đóng
            </button>
          </div>
        }
      >
        <div className="space-y-4 overflow-y-auto px-5 py-4">
          <div>
            <label htmlFor="checkout-sheet-order-voucher" className="mb-1 block text-xs font-medium text-slate-600">
              Mã giảm giá đơn hàng
            </label>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
              <input
                ref={orderInputRef}
                id="checkout-sheet-order-voucher"
                type="text"
                value={orderCode}
                onChange={(e) => setOrderCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void apply({ order_voucher_code: orderCode.trim() })
                }}
                placeholder="Nhập mã giảm giá đơn"
                autoComplete="off"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                disabled={isApplying}
                onClick={() => void apply({ order_voucher_code: orderCode.trim() })}
                className="shrink-0 border-l border-slate-200 bg-primary-50 px-4 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50"
              >
                Áp dụng
              </button>
            </div>
            {orderVoucherCode && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700">Đang áp dụng: {orderVoucherCode}</span>
                <button
                  type="button"
                  disabled={isApplying}
                  onClick={() => onRemoveVoucher('order')}
                  className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="checkout-sheet-ship-voucher" className="mb-1 block text-xs font-medium text-slate-600">
              Mã giảm phí vận chuyển
            </label>
            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
              <input
                id="checkout-sheet-ship-voucher"
                type="text"
                value={shippingCode}
                onChange={(e) => setShippingCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void apply({ shipping_voucher_code: shippingCode.trim() })
                }}
                placeholder="Nhập mã giảm ship"
                autoComplete="off"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                disabled={isApplying}
                onClick={() => void apply({ shipping_voucher_code: shippingCode.trim() })}
                className="shrink-0 border-l border-slate-200 bg-primary-50 px-4 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50"
              >
                Áp dụng
              </button>
            </div>
            {shippingVoucherCode && (
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-700">Đang áp dụng: {shippingVoucherCode}</span>
                <button
                  type="button"
                  disabled={isApplying}
                  onClick={() => onRemoveVoucher('shipping')}
                  className="font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Xóa
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center rounded-xl bg-slate-50 py-6 text-center">
            <EmptyOfferIllustration className="mb-3 h-20 w-20 text-slate-300" />
            <p className="max-w-[16rem] text-sm text-slate-500">Nhập mã giảm giá đơn và/hoặc mã giảm phí vận chuyển</p>
          </div>
        </div>
      </OfferSheet>
    </>
  )
}
