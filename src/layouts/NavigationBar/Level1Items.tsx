'use client'

import Link from 'next/link'
import React from 'react'
import type { NavigationCategoryChild } from './types'

export interface Level1ItemsProps {
  items: NavigationCategoryChild[]
  activeLevel1Id: number | null
  onLevel1Hover: (id: number) => void
  categoryHref: string
}

export const Level1Items: React.FC<Level1ItemsProps> = ({
  items,
  activeLevel1Id,
  onLevel1Hover,
  categoryHref,
}) => {
  const displayItems = items.slice(0, 9)
  const hasMore = items.length > 9

  return (
    <div className="flex-1 min-w-[220px]">
      {displayItems.map((level1) => {
        const isActive = activeLevel1Id === level1.id
        const hasLevel2 = level1.level2 && level1.level2.length > 0

        return (
          <Link
            key={level1.id}
            href={level1.href}
            onMouseEnter={() => hasLevel2 && onLevel1Hover(level1.id)}
            className={`block px-3 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap overflow-hidden text-ellipsis mb-1 last:mb-0 ${
              isActive && hasLevel2
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-900 hover:bg-gray-100 hover:text-primary-700'
            }`}
            title={level1.name}
          >
            {level1.name}
          </Link>
        )
      })}
      {hasMore && (
        <Link
          href={categoryHref}
          className="block px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors rounded-lg font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Xem thêm
        </Link>
      )}
    </div>
  )
}
