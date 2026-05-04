"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toastError, toastSuccess, toastWarning } from "@/lib/utils/toast"
import { useAuth } from "./AuthContext"
import { useCurrentCart, useAddCartItem, useRemoveCartItem, useUpdateCartItem, CART_QUERY_KEY } from "@/lib/hooks/useCarts"
import { getCurrentCart } from "@/lib/services/carts"
import { useQueryClient } from "@tanstack/react-query"

const LINE_SELECT_SESSION_KEY = "oupharmacy_cart_line_select_v1"

export interface CartItem {
  /** String form of `variant_unit_id` for React keys / localStorage; server cart uses `CartItem.id`. */
  id: string
  /** Product variant unit id (PVU). */
  variant_unit_id: number
  name: string
  price: number
  image_url?: string
  packaging?: string
  qty: number
  /** Included in localStorage for guest cart; server cart merges session map by `id`. */
  selected?: boolean
}

export interface CartSelectionTotals {
  selectedSubtotal: number
  selectedCount: number
  /** 0..1 — share of server subtotal covered by selected lines (authenticated). */
  selectionRatio: number
  estimatedOrderDiscount: number
  estimatedShippingDiscount: number
  estimatedShippingFee: number
  estimatedTotal: number
}

interface CartContextValue {
  items: CartItem[]
  /** Resolves after server/local cart update; rejects when authenticated add fails or cart is not ready. */
  add: (item: Omit<CartItem, "qty" | "selected">, qty?: number) => Promise<void>
  remove: (id: string) => void
  updateQuantity: (id: string, qty: number) => void
  clear: () => void
  total: number
  subtotal?: number
  shippingFee?: number
  discountAmount?: number
  shippingDiscountAmount?: number
  shippingMethodId?: number | null
  orderVoucherCode?: string | null
  shippingVoucherCode?: string | null
  version?: number
  isLoading?: boolean
  setItemSelected: (id: string, selected: boolean) => void
  setAllItemsSelected: (selected: boolean) => void
  selectionTotals: CartSelectionTotals
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = "oupharmacy_cart"

function migrateCartItem(item: Record<string, unknown>): CartItem {
  const parsedId = parseInt(String(item.id), 10)
  const variant_unit_id =
    (item.variant_unit_id as number | undefined) ??
    (item.medicine_unit_id as number | undefined) ??
    (Number.isNaN(parsedId) ? 0 : parsedId)
  return {
    id: String(variant_unit_id),
    variant_unit_id,
    name: String(item.name ?? ""),
    price: Number(item.price ?? 0) || 0,
    image_url: item.image_url as string | undefined,
    packaging: item.packaging as string | undefined,
    qty: Number(item.qty ?? 1) || 1,
    selected: item.selected === false ? false : true,
  }
}

function readServerLineSelection(): Record<string, boolean> {
  if (typeof window === "undefined") return {}
  try {
    const raw = sessionStorage.getItem(LINE_SELECT_SESSION_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as Record<string, boolean>
  } catch {
    return {}
  }
}

function writeServerLineSelection(map: Record<string, boolean>) {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(LINE_SELECT_SESSION_KEY, JSON.stringify(map))
  } catch {}
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const { data: serverCart, isLoading: serverCartLoading } = useCurrentCart(isAuthenticated)
  const addMutation = useAddCartItem()
  const removeMutation = useRemoveCartItem()
  const updateMutation = useUpdateCartItem()

  const [items, setItems] = useState<CartItem[]>([])
  const [serverLineSelection, setServerLineSelection] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!isAuthenticated) {
      setServerLineSelection({})
      return
    }
    setServerLineSelection(readServerLineSelection())
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return
    writeServerLineSelection(serverLineSelection)
  }, [isAuthenticated, serverLineSelection])

  useEffect(() => {
    if (isAuthenticated) return
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>[]
        const migrated = parsed.map(migrateCartItem)
        setItems(migrated)
      }
    } catch {}
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items, isAuthenticated])

  const serverItems = useMemo<CartItem[]>(() => {
    if (!serverCart?.items) return []
    return serverCart.items.map((item) => ({
      id: String(item.id),
      variant_unit_id: Number(item.product_variant) || 0,
      name: item.name || "",
      price: Number(item.unit_price_snapshot) || 0,
      image_url: item.image_url || undefined,
      qty: Number(item.quantity) || 1,
    }))
  }, [serverCart])

  useEffect(() => {
    if (!isAuthenticated) return
    const valid = new Set(serverItems.map((i) => i.id))
    setServerLineSelection((prev) => {
      let changed = false
      const next = { ...prev }
      for (const k of Object.keys(next)) {
        if (!valid.has(k)) {
          delete next[k]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [isAuthenticated, serverItems])

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return
    let cancelled = false

    const syncAnonymousCart = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const parsed = JSON.parse(raw) as Record<string, unknown>[]
        const localItems = parsed.map(migrateCartItem).filter((i) => i.variant_unit_id > 0 && i.qty > 0)
        if (localItems.length === 0) {
          localStorage.removeItem(STORAGE_KEY)
          return
        }

        let latest = await getCurrentCart()
        if (latest.error || !latest.data) return
        let version = latest.data.version

        for (const item of localItems) {
          if (cancelled) return
          const merged = await addMutation.mutateAsync({
            product_variant_id: item.variant_unit_id,
            quantity: item.qty,
            expected_version: version,
          })
          version = merged.version
        }

        if (!cancelled) {
          localStorage.removeItem(STORAGE_KEY)
          await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
        }
      } catch {
        toastWarning("Không thể đồng bộ giỏ hàng từ phiên chưa đăng nhập. Vui lòng thử lại sau.")
      }
    }

    syncAnonymousCart()
    return () => {
      cancelled = true
    }
  }, [addMutation, isAuthenticated, queryClient])

  const setItemSelected = useCallback(
    (id: string, selected: boolean) => {
      if (!isAuthenticated) {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, selected } : i)))
        return
      }
      setServerLineSelection((prev) => ({ ...prev, [id]: selected }))
    },
    [isAuthenticated]
  )

  const setAllItemsSelected = useCallback(
    (selected: boolean) => {
      if (!isAuthenticated) {
        setItems((prev) => prev.map((i) => ({ ...i, selected })))
        return
      }
      setServerLineSelection(() => {
        const next: Record<string, boolean> = {}
        for (const i of serverItems) {
          next[i.id] = selected
        }
        return next
      })
    },
    [isAuthenticated, serverItems]
  )

  const add = useCallback(
    async (item: Omit<CartItem, "qty" | "selected">, qty: number = 1) => {
      if (isAuthenticated) {
        const version = serverCart?.version
        if (version == null) {
          toastError("Đang tải giỏ hàng, vui lòng thử lại.")
          throw new Error("Cart not ready")
        }
        try {
          await addMutation.mutateAsync({
            product_variant_id: item.variant_unit_id,
            quantity: qty,
            expected_version: version,
          })
          toastSuccess(`Đã thêm ${item.name} vào giỏ hàng`)
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : "Không thêm được vào giỏ hàng."
          toastError(msg)
          throw e instanceof Error ? e : new Error(msg)
        }
        return
      }

      const isUpdate = items.some((i) => i.variant_unit_id === item.variant_unit_id)

      setItems((prev) => {
        const exist = prev.find((i) => i.variant_unit_id === item.variant_unit_id)
        return exist
          ? prev.map((i) =>
              i.variant_unit_id === item.variant_unit_id ? { ...i, qty: i.qty + qty, selected: i.selected !== false } : i
            )
          : [...prev, { ...item, qty, id: item.variant_unit_id.toString(), selected: true }]
      })

      toastSuccess(
        isUpdate ? `Đã cập nhật số lượng ${item.name} trong giỏ hàng` : `Đã thêm ${item.name} vào giỏ hàng`
      )
    },
    [addMutation, isAuthenticated, items, serverCart?.version]
  )

  const remove = useCallback(
    (id: string) => {
      if (isAuthenticated) {
        const version = serverCart?.version
        if (version == null) return
        const item = serverItems.find((i) => i.id === id)
        removeMutation
          .mutateAsync({
            item_id: Number(id),
            expected_version: version,
          })
          .then(() => {
            if (item) {
              toastSuccess(`Đã xóa ${item.name} khỏi giỏ hàng`)
            }
          })
          .catch(() => {})
        setServerLineSelection((prev) => {
          const next = { ...prev }
          delete next[id]
          return next
        })
        return
      }

      const item = items.find((i) => i.id === id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      if (item) {
        toastSuccess(`Đã xóa ${item.name} khỏi giỏ hàng`)
      }
    },
    [isAuthenticated, items, removeMutation, serverCart?.version, serverItems]
  )

  const updateQuantity = useCallback(
    (id: string, qty: number) => {
      if (qty < 1) return
      if (isAuthenticated) {
        const version = serverCart?.version
        if (version == null) return
        updateMutation
          .mutateAsync({
            item_id: Number(id),
            quantity: qty,
            expected_version: version,
          })
          .catch(() => {})
        return
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)))
    },
    [isAuthenticated, serverCart?.version, updateMutation]
  )

  const clear = useCallback(() => {
    if (isAuthenticated) {
      void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
      return
    }
    setItems([])
  }, [isAuthenticated, queryClient])

  const resolvedItems = useMemo<CartItem[]>(() => {
    if (isAuthenticated) {
      return serverItems.map((i) => ({
        ...i,
        selected: serverLineSelection[i.id] !== false,
      }))
    }
    return items.map((i) => ({ ...i, selected: i.selected !== false }))
  }, [isAuthenticated, items, serverItems, serverLineSelection])

  const total = useMemo(() => {
    if (isAuthenticated) {
      return Number(serverCart?.total ?? 0)
    }
    return items.reduce((s, i) => s + i.price * i.qty, 0)
  }, [isAuthenticated, items, serverCart?.total])

  const selectionTotals = useMemo((): CartSelectionTotals => {
    const selectedLines = resolvedItems.filter((i) => i.selected)
    const selectedSubtotal = selectedLines.reduce((s, i) => s + i.price * i.qty, 0)
    const selectedCount = selectedLines.length
    const grossSubtotal = isAuthenticated ? Number(serverCart?.subtotal ?? 0) : total
    const ratio =
      isAuthenticated && grossSubtotal > 0 ? Math.min(1, selectedSubtotal / grossSubtotal) : selectedCount === 0 ? 0 : 1
    const discount = isAuthenticated ? Number(serverCart?.discount_amount ?? 0) : 0
    const shipDisc = isAuthenticated ? Number(serverCart?.shipping_discount_amount ?? 0) : 0
    const shipFee = isAuthenticated ? Number(serverCart?.shipping_fee ?? 0) : 0
    const estimatedOrderDiscount = discount * ratio
    const estimatedShippingDiscount = shipDisc * ratio
    const estimatedShippingFee = shipFee
    const estimatedTotal = Math.max(
      0,
      selectedSubtotal - estimatedOrderDiscount - estimatedShippingDiscount + estimatedShippingFee
    )
    return {
      selectedSubtotal,
      selectedCount,
      selectionRatio: ratio,
      estimatedOrderDiscount,
      estimatedShippingDiscount,
      estimatedShippingFee,
      estimatedTotal,
    }
  }, [isAuthenticated, resolvedItems, serverCart, total])

  const value = useMemo(
    () => ({
      items: resolvedItems,
      add,
      remove,
      updateQuantity,
      clear,
      total,
      subtotal: isAuthenticated ? Number(serverCart?.subtotal ?? 0) : total,
      shippingFee: isAuthenticated ? Number(serverCart?.shipping_fee ?? 0) : 0,
      shippingMethodId: isAuthenticated ? (serverCart?.shipping_method?.id ?? null) : null,
      orderVoucherCode: isAuthenticated ? (serverCart?.order_voucher_code ?? null) : null,
      shippingVoucherCode: isAuthenticated ? (serverCart?.shipping_voucher_code ?? null) : null,
      discountAmount: isAuthenticated ? Number(serverCart?.discount_amount ?? 0) : 0,
      shippingDiscountAmount: isAuthenticated ? Number(serverCart?.shipping_discount_amount ?? 0) : 0,
      version: isAuthenticated ? serverCart?.version : undefined,
      isLoading: isAuthenticated ? serverCartLoading : false,
      setItemSelected,
      setAllItemsSelected,
      selectionTotals,
    }),
    [
      add,
      clear,
      isAuthenticated,
      remove,
      resolvedItems,
      selectionTotals,
      serverCart,
      serverCartLoading,
      setAllItemsSelected,
      setItemSelected,
      total,
      updateQuantity,
    ]
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
