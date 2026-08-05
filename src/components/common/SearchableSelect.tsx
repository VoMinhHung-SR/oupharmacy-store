'use client'

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDownIcon, ChevronUpIcon, SearchIcon, XIcon } from '@/components/icons'

export type SearchableSelectOption = {
  value: string
  label: string
}

export interface SearchableSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: SearchableSelectOption[]
  /** Trigger placeholder when nothing selected. */
  placeholder: string
  /** Search input placeholder. */
  searchPlaceholder: string
  /** Full-screen sheet title (phone / tablet). */
  title: string
  disabled?: boolean
  error?: boolean
  helperText?: React.ReactNode
  emptyMessage?: string
  className?: string
}

function normalizeSearch(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Tailwind `xl` — matches checkout / cart desktop breakpoint. */
const DESKTOP_MQ = '(min-width: 1280px)'

/**
 * Searchable select: bottom sheet below `xl`, portaled popover from `xl`
 * (avoids parent overflow clipping).
 */
export function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  title,
  disabled = false,
  error = false,
  helperText,
  emptyMessage = 'Không tìm thấy kết quả',
  className = '',
}: SearchableSelectProps) {
  const autoId = useId()
  const inputId = id || autoId
  const titleId = `${inputId}-title`
  const listId = `${inputId}-list`
  const searchId = `${inputId}-search`

  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isDesktop, setIsDesktop] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties | null>(null)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia(DESKTOP_MQ)
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useLayoutEffect(() => {
    if (!open || !isDesktop) {
      setPanelStyle(null)
      return
    }
    const place = () => {
      const el = rootRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const gap = 6
      const maxH = Math.min(320, Math.max(160, window.innerHeight - rect.bottom - gap - 16))
      setPanelStyle({
        position: 'fixed',
        top: rect.bottom + gap,
        left: rect.left,
        width: rect.width,
        maxHeight: maxH,
        zIndex: 120,
      })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open, isDesktop])

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const t = window.setTimeout(() => searchRef.current?.focus(), 40)
    return () => window.clearTimeout(t)
  }, [open])

  useEffect(() => {
    if (!open || isDesktop) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, isDesktop])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open || !isDesktop) return
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node
      if (rootRef.current?.contains(t) || panelRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [open, isDesktop])

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? '',
    [options, value]
  )

  const filtered = useMemo(() => {
    const q = normalizeSearch(query)
    if (!q) return options
    return options.filter((o) => normalizeSearch(o.label).includes(q))
  }, [options, query])

  const close = () => setOpen(false)

  const pick = (next: string) => {
    onChange(next)
    setOpen(false)
  }

  const triggerClass = [
    'flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 py-3 text-left text-sm transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
    open && isDesktop ? 'border-primary-500 ring-2 ring-primary-500' : '',
    error ? 'border-red-300 focus:ring-red-500' : 'border-slate-200',
    disabled ? 'cursor-not-allowed bg-slate-50 text-slate-500' : 'text-slate-900',
    !selectedLabel && !disabled ? 'text-slate-400' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const searchField = (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={searchRef}
        id={searchId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        autoComplete="off"
        className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30"
      />
    </div>
  )

  const optionList = (
    <ul id={listId} role="listbox" aria-labelledby={inputId} className="py-1">
      {filtered.length === 0 ? (
        <li className="px-4 py-6 text-center text-sm text-slate-500">{emptyMessage}</li>
      ) : (
        filtered.map((opt) => {
          const active = opt.value === value
          return (
            <li key={opt.value} role="option" aria-selected={active}>
              <button
                type="button"
                onClick={() => pick(opt.value)}
                className={[
                  'flex w-full items-center px-4 py-3 text-left text-sm transition-colors',
                  active
                    ? 'bg-primary-50 font-medium text-primary-800'
                    : 'text-slate-900 hover:bg-slate-50',
                ].join(' ')}
              >
                {opt.label}
              </button>
            </li>
          )
        })
      )}
    </ul>
  )

  const mobileSheet =
    mounted && open && !isDesktop
      ? createPortal(
          <div className="fixed inset-0 z-[110] flex items-end justify-center" role="presentation">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
              aria-label="Đóng"
              onClick={close}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 flex h-[90dvh] max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl"
            >
              <div className="relative flex shrink-0 items-center justify-center border-b border-slate-100 px-12 py-3.5">
                <h2 id={titleId} className="text-center text-base font-bold text-slate-900">
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Đóng"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="shrink-0 px-4 pb-2 pt-3">{searchField}</div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)]">
                {optionList}
              </div>
            </div>
          </div>,
          document.body
        )
      : null

  const desktopPopover =
    mounted && open && isDesktop && panelStyle
      ? createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
            role="listbox"
          >
            <div className="shrink-0 border-b border-slate-100 p-3">{searchField}</div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{optionList}</div>
          </div>,
          document.body
        )
      : null

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        id={inputId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          if (!disabled) setOpen((v) => !v)
        }}
        className={triggerClass}
      >
        <span className="min-w-0 flex-1 truncate">{selectedLabel || placeholder}</span>
        {open && isDesktop ? (
          <ChevronUpIcon className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronDownIcon className="h-4 w-4 shrink-0 text-slate-500" />
        )}
      </button>

      {helperText ? (
        <p className={`mt-1.5 text-xs ${error ? 'text-red-600' : 'text-slate-500'}`}>{helperText}</p>
      ) : null}

      {desktopPopover}
      {mobileSheet}
    </div>
  )
}

export default SearchableSelect
