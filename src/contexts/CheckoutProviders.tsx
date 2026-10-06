'use client'

import { CheckoutProvider } from '@/contexts/CheckoutContext'

export function CheckoutProviders({ children }: { children: React.ReactNode }) {
  return <CheckoutProvider>{children}</CheckoutProvider>
}
