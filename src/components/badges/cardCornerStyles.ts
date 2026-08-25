/** Shared corner badge geometry for product cards (country left, discount right). */

export const CARD_CORNER_TAB_Z = 'z-10'

/** Flush with card; does not block link clicks. */
export const CARD_CORNER_TAB_POINTER = 'pointer-events-none'

/**
 * Shared chrome — same height/padding for country + discount.
 * Explicit rounded-none so only the inner corner is rounded (not a pill).
 */
const CORNER_BADGE_CHROME =
  'inline-flex min-h-[26px] items-center rounded-none px-2 py-1 text-xs font-bold leading-none sm:min-h-[28px] sm:px-2.5 sm:text-[13px]'

/** Country: flush top-left; mirror of discount (only bottom-right rounded). */
export const CARD_CORNER_TAB_LEFT_POSITION = 'absolute left-0 top-0'

export const CARD_CORNER_TAB_LEFT_SHAPE = 'rounded-br-lg'

/** Discount: flush top-right; only bottom-left rounded. */
export const CARD_CORNER_TAB_RIGHT_POSITION = 'absolute right-0 top-0'

export const CARD_CORNER_TAB_RIGHT_SHAPE = 'rounded-bl-lg'

export const cardCornerTabLeftOverlayClass = [
  CARD_CORNER_TAB_POINTER,
  CARD_CORNER_TAB_Z,
  CARD_CORNER_TAB_LEFT_POSITION,
  CARD_CORNER_TAB_LEFT_SHAPE,
  CORNER_BADGE_CHROME,
  'max-w-[calc(100%-3rem)] gap-1.5 border-0 bg-gray-100 font-medium text-gray-800',
].join(' ')

/** Push product image below corner badges. */
export const CARD_CORNER_TAB_IMAGE_CLEARANCE = 'mt-6'

export const cardCornerTabRightPromoClass = [
  CARD_CORNER_TAB_POINTER,
  CARD_CORNER_TAB_Z,
  CARD_CORNER_TAB_RIGHT_POSITION,
  CARD_CORNER_TAB_RIGHT_SHAPE,
  CORNER_BADGE_CHROME,
  'min-w-[2.75rem] justify-center bg-red-500 text-white',
].join(' ')
