'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Product, getProductEntity, getProductName } from '@/lib/services/products'
import { HtmlContent } from '@/components/common/HtmlContent'

interface ProductDescriptionSectionProps {
  product: Product
}

interface Ingredient {
  name: string
  amount: string
}

interface ParsedIngredients {
  basis: string | null
  items: Ingredient[]
}

function splitTopLevelCommas(s: string): string[] {
  const out: string[] = []
  let depth = 0
  let buf = ''
  for (const ch of s) {
    if (ch === '(') depth++
    else if (ch === ')') depth = Math.max(0, depth - 1)
    if (ch === ',' && depth === 0) {
      const t = buf.trim()
      if (t) out.push(t)
      buf = ''
    } else {
      buf += ch
    }
  }
  const tail = buf.trim()
  if (tail) out.push(tail)
  return out
}

function parseIngredients(ingredientsStr: string | undefined): ParsedIngredients {
  if (!ingredientsStr) return { basis: null, items: [] }

  let body = ingredientsStr.trim()
  let basis: string | null = null
  const basisMatch = body.match(/^([\d.,]+\s*\S+\s+ch\u1ee9a)\s*:\s*/i)
  if (basisMatch) {
    basis = basisMatch[1].trim()
    body = body.slice(basisMatch[0].length).trim()
  }

  if (!body) return { basis, items: [] }

  const parts = splitTopLevelCommas(body)

  const items: Ingredient[] = parts.map(part => {
    const pmatch = part.match(/^(.+?)\s*\(([^()]+)\)\s*$/)
    if (pmatch) {
      return { name: pmatch[1].trim(), amount: pmatch[2].trim() }
    }
    const cmatch = part.match(/^(.+?)[:\-]\s*(.+)$/)
    if (cmatch) {
      return { name: cmatch[1].trim(), amount: cmatch[2].trim() }
    }
    return { name: part, amount: '' }
  })

  return { basis, items }
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

  const productEntity = useMemo(() => getProductEntity(product), [product])
  const productName = useMemo(() => getProductName(product), [product])

  // Memoize parsed ingredients (basis + items)
  const parsedIngredients = useMemo(
    () => parseIngredients(productEntity?.ingredients),
    [productEntity?.ingredients]
  )
  const ingredients = parsedIngredients.items
  const ingredientsBasis = parsedIngredients.basis

  // Memoize content checks
  const contentChecks = useMemo(() => ({
    hasIngredients: ingredients.length > 0,
    hasDescription: !!productEntity?.description,
    hasUsage: !!productEntity?.usage,
    hasDosage: !!productEntity?.dosage,
    hasAdverseEffect: !!productEntity?.adverse_effect,
    hasCareful: !!productEntity?.careful,
    hasPreservation: !!productEntity?.preservation,
  }), [ingredients, productEntity])

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
                  {productName} là gì?
                </h3>
                <HtmlContent html={
                  // productEntity?.description
                  "<div><h3>Bổ sung vitamin cho cơ thể</h3><p><strong>Viên sủi Kudos Daily Vitamins Plus Biotin &amp; Ginseng</strong> hương cam là một thức uống thơm ngon và sảng khoái giàu vitamin giúp tăng cường sức khỏe và đề kháng hàng ngày. Biotin rất quan trọng cho làn da, tóc và móng tay khỏe mạnh. Nhân sâm có tác dụng tiếp thêm sinh lực và hỗ trợ tăng cường nhận thức. Sản phẩm sản xuất tại Đức, tiêu chuẩn chất lượng Châu Âu.</p><p></p><p>Vitamin tham gia vào các quá trình quan trọng khác nhau trong cơ thể như hình thành tế bào, tạo máu và điều hòa quá trình trao đổi chất. Tuy nhiên nó không thể được tổng hợp độc lập bởi cơ thể con người mà chỉ được hấp thụ thông qua thực phẩm.</p><p>Viên sủi Kudos Daily Vitamins Plus Biotin &amp; Ginseng hương cam chứa 12 loại vitamin, biotin và chiết xuất <strong>nhân sâm</strong> giúp hỗ trợ sức khỏe miễn dịch, cân bằng năng lượng và sức khỏe tổng thể hàng ngày. Sản phẩm có hương cam thơm ngon, dễ uống và dễ hấp thu.</p><h3>Bổ sung năng lượng cho cơ thể</h3><p>Công thức chứa vitamin C và tất cả 8 loại <strong>vitamin B</strong> giúp giải phóng năng lượng từ thức ăn, tham gia vào quá trình trao đổi chất tạo năng lượng bình thường, góp phần làm giảm tình trạng kiệt sức và mệt mỏi, đồng thời hỗ trợ sức bền thể chất và tinh thần. Điều này làm cho Kudos Daily Vitamins Plus Biotin &amp; Ginseng hương cam trở thành một lựa chọn tốt để trải qua một ngày dài.</p><h3>Tăng cường miễn dịch</h3><p>Các vitamin B6, B12, C và D có trong viên sủi Kudos Daily Vitamins Plus Biotin &amp; Ginseng hương cam có thể tăng cường khả năng phòng vệ của cơ thể và hỗ trợ hệ thống miễn dịch.</p><h3>Giúp xương, cơ chắc khỏe</h3><p><strong>Thiếu vitamin D</strong> sẽ gây ra tình trạng ảnh hưởng đến sự phát triển của xương ở người lớn và có thể gây ra chứng nhuyễn xương (xương mềm) và yếu cơ.</p><p>Vitamin D đã được phát hiện là có vai trò quan trọng trong quá trình tái tạo và tổn thương cơ bắp.</p><p>Viên sủi Kudos Daily Vitamins Plus Biotin &amp; Ginseng hương cam với hàm lượng vitamin C và D cân bằng sẽ góp phần duy trì xương và các chức năng của cơ bắp khỏe mạnh bình thường.</p><h3>Cải thiện làn da</h3><p>Vitamin A là retinol thường có trong thành phần chăm sóc da phổ biến, giúp củng cố làn da, bảo vệ collagen, kích thích tái tạo tế bào da nhằm chống lại sự lão hóa.</p><p>Vitamin C là thành phần quan trọng trong việc hình thành collagen, trong khi vitamin E, chất chống oxy hóa hòa tan trong chất béo, giúp chống viêm, làm dịu da và ngăn ngừa tổn thương da.</p><p>Viên sủi Kudos Daily Vitamins Plus Biotin &amp; Ginseng hương cam ngoài chứa vitamin A, C, E còn được bổ sung bitotn sẽ hỗ trợ làn da thêm khỏe mạnh.</p><h3>Tăng cường sinh lực và chức năng hệ thần kinh</h3><p>Sản phẩm ngoài các loại vitamin tổng hợp còn chứa chiết xuất nhân sâm giúp tăng cường sinh lực và tăng cường chức năng hệ thần kinh.</p><h3>Dễ dàng hoàn tan, thơm ngon dễ uống</h3><p>Sản phẩm dạng viên sủi có thể hòa tan nhanh chóng và hoàn toàn, ngăn chặn sự tập trung cục bộ của các thành phần. Từ đó, ít có khả năng gây kích ứng hệ tiêu hóa vì chúng dễ dung nạp hơn trong đường tiêu hóa, không gây khó chịu cho dạ dày.</p><p>Viên sủi Kudos Daily Vitamins Plus Biotin &amp; Ginseng còn có hương cam thơm ngon, hấp dẫn hơn khi uống.</p><p></p><p>Kudos là thương hiệu thực phẩm chức năng cao cấp đến từ Đức, bao gồm các dòng sản phẩm chăm sóc sức khỏe, sắc đẹp và nâng cao hiệu suất hoạt động, hướng đến mục tiêu trở thành một trong những thương hiệu thực phẩm chức năng hàng đầu châu Á và vươn xa toàn cầu.</p><p>Kudos mang sứ mệnh đem đến một cuộc sống khỏe hơn, lành mạnh hơn cho chính bạn và những người bạn thương yêu. Trong từng sản phẩm, Kudos luôn đặt chất lượng, hiệu quả và tính an toàn làm tiêu chí hàng đầu. Hãng cũng không ngừng nghiên cứu và phát triển các sản phẩm mới để đáp ứng nhu cầu chăm sóc sức khỏe của nhiều đối tượng. Dù bạn ở độ tuổi, giới tính và lối sống nào, Kudos luôn có lựa chọn dành cho bạn.</p></div>"
                  } />
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
                  Thành phần của {productName}
                </h3>
                {ingredientsBasis && (
                  <p className="text-sm text-gray-600 mb-2 italic">
                    {`Thành phần cho ${ingredientsBasis.replace(/\s+ch\u1ee9a$/i, '').trim()}:`}
                  </p>
                )}
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
                  Công dụng của {productName}
                </h3>
                <HtmlContent html={productEntity?.usage} />
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
                <HtmlContent html={productEntity?.dosage} />
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
                <HtmlContent html={productEntity?.adverse_effect} />
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
                <HtmlContent html={productEntity?.careful} />
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
                <HtmlContent html={productEntity?.preservation} />
              </div>
            )}
        
          </div>
        </div>
      </div>
    </div>
  )
}