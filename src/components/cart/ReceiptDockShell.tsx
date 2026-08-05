'use client'

import React, { type ReactNode, type Ref } from 'react'
import { CartReceiptCard } from '@/components/cart/CartReceiptCard'
import { ChevronDownIcon, ChevronUpIcon } from '@/components/icons'

type ReceiptDockShellProps = {
  dockRef: Ref<HTMLDivElement>
  children: ReactNode
}

/** Fixed bottom receipt chrome (phone / tablet). */
export function ReceiptDockShell({ dockRef, children }: ReceiptDockShellProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 xl:hidden">
      <div ref={dockRef} className="pointer-events-auto w-full">
        <CartReceiptCard showScallop={false} className="rounded-none shadow-none">
          {children}
        </CartReceiptCard>
      </div>
    </div>
  )
}

type ReceiptDockTotalRowProps = {
  totalDisplay: string
  expanded: boolean
  onToggleExpand: () => void
  action: ReactNode
}

/** Collapsible “Thành tiền” + primary CTA used by cart/checkout docks. */
export function ReceiptDockTotalRow({
  totalDisplay,
  expanded,
  onToggleExpand,
  action,
}: ReceiptDockTotalRowProps) {
  return (
    <div className="mt-1 flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleExpand}
        className="min-w-0 flex-1 text-left"
        aria-expanded={expanded}
      >
        <p className="text-[11px] text-slate-500">Thành tiền</p>
        <span className="inline-flex items-center gap-1">
          <span className="truncate text-lg font-bold leading-tight text-primary-700">
            {totalDisplay}
          </span>
          {expanded ? (
            <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-700" />
          ) : (
            <ChevronUpIcon className="h-4 w-4 shrink-0 text-slate-700" />
          )}
        </span>
      </button>
      {action}
    </div>
  )
}
