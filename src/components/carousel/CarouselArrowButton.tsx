'use client'

import React from 'react'

/** Shared homepage carousel arrow — frosted circle (CampaignHeroSlot SoT). */
export const CAROUSEL_ARROW_BASE_CLASS =
  'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/45 px-3 py-2 text-xl leading-none text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

/** Hot-sale / flash-sale rails — flanked outside product track, with border. */
export const CAROUSEL_MERCH_RAIL_ARROW_CLASS =
  'inline-flex shrink-0 items-center justify-center rounded-full border border-white/90 bg-white/95 px-2.5 py-1.5 text-lg leading-none text-slate-800 shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

type CarouselArrowVariant = 'overlay' | 'merchRail'

type CarouselArrowButtonProps = {
  direction: 'prev' | 'next'
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  variant?: CarouselArrowVariant
  /** Stacking — hero cluster secondary uses z-30 over layered banners. */
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

    return (
      <button
        type="button"
        aria-label={label}
        className={`${CAROUSEL_MERCH_RAIL_ARROW_CLASS} ${sideClass} ${className}`.trim()}
        onClick={onClick}
      >
        {direction === 'prev' ? '‹' : '›'}
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
