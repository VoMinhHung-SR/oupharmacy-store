/** Shared corner tab geometry for product card overlays (country, promo). */

export const CARD_CORNER_TAB_Z = 'z-10'

/** Flush with card border; does not block link clicks. */
export const CARD_CORNER_TAB_POINTER = 'pointer-events-none'

const CORNER_TAB_SHADOW = 'shadow-sm'

/** Top-left tab (country badge). */
export const CARD_CORNER_TAB_LEFT_POSITION = 'absolute -left-4 -top-4'

export const CARD_CORNER_TAB_LEFT_SHAPE =
  'rounded-tl-lg rounded-br-md border border-gray-200 border-l-0 border-t-0'

export const CARD_CORNER_TAB_RIGHT_POSITION = 'absolute -right-4 -top-4'

export const CARD_CORNER_TAB_RIGHT_SHAPE =
  'rounded-tr-lg rounded-bl-md border border-red-500/30 border-r-0 border-t-0'

export const cardCornerTabLeftOverlayClass = [
  CARD_CORNER_TAB_POINTER,
  CARD_CORNER_TAB_Z,
  CARD_CORNER_TAB_LEFT_POSITION,
  'max-w-[calc(100%+1rem)]',
].join(' ')

export const CARD_CORNER_TAB_IMAGE_CLEARANCE = 'mt-5'

export const cardCornerTabRightPromoClass = [
  CARD_CORNER_TAB_POINTER,
  CARD_CORNER_TAB_Z,
  CARD_CORNER_TAB_RIGHT_POSITION,
  CARD_CORNER_TAB_RIGHT_SHAPE,
  CORNER_TAB_SHADOW,
  'bg-red-500 px-2.5 py-1.5 text-xs font-bold leading-none text-white',
].join(' ')
