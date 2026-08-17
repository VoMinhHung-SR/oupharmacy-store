import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Tủ thuốc thông minh',
}

export default function CabinetLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[calc(100vh-14rem)] bg-white">{children}</div>
}
