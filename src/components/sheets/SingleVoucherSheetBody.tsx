'use client'

import React, { type Ref } from 'react'
import { EmptyOfferIllustration } from '@/components/icons'

export interface SingleVoucherSheetBodyProps {
  code: string
  onCodeChange: (value: string) => void
  inputRef?: Ref<HTMLInputElement>
  isApplying: boolean
  onSubmit: () => void | Promise<void>
  placeholder?: string
  emptyHint?: string
}

export function SingleVoucherSheetBody({
  code,
  onCodeChange,
  inputRef,
  isApplying,
  onSubmit,
  placeholder = 'Nhập mã giảm giá',
  emptyHint = 'Nhập mã giảm giá để được áp dụng những ưu đãi',
}: SingleVoucherSheetBodyProps) {
  return (
    <div className="space-y-4 px-5 py-4">
      <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void onSubmit()
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          disabled={isApplying}
          onClick={() => void onSubmit()}
          className="shrink-0 border-l border-slate-200 bg-primary-50 px-4 text-sm font-semibold text-primary-800 transition-colors hover:bg-primary-100 disabled:opacity-50"
        >
          Xác nhận
        </button>
      </div>

      <div className="flex flex-col items-center rounded-xl bg-slate-50 py-8 text-center">
        <EmptyOfferIllustration className="mb-4 h-24 w-24 text-slate-300" />
        <p className="max-w-[16rem] text-sm text-slate-500">{emptyHint}</p>
      </div>
    </div>
  )
}
