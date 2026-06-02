'use client'

import React, { useEffect, useState } from 'react'
import { Product, buildProductCardPayload } from '@/lib/services/products'
import { ProductCard } from '@/components/cards/ProductCard'
import { Container } from '@/components/Container'

const STORAGE_KEY = 'oupharmacy_recently_viewed'
const MAX_ITEMS = 6

interface RecentlyViewedItem {
  id: number
  name: string
  price: number
  image_url?: string
  packaging?: string
  category_slug?: string
  product_slug?: string
  variant_unit_id: number
  in_stock: number
  price_display: string
}

function migrateStoredItem(raw: Record<string, unknown>): RecentlyViewedItem {
  const variant_unit_id =
    Number(raw.variant_unit_id ?? raw.medicine_unit_id ?? raw.id ?? 0) || 0
  const product_slug =
    (raw.product_slug as string | undefined) ?? (raw.medicine_slug as string | undefined) ?? ''
  return {
    id: Number(raw.id) || variant_unit_id,
    name: String(raw.name ?? ''),
    price: Number(raw.price ?? 0) || 0,
    image_url: raw.image_url as string | undefined,
    packaging: raw.packaging as string | undefined,
    category_slug: raw.category_slug as string | undefined,
    product_slug,
    variant_unit_id,
    in_stock: Number(raw.in_stock ?? 0) || 0,
    price_display: String(raw.price_display ?? ''),
  }
}

export const saveToRecentlyViewed = (product: Product, contextCategorySlug?: string) => {
  if (typeof window === 'undefined') return

  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    const items: RecentlyViewedItem[] = existing ? JSON.parse(existing).map(migrateStoredItem) : []

    const cardPayload = buildProductCardPayload(product, contextCategorySlug)
    const newItem: RecentlyViewedItem = {
      id: product.id,
      name: cardPayload.name,
      price: cardPayload.price,
      image_url: cardPayload.image_url,
      packaging: cardPayload.packaging,
      category_slug: cardPayload.category_slug,
      product_slug: cardPayload.product_slug,
      variant_unit_id: product.id,
      in_stock: product.in_stock,
      price_display: product.price_display || '',
    }

    const filtered = items.filter((item) => item.id !== product.id)
    const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Error saving to recently viewed:', error)
  }
}

export const RecentlyViewed: React.FC = () => {
  const [items, setItems] = useState<RecentlyViewedItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, unknown>[]
        setItems(parsed.map(migrateStoredItem))
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error)
    }
  }, [])

  if (items.length === 0) {
    return null
  }

  return (
    <Container className="py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sản phẩm đã xem gần đây</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            product={{
              id: item.id.toString(),
              name: item.name,
              price_display: item.price_display,
              price: item.price,
              image_url: item.image_url,
              packaging: item.packaging,
              variant_unit_id: item.variant_unit_id,
              category_slug: item.category_slug,
              product_slug: item.product_slug,
              in_stock: item.in_stock,
            }}
          />
        ))}
      </div>
    </Container>
  )
}
