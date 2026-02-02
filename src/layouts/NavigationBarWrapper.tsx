import React from 'react'
import { getCategoriesSSG, CategoryLevel0 } from '@/lib/services/categories'
import NavigationBar from './NavigationBar'

/**
 * Server Component wrapper để fetch categories với ISR
 * - Fetch categories tại build time (SSG)
 * - Revalidate mỗi 1 giờ (ISR)
 * - Pass categories vào NavigationBar client component
 */
export default async function NavigationBarWrapper() {
  let categories: CategoryLevel0[] = []

  try {
    categories = await getCategoriesSSG()
  } catch (error) {
    console.error('Error fetching categories for NavigationBar:', error)
    // Fallback: return empty array nếu fetch fail
    categories = []
  }

  const navigationCategories = categories.map((level0) => ({
    id: level0.id,
    name: level0.name,
    href: `/${level0.path_slug || level0.slug}`,
    children: level0.level1?.map((level1) => {
      const total = level1.level2 && level1.level2.length > 0 && level1.level2[0].total
        ? level1.level2[0].total
        : undefined

      return {
        id: level1.id,
        name: level1.name,
        href: `/${level1.path_slug || level1.slug}`,
        total,
        level2: level1.level2?.map((level2) => ({
          id: level2.id,
          name: level2.name,
          href: `/${level2.path_slug || level2.slug}`
        })) || [],
        topProducts: level1.top_products?.map((p) => ({
          ...p,
          web_slug: p.web_slug ? (p.web_slug.startsWith('/') ? p.web_slug : `/${p.web_slug}`) : `/${level0.path_slug || level0.slug}/${level1.path_slug || level1.slug}/${p.slug}`
        })) || [],
      }
    }) || [],
  }))

  return <NavigationBar categories={navigationCategories} />
}

