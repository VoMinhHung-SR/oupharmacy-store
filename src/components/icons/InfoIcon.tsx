import React from "react"

interface InfoIconProps {
  className?: string
  size?: number
}

export const InfoIcon: React.FC<InfoIconProps> = ({
  className = "h-3.5 w-3.5",
  size,
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" d="M12 16v-5M12 8h.01" />
    </svg>
  )
}
