import React from 'react'

interface ChevronUpIconProps {
  className?: string
  size?: number
}

export const ChevronUpIcon: React.FC<ChevronUpIconProps> = ({ 
  className = 'w-4 h-4', 
  size 
}) => {
  return (
    <svg 
      className={className}
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
