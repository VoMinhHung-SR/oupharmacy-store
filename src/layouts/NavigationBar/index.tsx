'use client'

import Link from 'next/link'
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Container from '@/components/Container'
import { LoadingBackdrop } from '@/components/LoadingBackdrop'
import { NAVBAR_DROPDOWN } from '@/lib/constant'
import type { NavigationBarProps, NavigationCategory, DropdownPosition } from './types'
import { Dropdown } from './Dropdown'

export type { DropdownPosition } from './types'
export type { NavigationCategory, NavigationCategoryChild, ProductMinimal } from './types'

export const NavigationBar: React.FC<NavigationBarProps> = ({ categories = [] }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null)
  const [hoveredLevel1Id, setHoveredLevel1Id] = useState<number | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition | null>(
    null,
  )
  const [isNavigating, setIsNavigating] = useState(false)
  /** Mega-menu only on desktop hover — touch/mobile uses category links. */
  const [desktopMegaEnabled, setDesktopMegaEnabled] = useState(false)
  const categoryRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)')
    const sync = () => setDesktopMegaEnabled(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  useEffect(() => {
    if (!desktopMegaEnabled && hoveredCategoryId !== null) {
      setHoveredCategoryId(null)
      setHoveredLevel1Id(null)
      setDropdownPosition(null)
    }
  }, [desktopMegaEnabled, hoveredCategoryId])

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
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [hoveredCategoryId])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && hoveredCategoryId !== null) {
        setHoveredCategoryId(null)
        setHoveredLevel1Id(null)
        setDropdownPosition(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hoveredCategoryId])

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount =
        scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -NAVBAR_DROPDOWN.SCROLL_AMOUNT : NAVBAR_DROPDOWN.SCROLL_AMOUNT)
      scrollContainerRef.current.scrollTo({ left: amount, behavior: 'smooth' })
    }
  }, [])

  const handleCategoryMouseEnter = useCallback(
    (categoryId: number) => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
      if (hoveredCategoryId !== categoryId) setHoveredLevel1Id(null)
      setHoveredCategoryId(categoryId)

      const categoryElement = categoryRefs.current.get(categoryId)
      if (categoryElement) {
        const rect = categoryElement.getBoundingClientRect()
        const category = categories.find((c) => c.id === categoryId)
        const hasAnyLevel2 =
          category?.children?.some((c) => c.level2?.length) ?? false
        const dropdownWidthPx = hasAnyLevel2
          ? NAVBAR_DROPDOWN.WIDTH_LARGE
          : NAVBAR_DROPDOWN.WIDTH_SMALL
        const viewportH =
          typeof window !== 'undefined' ? window.innerHeight : 600
        const viewportW =
          typeof window !== 'undefined' ? window.innerWidth : 1024
        const preferredTop = rect.bottom + NAVBAR_DROPDOWN.GAP
        const maxHeight = Math.max(
          NAVBAR_DROPDOWN.MIN_HEIGHT,
          viewportH - preferredTop - NAVBAR_DROPDOWN.VIEWPORT_MARGIN,
        )
        const top = Math.min(
          preferredTop,
          viewportH - maxHeight - NAVBAR_DROPDOWN.VIEWPORT_MARGIN,
        )
        const left = Math.max(
          NAVBAR_DROPDOWN.VIEWPORT_MARGIN,
          Math.min(
            rect.left,
            viewportW - dropdownWidthPx - NAVBAR_DROPDOWN.VIEWPORT_MARGIN,
          ),
        )
        setDropdownPosition({ top, left, maxHeight })
      }
    },
    [hoveredCategoryId, categories],
  )

  const handleCategoryMouseLeave = useCallback((e: React.MouseEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement | null
    if (
      relatedTarget instanceof Element &&
      (relatedTarget.closest('[data-bridge-area]') ||
        relatedTarget.closest('[data-dropdown]'))
    ) {
      return
    }
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCategoryId(null)
      setHoveredLevel1Id(null)
      setDropdownPosition(null)
    }, 150)
  }, [])

  const handleLevel1Hover = useCallback((level1Id: number) => {
    if (hoveredCategoryId !== null) setHoveredLevel1Id(level1Id)
  }, [hoveredCategoryId])

  const handleDropdownClose = useCallback(() => {
    setHoveredCategoryId(null)
    setHoveredLevel1Id(null)
    setDropdownPosition(null)
  }, [])

  const handleProductNavigate = useCallback(() => {
    setIsNavigating(true)
    setHoveredCategoryId(null)
    setHoveredLevel1Id(null)
    setDropdownPosition(null)
  }, [])

  const hoveredCategory = useMemo(
    () => categories.find((cat) => cat.id === hoveredCategoryId),
    [categories, hoveredCategoryId],
  )

  return (
    <>
      <nav
        className="relative z-30 overflow-x-hidden border-b border-gray-200 bg-white shadow-sm"
        style={{ overflowX: 'hidden', overflowY: 'visible' }}
      >
        <Container className="relative overflow-x-hidden" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
          <div
            className="relative flex items-center gap-0 overflow-x-hidden"
            style={{ overflowX: 'hidden', overflowY: 'visible' }}
          >
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-l-lg transition-colors h-full flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Scroll left"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="scrollbar-hide flex min-w-0 flex-1 touch-manipulation items-center justify-start gap-3 overflow-x-auto overflow-y-hidden sm:gap-5 md:justify-center lg:justify-start"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => {
                const hasChildren =
                  category.children && category.children.length > 0
                const isHovered = hoveredCategoryId === category.id

                return (
                  <div
                    key={category.id}
                    data-category-id={category.id}
                    ref={(el) => {
                      if (el) categoryRefs.current.set(category.id, el)
                      else categoryRefs.current.delete(category.id)
                    }}
                    className="relative"
                    onMouseEnter={() => {
                      if (desktopMegaEnabled && hasChildren) {
                        handleCategoryMouseEnter(category.id)
                      }
                    }}
                    onMouseLeave={desktopMegaEnabled ? handleCategoryMouseLeave : undefined}
                  >
                    <Link
                      href={category.href}
                      className={`flex items-center justify-center gap-1 border-b-2 border-transparent px-2 py-2.5 text-gray-700 transition-colors whitespace-nowrap hover:border-primary-700 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                        isHovered ? 'border-primary-700 text-primary-700' : ''
                      }`}
                      aria-haspopup={desktopMegaEnabled && hasChildren ? 'true' : undefined}
                      aria-expanded={desktopMegaEnabled && hasChildren ? isHovered : undefined}
                    >
                      <span className="max-w-[10rem] truncate text-sm font-medium sm:max-w-none" title={category.name}>
                        {category.name}
                      </span>
                      {hasChildren && desktopMegaEnabled && (
                        <svg
                          className={`hidden h-4 w-4 transition-transform lg:block ${
                            isHovered ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </Link>
                  </div>
                )
              })}
            </div>

            {desktopMegaEnabled &&
              hoveredCategoryId !== null &&
              dropdownPosition &&
              hoveredCategory && (
                <div data-dropdown>
                  <Dropdown
                    category={hoveredCategory}
                    hoveredLevel1Id={hoveredLevel1Id}
                    position={dropdownPosition}
                    onLevel1Hover={handleLevel1Hover}
                    onClose={handleDropdownClose}
                    onProductNavigate={handleProductNavigate}
                  />
                </div>
              )}

            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-r-lg transition-colors h-full flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                aria-label="Scroll right"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>
        </Container>
      </nav>

      <LoadingBackdrop isOpen={isNavigating} size="md" />
    </>
  )
}

export default NavigationBar
