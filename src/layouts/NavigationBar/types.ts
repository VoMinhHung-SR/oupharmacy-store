export interface NavigationCategoryLevel2 {
  id: number
  name: string
  href: string
}

export interface ProductMinimal {
  id: number
  medicine_id: number
  name: string
  slug: string
  web_slug: string
  thumbnail: string | null
  price_value: number
  original_price_value: number | null
  discount_percent: number
  package_size: string | null
  in_stock: number
  is_out_of_stock: boolean
  is_hot: boolean
  product_ranking: number
  badges: string[]
}

export interface NavigationCategoryChild {
  id: number
  name: string
  href: string
  total?: number
  level2: NavigationCategoryLevel2[]
  topProducts?: ProductMinimal[]
}

export interface NavigationCategory {
  id: number
  name: string
  href: string
  children: NavigationCategoryChild[]
}

export interface NavigationBarProps {
  categories: NavigationCategory[]
}

export type DropdownPosition = { top: number; left: number; maxHeight: number }
