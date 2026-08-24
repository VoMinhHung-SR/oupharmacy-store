/** Shared corner tab geometry for product card overlays (country, promo). */

export const CARD_CORNER_TAB_Z = 'z-10'

/** Flush with card border; does not block link clicks. */
export const CARD_CORNER_TAB_POINTER = 'pointer-events-none'

/** Top-left tab (country badge) — sits on outer wrapper (outside overflow-hidden card). */
export const CARD_CORNER_TAB_LEFT_POSITION = 'absolute -left-4 -top-4'

export const CARD_CORNER_TAB_LEFT_SHAPE =
  'rounded-tl-lg rounded-br-md border border-gray-200 border-l-0 border-t-0'

/**
 * Top-right discount: flush with card corner.
 * Parent card uses `overflow-hidden` so the tag clips cleanly (no 1px hairline).
 */
export const CARD_CORNER_TAB_RIGHT_POSITION = 'absolute right-0 top-0'

export const CARD_CORNER_TAB_RIGHT_SHAPE = 'rounded-bl-lg'

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
  'inline-flex min-h-[26px] min-w-[2.75rem] items-center justify-center bg-red-500 px-2 py-1 text-xs font-bold leading-none text-white sm:min-h-[28px] sm:px-2.5 sm:text-[13px]',
].join(' ')
