import React from 'react'

interface ArrowLeftIconProps {
  className?: string
  size?: number
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ 
  className = 'w-5 h-5', 
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
