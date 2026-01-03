'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface LoginModalContextValue {
  isOpen: boolean
  returnUrl: string | null
  openModal: (returnUrl?: string) => void
  closeModal: () => void
}

const LoginModalContext = createContext<LoginModalContextValue | undefined>(undefined)

export const LoginModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [returnUrl, setReturnUrl] = useState<string | null>(null)

  const openModal = useCallback((url?: string) => {
    setReturnUrl(url || null)
    setIsOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setReturnUrl(null)
  }, [])

  return (
    <LoginModalContext.Provider value={{ isOpen, returnUrl, openModal, closeModal }}>
      {children}
    </LoginModalContext.Provider>
  )
}

export const useLoginModal = () => {
  const context = useContext(LoginModalContext)
  if (context === undefined) {
    throw new Error('useLoginModal must be used within a LoginModalProvider')
  }
  return context
}
