import React from 'react'

interface ChevronLeftIconProps {
  className?: string
  size?: number
}

export const ChevronLeftIcon: React.FC<ChevronLeftIconProps> = ({ 
  className = 'w-6 h-6', 
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
        d="M15 19l-7-7 7-7"
      />
    </svg>
  )
}

