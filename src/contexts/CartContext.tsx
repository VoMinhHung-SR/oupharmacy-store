"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toastSuccess } from '@/lib/utils/toast'

export interface CartItem {
  id: string // medicine_unit_id as string for compatibility
  medicine_unit_id: number
  name: string
  price: number
  image_url?: string
  packaging?: string
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
      if (raw) {
        const parsed = JSON.parse(raw)
        // Migrate old cart items to new format if needed
        const migrated = parsed.map((item: any) => ({
          ...item,
          medicine_unit_id: item.medicine_unit_id || parseInt(item.id) || 0,
          id: item.medicine_unit_id?.toString() || item.id,
        }))
        setItems(migrated)
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (item: Omit<CartItem, 'qty'>, qty: number = 1) => {
    const isUpdate = items.some((i) => i.medicine_unit_id === item.medicine_unit_id)

    setItems((prev) => {
      const exist = prev.find((i) => i.medicine_unit_id === item.medicine_unit_id)
      return exist
        ? prev.map((i) => (i.medicine_unit_id === item.medicine_unit_id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { ...item, qty, id: item.medicine_unit_id.toString() }]
    })

    toastSuccess(isUpdate ? `Đã cập nhật số lượng ${item.name} trong giỏ hàng` : `Đã thêm ${item.name} vào giỏ hàng`)
  }

  const remove = (id: string) => {
    const item = items.find((i) => i.id === id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (item) {
      toastSuccess(`Đã xóa ${item.name} khỏi giỏ hàng`)
    }
  }
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