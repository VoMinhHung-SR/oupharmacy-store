"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { toastError, toastSuccess, toastWarning } from "@/lib/utils/toast"
import { useAuth } from "./AuthContext"
import { useCurrentCart, useAddCartItem, useRemoveCartItem, useUpdateCartItem, CART_QUERY_KEY } from "@/lib/hooks/useCarts"
import { getCurrentCart } from "@/lib/services/carts"
import { useQueryClient } from "@tanstack/react-query"

const LINE_SELECT_SESSION_KEY = "oupharmacy_cart_line_select_v1"
const MAX_ANONYMOUS_SYNC_RETRIES = 3
const RETRY_DELAY_MS = 350

export interface CartItem {
  /** String form of `variant_unit_id` for React keys / localStorage; server cart uses `CartItem.id`. */
  id: string
  /** Product variant unit id (PVU). */
  variant_unit_id: number
  /** Selected server unit id for this cart line. */
  product_variant_unit_id?: number | null
  unit_options?: { id: number; unit_name: string; is_default?: boolean; price_value?: number }[]
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
  updateItemUnit: (id: string, productVariantUnitId: number) => Promise<void>
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
    id: String(item.id ?? variant_unit_id),
    variant_unit_id,
    product_variant_unit_id:
      item.product_variant_unit_id == null ? null : Number(item.product_variant_unit_id),
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
  const hasAttemptedAnonymousSyncRef = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setServerLineSelection({})
      hasAttemptedAnonymousSyncRef.current = false
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
      product_variant_unit_id: item.product_variant_unit ?? null,
      unit_options: Array.isArray(item.unit_options)
        ? item.unit_options.map((unit) => ({
            id: Number(unit.id) || 0,
            unit_name: String(unit.unit_name ?? ""),
            is_default: Boolean(unit.is_default),
            price_value: Number(unit.price_value ?? 0) || 0,
          }))
        : [],
      name: item.name || "",
      price: Number(item.unit_price_snapshot) || 0,
      image_url: item.image_url || undefined,
      packaging: item.packing || undefined,
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
    if (hasAttemptedAnonymousSyncRef.current) return
    hasAttemptedAnonymousSyncRef.current = true
    let cancelled = false
    const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

    const syncAnonymousCart = async () => {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as Record<string, unknown>[]
      const localItems = parsed.map(migrateCartItem).filter((i) => i.variant_unit_id > 0 && i.qty > 0)
      if (localItems.length === 0) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      let synced = false
      for (let attempt = 1; attempt <= MAX_ANONYMOUS_SYNC_RETRIES && !cancelled; attempt += 1) {
        try {
          const latest = await getCurrentCart()
          if (latest.error || !latest.data) {
            throw new Error("Unable to fetch current cart")
          }
          let version = latest.data.version

          for (const item of localItems) {
            if (cancelled) return
            const merged = await addMutation.mutateAsync({
              product_variant_id: item.variant_unit_id,
              ...(item.product_variant_unit_id ? { product_variant_unit_id: item.product_variant_unit_id } : {}),
              quantity: item.qty,
              expected_version: version,
            })
            version = merged.version
          }

          synced = true
          break
        } catch {
          if (attempt < MAX_ANONYMOUS_SYNC_RETRIES) {
            await delay(RETRY_DELAY_MS * attempt)
          }
        }
      }

      if (!cancelled && synced) {
        localStorage.removeItem(STORAGE_KEY)
        await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
        return
      }

      if (!cancelled) {
        toastWarning(
          "Không thể đồng bộ giỏ hàng từ phiên chưa đăng nhập. Vui lòng refresh trình duyệt và thử lại."
        )
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
        setItems((prev) => {
          let changed = false
          const next = prev.map((i) => {
            if (i.id !== id || i.selected === selected) return i
            changed = true
            return { ...i, selected }
          })
          return changed ? next : prev
        })
        return
      }
      setServerLineSelection((prev) => {
        if (prev[id] === selected) return prev
        return { ...prev, [id]: selected }
      })
    },
    [isAuthenticated]
  )

  const setAllItemsSelected = useCallback(
    (selected: boolean) => {
      if (!isAuthenticated) {
        setItems((prev) => {
          const shouldUpdate = prev.some((i) => i.selected !== selected)
          if (!shouldUpdate) return prev
          return prev.map((i) => ({ ...i, selected }))
        })
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
            ...(item.product_variant_unit_id ? { product_variant_unit_id: item.product_variant_unit_id } : {}),
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

      const isSameLine = (line: CartItem) =>
        line.variant_unit_id === item.variant_unit_id &&
        (line.product_variant_unit_id ?? null) === (item.product_variant_unit_id ?? null)
      const isUpdate = items.some(isSameLine)

      setItems((prev) => {
        const exist = prev.find(isSameLine)
        const lineId = `${item.variant_unit_id}:${item.product_variant_unit_id ?? 0}`
        return exist
          ? prev.map((i) =>
              isSameLine(i) ? { ...i, qty: i.qty + qty, selected: i.selected !== false } : i
            )
          : [...prev, { ...item, qty, id: lineId, selected: true }]
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

  const updateItemUnit = useCallback(
    async (id: string, productVariantUnitId: number) => {
      if (!isAuthenticated) {
        setItems((prev) => {
          const current = prev.find((line) => line.id === id)
          if (!current) return prev

          const currentUnitId = current.product_variant_unit_id ?? null
          if (currentUnitId === productVariantUnitId) return prev

          const target = prev.find(
            (line) =>
              line.id !== id &&
              line.variant_unit_id === current.variant_unit_id &&
              (line.product_variant_unit_id ?? null) === productVariantUnitId
          )

          const selectedUnitMeta =
            current.unit_options?.find((unit) => unit.id === productVariantUnitId) ?? null

          if (target) {
            // Merge quantities when target unit line already exists.
            return prev
              .map((line) => {
                if (line.id === target.id) {
                  const nextPrice =
                    selectedUnitMeta?.price_value != null ? selectedUnitMeta.price_value : line.price
                  return {
                    ...line,
                    qty: line.qty + current.qty,
                    price: nextPrice,
                    packaging: selectedUnitMeta?.unit_name || line.packaging,
                    selected: line.selected !== false || current.selected !== false,
                  }
                }
                return line
              })
              .filter((line) => line.id !== id)
          }

          const nextId = `${current.variant_unit_id}:${productVariantUnitId}`
          return prev.map((line) => {
            if (line.id !== id) return line
            const nextPrice =
              selectedUnitMeta?.price_value != null ? selectedUnitMeta.price_value : line.price
            return {
              ...line,
              id: nextId,
              product_variant_unit_id: productVariantUnitId,
              price: nextPrice,
              packaging: selectedUnitMeta?.unit_name || line.packaging,
            }
          })
        })
        return
      }
      const version = serverCart?.version
      if (version == null) {
        throw new Error("Cart not ready")
      }
      await updateMutation.mutateAsync({
        item_id: Number(id),
        product_variant_unit_id: productVariantUnitId,
        expected_version: version,
      })
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
      updateItemUnit,
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
      updateItemUnit,
    ]
  )
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
