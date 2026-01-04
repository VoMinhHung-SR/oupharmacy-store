import React from 'react'

interface XIconProps {
  className?: string
  size?: number
}

export const XIcon: React.FC<XIconProps> = ({ 
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}
