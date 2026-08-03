'use client'

import { StorePage } from '@/components/catalog/StorePage'

/**
 * One page for `/{category}` and `/{category}/…` so StorePage does not remount
 * when navigating parent → subcategory / product (optional catch-all).
 */
export default function StorePathPage() {
  return <StorePage minSegments={1} />
}
