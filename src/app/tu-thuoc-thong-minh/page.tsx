'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountHubSkeleton } from '@/components/skeletons'
import { CabinetWorkspace } from '@/components/cabinet/CabinetWorkspace'

export default function SmartMedicineCabinetPage() {
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()

  React.useEffect(() => {
    if (!loading && !isAuthenticated && !isOpen) {
      openModal('/tu-thuoc-thong-minh')
    }
  }, [isAuthenticated, loading, openModal, isOpen])

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
