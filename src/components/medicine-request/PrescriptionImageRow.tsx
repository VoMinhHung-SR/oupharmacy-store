'use client'

import { useRef } from 'react'

type PrescriptionImageRowProps = {
  file: File | null
  previewUrl: string | null
  error?: string | null
  onPick: (file: File | null) => void
  className?: string
}

export function PrescriptionImageRow({
  file,
  previewUrl,
  error,
  onPick,
  className = '',
}: PrescriptionImageRowProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`.trim()}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:border-primary-300 hover:bg-primary-50/40 sm:gap-4 sm:px-5 sm:py-4"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-primary-700 sm:text-base">
            Đính ảnh đơn thuốc (không bắt buộc)
          </span>
          <span className="mt-0.5 block text-xs text-slate-500 sm:text-sm">
            {file ? file.name : 'JPEG, PNG, WEBP hoặc GIF — tối đa 5MB'}
          </span>
        </span>
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-lg font-medium leading-none text-primary-600 sm:h-9 sm:w-9 sm:text-xl"
          aria-hidden
        >
          +
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const next = e.target.files?.[0] || null
          onPick(next)
          e.target.value = ''
        }}
      />
      {previewUrl ? (
        <div className="flex items-start gap-3 border-t border-slate-100 px-4 py-3 sm:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Xem trước đơn thuốc" className="h-20 w-20 rounded-md object-cover" />
          <button
            type="button"
            className="text-sm font-medium text-primary-700 hover:underline"
            onClick={() => onPick(null)}
          >
            Xóa ảnh
          </button>
        </div>
      ) : null}
      {error ? <p className="px-4 pb-3 text-xs text-red-600 sm:px-5">{error}</p> : null}
    </div>
  )
}
