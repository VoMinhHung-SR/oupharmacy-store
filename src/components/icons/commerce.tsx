import { createOutlineIcon } from './createOutlineIcon'

export const CartIcon = createOutlineIcon('shopping-bag', ['M6.331 8H17.67a2 2 0 0 1 1.977 2.304l-1.255 8.152A3 3 0 0 1 15.426 21H8.574a3 3 0 0 1-2.965-2.544l-1.255-8.152A2 2 0 0 1 6.331 8', 'M9 11V6a3 3 0 0 1 6 0v5'], { className: 'w-6 h-6', strokeWidth: 2 })

export const ImagePlaceholderIcon = createOutlineIcon('photo', ['M15 8h.01M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z', 'm3 16l5-5c.928-.893 2.072-.893 3 0l5 5', 'm14 14l1-1c.928-.893 2.072-.893 3 0l3 3'], { className: 'w-6 h-6', strokeWidth: 2 })

export const CreditCardIcon = createOutlineIcon('credit-card', ['M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zm0 2h18M7 15h.01M11 15h2'], { className: 'w-6 h-6', strokeWidth: 2 })

export const OrderIcon = createOutlineIcon('package', ['m12 3l8 4.5v9L12 21l-8-4.5v-9zm0 9l8-4.5M12 12v9m0-9L4 7.5m12-2.25l-8 4.5'], { className: 'w-6 h-6', strokeWidth: 2 })

/** Alias for category default / packaging — same package glyph. */
export const PackageIcon = OrderIcon

export const TrashIcon = createOutlineIcon('trash', ['M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3'], { className: 'w-6 h-6', strokeWidth: 2 })

export const PercentInCircleIcon = createOutlineIcon('circle-percentage', ['M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0m6 3.075l6-6m-6 .03v.015m6 6v.015'], { className: 'h-5 w-5', strokeWidth: 2 })

export const TicketIcon = createOutlineIcon(
  'ticket',
  ['M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2'],
  { className: 'h-5 w-5', strokeWidth: 2 },
)

/** Coupon ticket with percent mark — used by PromoIcon. */
export const TicketPercentIcon = createOutlineIcon(
  'ticket-percent',
  [
    'M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Zm7 0h.01M15 9l-6 6m6 0h.01',
  ],
  { className: 'h-5 w-5', strokeWidth: 2 },
)

/** Alias — promo / voucher coupon. */
export const CouponIcon = TicketPercentIcon

export const DiscountIcon = createOutlineIcon(
  'discount',
  ['m9 15l6-6', 'M9 9.5a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0m5 5a.5.5 0 1 0 1 0a.5.5 0 1 0-1 0', 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0'],
  { className: 'h-5 w-5', strokeWidth: 2 },
)

export const ReceiptRefundIcon = createOutlineIcon(
  'receipt-refund',
  ['M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2l-2 2l-2-2l-2 2l-2-2z', 'M15 14v-2a2 2 0 0 0-2-2H9l2-2m0 4l-2-2'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const ArrowsExchangeIcon = createOutlineIcon(
  'arrows-exchange',
  ['M7 10h14l-4-4m0 8H3l4 4'],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const TruckDeliveryIcon = createOutlineIcon(
  'truck-delivery',
  [
    'M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0m10 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
    'M5 17H3v-4M2 5h11v12m-4 0h6m4 0h2v-6h-8m0-5h5l3 5M3 9h4',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)

export const PackageExportIcon = createOutlineIcon(
  'package-export',
  [
    'm12 21l-8-4.5v-9L12 3l8 4.5V12m-8 0l8-4.5M12 12v9m0-9L4 7.5M15 18h7m-3-3l3 3l-3 3',
  ],
  { className: 'w-6 h-6', strokeWidth: 2 },
)
