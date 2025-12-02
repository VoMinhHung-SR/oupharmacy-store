"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { CheckoutInformationFormData } from '@/lib/validations/checkout'

export interface CheckoutInformation {
  name: string
  phone: string
  email: string
  address: string
}

interface CheckoutContextValue {
  information: CheckoutInformation | null
  shippingMethodId: number | null
  paymentMethodId: number | null
  setInformation: (info: CheckoutInformation) => void
  setShippingMethodId: (id: number | null) => void
  setPaymentMethodId: (id: number | null) => void
  clear: () => void
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined)

const STORAGE_KEY = 'oupharmacy_checkout'

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [information, setInformationState] = useState<CheckoutInformation | null>(null)
  const [shippingMethodId, setShippingMethodIdState] = useState<number | null>(null)
  const [paymentMethodId, setPaymentMethodIdState] = useState<number | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.information) {
          setInformationState(parsed.information)
        }
        if (parsed.shippingMethodId) {
          setShippingMethodIdState(parsed.shippingMethodId)
        }
        if (parsed.paymentMethodId) {
          setPaymentMethodIdState(parsed.paymentMethodId)
        }
      }
    } catch {}
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      const data = {
        information,
        shippingMethodId,
        paymentMethodId,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [information, shippingMethodId, paymentMethodId])

  const setInformation = (info: CheckoutInformation) => {
    setInformationState(info)
  }

  const setShippingMethodId = (id: number | null) => {
    setShippingMethodIdState(id)
  }

  const setPaymentMethodId = (id: number | null) => {
    setPaymentMethodIdState(id)
  }

  const clear = () => {
    setInformationState(null)
    setShippingMethodIdState(null)
    setPaymentMethodIdState(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const value = useMemo(
    () => ({
      information,
      shippingMethodId,
      paymentMethodId,
      setInformation,
      setShippingMethodId,
      setPaymentMethodId,
      clear,
    }),
    [information, shippingMethodId, paymentMethodId]
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider')
  return ctx
}

