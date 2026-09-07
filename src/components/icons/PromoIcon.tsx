import React from 'react'
import { TicketPercentIcon } from './commerce'

type PromoIconSize = 'sm' | 'md' | 'lg'
type PromoIconTone = 'brand' | 'soft' | 'muted'

interface PromoIconProps {
  size?: PromoIconSize
  tone?: PromoIconTone
  className?: string
}

/** Glyph size = wrapper size (no hollow soft box larger than the SVG). */
const ICON_SIZE: Record<PromoIconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const TONE_BOX: Record<PromoIconTone, string> = {
  brand: '',
  soft: 'rounded bg-primary-50 p-0.5',
  muted: 'rounded bg-slate-100 p-0.5',
}

const TONE_ICON: Record<PromoIconTone, string> = {
  brand: 'text-primary-600',
  soft: 'text-primary-600',
  muted: 'text-slate-500',
}

/** Catalog / cart direct-discount promo badge. */
export function PromoIcon({
  size = 'sm',
  tone = 'brand',
  className = '',
}: PromoIconProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center leading-none ${TONE_BOX[tone]} ${className}`.trim()}
      aria-hidden
    >
      <TicketPercentIcon className={`${ICON_SIZE[size]} ${TONE_ICON[tone]}`} />
    </span>
  )
}
