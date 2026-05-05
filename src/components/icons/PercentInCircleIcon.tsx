import React from "react"

interface PercentInCircleIconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export const PercentInCircleIcon: React.FC<PercentInCircleIconProps> = ({
  className = "h-5 w-5",
  size,
  strokeWidth = 1.75,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M9 15l6-6M10 10h.01M14 14h.01" />
    </svg>
  )
}
