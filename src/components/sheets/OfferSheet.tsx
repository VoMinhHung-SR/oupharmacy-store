'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from '@/components/icons'

export interface OfferSheetProps {
  open: boolean
  onClose: () => void
  /** `useId()` from parent for `aria-labelledby`. */
  titleId: string
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  /**
   * `auto` — bottom on phone, centered dialog from `sm`.
   * `bottom` — always bottom sheet (good for dense filter UIs).
   */
  placement?: 'auto' | 'bottom'
  /** Extra classes on the dialog panel (size / rounding). */
  panelClassName?: string
  /** Extra classes on the fixed portal root (e.g. `lg:hidden`). */
  rootClassName?: string
}

/**
 * Bottom sheet / centered dialog — shell chung (nội dung qua `children`).
 */
export function OfferSheet({
  open,
  onClose,
  titleId,
  title,
  children,
  footer,
  placement = 'auto',
  panelClassName = '',
  rootClassName = '',
}: OfferSheetProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !mounted) return null

  const shellAlign =
    placement === 'bottom'
      ? 'fixed inset-0 z-[100] flex items-end justify-center'
      : 'fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4'

  const panelBase =
    placement === 'bottom'
      ? 'relative z-10 flex max-h-[min(92dvh,44rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl'
      : 'relative z-10 flex max-h-[min(90dvh,44rem)] w-full max-w-md flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl'

  return createPortal(
    <div className={`${shellAlign} ${rootClassName}`.trim()} role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        aria-label="Đóng"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${panelBase} ${panelClassName}`.trim()}
      >
        {placement === 'bottom' ? (
          <div className="flex shrink-0 justify-center pt-2" aria-hidden>
            <span className="h-1 w-10 rounded-full bg-slate-200" />
          </div>
        ) : null}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={titleId} className="text-base font-bold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            aria-label="Đóng"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
          {children}
        </div>
        {footer != null ? <div className="shrink-0">{footer}</div> : null}
      </div>
    </div>,
    document.body
  )
}
