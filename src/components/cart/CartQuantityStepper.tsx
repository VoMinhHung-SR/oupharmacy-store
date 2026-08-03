'use client'

import React from 'react'
import { MinusIcon, PlusIcon } from '@/components/icons'

type CartQuantityStepperProps = {
  qty: number
  onDec: () => void
  onInc: () => void
  disableDec?: boolean
  disabled?: boolean
}

/** Pill quantity control — shared shape with CartUnitSelect trigger. */
export function CartQuantityStepper({
  qty,
  onDec,
  onInc,
  disableDec = false,
  disabled = false,
}: CartQuantityStepperProps) {
  return (
    <div className="inline-flex h-9 items-stretch overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onDec}
        disabled={disableDec || disabled}
        className="flex w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Giảm số lượng"
      >
        <MinusIcon />
      </button>
      <span className="flex min-w-[2.25rem] select-none items-center justify-center px-1 text-center text-sm font-semibold tabular-nums text-slate-800">
        {qty}
      </span>
      <button
        type="button"
        onClick={onInc}
        disabled={disabled}
        className="flex w-9 items-center justify-center text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Tăng số lượng"
      >
        <PlusIcon />
      </button>
    </div>
  )
}

export default CartQuantityStepper
