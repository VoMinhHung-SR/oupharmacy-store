'use client'

import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'

export const CAROUSEL_ARROW_BASE_CLASS =
  'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/45 px-3 py-2 text-xl leading-none text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

export const CAROUSEL_MERCH_RAIL_ARROW_CLASS =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-primary-600 shadow-[0_2px_8px_rgba(15,23,42,0.12)] transition-[box-shadow,background-color] hover:bg-white hover:shadow-[0_4px_12px_rgba(15,23,42,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:h-9 sm:w-9'

type CarouselArrowVariant = 'overlay' | 'merchRail'

type CarouselArrowButtonProps = {
  direction: 'prev' | 'next'
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: CarouselArrowVariant
  zClassName?: string
  className?: string
}

export function CarouselArrowButton({
  direction,
  label,
  onClick,
  variant = 'overlay',
  zClassName = 'z-20',
  className = '',
}: CarouselArrowButtonProps) {
  if (variant === 'merchRail') {
    const sideClass =
      direction === 'prev'
        ? 'absolute top-1/2 left-0 z-20 -translate-x-1/2 -translate-y-1/2'
        : 'absolute top-1/2 right-0 z-20 translate-x-1/2 -translate-y-1/2'

    const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon

    return (
      <button
        type="button"
        aria-label={label}
        className={`${CAROUSEL_MERCH_RAIL_ARROW_CLASS} ${sideClass} ${className}`.trim()}
        onClick={onClick}
      >
        <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
      </button>
    )
  }

  const sideClass = direction === 'prev' ? 'left-2 sm:left-3' : 'right-2 sm:right-3'

  return (
    <button
      type="button"
      aria-label={label}
      className={`${CAROUSEL_ARROW_BASE_CLASS} ${zClassName} ${sideClass} ${className}`.trim()}
      onClick={onClick}
    >
      {direction === 'prev' ? '‹' : '›'}
    </button>
  )
}
