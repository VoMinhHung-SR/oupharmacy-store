import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Site content width — same max-width + horizontal gutter as the home hero band.
 * Use this for header, home rails, PDP, etc. so edges align top → bottom.
 */
export const Container: React.FC<ContainerProps> = ({ children, className = '', style }) => {
  return (
    <div className={`mx-auto max-w-7xl px-2 sm:px-3 lg:px-4 ${className}`} style={style}>
      {children}
    </div>
  )
}

export default Container
