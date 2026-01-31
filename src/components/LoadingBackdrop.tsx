'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface LoadingBackdropProps {
    isOpen: boolean
    loadingText?: string
    opacity?: number
    size?: 'sm' | 'md' | 'lg'
    zIndex?: number
}

export const LoadingBackdrop: React.FC<LoadingBackdropProps> = ({
    isOpen,
    loadingText,
    opacity = 0.5,
    size = 'md',
    zIndex = 9999,
}) => {
    const [mounted, setMounted] = useState(false)
    
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            // Lưu lại scroll position hiện tại
            const scrollY = window.scrollY
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollY}px`
            document.body.style.width = '100%'
            document.body.style.overflow = 'hidden'

            return () => {
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                document.body.style.overflow = ''
                window.scrollTo(0, scrollY)
            }
        }
    }, [isOpen])

    if (!mounted || !isOpen) {
        return null
    }
    const sizeClasses = {
        sm: 'w-8 h-8 border-2',
        md: 'w-12 h-12 border-3',
        lg: 'w-16 h-16 border-4',
    }

    const spinnerSize = sizeClasses[size]

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{
                backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Loading"
        >
            <div className="flex flex-col items-center gap-4 animate-fadeIn">
                {/* Spinner */}
                <div
                    className={`${spinnerSize} border-primary-200 border-t-primary-600 rounded-full animate-spin`}
                    role="status"
                    aria-live="polite"
                />

                {/* Loading Text */}
                {loadingText && (
                    <p className="text-white text-sm font-medium animate-pulse">
                        {loadingText}
                    </p>
                )}
            </div>
        </div>,
        document.body
    )
}

export default LoadingBackdrop
