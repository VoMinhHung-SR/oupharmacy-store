"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CheckoutInformation {
  name: string
  phone: string
  email: string
  address: string
  recipient_name?: string
  recipient_phone?: string
  province?: string
  district?: string
  ward?: string
}

interface CheckoutContextValue {
  information: CheckoutInformation | null
  paymentMethodId: number | null
  notes: string
  /** Cart line ids (server `CartItem.id` as string) to pay for; null = entire cart. */
  checkoutScopedLineIds: string[] | null
  setInformation: (info: CheckoutInformation) => void
  setPaymentMethodId: (id: number | null) => void
  setNotes: (notes: string) => void
  setCheckoutScopedLineIds: (ids: string[] | null) => void
  clear: () => void
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined)

const STORAGE_KEY = 'oupharmacy_checkout'

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [information, setInformationState] = useState<CheckoutInformation | null>(null)
  const [paymentMethodId, setPaymentMethodIdState] = useState<number | null>(null)
  const [notes, setNotesState] = useState<string>('')
  const [checkoutScopedLineIds, setCheckoutScopedLineIdsState] = useState<string[] | null>(null)

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
        if (
          parsed.checkoutScopedLineIds === null ||
          (Array.isArray(parsed.checkoutScopedLineIds) &&
            parsed.checkoutScopedLineIds.every((x: unknown) => typeof x === 'string'))
        ) {
          setCheckoutScopedLineIdsState(
            Array.isArray(parsed.checkoutScopedLineIds) ? parsed.checkoutScopedLineIds : null
          )
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
        checkoutScopedLineIds,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [information, paymentMethodId, notes, checkoutScopedLineIds])

  const setInformation = (info: CheckoutInformation) => {
    setInformationState(info)
  }

  const setPaymentMethodId = (id: number | null) => {
    setPaymentMethodIdState(id)
  }

  const setNotes = (nextNotes: string) => {
    setNotesState(nextNotes)
  }

  const setCheckoutScopedLineIds = (ids: string[] | null) => {
    setCheckoutScopedLineIdsState(ids)
  }

  const clear = () => {
    setInformationState(null)
    setPaymentMethodIdState(null)
    setNotesState('')
    setCheckoutScopedLineIdsState(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const value = useMemo(
    () => ({
      information,
      paymentMethodId,
      notes,
      checkoutScopedLineIds,
      setInformation,
      setPaymentMethodId,
      setNotes,
      setCheckoutScopedLineIds,
      clear,
    }),
    [information, paymentMethodId, notes, checkoutScopedLineIds]
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}

