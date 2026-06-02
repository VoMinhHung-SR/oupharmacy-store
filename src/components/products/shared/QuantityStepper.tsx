'use client'

import React from 'react'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  size?: 'md' | 'lg'
  className?: string
}

const controlTone = (disabled: boolean) =>
  disabled
    ? 'cursor-not-allowed text-gray-400 hover:bg-white'
    : 'text-gray-900 hover:bg-gray-50'

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  size = 'md',
  className = '',
}: QuantityStepperProps) {
  const isLarge = size === 'lg'
  const heightClass = isLarge ? 'h-12' : 'h-10'
  const buttonWidthClass = isLarge ? 'w-12' : 'w-10'
  const inputWidthClass = isLarge ? 'w-24' : 'w-16'
  const textClass = isLarge ? 'text-xl' : 'text-lg'
  const inputTextClass = isLarge ? 'text-lg' : 'text-base'

  const atMin = value <= min
  const atMax = value >= max

  return (
    <div
      className={`inline-flex shrink-0 items-stretch overflow-hidden rounded-xl border border-gray-300 bg-white box-border ${heightClass} ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`flex h-full shrink-0 items-center justify-center border-r border-gray-300 ${controlTone(atMin)} ${buttonWidthClass} ${textClass}`}
        disabled={atMin}
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/[^\d]/g, '')
          const parsedValue = digitsOnly ? Number.parseInt(digitsOnly, 10) : min
          onChange(Math.max(min, Math.min(max, parsedValue)))
        }}
        className={`h-full shrink-0 border-r border-gray-300 bg-white text-center font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 ${inputWidthClass} ${inputTextClass}`}
        aria-label="Số lượng"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`flex h-full shrink-0 items-center justify-center ${controlTone(atMax)} ${buttonWidthClass} ${textClass}`}
        disabled={atMax}
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  )
}
