'use client'

import React from 'react'

export interface SelectOptionPillProps {
  label: string
  selected: boolean
  onSelect: () => void
  /** `md` = unit picker on PDP; `sm` = listing sort chips. */
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Default select-option pill (ref: corner check badge).
 * Selected: primary border + top-right triangle tick (theme primary).
 */
export function SelectOptionPill({
  label,
  selected,
  onSelect,
  size = 'md',
  className = '',
}: SelectOptionPillProps) {
  // Ref: h-9, pl-4 pr-6, corner badge ~26px
  const sizeClass =
    size === 'sm'
      ? 'h-8 pl-3 pr-5 text-sm'
      : 'h-9 min-w-[80px] pl-4 pr-6 text-sm'

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[50px] border border-solid bg-white font-medium text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
        selected
          ? `border-primary-600 ${sizeClass}`
          : `border-gray-300 ${sizeClass}`
      } ${className}`.trim()}
    >
      {selected ? (
        <span
          className="pointer-events-none absolute right-0 top-0 z-[2] block h-[26px] w-[26px] bg-primary-600"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            className="absolute right-[3px] top-[3px] text-white"
          >
            <path
              d="M8.5 16.5858L4.70711 12.7929C4.31658 12.4024 3.68342 12.4024 3.29289 12.7929C2.90237 13.1834 2.90237 13.8166 3.29289 14.2071L7.79289 18.7071C8.18342 19.0976 8.81658 19.0976 9.20711 18.7071L20.2071 7.70711C20.5976 7.31658 20.5976 6.68342 20.2071 6.29289C19.8166 5.90237 19.1834 5.90237 18.7929 6.29289L8.5 16.5858Z"
              fill="currentColor"
            />
          </svg>
        </span>
      ) : null}
      <span className="relative z-[1] whitespace-nowrap">{label}</span>
    </button>
  )
}
