'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Product } from '@/lib/services/products'

interface ProductDescriptionSectionProps {
  product: Product
}

interface Ingredient {
  name: string
  amount: string
}

/**
 * Parse ingredients string thành array of {name, amount}
 * Ví dụ: "Calci glucoheptonat: 550mg, Vitamin D3: 100iu" 
 * -> [{name: "Calci glucoheptonat", amount: "550mg"}, ...]
 */
function parseIngredients(ingredientsStr: string | undefined): Ingredient[] {
  if (!ingredientsStr) return []
  
  // Split by comma, semicolon, or newline
  const parts = ingredientsStr.split(/[,;\n]/).map(s => s.trim()).filter(Boolean)
  
  return parts.map(part => {
    // Try to split by colon or dash
    const match = part.match(/^(.+?)[:\-]\s*(.+)$/)
    if (match) {
      return {
        name: match[1].trim(),
        amount: match[2].trim()
      }
    }
    // If no separator, return as name only
    return {
      name: part,
      amount: ''
    }
  })
}

interface Section {
  id: string
  label: string
  hasContent: boolean
}

export function ProductDescriptionSection({ product }: ProductDescriptionSectionProps) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [headerHeight, setHeaderHeight] = useState<number>(120)
  
  // Refs for each section
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Memoize parsed ingredients
  const ingredients = useMemo(
    () => parseIngredients(product.medicine.ingredients),
    [product.medicine.ingredients]
  )

  // Memoize content checks
  const contentChecks = useMemo(() => ({
    hasIngredients: ingredients.length > 0,
    hasDescription: !!product.medicine.description,
    hasUsage: !!product.medicine.usage,
    hasDosage: !!product.medicine.dosage,
    hasAdverseEffect: !!product.medicine.adverse_effect,
    hasCareful: !!product.medicine.careful,
    hasPreservation: !!product.medicine.preservation,
  }), [ingredients, product.medicine])

  // Memoize sections
  const sections: Section[] = useMemo(() => [
    { id: 'description', label: 'Mô tả', hasContent: contentChecks.hasDescription },
    { id: 'ingredients', label: 'Thành phần', hasContent: contentChecks.hasIngredients },
    { id: 'usage', label: 'Công dụng', hasContent: contentChecks.hasUsage },
    { id: 'dosage', label: 'Cách dùng', hasContent: contentChecks.hasDosage },
    { id: 'adverse-effect', label: 'Tác dụng phụ', hasContent: contentChecks.hasAdverseEffect },
    { id: 'careful', label: 'Lưu ý', hasContent: contentChecks.hasCareful },
    { id: 'preservation', label: 'Bảo quản', hasContent: contentChecks.hasPreservation },
  ], [contentChecks])

  const visibleSections = useMemo(
    () => sections.filter(s => s.hasContent),
    [sections]
  )

  // Check if there's any content to show
  const hasContent = useMemo(
    () => Object.values(contentChecks).some(Boolean),
    [contentChecks]
  )

  // Calculate header height dynamically
  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('header')
      const navBar = document.querySelector('nav')
      if (header && navBar) {
        const headerRect = header.getBoundingClientRect()
        const navRect = navBar.getBoundingClientRect()
        const totalHeight = headerRect.height + navRect.height
        setHeaderHeight(totalHeight)
      } else if (header) {
        setHeaderHeight(header.getBoundingClientRect().height)
      }
    }

    calculateHeaderHeight()
    window.addEventListener('resize', calculateHeaderHeight)
    
    return () => {
      window.removeEventListener('resize', calculateHeaderHeight)
    }
  }, [])

  // Throttle function for scroll handler
  const throttle = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null
    let lastExecTime = 0
    return () => {
      const currentTime = Date.now()
      if (currentTime - lastExecTime > delay) {
        func()
        lastExecTime = currentTime
      } else {
        if (timeoutId) clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          func()
          lastExecTime = Date.now()
        }, delay - (currentTime - lastExecTime))
      }
    }
  }, [])

  // Setup scroll tracking to update active section
  useEffect(() => {
    if (!hasContent || visibleSections.length === 0) return

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const viewportTop = scrollTop + headerHeight + 20

      // Find the section that is currently in view
      let currentSection: string | null = null
      
      for (const section of visibleSections) {
        const element = sectionRefs.current[section.id]
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = scrollTop + rect.top
          const elementBottom = elementTop + rect.height

          if (elementTop <= viewportTop && elementBottom > viewportTop) {
            currentSection = section.id
            break
          }
        }
      }

      // If no section found, find the closest one above viewport
      if (!currentSection) {
        let closestSection: string | null = null
        let closestDistance = Infinity

        for (const section of visibleSections) {
          const element = sectionRefs.current[section.id]
          if (element) {
            const rect = element.getBoundingClientRect()
            const elementTop = scrollTop + rect.top
            const distance = Math.abs(elementTop - viewportTop)

            if (elementTop <= viewportTop && distance < closestDistance) {
              closestDistance = distance
              closestSection = section.id
            }
          }
        }

        currentSection = closestSection || visibleSections[0]?.id || null
      }

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    // Throttled scroll handler
    const throttledHandleScroll = throttle(handleScroll, 100)

    // Initial check
    handleScroll()

    // Listen to scroll events
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [hasContent, headerHeight, visibleSections, activeSection, throttle])

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      setActiveSection(sectionId)
      
      const offset = headerHeight + 20
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      })
    }
  }, [headerHeight])

  if (!hasContent) {
    return null
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <div 
            className="sticky overflow-y-auto pb-4"
            style={{
              top: `${headerHeight}px`,
              maxHeight: `calc(100vh - ${headerHeight}px)`,
            }}
          >
            <nav className="space-y-1">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(section.id)
                  }}
                  className={`w-full text-left px-4 py-3 transition-all text-sm rounded-xl ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:text-primary-600 hover:border-b-2 hover:border-primary-600'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Navigation - Horizontal Scroll */}
        <div className="lg:hidden mb-4">
          <div className="overflow-x-auto pb-2 -mx-6 px-6">
            <nav className="flex gap-2 min-w-max">
              {visibleSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                    activeSection === section.id
                      ? 'bg-primary-600 text-white font-medium shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="space-y-8">
            {/* Description */}
            {contentChecks.hasDescription && (
              <div
                id="description"
                ref={(el) => {
                  sectionRefs.current.description = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {product.medicine.name} là gì?
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.medicine.description}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {contentChecks.hasIngredients && (
              <div
                id="ingredients"
                ref={(el) => {
                  sectionRefs.current.ingredients = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Thành phần của {product.medicine.name}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                          Thông tin thành phần
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                          Hàm lượng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map((ingredient, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-3 text-gray-700">
                            {ingredient.name}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-gray-700">
                            {ingredient.amount || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Usage */}
            {contentChecks.hasUsage && (
              <div
                id="usage"
                ref={(el) => {
                  sectionRefs.current.usage = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Công dụng của {product.medicine.name}
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.medicine.usage}
                </div>
              </div>
            )}

            {/* Dosage */}
            {contentChecks.hasDosage && (
              <div
                id="dosage"
                ref={(el) => {
                  sectionRefs.current.dosage = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Cách dùng
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.medicine.dosage}
                </div>
              </div>
            )}

            {/* Adverse Effects */}
            {contentChecks.hasAdverseEffect && (
              <div
                id="adverse-effect"
                ref={(el) => {
                  sectionRefs.current['adverse-effect'] = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tác dụng phụ
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.medicine.adverse_effect}
                </div>
              </div>
            )}

            {/* Careful / Notes */}
            {contentChecks.hasCareful && (
              <div
                id="careful"
                ref={(el) => {
                  sectionRefs.current.careful = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Lưu ý
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.medicine.careful}
                </div>
              </div>
            )}

            {/* Preservation */}
            {contentChecks.hasPreservation && (
              <div
                id="preservation"
                ref={(el) => {
                  sectionRefs.current.preservation = el
                }}
                className="scroll-mt-32"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Bảo quản
                </h3>
                <div className="text-gray-700 whitespace-pre-line">
                  {product.medicine.preservation}
                </div>
              </div>
            )}
        
          </div>
        </div>
      </div>
    </div>
  )
}