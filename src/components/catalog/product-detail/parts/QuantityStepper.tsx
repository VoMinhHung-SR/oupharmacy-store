'use client'

import React from 'react'

interface QuantityStepperProps {
  value: number
  min?: number
  max: number
  onChange: (value: number) => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const controlTone = (disabled: boolean) =>
  disabled
    ? 'cursor-not-allowed text-gray-400 hover:bg-white'
    : 'text-gray-900 hover:bg-gray-50'

const SIZE = {
  xs: { height: 'h-8', btn: 'w-7', input: 'w-8', text: 'text-sm', inputText: 'text-sm' },
  sm: { height: 'h-8', btn: 'w-8', input: 'w-9', text: 'text-sm', inputText: 'text-sm' },
  md: { height: 'h-10', btn: 'w-10', input: 'w-14', text: 'text-base', inputText: 'text-sm' },
  lg: { height: 'h-11', btn: 'w-11', input: 'w-16', text: 'text-lg', inputText: 'text-base' },
} as const

export function QuantityStepper({
  value,
  min = 1,
  max,
  onChange,
  size = 'md',
  className = '',
}: QuantityStepperProps) {
  const s = SIZE[size]
  const atMin = value <= min
  const atMax = value >= max

  return (
    <div
      className={`inline-flex w-fit max-w-full shrink-0 items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white box-border ${s.height} ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className={`flex h-full shrink-0 items-center justify-center border-r border-gray-300 ${controlTone(atMin)} ${s.btn} ${s.text}`}
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
        className={`h-full w-auto min-w-0 shrink-0 border-0 border-r border-gray-300 bg-transparent text-center font-medium text-gray-900 shadow-none focus:outline-none focus:ring-0 ${s.input} ${s.inputText}`}
        aria-label="Số lượng"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`flex h-full shrink-0 items-center justify-center ${controlTone(atMax)} ${s.btn} ${s.text}`}
        disabled={atMax}
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  )
}
