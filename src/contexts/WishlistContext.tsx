'use client'

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { toastSuccess, toastWarning } from '@/lib/utils/toast'
import { useAuth } from '@/contexts/AuthContext'

export interface WishlistItem {
  id: string
  variant_unit_id: number
  product_variant_unit_id?: number
  name: string
  price: number
  price_display?: string
  image_url?: string
  packaging?: string
  category_slug?: string
  product_slug?: string
}

interface WishlistContextValue {
  items: WishlistItem[]
  add: (item: WishlistItem) => void
  remove: (id: string) => void
  isInWishlist: (id: string | number) => boolean
  toggle: (item: WishlistItem) => void
  clear: () => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

const STORAGE_KEY = 'oupharmacy_wishlist'

function migrateWishlistItem(raw: Record<string, unknown>): WishlistItem {
  const variant_unit_id =
    (raw.variant_unit_id as number | undefined) ??
    (raw.medicine_unit_id as number | undefined) ??
    0
  const product_slug =
    (raw.product_slug as string | undefined) ?? (raw.medicine_slug as string | undefined)
  const product_variant_unit_id =
    raw.product_variant_unit_id == null ? undefined : Number(raw.product_variant_unit_id)

  return {
    id: String(raw.id ?? variant_unit_id),
    variant_unit_id,
    ...(product_variant_unit_id != null && Number.isFinite(product_variant_unit_id)
      ? { product_variant_unit_id }
      : {}),
    name: String(raw.name ?? ''),
    price: Number(raw.price ?? 0) || 0,
    price_display: raw.price_display as string | undefined,
    image_url: raw.image_url as string | undefined,
    packaging: raw.packaging as string | undefined,
    category_slug: raw.category_slug as string | undefined,
    product_slug,
  }
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([])
      return
    }

    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>[]
        setItems(parsed.map(migrateWishlistItem))
      }
    } catch {}
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, isAuthenticated])

  const add = (item: WishlistItem) => {
    if (!isAuthenticated) {
      toastWarning('Vui lòng đăng nhập để sử dụng tính năng yêu thích')
      return
    }

    const exists = items.some((i) => i.variant_unit_id === item.variant_unit_id)
    if (exists) {
      toastWarning('Sản phẩm đã có trong danh sách yêu thích')
      return
    }

    setItems((prev) => [...prev, item])
    toastSuccess(`Đã thêm ${item.name} vào danh sách yêu thích`)
  }

  const remove = (id: string) => {
    if (!isAuthenticated) {
      toastWarning('Vui lòng đăng nhập để sử dụng tính năng yêu thích')
      return
    }

    const item = items.find((i) => i.id === id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    if (item) {
      toastSuccess(`Đã xóa ${item.name} khỏi danh sách yêu thích`)
    }
  }

  const isInWishlist = (id: string | number): boolean => {
    if (!isAuthenticated) return false
    return items.some((item) => item.variant_unit_id === Number(id) || item.id === String(id))
  }

  const toggle = (item: WishlistItem) => {
    if (!isAuthenticated) {
      toastWarning('Vui lòng đăng nhập để sử dụng tính năng yêu thích')
      return
    }

    if (isInWishlist(item.variant_unit_id)) {
      const existingItem = items.find((i) => i.variant_unit_id === item.variant_unit_id)
      if (existingItem) {
        remove(existingItem.id)
      }
    } else {
      add(item)
    }
  }

  const clear = () => {
    if (!isAuthenticated) return
    setItems([])
  }

  const count = useMemo(() => items.length, [items])

  return (
    <WishlistContext.Provider value={{ items, add, remove, isInWishlist, toggle, clear, count }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
