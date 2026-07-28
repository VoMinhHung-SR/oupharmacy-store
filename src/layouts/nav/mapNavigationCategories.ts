import type { NavigationCategory } from '@/layouts/NavigationBar/types'
import { getCategoriesSSG, hrefFromWebSlug, type CategoryLevel0 } from '@/lib/services/categories'

/** Map store category tree → nav chrome shape (shared by desktop bar + mobile drawer). */
export function mapCategoriesToNavigation(categories: CategoryLevel0[]): NavigationCategory[] {
  return categories.map((level0) => ({
    id: level0.id,
    name: level0.name,
    href: `/${level0.path_slug || level0.slug}`,
    children:
      level0.level1?.map((level1) => {
        const total =
          level1.level2 && level1.level2.length > 0 && level1.level2[0].total
            ? level1.level2[0].total
            : undefined

        return {
          id: level1.id,
          name: level1.name,
          href: `/${level1.path_slug || level1.slug}`,
          total,
          level2:
            level1.level2?.map((level2) => ({
              id: level2.id,
              name: level2.name,
              href: `/${level2.path_slug || level2.slug}`,
            })) || [],
          topProducts: (level1.top_products ?? []).map((p) => ({
            ...p,
            web_slug: hrefFromWebSlug(p.web_slug),
          })),
        }
      }) || [],
  }))
}

export async function loadNavigationCategories(): Promise<NavigationCategory[]> {
  try {
    const categories = await getCategoriesSSG()
    return mapCategoriesToNavigation(categories)
  } catch (error) {
    console.error('Error fetching categories for nav chrome:', error)
    return []
  }
}
