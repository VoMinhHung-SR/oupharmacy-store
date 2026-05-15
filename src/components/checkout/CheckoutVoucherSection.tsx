'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { toastError } from '@/lib/utils/toast'
import { ChevronRightIcon } from '@/components/icons'
import { OfferSheet, SingleVoucherSheetBody } from '@/components/sheets'

interface CheckoutVoucherSectionProps {
  onApplyVoucher: (payload: { order_voucher_code?: string; shipping_voucher_code?: string }) => Promise<void>
  isApplying: boolean
}

export function CheckoutVoucherSection({ onApplyVoucher, isApplying }: CheckoutVoucherSectionProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [code, setCode] = useState('')
  const titleId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!sheetOpen) return
    const t = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(t)
  }, [sheetOpen])

  const submit = async () => {
    const trimmed = code.trim()
    if (!trimmed) {
      toastError('Vui lòng nhập mã giảm giá.')
      return
    }
    try {
      await onApplyVoucher({ order_voucher_code: trimmed })
      setSheetOpen(false)
      setCode('')
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
              onClick={() => void submit()}
              disabled={isApplying}
              className="w-full rounded-xl bg-primary-600 py-3.5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-60"
            >
              {isApplying ? 'Đang áp dụng…' : 'Áp dụng'}
            </button>
          </div>
        }
      >
        <SingleVoucherSheetBody
          code={code}
          onCodeChange={setCode}
          inputRef={inputRef}
          isApplying={isApplying}
          onSubmit={() => void submit()}
        />
      </OfferSheet>
    </>
  )
}
