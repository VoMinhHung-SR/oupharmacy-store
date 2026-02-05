'use client'

import Link from 'next/link'
import React from 'react'
import type { NavigationCategoryLevel2 } from './types'

export interface Level2ItemsProps {
  items: NavigationCategoryLevel2[]
  hasMore: boolean
  viewMoreHref: string
}

export const Level2Items: React.FC<Level2ItemsProps> = ({
  items,
  hasMore,
  viewMoreHref,
}) => {
  return (
    <div className="flex-1 min-w-[360px]">
      <div className="grid grid-cols-3 gap-1">
        {items.map((level2) => (
          <Link
            key={level2.id}
            href={level2.href}
            className="block px-2 py-2 text-sm text-gray-600 hover:text-primary-700 transition-colors rounded-lg whitespace-nowrap overflow-hidden text-ellipsis border-b-2 border-transparent hover:border-primary-700"
            title={level2.name}
          >
            {level2.name}
          </Link>
        ))}
        {hasMore && (
          <Link
            href={viewMoreHref}
            className="block px-2 py-2 text-sm text-primary-600 hover:text-primary-700 transition-colors rounded-lg font-medium border-b-2 border-transparent hover:border-primary-700"
          >
            Xem thêm
          </Link>
        )}
      </div>
    </div>
  )
}
