'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'
import { AccountPageHeader } from '@/components/account/AccountPageHeader'
import { AccountPageShell } from '@/components/account/AccountPageShell'
import { AddressBook } from '@/components/account/AddressBook'

export default function AddressesPage() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { openModal, isOpen } = useLoginModal()

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isOpen) {
      openModal('/tai-khoan/dia-chi')
    }
  }, [isAuthenticated, authLoading, openModal, isOpen])

  if (!isAuthenticated) return null

  return (
    <AccountPageShell>
      <div className="space-y-4">
        <AccountPageHeader
          title="Sổ địa chỉ"
          subtitle="Địa chỉ mặc định sẽ được điền sẵn khi thanh toán."
        />
        <AddressBook />
      </div>
    </AccountPageShell>
  )
}
