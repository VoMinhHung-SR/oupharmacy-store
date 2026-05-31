/** PDP top row: country badge, wishlist, share — shared height. */
export const PDP_HEADER_CONTROL_HEIGHT = 'h-8'

export const pdpHeaderIconButtonClass = [
  'inline-flex shrink-0 items-center justify-center',
  PDP_HEADER_CONTROL_HEIGHT,
  'w-8 rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50',
].join(' ')

export const pdpHeaderTextButtonClass = [
  'inline-flex shrink-0 items-center gap-1.5',
  PDP_HEADER_CONTROL_HEIGHT,
  'rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-600 transition-colors hover:bg-gray-50',
].join(' ')
