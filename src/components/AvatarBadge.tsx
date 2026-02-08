'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { ChevronDownIcon } from '@/components/icons'
import { AVATAR_STATUS } from '@/lib/constant'

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

  // Get user avatar; treat USER_NULL / ERROR_CLOUDINARY as no avatar (show initials)
  const getUserAvatar = (): string | null => {
    if (!user) return null
    const url = user.avatar_path || user.avatar || null
    if (!url) return null
    if (url === AVATAR_STATUS.USER_NULL || url === AVATAR_STATUS.ERROR_CLOUDINARY) return null
    return url
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
    <div className="relative flex-shrink-0 min-w-0 max-w-[200px]" ref={dropdownRef}>
      {/* Avatar Badge */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 h-10 px-3 py-2 rounded-full group hover:text-primary-100 transition-colors min-w-0 w-full max-w-full"
      >
        <div className="relative flex-shrink-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white/20 border-2 border-white/30 flex items-center justify-center shrink-0">
            {getUserAvatar() ? (
              <Image
                src={getUserAvatar()!}
                alt={getUserDisplayName()}
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-white font-semibold text-xs leading-none select-none">
                {getUserInitials()}
              </span>
            )}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-primary-700 rounded-full" aria-hidden />
        </div>
        <span className="hidden md:block text-sm font-medium group-hover:text-primary-100 text-white truncate min-w-0 text-left max-w-[100px]">
          {getUserDisplayName()}
        </span>
        <ChevronDownIcon
          className="w-4 h-4 text-white shrink-0 group-hover:text-primary-100"
          rotated={isDropdownOpen}
        />
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