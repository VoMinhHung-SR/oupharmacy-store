'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { toastError } from '@/lib/utils/toast'
import { ChevronRightIcon } from '@/components/icons'
import { OfferSheet, CartVoucherOfferSheetBody } from '@/components/sheets'
import { useEligibleCartVouchers } from '@/lib/hooks/useCartVoucherOffers'

interface CheckoutVoucherSectionProps {
  cartVersion: number | undefined
  orderVoucherCode: string | null
  onApplyVoucher: (payload: { order_voucher_code?: string; shipping_voucher_code?: string }) => Promise<void>
  isApplying: boolean
  enabled?: boolean
}

export function CheckoutVoucherSection({
  cartVersion,
  orderVoucherCode,
  onApplyVoucher,
  isApplying,
  enabled = true,
}: CheckoutVoucherSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [selectedOfferCode, setSelectedOfferCode] = useState<string | null>(null)
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const { data: eligibleVouchers, isLoading: eligibleVouchersLoading, refetch: refetchEligibleVouchers } =
    useEligibleCartVouchers(enabled && cartVersion != null)

  useEffect(() => {
    if (!sheetOpen) return
    void refetchEligibleVouchers()
  }, [refetchEligibleVouchers, sheetOpen])

  useEffect(() => {
    if (!sheetOpen || !eligibleVouchers) return
    const applied = eligibleVouchers.order_vouchers.find((row) => row.is_applied)
    const firstEligible = eligibleVouchers.order_vouchers.find((row) => row.is_eligible && !row.is_applied)
    const preferred =
      orderVoucherCode ??
      applied?.code ??
      eligibleVouchers.best_order_voucher_code ??
      firstEligible?.code ??
      null
    setSelectedOfferCode(preferred)
  }, [eligibleVouchers, orderVoucherCode, sheetOpen])

  useEffect(() => {
    if (!sheetOpen) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [sheetOpen])

  const submitSelected = useCallback(async () => {
    const code = (selectedOfferCode ?? manualCode).trim()
    if (!code) {
      toastError('Vui lòng chọn hoặc nhập mã giảm giá.')
      return
    }
    const selectedOffer = eligibleVouchers?.order_vouchers.find((row) => row.code === code)
    if (selectedOffer && !selectedOffer.is_eligible) {
      toastError(selectedOffer.ineligible_reason ?? 'Voucher chưa đủ điều kiện áp dụng.')
      return
    }
    try {
      await onApplyVoucher({ order_voucher_code: code })
      setSheetOpen(false)
      setManualCode('')
      setSelectedOfferCode(null)
    } catch {
      /* parent shows toast */
    }
  }, [eligibleVouchers?.order_vouchers, manualCode, onApplyVoucher, selectedOfferCode])

  const submitManual = useCallback(async () => {
    const trimmed = manualCode.trim()
    if (!trimmed) {
      toastError('Vui lòng nhập mã giảm giá.')
      return
    }
    setSelectedOfferCode(trimmed.toUpperCase())
    try {
      await onApplyVoucher({ order_voucher_code: trimmed })
      setSheetOpen(false)
      setManualCode('')
      setSelectedOfferCode(null)
    } catch {
      /* parent shows toast */
    }
  }, [manualCode, onApplyVoucher])

  return (
    <>
      <button
        type="button"
        title="Áp dụng ưu đãi để được giảm giá"
        onClick={() => setSheetOpen(true)}
        className="mb-4 flex w-full min-w-0 items-center justify-between gap-1.5 overflow-hidden rounded-lg border border-primary-100 bg-primary-50 px-3 py-2.5 text-left text-xs font-medium leading-snug text-primary-800 transition-colors hover:bg-primary-100/80 sm:px-4 sm:py-3 sm:text-sm"
      >
        <span className="min-w-0 flex-1 truncate">Áp dụng ưu đãi để được giảm giá</span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-primary-600 sm:h-5 sm:w-5" />
      </button>

      <OfferSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        titleId={titleId}
        title="Ưu đãi dành cho bạn"
        footer={
          cartVersion != null ? (
            <div className="space-y-2 border-t border-slate-100 p-4">
              {selectedOfferCode ? (
                <p className="text-center text-sm text-slate-600">Đã chọn 1 ưu đãi</p>
              ) : null}
              <button
                type="button"
                onClick={() => void submitSelected()}
                disabled={isApplying || !selectedOfferCode}
                className="w-full rounded-xl bg-primary-600 py-3.5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
              >
                {isApplying ? 'Đang áp dụng…' : 'Áp dụng'}
              </button>
            </div>
          ) : undefined
        }
      >
        {cartVersion == null ? (
          <div className="space-y-4 px-5 py-6 text-center text-sm text-slate-600">
            <p>Đang tải giỏ hàng… Vui lòng thử lại sau giây lát.</p>
          </div>
        ) : (
          <CartVoucherOfferSheetBody
            manualCode={manualCode}
            onManualCodeChange={setManualCode}
            inputRef={inputRef}
            isApplying={isApplying}
            offers={eligibleVouchers?.order_vouchers ?? []}
            unavailableOffers={eligibleVouchers?.order_vouchers_unavailable ?? []}
            selectedCode={selectedOfferCode}
            onSelectOffer={setSelectedOfferCode}
            onSubmitManual={() => void submitManual()}
            isLoadingOffers={eligibleVouchersLoading && !eligibleVouchers}
          />
        )}
      </OfferSheet>
    </>
  )
}
