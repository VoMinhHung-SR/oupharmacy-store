import Link from 'next/link'
import React, { useMemo, useCallback } from 'react'

export interface CrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: CrumbItem[]
  className?: string
  maxItems?: number
  maxItemLength?: number
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className = '',
  maxItems = 5,
  maxItemLength = 30
}) => {
  const displayItems = useMemo(() => {
    if (items.length <= maxItems) {
      return items
    }
    const firstItem = items[0]
    const lastItems = items.slice(-2)
    return [firstItem, { label: '...', href: undefined }, ...lastItems]
  }, [items, maxItems])

  const truncateLabel = useCallback((label: string): string => {
    return label.length <= maxItemLength ? label : `${label.slice(0, maxItemLength)}...`
  }, [maxItemLength])

  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-gray-600 ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1
          const isEllipsis = item.label === '...'
          
          if (isEllipsis) {
            return (
              <li key={`ellipsis-${index}`} className="flex items-center gap-2">
                <span className="text-gray-400">...</span>
                <span>／</span>
              </li>
            )
          }
          
          if (item.href && !isLast) {
            return (
              <li key={index} className="flex items-center gap-2">
                <Link 
                  href={item.href} 
                  className="text-primary-500 hover:text-primary-700 truncate max-w-[200px]"
                  title={item.label}
                >
                  {truncateLabel(item.label)}
                </Link>
                <span>／</span>
              </li>
            )
          }
          return (
            <li 
              key={index} 
              className="text-gray-900 font-medium truncate max-w-[300px]"
              title={item.label}
            >
              {truncateLabel(item.label)}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb