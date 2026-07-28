import React from 'react'

interface ChevronDoubleDownIconProps {
  className?: string
  size?: number
}

/** Double chevron down — load-more / expand affordance. */
export const ChevronDoubleDownIcon: React.FC<ChevronDoubleDownIconProps> = ({
  className = 'h-5 w-5',
  size,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6l5 5 5-5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 13l5 5 5-5" />
    </svg>
  )
}
