import { CountryFlagIcon } from '@/components/badges/CountryFlagIcon'
import { CARD_CORNER_TAB_LEFT_SHAPE, CARD_CORNER_TAB_POINTER } from '@/components/badges/cardCornerStyles'
import { PDP_HEADER_CONTROL_HEIGHT } from '@/components/badges/pdpHeaderStyles'
import { resolveCountryBadge } from '@/lib/utils/countryBadge'

type CardBadgeProps = {
  country?: string | null
  variant?: 'corner' | 'pdp' | 'inline'
  className?: string
}

const VARIANT_CLASS: Record<NonNullable<CardBadgeProps['variant']>, string> = {
  corner: [
    CARD_CORNER_TAB_POINTER,
    CARD_CORNER_TAB_LEFT_SHAPE,
    'min-h-[22px] gap-1.5 px-2.5 py-1.5 shadow-sm',
  ].join(' '),
  pdp: [
    PDP_HEADER_CONTROL_HEIGHT,
    'gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-700',
  ].join(' '),
  inline: 'rounded-md px-2 py-1 shadow-sm',
}

/**
 * Origin pill for product cards — rounded border, optional flag + country label.
 */
export function CardBadge({ country, variant = 'inline', className = '' }: CardBadgeProps) {
  const resolved = resolveCountryBadge(country)
  if (!resolved) return null

  const { label, isoCode } = resolved

  return (
    <span
      title={label}
      className={`inline-flex max-w-full items-center border border-gray-200 font-medium leading-none text-gray-800 ${
        variant === 'pdp' ? 'bg-gray-50' : 'bg-gray-100 text-[11px]'
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
