'use client'

import React from 'react'

/** Shared hero / rail carousel arrow — frosted circle (CampaignHeroSlot SoT). */
export const CAROUSEL_ARROW_BASE_CLASS =
  'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/45 px-3 py-2 text-xl leading-none text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'

type CarouselArrowButtonProps = {
  direction: 'prev' | 'next'
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Stacking — hero cluster secondary uses z-30 over layered banners. */
  zClassName?: string
  className?: string
}

export function CarouselArrowButton({
  direction,
  label,
  onClick,
  zClassName = 'z-20',
  className = '',
}: CarouselArrowButtonProps) {
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
