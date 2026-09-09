import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Site content width — same max-width + gutter as header/nav.
 * Always includes `w-full` so flex children of `main` do not shrink-to-content.
 */
export const Container: React.FC<ContainerProps> = ({ children, className = '', style }) => {
  return (
    <div className={`mx-auto w-full max-w-7xl px-2 sm:px-3 lg:px-4 ${className}`} style={style}>
      {children}
    </div>
  )
}

export default Container
