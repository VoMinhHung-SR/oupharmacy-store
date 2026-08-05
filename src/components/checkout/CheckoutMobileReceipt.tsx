'use client'

import React, { useId, type RefObject } from 'react'
import { CartReceiptCard } from '@/components/cart/CartReceiptCard'
import { ReceiptDockShell, ReceiptDockTotalRow } from '@/components/cart/ReceiptDockShell'
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary'
import { CheckoutVoucherSection } from '@/components/checkout/CheckoutVoucherSection'
import { InfoIcon } from '@/components/icons'
import { useStickyReceiptHandoff } from '@/lib/hooks/useStickyReceiptHandoff'
import { formatVnd } from '@/lib/utils/currency'

export type CheckoutReceiptTotals = {
  subtotal: number
  shippingFee: number
  total: number
  hasShippingSelected: boolean
  qualifiesFreeShipping: boolean
  discountAmount: number
  shippingDiscountAmount: number
  directDiscount: number
}

type CheckoutReceiptBlockProps = CheckoutReceiptTotals & {
  hideLineDetail: boolean
  onHideLineDetailChange: (checked: boolean) => void
  onApplyVoucher: (payload: {
    order_voucher_code?: string
    shipping_voucher_code?: string
  }) => Promise<void>
  isApplyingVoucher: boolean
  onPlaceOrder: () => void
  isSubmitting: boolean
  canSubmit: boolean
  showPlaceOrder?: 'always' | 'desktop' | 'never'
  showHideToggle?: boolean
  className?: string
}

function HideLineDetailRow({
  checked,
  onChange,
  compact = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  compact?: boolean
}) {
  const switchId = useId()
  return (
    <div
      className={`flex items-center justify-between gap-3 ${
        compact ? '' : 'mb-4 border-b border-slate-100 pb-3'
      }`}
    >
      <label htmlFor={switchId} className="flex min-w-0 cursor-pointer items-center gap-2.5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600"
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2 4 5v6c0 5 3.4 9.4 8 10.7C16.6 20.4 20 16 20 11V5l-8-3Zm0 4.2 5 1.9v3.9c0 3.4-2.2 6.5-5 7.5-2.8-1-5-4.1-5-7.5V8.1l5-1.9Z" />
          </svg>
        </span>
        <span className="min-w-0 text-sm leading-snug text-slate-800">
          Ẩn tên sản phẩm khi giao hàng
          <span
            className="ml-1 inline-flex align-middle text-slate-400"
            title="Tên sản phẩm trên kiện hàng sẽ được ẩn khi giao."
          >
            <InfoIcon className="h-3.5 w-3.5" />
          </span>
        </span>
      </label>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
          checked ? 'bg-primary-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function CompactBreakdown({ totals }: { totals: CheckoutReceiptTotals }) {
  const voucherDiscount = totals.discountAmount + totals.shippingDiscountAmount
  const shippingIsFree =
    totals.qualifiesFreeShipping || (totals.hasShippingSelected && totals.shippingFee <= 0)
  const shippingLabel = !totals.hasShippingSelected
    ? 'Chọn phương thức'
    : shippingIsFree
      ? 'Miễn phí'
      : formatVnd(totals.shippingFee)

  return (
    <dl className="mb-3 space-y-2 border-b border-dashed border-slate-200 pb-3 text-sm">
      <div className="flex justify-between gap-3">
        <dt className="text-slate-600">Tổng tiền</dt>
        <dd className="font-semibold text-slate-900">{formatVnd(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-600">Giảm giá trực tiếp</dt>
        <dd className="font-medium text-orange-600">
          {totals.directDiscount > 0 ? `-${formatVnd(totals.directDiscount)}` : formatVnd(0)}
        </dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-slate-600">Giảm giá voucher</dt>
        <dd className="font-medium text-orange-600">
          {voucherDiscount > 0 ? `-${formatVnd(voucherDiscount)}` : formatVnd(0)}
        </dd>
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
  )
}

export function CheckoutReceiptBlock({
  hideLineDetail,
  onHideLineDetailChange,
  onApplyVoucher,
  isApplyingVoucher,
  onPlaceOrder,
  isSubmitting,
  canSubmit,
  showPlaceOrder = 'always',
  showHideToggle = true,
  className = '',
  ...totals
}: CheckoutReceiptBlockProps) {
  return (
    <CartReceiptCard className={className}>
      {showHideToggle ? (
        <HideLineDetailRow checked={hideLineDetail} onChange={onHideLineDetailChange} />
      ) : null}
      <CheckoutVoucherSection onApplyVoucher={onApplyVoucher} isApplying={isApplyingVoucher} />
      <CheckoutOrderSummary
        embedded
        subtotal={totals.subtotal}
        shippingFee={totals.shippingFee}
        total={totals.total}
        hasShippingSelected={totals.hasShippingSelected}
        qualifiesFreeShipping={totals.qualifiesFreeShipping}
        discountAmount={totals.discountAmount}
        shippingDiscountAmount={totals.shippingDiscountAmount}
        directDiscount={totals.directDiscount}
        onPlaceOrder={onPlaceOrder}
        isSubmitting={isSubmitting}
        canSubmit={canSubmit}
        showPlaceOrder={showPlaceOrder}
      />
    </CartReceiptCard>
  )
}

type CheckoutMobileReceiptDockProps = CheckoutReceiptTotals & {
  targetRef: RefObject<HTMLElement | null>
  hideLineDetail: boolean
  onHideLineDetailChange: (checked: boolean) => void
  onApplyVoucher: (payload: {
    order_voucher_code?: string
    shipping_voucher_code?: string
  }) => Promise<void>
  isApplyingVoucher: boolean
  onPlaceOrder: () => void
  isSubmitting: boolean
  canSubmit: boolean
  onPinnedChange?: (pinned: boolean) => void
}

export function CheckoutMobileReceiptDock({
  targetRef,
  hideLineDetail,
  onHideLineDetailChange,
  onApplyVoucher,
  isApplyingVoucher,
  onPlaceOrder,
  isSubmitting,
  canSubmit,
  onPinnedChange,
  ...totals
}: CheckoutMobileReceiptDockProps) {
  const { dockRef, pinned, expanded, setExpanded } = useStickyReceiptHandoff(
    targetRef,
    onPinnedChange
  )

  if (!pinned) return null

  return (
    <ReceiptDockShell dockRef={dockRef}>
      <HideLineDetailRow checked={hideLineDetail} onChange={onHideLineDetailChange} compact />
      <div className="mt-3">
        <CheckoutVoucherSection onApplyVoucher={onApplyVoucher} isApplying={isApplyingVoucher} />
      </div>
      {expanded ? (
        <div className="mt-1">
          <CompactBreakdown totals={totals} />
        </div>
      ) : null}
      <ReceiptDockTotalRow
        totalDisplay={formatVnd(totals.total)}
        expanded={expanded}
        onToggleExpand={() => setExpanded((v) => !v)}
        action={
          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={!canSubmit}
            aria-busy={isSubmitting}
            className="shrink-0 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
          >
            {isSubmitting ? 'Đang xử lý…' : 'Hoàn tất'}
          </button>
        }
      />
    </ReceiptDockShell>
  )
}
