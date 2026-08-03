'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Subcategory } from '@/lib/services/products'
import { CategoryIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { markStoreNavIntent } from '@/lib/store-path/nav-intent'

interface SubcategoriesHorizontalListProps {
  subcategories: Subcategory[]
  currentCategorySlug: string
}

/**
 * Extract subcategory name only (remove parent category name before " > ")
 * Example: "Thực phẩm chức năng > Hỗ trợ điều trị" -> "Hỗ trợ điều trị"
 */
function getSubcategoryName(fullName: string): string {
  const parts = fullName.split(' > ')
  return parts.length > 1 ? parts[parts.length - 1] : fullName
}

export function SubcategoriesHorizontalList({
  subcategories,
  currentCategorySlug,
}: SubcategoriesHorizontalListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      window.addEventListener('resize', checkScrollButtons)
      return () => {
        container.removeEventListener('scroll', checkScrollButtons)
        window.removeEventListener('resize', checkScrollButtons)
      }
    }
  }, [checkScrollButtons, subcategories])

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }, [])

  if (!subcategories || subcategories.length === 0) {
    return null
  }

  const buttonBase =
    'flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'

  const buttonActive = 'bg-white text-gray-700 shadow-md'

  const buttonDisabled = 'cursor-not-allowed bg-gray-100 text-gray-300'

  return (
    <div className="mb-6 flex items-stretch">
      {/* LEFT BUTTON */}
      <div className="w-12 flex items-center justify-center">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left through subcategories"
          title="Cuộn trái"
          className={`
            ${buttonBase}
            ${canScrollLeft ? buttonActive : buttonDisabled}
          `}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
      </div>

      {/* SCROLL CONTENT */}
      <div
        ref={scrollContainerRef}
        className="
          flex flex-1 items-center gap-2
          overflow-x-auto overflow-y-hidden
          scrollbar-hide scroll-smooth
        "
        role="region"
        aria-label="Subcategories list"
      >
        {subcategories.map((subcat) => (
          <Link
            key={subcat.slug}
            href={`/${subcat.slug}`}
            onClick={() => markStoreNavIntent('category', subcat.slug)}
            className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            title={`View ${getSubcategoryName(subcat.name)} category`}
          >
            <div className="flex h-4 w-4 shrink-0 items-center justify-center">
              <CategoryIcon
                categorySlug={subcat.slug}
                className="h-5 w-5 text-gray-600"
                aria-hidden="true"
              />
            </div>

            <span className="text-xs font-medium text-gray-700 truncate">
              {getSubcategoryName(subcat.name)}
            </span>
          </Link>
        ))}
      </div>

      {/* RIGHT BUTTON */}
      <div className="w-12 flex items-center justify-center">
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right through subcategories"
          title="Cuộn phải"
          className={`
            ${buttonBase}
            ${canScrollRight ? buttonActive : buttonDisabled}
          `}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )

}
