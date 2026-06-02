'use client'

import React from 'react'

interface ProductUnitOptionButtonProps {
  label: string
  selected: boolean
  onSelect: () => void
}

/** Unit pill — unselected: compact grey border; selected: wider blue border + top-right corner check. */
export function ProductUnitOptionButton({
  label,
  selected,
  onSelect,
}: ProductUnitOptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative overflow-hidden rounded-full border bg-white text-sm text-gray-900 transition-colors ${
        selected
          ? 'min-w-[80px] border-primary-600 px-6 py-2 font-semibold'
          : 'min-w-[72px] border-gray-300 px-4 py-2 font-medium hover:border-gray-400'
      }`}
    >
      {selected ? (
        <span
          className="absolute right-0 top-0 h-4 w-1/2 bg-primary-600"
          style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
          aria-hidden="true"
        >
          <svg
            className="absolute right-1 top-0.5 h-2.5 w-2.5 text-white"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2.5 6.2 5 8.7 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
      <span className="relative z-[1]">{label}</span>
    </button>
  )
}
