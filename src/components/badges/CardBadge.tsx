import { CountryFlagIcon } from '@/components/badges/CountryFlagIcon'
import { CARD_CORNER_TAB_POINTER } from '@/components/badges/cardCornerStyles'
import { PDP_HEADER_CONTROL_HEIGHT } from '@/components/badges/pdpHeaderStyles'
import { resolveCountryBadge } from '@/lib/utils/countryBadge'

type CardBadgeProps = {
  country?: string | null
  variant?: 'corner' | 'pdp' | 'inline'
  className?: string
}

const VARIANT_CLASS: Record<NonNullable<CardBadgeProps['variant']>, string> = {
  /** Shape/position come from `cardCornerTabLeftOverlayClass` on ProductCard. */
  corner: CARD_CORNER_TAB_POINTER,
  pdp: [
    PDP_HEADER_CONTROL_HEIGHT,
    'gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-700',
  ].join(' '),
  inline: 'rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-[11px] shadow-sm',
}

/**
 * Origin pill for product cards — flag + country label.
 * Corner variant: flush top-left, same chrome geometry as discount badge.
 */
export function CardBadge({ country, variant = 'inline', className = '' }: CardBadgeProps) {
  const resolved = resolveCountryBadge(country)
  if (!resolved) return null

  const { label, isoCode } = resolved

  return (
    <span
      title={label}
      className={`inline-flex max-w-full items-center font-medium leading-none text-gray-800 ${
        variant === 'pdp' ? 'bg-gray-50' : variant === 'corner' ? '' : 'bg-gray-100'
      } ${VARIANT_CLASS[variant]} ${className}`.trim()}
    >
      {isoCode ? (
        <CountryFlagIcon
          isoCode={isoCode}
          label={label}
          className={variant === 'pdp' ? '!h-4 !w-4' : undefined}
        />
      ) : null}
      <span className="truncate">{label}</span>
    </span>
  )
}
