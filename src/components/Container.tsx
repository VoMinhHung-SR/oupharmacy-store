import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Container: React.FC<ContainerProps> = ({ children, className = '', style }) => {
  return (
    <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} style={style}>
      {children}
    </div>
  )
}

export default Container


