import React from "react"

interface MinusIconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export const MinusIcon: React.FC<MinusIconProps> = ({
  className = "h-4 w-4",
  size,
  strokeWidth = 2,
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
        strokeWidth={strokeWidth}
        d="M20 12H4"
      />
    </svg>
  )
}
