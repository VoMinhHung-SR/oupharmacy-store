'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { QuantityStepper } from '@/components/catalog/product-detail/parts/QuantityStepper'
import { ProductUnitOption } from '@/lib/services/products'

interface ProductStickyAddToCartBarProps {
  visible: boolean
  productName: string
  imageUrl?: string | null
  priceValue: number
  selectedUnitName?: string
  unitOptions: ProductUnitOption[]
  selectedUnitId: number | null
  onSelectUnit: (unitId: number) => void
  quantity: number
  maxQuantity: number
  onQuantityChange: (value: number) => void
  onAddToCart: () => void
}

export function ProductStickyAddToCartBar({
  visible,
  productName,
  imageUrl,
  priceValue,
  unitOptions,
  selectedUnitId,
  onSelectUnit,
  quantity,
  maxQuantity,
  onQuantityChange,
  onAddToCart,
}: ProductStickyAddToCartBarProps) {
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false)
  const unitMenuRef = useRef<HTMLDivElement | null>(null)
  const activeUnit =
    unitOptions.find((unit) => unit.unit_id === selectedUnitId) || unitOptions[0] || null

  useEffect(() => {
    if (!isUnitMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (!unitMenuRef.current?.contains(target)) {
        setIsUnitMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUnitMenuOpen])

  useEffect(() => {
    if (!visible && isUnitMenuOpen) {
      setIsUnitMenuOpen(false)
    }
  }, [visible, isUnitMenuOpen])

  return (
    <div
      className={`fixed inset-x-0 bottom-3 z-40 transition-all duration-300 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
      aria-hidden={!visible}
    >
      <Container className="py-1">
        <div className="mx-auto w-[90%] rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-[0_8px_24px_rgba(15,23,42,0.10)] md:px-4 md:py-3">
          <div className="flex items-center gap-3">
            {imageUrl ? (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white md:h-12 md:w-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={productName} className="h-full w-full object-cover" />
              </div>
            ) : null}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <p className="line-clamp-2 flex-1 text-sm font-semibold leading-5 text-gray-900">
                {productName}
              </p>
              <p className="shrink-0 text-base font-bold text-primary-700 md:text-lg md:leading-6">
                {priceValue.toLocaleString('vi-VN')}₫
              </p>
            </div>
            <div ref={unitMenuRef} className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsUnitMenuOpen((prev) => !prev)}
                className="inline-flex h-9 min-w-[92px] items-center justify-between gap-2 rounded-full border border-gray-300 bg-white px-3 text-sm text-gray-800 hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={isUnitMenuOpen}
              >
                <span>{activeUnit?.unit_name || 'Đơn vị'}</span>
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </button>

              {isUnitMenuOpen ? (
                <div
                  role="menu"
                  className="absolute bottom-full left-0 z-10 mb-2 min-w-[180px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                  {unitOptions.map((unit) => {
                    const isActive = unit.unit_id === (selectedUnitId ?? activeUnit?.unit_id ?? null)
                    return (
                      <button
                        key={unit.unit_id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onSelectUnit(unit.unit_id)
                          setIsUnitMenuOpen(false)
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
                          isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isActive ? (
                            <CheckCircleIcon className="h-4 w-4 text-primary-600" />
                          ) : null}
                          <span>{unit.unit_name}</span>
                        </span>
                        <span>{(unit.price_value ?? priceValue).toLocaleString('vi-VN')}₫</span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
            <QuantityStepper
              value={quantity}
              max={maxQuantity}
              onChange={onQuantityChange}
              size="md"
            />
            <Button onClick={onAddToCart} className="min-w-[150px] rounded-full" size="md">
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
