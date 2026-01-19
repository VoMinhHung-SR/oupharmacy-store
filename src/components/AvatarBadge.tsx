'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'

export const AvatarBadge: React.FC = () => {
  const { user, logout } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  if (!user) {
    return null
  }

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User'
    return user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'User'
  }

  // Get user avatar
  const getUserAvatar = () => {
    if (!user) return null
    return user.avatar_path || user.avatar || null
  }

  // Get initials for avatar fallback
  const getUserInitials = () => {
    const name = getUserDisplayName()
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Badge */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="relative">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20 border-2 border-white/30 flex items-center justify-center">
            {getUserAvatar() ? (
              <Image
                src={getUserAvatar()!}
                alt={getUserDisplayName()}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {getUserInitials()}
              </span>
            )}
          </div>
          {/* Badge indicator - có thể dùng để hiển thị notification hoặc status */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
        </div>
        <span className="hidden md:block text-sm font-medium text-white max-w-[120px] truncate">
          {getUserDisplayName()}
        </span>
        <svg
          className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 truncate">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/tai-khoan"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Tài khoản của tôi
            </Link>
            <Link
              href="/tai-khoan/ho-so"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Hồ sơ cá nhân
            </Link>
            <Link
              href="/san-pham-yeu-thich"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors relative"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span className="flex items-center justify-between">
                <span>Sản phẩm yêu thích</span>
                {wishlistCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </span>
            </Link>
            <Link
              href="/tai-khoan/don-hang"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Đơn hàng của tôi
            </Link>
            <Link
              href="/tai-khoan/cai-dat"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Cài đặt tài khoản
            </Link>
            <Link
              href="/tai-khoan/doi-mat-khau"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              Đổi mật khẩu
            </Link>
          </div>
          <div className="border-t border-gray-200 py-1">
            <button
              onClick={() => {
                logout()
                setIsDropdownOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AvatarBadge