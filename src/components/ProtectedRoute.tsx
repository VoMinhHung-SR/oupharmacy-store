'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoginModal } from '@/contexts/LoginModalContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const { openModal } = useLoginModal()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const currentPath = window.location.pathname
      openModal(currentPath)
    }
  }, [isAuthenticated, loading, openModal])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export default ProtectedRoute

