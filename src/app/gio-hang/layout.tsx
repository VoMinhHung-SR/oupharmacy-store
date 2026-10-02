import type { Metadata } from 'next'
import { CheckoutProviders } from '@/contexts/CheckoutProviders'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Giỏ hàng',
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <CheckoutProviders>{children}</CheckoutProviders>
}
