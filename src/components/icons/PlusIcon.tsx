import React from "react"

interface PlusIconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export const PlusIcon: React.FC<PlusIconProps> = ({
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
        d="M12 4v16m8-8H4"
      />
    </svg>
  )
}
