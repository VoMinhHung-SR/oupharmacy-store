import Link from 'next/link'
import React from 'react'

export interface CrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: CrumbItem[]
  className?: string
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-gray-600 ${className}`}>
      <ol className="flex items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          if (item.href && !isLast) {
            return (
              <li key={index} className="flex items-center gap-2">
                <Link href={item.href} className="text-primary-500 hover:text-primary-700">{item.label}</Link>
                <span>／</span>
              </li>
            )
          }
          return (
            <li key={index} className="text-gray-900 font-medium">{item.label}</li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb


