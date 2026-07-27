'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CartIcon, ImagePlaceholderIcon, TrashIcon } from '@/components/icons'
import { useCart } from '@/contexts/CartContext'
import { formatVnd } from '@/lib/utils/currency'

const CLOSE_DELAY_MS = 120

export function HeaderCartDropdown() {
  const t = useTranslations('common')
  const { items, remove } = useCart()
  const [open, setOpen] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelId = useId()

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }, [clearCloseTimer])

  const openPanel = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  const count = items.length
  const badgeLabel = count > 99 ? '99+' : String(count)

  return (
    <div
      className="relative"
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
      onFocus={openPanel}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          scheduleClose()
        }
      }}
    >
      <Link
        href="/gio-hang"
        className="flex items-center gap-2 rounded-full bg-primary-700 px-2.5 py-2 text-sm font-medium text-white shadow-sm whitespace-nowrap sm:px-3"
        aria-label={t('cart')}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="relative inline-flex shrink-0">
          <CartIcon className="h-5 w-5" strokeWidth={2} />
          {count > 0 ? (
            <span
              className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent-500 px-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-primary-600"
              aria-hidden
            >
              {badgeLabel}
            </span>
          ) : null}
        </span>
        <span className="hidden sm:inline">{t('cart')}</span>
      </Link>

      {/* Desktop / tablet hover panel — mobile taps through to /gio-hang */}
      <div
        id={panelId}
        role="dialog"
        aria-label={t('cart')}
        className={`absolute right-0 top-full z-50 hidden w-[min(22rem,calc(100vw-1.5rem))] pt-2 md:block ${
          open ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white text-gray-900 shadow-xl">
          <div className="border-b border-gray-100 px-4 py-2.5">
            <p className="text-sm font-medium text-gray-500">{t('cart')}</p>
          </div>

          {count === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-500">Giỏ hàng trống</div>
          ) : (
            <ul className="max-h-[18rem] overflow-y-auto overscroll-contain py-1">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 border-b border-gray-50 px-4 py-3 last:border-b-0"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 ring-1 ring-gray-100">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <ImagePlaceholderIcon className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm leading-snug text-gray-900">{item.name}</p>
                    <div className="mt-1 flex items-end justify-between gap-2">
                      <p className="text-sm font-semibold text-primary-600">
                        {formatVnd(item.price, { symbol: 'đ' })}
                      </p>
                      <p className="shrink-0 text-xs text-gray-500">
                        x{item.qty}
                        {item.packaging ? ` ${item.packaging}` : ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      remove(item.id)
                    }}
                    className="mt-0.5 shrink-0 self-start rounded p-1 text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    aria-label={`Xóa ${item.name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/80 px-4 py-3">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{count}</span> sản phẩm
            </p>
            <Link
              href="/gio-hang"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary-600 px-4 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              onClick={() => setOpen(false)}
            >
              Xem giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
