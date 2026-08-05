'use client'

import React, { type RefObject } from 'react'
import { ReceiptDockShell, ReceiptDockTotalRow } from '@/components/cart/ReceiptDockShell'
import { ChevronRightIcon, InfoIcon } from '@/components/icons'
import { useStickyReceiptHandoff } from '@/lib/hooks/useStickyReceiptHandoff'
import { formatVnd } from '@/lib/utils/currency'

export type CartMobileReceiptDockProps = {
  targetRef: RefObject<HTMLElement | null>
  selectedSubtotal: number
  estimatedTotal: number
  directDiscount: number
  voucherDiscount: number
  hasSavings: boolean
  selectedCount: number
  onOpenOffers: () => void
  onCheckout: () => void
  onPinnedChange?: (pinned: boolean) => void
}

export function CartMobileReceiptDock({
  targetRef,
  selectedSubtotal,
  estimatedTotal,
  directDiscount,
  voucherDiscount,
  hasSavings,
  selectedCount,
  onOpenOffers,
  onCheckout,
  onPinnedChange,
}: CartMobileReceiptDockProps) {
  const { dockRef, pinned, expanded, setExpanded } = useStickyReceiptHandoff(
    targetRef,
    onPinnedChange
  )

  if (!pinned) return null

  const savings = directDiscount + voucherDiscount

  return (
    <ReceiptDockShell dockRef={dockRef}>
      <button
        type="button"
        title="Áp dụng ưu đãi để được giảm giá"
        onClick={onOpenOffers}
        className="mb-3 flex w-full min-w-0 items-center justify-between gap-1.5 overflow-hidden rounded-lg border border-primary-100 bg-primary-50 px-3 py-2.5 text-left text-xs font-medium leading-snug text-primary-800 transition-colors hover:bg-primary-100/80 sm:px-4 sm:py-3 sm:text-sm"
      >
        <span className="min-w-0 flex-1 truncate">Áp dụng ưu đãi để được giảm giá</span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-primary-600 sm:h-5 sm:w-5" />
      </button>

      {expanded ? (
        <dl className="mb-3 space-y-2 border-b border-dashed border-slate-200 pb-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-600">Tổng tiền (đã chọn)</dt>
            <dd className="font-semibold text-slate-900">{formatVnd(selectedSubtotal)}</dd>
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
              <span className="inline-flex text-slate-400" title="Mã giảm giá đã áp dụng (nếu có).">
                <InfoIcon className="h-3.5 w-3.5" />
              </span>
            </dt>
            <dd className="font-medium text-orange-600">
              {voucherDiscount > 0 ? `-${formatVnd(voucherDiscount)}` : formatVnd(0)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="font-medium text-slate-700">Tiết kiệm được</dt>
            <dd className="font-semibold text-orange-600">
              {hasSavings ? formatVnd(savings) : formatVnd(0)}
            </dd>
          </div>
        </dl>
      ) : null}

      <ReceiptDockTotalRow
        totalDisplay={formatVnd(estimatedTotal)}
        expanded={expanded}
        onToggleExpand={() => setExpanded((v) => !v)}
        action={
          <button
            type="button"
            onClick={onCheckout}
            disabled={selectedCount === 0}
            className="shrink-0 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
          >
            Mua hàng{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </button>
        }
      />
    </ReceiptDockShell>
  )
}
