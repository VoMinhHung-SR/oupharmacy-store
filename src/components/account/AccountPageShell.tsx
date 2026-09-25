import React from 'react'
import { PageShell } from '@/components/layout/PageShell'

interface AccountPageShellProps {
  children: React.ReactNode
}

export function AccountPageShell({ children }: AccountPageShellProps) {
  return <PageShell innerClassName="sm:space-y-5">{children}</PageShell>
}
