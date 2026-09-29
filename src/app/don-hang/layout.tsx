import type { Metadata } from 'next'

/**
 * Checkout allows guest (cart-first) and authenticated users.
 * Do not wrap with ProtectedRoute — guest uses X-Guest-Session + server cart.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Thanh toán',
}

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
