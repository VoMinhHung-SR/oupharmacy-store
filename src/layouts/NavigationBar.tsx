'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import React, { useRef, useState, useEffect } from 'react'
import Container from '@/components/Container'

const categories = [
  { name: 'Thực phẩm chức năng', href: '/categories/thuc-pham-chuc-nang' },
  { name: 'Dược mỹ phẩm', href: '/categories/duoc-my-pham' },
  { name: 'Thuốc', href: '/categories/thuoc' },
  { name: 'Chăm sóc cá nhân', href: '/categories/cham-soc-ca-nhan' },
  { name: 'Thiết bị y tế', href: '/categories/thiet-bi-y-te' },
  { name: 'Tiêm chủng', href: '/categories/tiem-chung' },
  { name: 'Bệnh & Góc sức khỏe', href: '/categories/benh-goc-suc-khoe' },
  { name: 'Hệ thống nhà thuốc', href: '/categories/he-thong-nha-thuoc' },
]

export const NavigationBar: React.FC = () => {
  const locale = useLocale()
  const createLink = (href: string) => `/${locale}${href}`
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
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <Container>
        <div className="flex items-center gap-0">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 p-2.5 rounded-l-lg transition-colors h-full flex items-center"
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
                href={createLink(category.href)}
                className="flex items-center gap-1 py-3 px-2 hover:bg-white/20 transition-colors whitespace-nowrap"
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
              className="flex-shrink-0 bg-white/20 hover:bg-white/30 p-2.5 rounded-r-lg transition-colors h-full flex items-center"
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

