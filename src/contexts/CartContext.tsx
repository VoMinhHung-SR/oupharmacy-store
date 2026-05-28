"use client"
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { toastError, toastSuccess, toastWarning } from "@/lib/utils/toast"
import { useAuth } from "./AuthContext"
import { useCurrentCart, useAddCartItem, useRemoveCartItem, useUpdateCartItem, CART_QUERY_KEY } from "@/lib/hooks/useCarts"
import { getCurrentCart, mergeGuestCart } from "@/lib/services/carts"
import { clearGuestSessionId, ensureGuestSessionId, getGuestSessionId } from "@/lib/utils/guestSession"
import type { CartLineUnitOption } from "@/lib/services/products"
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
  unit_options?: CartLineUnitOption[]
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
  freeShippingApplied?: boolean
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
  const rawUnitOptions = item.unit_options
  let unit_options: CartLineUnitOption[] | undefined
  if (Array.isArray(rawUnitOptions) && rawUnitOptions.length > 0) {
    const parsed: CartLineUnitOption[] = []
    for (const u of rawUnitOptions) {
      const row = u as Record<string, unknown>
      const id = Number(row.id ?? row.unit_id)
      const unit_name = String(row.unit_name ?? "").trim()
      if (!Number.isFinite(id) || id <= 0 || !unit_name) continue
      parsed.push({
        id,
        unit_name,
        is_default: row.is_default === true ? true : undefined,
        price_value:
          row.price_value != null && Number.isFinite(Number(row.price_value))
            ? Number(row.price_value)
            : undefined,
      })
    }
    if (parsed.length > 0) unit_options = parsed
  }

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
    ...(unit_options?.length ? { unit_options } : {}),
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
  const [guestSessionReady, setGuestSessionReady] = useState(false)
  const serverCartEnabled = isAuthenticated || guestSessionReady
  const { data: serverCart, isLoading: serverCartLoading } = useCurrentCart(serverCartEnabled)
  const addMutation = useAddCartItem()
  const removeMutation = useRemoveCartItem()
  const updateMutation = useUpdateCartItem()

  const [serverLineSelection, setServerLineSelection] = useState<Record<string, boolean>>({})
  const hasAttemptedAnonymousSyncRef = useRef(false)
  const hasAttemptedGuestSyncRef = useRef(false)
  const hasAttemptedGuestMergeRef = useRef(false)

  useEffect(() => {
    if (isAuthenticated) {
      ensureGuestSessionId()
      setGuestSessionReady(true)
      return
    }
    setGuestSessionReady(false)
    hasAttemptedGuestSyncRef.current = false
    hasAttemptedGuestMergeRef.current = false
    ensureGuestSessionId()
    setGuestSessionReady(true)
  }, [isAuthenticated])

  useEffect(() => {
    if (!serverCartEnabled) {
      setServerLineSelection({})
      hasAttemptedAnonymousSyncRef.current = false
      return
    }
    setServerLineSelection(readServerLineSelection())
  }, [serverCartEnabled])

  useEffect(() => {
    if (!serverCartEnabled) return
    writeServerLineSelection(serverLineSelection)
  }, [serverCartEnabled, serverLineSelection])

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
    if (!serverCartEnabled) return
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
  }, [serverCartEnabled, serverItems])

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

  useEffect(() => {
    if (isAuthenticated || !guestSessionReady || typeof window === "undefined") return
    if (hasAttemptedGuestSyncRef.current) return
    hasAttemptedGuestSyncRef.current = true
    let cancelled = false
    const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

    const syncGuestLocalCart = async () => {
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
        toastWarning("Không thể đồng bộ giỏ hàng. Vui lòng refresh trình duyệt và thử lại.")
      }
    }

    syncGuestLocalCart()
    return () => {
      cancelled = true
    }
  }, [addMutation, guestSessionReady, isAuthenticated, queryClient])

  useEffect(() => {
    if (!isAuthenticated || typeof window === "undefined") return
    if (hasAttemptedGuestMergeRef.current) return
    const guestId = getGuestSessionId()
    if (!guestId) return
    hasAttemptedGuestMergeRef.current = true
    let cancelled = false

    const runMerge = async () => {
      try {
        const result = await mergeGuestCart()
        if (!cancelled && result.data) {
          queryClient.setQueryData(CART_QUERY_KEY, result.data)
        }
      } catch {
        // Non-fatal: user cart may still be usable
      } finally {
        if (!cancelled) {
          clearGuestSessionId()
          await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
        }
      }
    }

    void runMerge()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, queryClient])

  const setItemSelected = useCallback(
    (id: string, selected: boolean) => {
      if (!serverCartEnabled) return
      setServerLineSelection((prev) => {
        if (prev[id] === selected) return prev
        return { ...prev, [id]: selected }
      })
    },
    [serverCartEnabled]
  )

  const setAllItemsSelected = useCallback(
    (selected: boolean) => {
      if (!serverCartEnabled) return
      setServerLineSelection(() => {
        const next: Record<string, boolean> = {}
        for (const i of serverItems) {
          next[i.id] = selected
        }
        return next
      })
    },
    [serverCartEnabled, serverItems]
  )

  const add = useCallback(
    async (item: Omit<CartItem, "qty" | "selected">, qty: number = 1) => {
      if (!serverCartEnabled) {
        toastError("Đang tải giỏ hàng, vui lòng thử lại.")
        throw new Error("Cart not ready")
      }
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
    },
    [addMutation, serverCartEnabled, serverCart?.version]
  )

  const remove = useCallback(
    (id: string) => {
      if (!serverCartEnabled) return
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
    },
    [removeMutation, serverCart?.version, serverCartEnabled, serverItems]
  )

  const updateQuantity = useCallback(
    (id: string, qty: number) => {
      if (qty < 1) return
      if (!serverCartEnabled) return
      const version = serverCart?.version
      if (version == null) return
      updateMutation
        .mutateAsync({
          item_id: Number(id),
          quantity: qty,
          expected_version: version,
        })
        .catch(() => {})
    },
    [serverCart?.version, serverCartEnabled, updateMutation]
  )

  const updateItemUnit = useCallback(
    async (id: string, productVariantUnitId: number) => {
      if (!serverCartEnabled) {
        throw new Error("Cart not ready")
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
    [serverCart?.version, serverCartEnabled, updateMutation]
  )

  const clear = useCallback(() => {
    if (!serverCartEnabled) return
    void queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
  }, [queryClient, serverCartEnabled])

  const resolvedItems = useMemo<CartItem[]>(() => {
    if (!serverCartEnabled) return []
    return serverItems.map((i) => ({
      ...i,
      selected: serverLineSelection[i.id] !== false,
    }))
  }, [serverCartEnabled, serverItems, serverLineSelection])

  const total = useMemo(() => {
    if (!serverCartEnabled) return 0
    return Number(serverCart?.total ?? 0)
  }, [serverCart?.total, serverCartEnabled])

  const selectionTotals = useMemo((): CartSelectionTotals => {
    const selectedLines = resolvedItems.filter((i) => i.selected)
    const selectedSubtotal = selectedLines.reduce((s, i) => s + i.price * i.qty, 0)
    const selectedCount = selectedLines.length
    const grossSubtotal = serverCartEnabled ? Number(serverCart?.subtotal ?? 0) : total
    const ratio =
      serverCartEnabled && grossSubtotal > 0 ? Math.min(1, selectedSubtotal / grossSubtotal) : selectedCount === 0 ? 0 : 1
    const discount = serverCartEnabled ? Number(serverCart?.discount_amount ?? 0) : 0
    const shipDisc = serverCartEnabled ? Number(serverCart?.shipping_discount_amount ?? 0) : 0
    const shipFee = serverCartEnabled ? Number(serverCart?.shipping_fee ?? 0) : 0
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
  }, [resolvedItems, serverCart, serverCartEnabled, total])

  const value = useMemo(
    () => ({
      items: resolvedItems,
      add,
      remove,
      updateQuantity,
      updateItemUnit,
      clear,
      total,
      subtotal: serverCartEnabled ? Number(serverCart?.subtotal ?? 0) : 0,
      shippingFee: serverCartEnabled ? Number(serverCart?.shipping_fee ?? 0) : 0,
      freeShippingApplied: serverCartEnabled ? Boolean(serverCart?.free_shipping_applied) : false,
      shippingMethodId: serverCartEnabled ? (serverCart?.shipping_method?.id ?? null) : null,
      orderVoucherCode: serverCartEnabled ? (serverCart?.order_voucher_code ?? null) : null,
      shippingVoucherCode: serverCartEnabled ? (serverCart?.shipping_voucher_code ?? null) : null,
      discountAmount: serverCartEnabled ? Number(serverCart?.discount_amount ?? 0) : 0,
      shippingDiscountAmount: serverCartEnabled ? Number(serverCart?.shipping_discount_amount ?? 0) : 0,
      version: serverCartEnabled ? serverCart?.version : undefined,
      isLoading: serverCartEnabled ? serverCartLoading || !guestSessionReady : false,
      setItemSelected,
      setAllItemsSelected,
      selectionTotals,
    }),
    [
      add,
      clear,
      guestSessionReady,
      remove,
      resolvedItems,
      selectionTotals,
      serverCart,
      serverCartEnabled,
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
