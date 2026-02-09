'use client'

import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { NAVBAR_DROPDOWN } from '@/lib/constant'
import type { NavigationCategory, DropdownPosition } from './types'
import { Level1Items } from './Level1Items'
import { Level2Items } from './Level2Items'
import { TopProducts } from './TopProducts'

export interface DropdownProps {
  category: NavigationCategory
  hoveredLevel1Id: number | null
  position: DropdownPosition
  onLevel1Hover: (id: number) => void
  onClose: () => void
  onProductNavigate: () => void
}

const { GAP: DROPDOWN_GAP } = NAVBAR_DROPDOWN

export const Dropdown: React.FC<DropdownProps> = ({
  category,
  hoveredLevel1Id,
  position,
  onLevel1Hover,
  onClose,
  onProductNavigate,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const bridgeRef = useRef<HTMLDivElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const activeLevel1 = useMemo(() => {
    if (hoveredLevel1Id) {
      return category.children.find((l1) => l1.id === hoveredLevel1Id)
    }
    return (
      category.children.find((l1) => l1.level2 && l1.level2.length > 0) ||
      category.children[0]
    )
  }, [category.children, hoveredLevel1Id])

  const level2Items = activeLevel1?.level2 || []
  const total = activeLevel1?.total
  const hasMoreLevel2 = total ? total > 6 : level2Items.length > 6
  const displayLevel2 = level2Items.slice(0, 6)

  const hasAnyLevel2 = useMemo(
    () =>
      category.children.some((l1) => l1.level2 && l1.level2.length > 0),
    [category.children],
  )

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

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent) => {
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
    },
    [onClose],
  )

  const bridgeWidth = hasAnyLevel2
    ? `${NAVBAR_DROPDOWN.WIDTH_LARGE}px`
    : `${NAVBAR_DROPDOWN.WIDTH_SMALL}px`

  return (
    <>
      <div
        ref={bridgeRef}
        data-bridge-area
        className="fixed bg-transparent z-[29]"
        style={{
          position: 'fixed',
          top: `${position.top - DROPDOWN_GAP}px`,
          left: `${position.left}px`,
          width: bridgeWidth,
          height: `${DROPDOWN_GAP}px`,
          pointerEvents: 'auto',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div
        ref={dropdownRef}
        className={`fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[30] flex flex-col ${
          hasAnyLevel2 ? 'min-w-[800px] max-w-[1000px]' : 'w-[280px]'
        }`}
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          maxHeight: `${position.maxHeight}px`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hasAnyLevel2 ? (
          <div className="flex flex-col min-h-0 flex-1 overflow-y-auto py-4">
            <div className="px-6 py-2">
              <div className="grid grid-cols-[30%_70%] gap-4">
                <div className="relative z-10 border-r border-gray-100 pr-8 bg-white">
                  <Level1Items
                    items={category.children}
                    activeLevel1Id={activeLevel1?.id ?? null}
                    onLevel1Hover={onLevel1Hover}
                    categoryHref={category.href}
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  {displayLevel2.length > 0 && activeLevel1 && (
                    <Level2Items
                      items={displayLevel2}
                      hasMore={hasMoreLevel2}
                      viewMoreHref={activeLevel1.href}
                    />
                  )}
                  {activeLevel1?.topProducts &&
                    activeLevel1.topProducts.length > 0 && (
                      <div>
                        <TopProducts
                          products={activeLevel1.topProducts}
                          categoryHref={activeLevel1.href}
                          onNavigate={onProductNavigate}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto py-4 min-h-0 flex-1">
            <div className="px-2">
              <Level1Items
                items={category.children}
                activeLevel1Id={activeLevel1?.id ?? null}
                onLevel1Hover={onLevel1Hover}
                categoryHref={category.href}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
