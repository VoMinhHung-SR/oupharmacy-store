import React from 'react'

interface MenuIconProps {
  className?: string
  size?: number
}

export const MenuIcon: React.FC<MenuIconProps> = ({ className = 'h-6 w-6', size }) => {
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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
