import { resolveCategoryIcon } from './categoryIconMap'

interface CategoryIconProps {
  categorySlug: string
  className?: string
  'aria-hidden'?: boolean | 'true' | 'false'
}

/** Maps category slug → outline icon (medical/pharmacy + categoryIconMap). */
export function CategoryIcon({
  categorySlug,
  className = 'w-6 h-6',
  'aria-hidden': ariaHidden = true,
}: CategoryIconProps) {
  const Icon = resolveCategoryIcon(categorySlug)
  return <Icon className={className} aria-hidden={ariaHidden} />
}
