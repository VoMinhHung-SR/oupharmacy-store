'use client'

import React from 'react'
import { BackdropLoading } from '@/components/BackdropLoading'
import { ChevronDoubleDownIcon } from '@/components/icons'

interface LoadMoreProductsButtonProps {
  remainingCount: number
  onLoadMore: () => void
  loading?: boolean
  className?: string
}

/** Compact inline “Xem thêm N sản phẩm” (no flex column). */
export function LoadMoreProductsButton({
  remainingCount,
  onLoadMore,
  loading = false,
  className = '',
}: LoadMoreProductsButtonProps) {
  if (remainingCount <= 0) return null

  return (
    <>
      <BackdropLoading
        isOpen={loading}
        loadingText="Đang tải thêm sản phẩm…"
        size="md"
        lockScroll={false}
        opacity={0.45}
      />
      <div className={`mt-5 text-center ${className}`.trim()}>
        <button
          type="button"
          onClick={onLoadMore}
          disabled={loading}
          className="inline text-xs font-medium text-primary-700 underline-offset-2 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 sm:text-sm"
        >
          <ChevronDoubleDownIcon
            className="mr-1 inline-block h-3.5 w-3.5 align-[-0.125em] text-primary-600"
            aria-hidden
          />
          {loading
            ? 'Đang tải…'
            : `Xem thêm ${remainingCount.toLocaleString('vi-VN')} sản phẩm`}
        </button>
      </div>
    </>
  )
}
