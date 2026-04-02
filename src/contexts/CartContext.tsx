"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { toastSuccess } from '@/lib/utils/toast'

export interface CartItem {
  /** String form of `variant_unit_id` for React keys / localStorage. */
  id: string
  /** Product variant unit id (PVU). */
  variant_unit_id: number
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
  updateQuantity: (id: string, qty: number) => void
  clear: () => void
  total: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'oupharmacy_cart'

function migrateCartItem(item: Record<string, unknown>): CartItem {
  const parsedId = parseInt(String(item.id), 10)
  const variant_unit_id =
    (item.variant_unit_id as number | undefined) ??
    (item.medicine_unit_id as number | undefined) ??
    (Number.isNaN(parsedId) ? 0 : parsedId)
  return {
    id: String(variant_unit_id),
    variant_unit_id,
    name: String(item.name ?? ''),
    price: Number(item.price ?? 0) || 0,
    image_url: item.image_url as string | undefined,
    packaging: item.packaging as string | undefined,
    qty: Number(item.qty ?? 1) || 1,
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>[]
        const migrated = parsed.map(migrateCartItem)
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
    const isUpdate = items.some((i) => i.variant_unit_id === item.variant_unit_id)

    setItems((prev) => {
      const exist = prev.find((i) => i.variant_unit_id === item.variant_unit_id)
      return exist
        ? prev.map((i) => (i.variant_unit_id === item.variant_unit_id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { ...item, qty, id: item.variant_unit_id.toString() }]
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

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
  }

  const clear = () => setItems([])
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])

  const value = useMemo(() => ({ items, add, remove, updateQuantity, clear, total }), [items, total])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
