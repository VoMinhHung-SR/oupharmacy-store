'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
