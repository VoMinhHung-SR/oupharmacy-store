import React from 'react'

interface CheckCircleIconProps {
  className?: string
  size?: number
}

export const CheckCircleIcon: React.FC<CheckCircleIconProps> = ({
  className = 'h-4 w-4',
  size,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="9" fill="currentColor" />
      <path
        d="M6 10.2l2.2 2.2L14 6.8"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

