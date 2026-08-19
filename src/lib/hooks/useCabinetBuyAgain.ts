'use client'

import { useCallback } from 'react'
import { getCurrentCart } from '@/lib/services/carts'
import type { CabinetItem } from '@/lib/services/cabinet'
import { useAddCartItem } from '@/lib/hooks/useCarts'

export function isWarehouseStockError(message: string) {
  return /insufficient stock/i.test(message)
}

export function mapBuyAgainError(message: string, t: (key: string) => string) {
  if (message === 'CART_NOT_READY' || /không thể làm mới giỏ/i.test(message)) {
    return t('toast.cartNotReady')
  }
  if (isWarehouseStockError(message)) {
    return t('toast.warehouseOutOfStock')
  }
  return message || t('toast.actionFailed')
}

export function useCabinetBuyAgain() {
  const addItem = useAddCartItem()

  const buyAgain = useCallback(
    async (item: Pick<CabinetItem, 'product_variant_id' | 'product_variant_unit_id'>) => {
      const latest = await getCurrentCart()
      if (latest.error || !latest.data) {
        throw new Error(latest.error || 'CART_NOT_READY')
      }
      await addItem.mutateAsync({
        product_variant_id: item.product_variant_id,
        product_variant_unit_id: item.product_variant_unit_id,
        quantity: 1,
        expected_version: latest.data.version,
      })
    },
    [addItem]
  )

  return { buyAgain, isPending: addItem.isPending }
}
