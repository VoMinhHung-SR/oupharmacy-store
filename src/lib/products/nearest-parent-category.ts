import { buildCategoryBreadcrumbFromPath, Product } from '@/lib/services/products'

export interface CategoryLinkSegment {
  name: string
  href: string
}

/** Nearest parent category for PDP chips (one level above leaf in current path). */
export function getNearestParentCategory(
  product: Product,
  categoryPath: string
): CategoryLinkSegment | null {
  const trail = buildCategoryBreadcrumbFromPath(categoryPath, product)
  if (trail.length >= 2) {
    return trail[trail.length - 2]
  }
  if (trail.length === 1) {
    return trail[0]
  }

  if (product.category?.name) {
    const slug =
      product.category.path_slug?.trim() ||
      product.category.slug?.trim() ||
      categoryPath.trim()
    if (slug) {
      return { name: product.category.name, href: `/${slug}` }
    }
  }

  return null
}
