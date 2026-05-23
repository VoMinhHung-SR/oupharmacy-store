'use client'

/**
 * Checkout allows guest (cart-first) and authenticated users.
 * Do not wrap with ProtectedRoute — guest uses X-Guest-Session + server cart.
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
