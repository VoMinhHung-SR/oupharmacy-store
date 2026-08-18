import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Tủ thuốc thông minh',
}

export default function CabinetAccountLayout({ children }: { children: ReactNode }) {
  return children
}
