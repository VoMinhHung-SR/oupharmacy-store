'use client'

import Link from 'next/link'
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import Container from '@/components/Container'

interface NavigationCategoryLevel2 {
  id: number
  name: string
  href: string
}

interface NavigationCategoryChild {
  id: number
  name: string
  href: string
  total?: number
  level2: NavigationCategoryLevel2[]
}

interface NavigationCategory {
  id: number
  name: string
  href: string
  children: NavigationCategoryChild[]
}

interface NavigationBarProps {
  categories: NavigationCategory[]
}

// Component cho Level 1 items
interface Level1ItemsProps {
  items: NavigationCategoryChild[]
  activeLevel1Id: number | null
  onLevel1Hover: (id: number) => void
  categoryHref: string // Level 0 category href cho "Xem thêm"
}

const Level1Items: React.FC<Level1ItemsProps> = ({ items, activeLevel1Id, onLevel1Hover, categoryHref }) => {
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
            className={`block px-4 py-2.5 text-sm font-medium transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis ${
              isActive && hasLevel2
                ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-700'
                : 'text-gray-900 hover:bg-primary-50 hover:text-primary-700 hover:border-b-2 hover:border-primary-700'
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
          className="block px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 hover:text-primary-700 transition-colors rounded-lg font-medium"
        >
          Xem thêm
        </Link>
      )}
    </div>
  )
}

interface Level2ItemsProps {
  items: NavigationCategoryLevel2[]
  hasMore: boolean
  viewMoreHref: string
}

const Level2Items: React.FC<Level2ItemsProps> = ({ items, hasMore, viewMoreHref }) => {
  return (
    <div className="flex-1 min-w-[360px] border-l border-gray-200 px-6">
      <div className="grid grid-cols-3 gap-1">
        {items.map((level2) => (
          <Link
            key={level2.id}
            href={level2.href}
            className="block px-2 py-4 text-sm text-gray-600 hover:text-primary-700 hover:border-b-2 hover:border-primary-700 transition-all rounded-lg whitespace-nowrap overflow-hidden text-ellipsis"
            title={level2.name}
          >
            {level2.name}
          </Link>
        ))}
        {hasMore && (
          <Link
            href={viewMoreHref}
            className="block px-2 py-4 text-sm text-primary-600 hover:text-primary-700 hover:border-b-2 hover:border-primary-700 transition-all rounded-lg font-medium"
          >
            Xem thêm
          </Link>
        )}
      </div>
    </div>
  )
}

// Component cho Dropdown
interface DropdownProps {
  category: NavigationCategory
  hoveredLevel1Id: number | null
  position: { top: number; left: number }
  onLevel1Hover: (id: number) => void
  onClose: () => void
}

const Dropdown: React.FC<DropdownProps> = ({ 
  category, 
  hoveredLevel1Id, 
  position, 
  onLevel1Hover,
  onClose 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const bridgeRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const activeLevel1 = useMemo(() => {
    if (hoveredLevel1Id) {
      return category.children.find(l1 => l1.id === hoveredLevel1Id)
    }
    return category.children.find(l1 => l1.level2 && l1.level2.length > 0) || category.children[0]
  }, [category.children, hoveredLevel1Id])

  const level2Items = activeLevel1?.level2 || []
  const total = activeLevel1?.total
  const hasMoreLevel2 = total ? total > 6 : level2Items.length > 6
  const displayLevel2 = level2Items.slice(0, 6)

  const hasAnyLevel2 = useMemo(() => {
    return category.children.some(l1 => l1.level2 && l1.level2.length > 0)
  }, [category.children])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null
    
    if (
      relatedTarget instanceof Element &&
      (relatedTarget.closest('[data-category-id]') ||
       dropdownRef.current?.contains(relatedTarget) ||
       bridgeRef.current?.contains(relatedTarget))
    ) {
      return
    }

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }

    closeTimeoutRef.current = setTimeout(() => {
      if (
        !dropdownRef.current?.matches(':hover') &&
        !bridgeRef.current?.matches(':hover')
      ) {
        onClose()
      }
    }, 100)
  }, [onClose])

  const dropdownWidth = hasAnyLevel2 ? '800px' : '280px'
  const bridgeWidth = hasAnyLevel2 ? '800px' : '280px'

  return (
    <>
      <div
        ref={bridgeRef}
        data-bridge-area
        className="fixed bg-transparent z-[29]"
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: bridgeWidth,
          height: '12px',
          pointerEvents: 'auto',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div
        ref={dropdownRef}
        className={`fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[30] py-4 ${
          hasAnyLevel2 ? 'min-w-[800px] max-w-[1000px]' : 'w-[280px]'
        }`}
        style={{ 
          position: 'fixed',
          top: `${position.top + 8}px`,
          left: `${position.left}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasAnyLevel2 ? (
          <div className="grid grid-cols-[30%_70%] gap-8 px-4">
            <Level1Items
              items={category.children}
              activeLevel1Id={activeLevel1?.id || null}
              onLevel1Hover={onLevel1Hover}
              categoryHref={category.href}
            />
            
            {displayLevel2.length > 0 && activeLevel1 && (
              <Level2Items
                items={displayLevel2}
                hasMore={hasMoreLevel2}
                viewMoreHref={activeLevel1.href}
              />
            )}
          </div>
        ) : (
          <div className="px-2">
            <Level1Items
              items={category.children}
              activeLevel1Id={activeLevel1?.id || null}
              onLevel1Hover={onLevel1Hover}
              categoryHref={category.href}
            />
          </div>
        )}
      </div>
    </>
  )
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ categories = [] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null)
  const [hoveredLevel1Id, setHoveredLevel1Id] = useState<number | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null)
  const categoryRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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
  }, [checkScrollButtons])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        target &&
        !target.closest('[data-category-id]') &&
        !target.closest('[data-bridge-area]') &&
        !target.closest('[data-dropdown]')
      ) {
        setHoveredCategoryId(null)
        setHoveredLevel1Id(null)
        setDropdownPosition(null)
      }
    }

    if (hoveredCategoryId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [hoveredCategoryId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

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

  const handleCategoryMouseEnter = useCallback((categoryId: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }

    if (hoveredCategoryId !== categoryId) {
      setHoveredLevel1Id(null)
    }

    setHoveredCategoryId(categoryId)
    
    const categoryElement = categoryRefs.current.get(categoryId)
    if (categoryElement) {
      const rect = categoryElement.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      })
    }
  }, [hoveredCategoryId])

  const handleCategoryMouseLeave = useCallback((e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null
    
    if (
      relatedTarget instanceof Element &&
      (relatedTarget.closest('[data-bridge-area]') ||
       relatedTarget.closest('[data-dropdown]'))
    ) {
      return
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategoryId(null)
      setHoveredLevel1Id(null)
      setDropdownPosition(null)
    }, 150)
  }, [])

  const handleLevel1Hover = useCallback((level1Id: number) => {
    // Chỉ update nếu đang có category được hover
    if (hoveredCategoryId !== null) {
      setHoveredLevel1Id(level1Id)
    }
  }, [hoveredCategoryId])

  const handleDropdownClose = useCallback(() => {
    setHoveredCategoryId(null)
    setHoveredLevel1Id(null)
    setDropdownPosition(null)
  }, [])

  const hoveredCategory = useMemo(() => {
    return categories.find(cat => cat.id === hoveredCategoryId)
  }, [categories, hoveredCategoryId])

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm relative z-20" style={{ overflow: 'visible' }}>
      <Container className="relative" style={{ overflow: 'visible' }}>
        <div className="flex items-center gap-0 relative" style={{ overflow: 'visible' }}>
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

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-6 overflow-x-auto overflow-y-visible scrollbar-hide flex-1 min-w-0"
          >
            {categories.map((category) => {
              const hasChildren = category.children && category.children.length > 0
              const isHovered = hoveredCategoryId === category.id

              return (
                <div
                  key={category.id}
                  data-category-id={category.id}
                  ref={(el) => {
                    if (el) {
                      categoryRefs.current.set(category.id, el)
                    } else {
                      categoryRefs.current.delete(category.id)
                    }
                  }}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasChildren) {
                      handleCategoryMouseEnter(category.id)
                    }
                  }}
                  onMouseLeave={handleCategoryMouseLeave}
                >
              <Link
                href={category.href}
                    className={`flex items-center gap-1 py-3 px-2 border-b-2 border-transparent hover:text-primary-700 hover:border-primary-700 text-gray-700 transition-all whitespace-nowrap ${
                      isHovered ? 'text-primary-700 border-primary-700' : ''
                    }`}
              >
                <span className="text-sm font-medium">{category.name}</span>
                    {hasChildren && (
                      <svg 
                        className={`w-4 h-4 transition-transform ${isHovered ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                    )}
              </Link>
                </div>
              )
            })}
          </div>

          {/* Dropdown menu */}
          {hoveredCategoryId !== null && dropdownPosition && hoveredCategory && (
            <div data-dropdown>
              <Dropdown
                category={hoveredCategory}
                hoveredLevel1Id={hoveredLevel1Id}
                position={dropdownPosition}
                onLevel1Hover={handleLevel1Hover}
                onClose={handleDropdownClose}
              />
            </div>
          )}

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
