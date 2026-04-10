import React from 'react'
import { Container } from '@/components/Container'

interface AccountPageShellProps {
  children: React.ReactNode
}

export function AccountPageShell({ children }: AccountPageShellProps) {
  return (
    <Container className="py-6">
      <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
    </Container>
  )
}
