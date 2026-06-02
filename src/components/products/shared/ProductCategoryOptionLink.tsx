import Link from 'next/link'
import { CategoryIcon } from '@/components/icons'

interface ProductCategoryOptionLinkProps {
  name: string
  href: string
}

/** Category chip on PDP — matches listing subcategory option style (ref Long Chau / category row). */
export function ProductCategoryOptionLink({ name, href }: ProductCategoryOptionLinkProps) {
  const slug = href.replace(/^\//, '')

  return (
    <Link
      href={href}
      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 transition hover:border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        <CategoryIcon categorySlug={slug} className="h-4 w-4 text-gray-600" aria-hidden />
      </span>
      <span className="truncate text-sm font-medium text-gray-700">{name}</span>
    </Link>
  )
}
