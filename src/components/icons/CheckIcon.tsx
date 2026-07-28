import React from 'react'

interface CheckIconProps {
  className?: string
  size?: number
}

/** Stroke checkmark for checkbox / selected states. */
export const CheckIcon: React.FC<CheckIconProps> = ({ className = 'h-3 w-3', size }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 6.2L4.8 8.5L9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
