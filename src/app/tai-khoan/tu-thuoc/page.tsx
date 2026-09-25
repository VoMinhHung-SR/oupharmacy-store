'use client'

import React, { Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountHubSkeleton } from '@/components/skeletons'
import { CabinetWorkspace } from '@/components/cabinet/CabinetWorkspace'

function CabinetPageBody() {
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const returnUrl = React.useMemo(() => {
    const qs = searchParams.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }, [pathname, searchParams])

  React.useEffect(() => {
    if (!loading && !isAuthenticated && !isOpen) {
      openModal(returnUrl)
    }
  }, [isAuthenticated, loading, openModal, isOpen, returnUrl])

  if (loading) {
    return (
      <AccountPageShell>
        <AccountHubSkeleton />
      </AccountPageShell>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AccountPageShell>
      <CabinetWorkspace />
    </AccountPageShell>
  )
}

export default function SmartMedicineCabinetPage() {
  return (
    <Suspense
      fallback={
        <AccountPageShell>
          <AccountHubSkeleton />
        </AccountPageShell>
      }
    >
      <CabinetPageBody />
    </Suspense>
  )
}
