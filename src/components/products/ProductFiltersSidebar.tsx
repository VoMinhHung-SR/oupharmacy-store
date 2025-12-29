'use client'

import React, { useState } from 'react'
import { ProductFilters } from '@/lib/services/products'
import { Category } from '@/lib/services/categories'
import { Brand } from '@/lib/services/brands'
import { PRODUCT_FILTERS, SIDEBAR } from '@/lib/constant'
import { ChevronDownIcon, SearchIcon } from '@/components/icons'

interface ProductFiltersSidebarProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  categories?: Category[]
  brands?: Brand[]
}

const TARGET_AUDIENCES = PRODUCT_FILTERS.TARGET_AUDIENCES
const PRICE_RANGES = PRODUCT_FILTERS.PRICE_RANGES
const FLAVORS = PRODUCT_FILTERS.FLAVORS

export const ProductFiltersSidebar: React.FC<ProductFiltersSidebarProps> = ({
  filters,
  onFiltersChange,
  categories = [],
  brands = [],
}) => {
  const [expandedSections, setExpandedSections] = useState({
    targetAudience: true,
    price: true,
    flavor: true,
    country: false,
  })
  const [targetAudienceSearch, setTargetAudienceSearch] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [selectedFlavor, setSelectedFlavor] = useState<string>('all')

  const handlePriceRangeClick = (index: number, min: number, max?: number) => {
    if (selectedPriceRange === index) {
      // Deselect
      setSelectedPriceRange(null)
      const newFilters = { ...filters }
      delete newFilters.min_price
      delete newFilters.max_price
      onFiltersChange(newFilters)
    } else {
      // Select
      setSelectedPriceRange(index)
      onFiltersChange({
        ...filters,
        min_price: min,
        max_price: max,
      })
    }
  }

  const handleFlavorChange = (flavorId: string) => {
    setSelectedFlavor(flavorId)
    // Note: Flavor filtering would need backend support
    // For now, this is just UI
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="space-y-4 bg-white rounded-lg p-4" style={{ width: `${SIDEBAR.WIDTH}px` }}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc nâng cao</h2>

      {/* Đối tượng sử dụng */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('targetAudience')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-gray-900">Đối tượng sử dụng</h3>
          <ChevronDownIcon 
            className="w-5 h-5 text-gray-500" 
            rotated={expandedSections.targetAudience}
          />
        </button>

        {expandedSections.targetAudience && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tên"
                value={targetAudienceSearch}
                onChange={(e) => setTargetAudienceSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <SearchIcon />
              </div>
            </div>

            <div className="space-y-2">
              {TARGET_AUDIENCES.map((audience) => (
                <label key={audience.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={audience.id === 'all'}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{audience.label}</span>
                </label>
              ))}
            </div>

            <button className="text-sm text-primary-600 hover:text-primary-700">
              Xem thêm
            </button>
          </div>
        )}
      </div>

      {/* Giá bán */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-gray-900">Giá bán</h3>
          <ChevronDownIcon 
            className="w-5 h-5 text-gray-500" 
            rotated={expandedSections.price}
          />
        </button>

        {expandedSections.price && (
          <div className="space-y-2">
            {PRICE_RANGES.map((range, index) => (
              <button
                key={index}
                onClick={() => handlePriceRangeClick(index, range.min, range.max)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedPriceRange === index
                    ? 'bg-primary-100 text-primary-700 border border-primary-500'
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mùi vị/ Mùi hương */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('flavor')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-gray-900">Mùi vị/ Mùi hương</h3>
          <ChevronDownIcon 
            className="w-5 h-5 text-gray-500" 
            rotated={expandedSections.flavor}
          />
        </button>

        {expandedSections.flavor && (
          <div className="space-y-3">
            <div className="space-y-2">
              {FLAVORS.map((flavor) => (
                <label key={flavor.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFlavor === flavor.id}
                    onChange={() => handleFlavorChange(flavor.id)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{flavor.label}</span>
                </label>
              ))}
            </div>

            <button className="text-sm text-primary-600 hover:text-primary-700">
              Xem thêm
            </button>
          </div>
        )}
      </div>

      {/* Nước sản xuất */}
      <div className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleSection('country')}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <h3 className="font-medium text-gray-900">Nước sản xuất</h3>
          <ChevronDownIcon 
            className="w-5 h-5 text-gray-500" 
            rotated={expandedSections.country}
          />
        </button>

        {expandedSections.country && (
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Tất cả</span>
            </label>
            {brands.slice(0, 5).map((brand) => (
              <label key={brand.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brand === brand.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFiltersChange({ ...filters, brand: brand.id })
                    } else {
                      const newFilters = { ...filters }
                      delete newFilters.brand
                      onFiltersChange(newFilters)
                    }
                  }}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{brand.name}</span>
              </label>
            ))}
            {brands.length > 5 && (
              <button className="text-sm text-primary-600 hover:text-primary-700">
                Xem thêm
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

