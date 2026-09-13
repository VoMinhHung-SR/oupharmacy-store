'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface ConsultUiContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
}

const ConsultUiContext = createContext<ConsultUiContextValue | undefined>(undefined)

export const ConsultUiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

  return <ConsultUiContext.Provider value={value}>{children}</ConsultUiContext.Provider>
}

export function useConsultUi() {
  const ctx = useContext(ConsultUiContext)
  if (!ctx) {
    throw new Error('useConsultUi must be used within a ConsultUiProvider')
  }
  return ctx
}
