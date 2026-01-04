'use client'

import React, { useEffect, useState } from 'react'
import { Product } from '@/lib/services/products'
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
  medicine_slug?: string
  medicine_unit_id: number
  in_stock: number
  price_display: string
}

export const saveToRecentlyViewed = (product: Product) => {
  if (typeof window === 'undefined') return

  try {
    const existing = localStorage.getItem(STORAGE_KEY)
    const items: RecentlyViewedItem[] = existing ? JSON.parse(existing) : []

    const newItem: RecentlyViewedItem = {
      id: product.id,
      name: product.medicine.name,
      price: product.price_value,
      image_url: product.image_url || (product.images && product.images.length > 0 ? product.images[0] : undefined),
      packaging: product.package_size,
      category_slug: product.category?.path_slug || product.category?.slug,
      medicine_slug: product.medicine.slug,
      medicine_unit_id: product.id,
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
        const parsed = JSON.parse(stored)
        setItems(parsed)
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
              medicine_unit_id: item.medicine_unit_id,
              category_slug: item.category_slug,
              medicine_slug: item.medicine_slug,
              in_stock: item.in_stock,
            }}
          />
        ))}
      </div>
    </Container>
  )
}
