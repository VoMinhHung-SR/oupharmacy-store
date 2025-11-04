"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  remove: (id: string) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'oupharmacy_cart'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (item: Omit<CartItem, 'qty'>, qty: number = 1) => {
    setItems((prev) => {
      const exist = prev.find((i) => i.id === item.id)
      if (exist) return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { ...item, qty }]
    })
  }

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])

  const value = useMemo(() => ({ items, add, remove, clear, total }), [items, total])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


