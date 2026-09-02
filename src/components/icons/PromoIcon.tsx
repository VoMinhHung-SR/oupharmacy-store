import React from 'react'
import Image from 'next/image'

type PromoIconSize = 'sm' | 'md' | 'lg'
type PromoIconTone = 'brand' | 'soft' | 'muted'

interface PromoIconProps {
  size?: PromoIconSize
  tone?: PromoIconTone
  className?: string
}

const SIZE: Record<PromoIconSize, { tag: number; tagClass: string; box: string; radius: string }> = {
  sm: { tag: 18, tagClass: 'h-[1.125rem] w-[1.125rem]', box: 'h-5 w-5', radius: 'rounded' },
  md: { tag: 20, tagClass: 'h-5 w-5', box: 'h-8 w-8', radius: 'rounded-md' },
  lg: { tag: 24, tagClass: 'h-6 w-6', box: 'h-10 w-10', radius: 'rounded-lg' },
}

const TONE_BOX: Record<PromoIconTone, string> = {
  brand: '',
  soft: 'bg-primary-50',
  muted: 'bg-slate-100',
}

const PROMO_TAG_SRC = '/icons/promo-tag.png'

/** Catalog / cart direct-discount promo badge — reuse across line items, PDP, voucher sheet. */
export function PromoIcon({
  size = 'sm',
  tone = 'brand',
  className = '',
}: PromoIconProps) {
  const s = SIZE[size]
  const boxed = tone !== 'brand'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${boxed ? `${s.box} ${s.radius} ${TONE_BOX[tone]}` : ''} ${className}`.trim()}
      aria-hidden
    >
      <Image
        src={PROMO_TAG_SRC}
        alt=""
        width={s.tag}
        height={s.tag}
        className={`${s.tagClass} object-contain`}
      />
    </span>
  )
}
