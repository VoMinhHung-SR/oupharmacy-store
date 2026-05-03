"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CheckoutInformation {
  name: string
  phone: string
  email: string
  address: string
}

interface CheckoutContextValue {
  information: CheckoutInformation | null
  paymentMethodId: number | null
  notes: string
  setInformation: (info: CheckoutInformation) => void
  setPaymentMethodId: (id: number | null) => void
  setNotes: (notes: string) => void
  clear: () => void
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined)

const STORAGE_KEY = 'oupharmacy_checkout'

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [information, setInformationState] = useState<CheckoutInformation | null>(null)
  const [paymentMethodId, setPaymentMethodIdState] = useState<number | null>(null)
  const [notes, setNotesState] = useState<string>('')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.information) {
          setInformationState(parsed.information)
        }
        if (parsed.paymentMethodId) {
          setPaymentMethodIdState(parsed.paymentMethodId)
        }
        if (typeof parsed.notes === 'string') {
          setNotesState(parsed.notes)
        }
      }
    } catch {}
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      const data = {
        information,
        paymentMethodId,
        notes,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [information, paymentMethodId, notes])

  const setInformation = (info: CheckoutInformation) => {
    setInformationState(info)
  }

  const setPaymentMethodId = (id: number | null) => {
    setPaymentMethodIdState(id)
  }

  const setNotes = (nextNotes: string) => {
    setNotesState(nextNotes)
  }

  const clear = () => {
    setInformationState(null)
    setPaymentMethodIdState(null)
    setNotesState('')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const value = useMemo(
    () => ({
      information,
      paymentMethodId,
      notes,
      setInformation,
      setPaymentMethodId,
      setNotes,
      clear,
    }),
    [information, paymentMethodId, notes]
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}

