'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AccountHubSkeleton } from '@/components/skeletons'
import { MedicationReminderWorkspace } from '@/components/cabinet/MedicationReminderWorkspace'
import { STORE_SUPPORT } from '@/lib/constant'

export default function MedicationReminderPage() {
  const { isAuthenticated, loading } = useAuth()
  const { openModal, isOpen } = useLoginModal()

  React.useEffect(() => {
    if (!loading && !isAuthenticated && !isOpen) {
      openModal(STORE_SUPPORT.MED_REMINDER_HREF)
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
      <MedicationReminderWorkspace />
    </AccountPageShell>
  )
}
