import type { CartItem } from '@/contexts/CartContext'
import type { Order } from '@/lib/services/orders'

export type ReorderCartAdd = (
  item: Omit<CartItem, 'qty' | 'selected'>,
  qty?: number
) => Promise<void>

export type ReorderOrderToCartResult = {
  added: number
  skipped: number
  total: number
}

/**
 * Refill cart from a past order (current catalog/cart SoT — not historical price lock).
 * Skips lines without a valid variant id or quantity.
 */
export async function reorderOrderToCart(
  order: Order,
  add: ReorderCartAdd
): Promise<ReorderOrderToCartResult> {
  const items = order.items ?? []
  let added = 0
  let skipped = 0

  for (const item of items) {
    const variantUnitId = Number(item.variant_unit_id) || 0
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0))
    if (variantUnitId <= 0 || qty <= 0) {
      skipped += 1
      continue
    }

    try {
      await add(
        {
          id: String(variantUnitId),
          variant_unit_id: variantUnitId,
          product_variant_unit_id: item.product_variant_unit_id ?? null,
          name: item.name?.trim() || `Sản phẩm #${variantUnitId}`,
          price: Number(item.price) || 0,
          image_url: item.image_url,
        },
        qty
      )
      added += 1
    } catch {
      skipped += 1
    }
  }

  return { added, skipped, total: items.length }
}
