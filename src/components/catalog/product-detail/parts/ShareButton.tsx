'use client'

import { ShareIcon, CopyIcon, FacebookIcon } from '@/components/icons'
import React, { useState } from 'react'

interface ShareButtonProps {
  productName: string
  productUrl: string
}

export const ShareButton: React.FC<ShareButtonProps> = ({ productName, productUrl }) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleShare = async (platform: 'facebook' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : productUrl
    const text = `Xem sản phẩm: ${productName}`

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          '_blank',
          'width=600,height=400'
        )
        break
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url)
          alert('Đã sao chép link vào clipboard!')
        } else {
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          alert('Đã sao chép link vào clipboard!')
        }
        break
    }
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white text-xs text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto sm:px-3"
        aria-label="Chia sẻ sản phẩm"
      >
        <ShareIcon className="w-4 h-4 text-gray-600" />
        <span className="hidden text-gray-500 sm:inline">Chia sẻ</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-20">
            <button
              onClick={() => handleShare('facebook')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <FacebookIcon className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">Facebook</span>
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              <CopyIcon className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Sao chép link</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
