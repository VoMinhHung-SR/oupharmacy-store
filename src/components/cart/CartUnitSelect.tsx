'use client'

import React, { useEffect, useId, useRef, useState } from 'react'
import { CheckIcon, ChevronDownIcon } from '@/components/icons'

export type CartUnitSelectOption = {
  id: number
  unit_name: string
  price_value?: number
}

function formatMoney(n: number) {
  return `${Math.round(n).toLocaleString('vi-VN')}₫`
}

type CartUnitSelectProps = {
  value: number
  options: CartUnitSelectOption[]
  disabled?: boolean
  loading?: boolean
  onChange: (nextUnitId: number) => void
  className?: string
}

/** Circle-check — same language as `.cart-select-check` on cart lines. */
function UnitCircleCheck({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center self-center rounded-full border-[2.5px] transition-colors ${
        active ? 'border-primary-600 bg-primary-600 text-white' : 'border-slate-400 bg-white'
      }`}
      aria-hidden
    >
      {active ? <CheckIcon className="h-2.5 w-2.5" /> : null}
    </span>
  )
}

/**
 * Compact unit menu for cart lines.
 * Option row (ref image 4): [✓  Unit name ………………… Price]
 */
export function CartUnitSelect({
  value,
  options,
  disabled = false,
  loading = false,
  onChange,
  className = '',
}: CartUnitSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selected = options.find((o) => o.id === value) ?? options[0]
  const canOpen = !disabled && !loading && options.length > 1

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current
      if (!el || el.contains(e.target as Node)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (disabled || loading) setOpen(false)
  }, [disabled, loading])

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <button
        type="button"
        disabled={!canOpen && (disabled || loading || options.length <= 1)}
        onClick={() => {
          if (!canOpen) return
          setOpen((prev) => !prev)
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Đơn vị"
        aria-busy={loading || undefined}
        className={`inline-flex h-9 w-full min-w-[5.75rem] items-center justify-center gap-1.5 rounded-full border bg-white px-3 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 ${
          open
            ? 'border-primary-400 text-primary-800'
            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className="max-w-[5.5rem] truncate text-center">{selected?.unit_name || 'Đơn vị'}</span>
        {loading ? (
          <span
            className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-slate-300 border-t-primary-600"
            aria-hidden
          />
        ) : (
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
            size={14}
          />
        )}
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Chọn đơn vị"
          className="absolute right-0 z-30 mt-1.5 min-w-[14.5rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          {options.map((option) => {
            const isActive = option.id === value
            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setOpen(false)
                    if (option.id !== value) onChange(option.id)
                  }}
                  className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm leading-none transition-colors ${
                    isActive
                      ? 'bg-primary-50 font-medium text-primary-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <UnitCircleCheck active={isActive} />
                  <span className="min-w-0 flex-1 truncate leading-snug">{option.unit_name}</span>
                  {option.price_value != null && Number.isFinite(option.price_value) ? (
                    <span
                      className={`shrink-0 tabular-nums leading-snug ${
                        isActive ? 'text-primary-700' : 'text-slate-500'
                      }`}
                    >
                      {formatMoney(option.price_value)}
                    </span>
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export default CartUnitSelect
