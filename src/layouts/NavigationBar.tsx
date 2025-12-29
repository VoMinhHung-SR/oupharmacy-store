'use client'

import Link from 'next/link'
import React, { useRef, useState, useEffect } from 'react'
import Container from '@/components/Container'

const categories = [
  { name: 'Thực phẩm chức năng', href: '/thuc-pham-chuc-nang' },
  { name: 'Dược mỹ phẩm', href: '/duoc-my-pham' },
  { name: 'Thuốc', href: '/thuoc' },
  { name: 'Chăm sóc cá nhân', href: '/cham-soc-ca-nhan' },
  { name: 'Thiết bị y tế', href: '/thiet-bi-y-te' },
  { name: 'Tiêm chủng', href: '/tiem-chung' },
  { name: 'Bệnh & Góc sức khỏe', href: '/benh-goc-suc-khoe' },
  { name: 'Hệ thống nhà thuốc', href: '/he-thong-nha-thuoc' },
]

export const NavigationBar: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

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
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <Container>
        <div className="flex items-center gap-0">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-l-lg transition-colors h-full flex items-center"
              aria-label="Scroll left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Categories container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-6 overflow-x-auto scrollbar-hide flex-1 min-w-0"
          >
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="flex items-center gap-1 py-3 px-2 hover:bg-primary-50 hover:text-primary-700 text-gray-700 transition-colors whitespace-nowrap"
              >
                <span className="text-sm font-medium">{category.name}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-r-lg transition-colors h-full flex items-center"
              aria-label="Scroll right"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </Container>
    </nav>
  )
}

export default NavigationBar

