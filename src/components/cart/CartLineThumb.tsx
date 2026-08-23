'use client'

import React from 'react'
import Image from 'next/image'
import { ImagePlaceholderIcon } from '@/components/icons'

type CartLineThumbProps = {
  src?: string | null
  alt: string
  size?: 'sm' | 'md'
  /** Native <img> when the URL may be outside next/image remotePatterns. */
  native?: boolean
}

const SIZE = {
  sm: {
    box: 'h-16 w-16 p-1.5 sm:h-[4.25rem] sm:w-[4.25rem] sm:p-2',
    px: 60,
  },
  md: {
    box: 'h-[4.25rem] w-[4.25rem] p-2',
    px: 56,
  },
} as const

/** Bordered product thumb with inner padding (cart line items). */
export function CartLineThumb({ src, alt, size = 'sm', native = false }: CartLineThumbProps) {
  const s = SIZE[size]
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white ${s.box}`}
    >
      {src ? (
        native ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            width={s.px}
            height={s.px}
            className="h-full w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={s.px}
            height={s.px}
            className="h-full w-full object-contain"
          />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-400">
          <ImagePlaceholderIcon className="h-6 w-6" />
        </div>
      )}
    </div>
  )
}

export default CartLineThumb
