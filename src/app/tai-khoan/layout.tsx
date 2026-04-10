import type { ReactNode } from 'react'

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[calc(100vh-14rem)] bg-white">{children}</div>
}
