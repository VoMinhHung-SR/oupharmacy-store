import React from 'react'

interface ChevronDownIconProps {
  className?: string
  size?: number
  rotated?: boolean
}

export const ChevronDownIcon: React.FC<ChevronDownIconProps> = ({ 
  className = 'w-5 h-5', 
  size,
  rotated = false
}) => {
  return (
    <svg 
      className={`${className} transition-transform ${rotated ? 'rotate-180' : ''}`}
      width={size}
      height={size}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  )
}


