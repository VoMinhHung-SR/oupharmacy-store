'use client'

import { useState } from 'react'
import { countryFlagSrc } from '@/lib/utils/countryBadge'

/** Uniform flag slot on product cards (1:1 SVG). */
export const FLAG_ICON_SIZE_CLASS = 'h-3.5 w-3.5'

export const FLAG_ICON_RING_CLASS = 'ring-1 ring-gray-200/90'

type CountryFlagIconProps = {
  isoCode: string
  label: string
  className?: string
}

/**
 * Flag from `public/flags/{iso}.svg`.
 * SVG assets should be img-safe (no `<marker>`; avoid complex xlink when possible).
 */
export function CountryFlagIcon({ isoCode, label, className = '' }: CountryFlagIconProps) {
  const [failed, setFailed] = useState(false)
  const code = isoCode.trim().toUpperCase()

  if (!failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- local SVG flags
      <img
        src={countryFlagSrc(code)}
        alt=""
        width={14}
        height={14}
        className={`block shrink-0 self-center rounded-[2px] object-cover ${FLAG_ICON_SIZE_CLASS} ${FLAG_ICON_RING_CLASS} ${className}`.trim()}
        loading="lazy"
        decoding="async"
        aria-hidden
        onError={() => setFailed(true)}
      />
    )
  }

  return null
}
