'use client'

import React, { useState, useRef, useMemo } from 'react'
import Image from 'next/image'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { ImagePlaceholderIcon } from '@/components/icons'

interface ImageZoomModalProps {
  image: string
  productName: string
  isOpen: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  image,
  productName,
  isOpen,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
        aria-label="Close zoom"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      )}

      <div onClick={(e) => e.stopPropagation()} className="relative h-[min(90vh,90vw)] w-[min(90vh,90vw)] max-w-7xl">
        <Image
          src={image}
          alt={productName}
          fill
          sizes="90vw"
          className="object-contain object-center"
          priority
        />
      </div>
    </div>
  )
}

interface ProductImageGalleryProps {
  mainImage?: string
  images?: string[]
  productName: string
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImage,
  images = [],
  productName,
}) => {
  const allImages = useMemo(() => {
    const imageSet = new Set<string>()
    const result: string[] = []
    
    if (mainImage && !imageSet.has(mainImage)) {
      result.push(mainImage)
      imageSet.add(mainImage)
    }
    
    images.forEach(img => {
      if (img && !imageSet.has(img)) {
        result.push(img)
        imageSet.add(img)
      }
    })
    
    return result
  }, [mainImage, images])
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomOpen, setIsZoomOpen] = useState(false)
  const thumbnailRef = useRef<HTMLDivElement>(null)
  const currentImage = allImages[selectedIndex] || allImages[0]

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
    if (thumbnailRef.current) {
      const thumbnail = thumbnailRef.current.children[index] as HTMLElement
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (thumbnailRef.current) {
      const scrollAmount = 100
      const currentScroll = thumbnailRef.current.scrollLeft
      thumbnailRef.current.scrollTo({
        left: currentScroll + (direction === 'left' ? -scrollAmount : scrollAmount),
        behavior: 'smooth',
      })
    }
  }

  if (allImages.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square w-full overflow-hidden rounded-lg border bg-gray-100 flex items-center justify-center">
          <ImagePlaceholderIcon className="h-24 w-24 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 text-center">
          Mẫu mã sản phẩm có thể thay đổi theo lô hàng
        </p>
      </div>
    )
  }

  const handleImageClick = () => {
    if (currentImage) {
      setIsZoomOpen(true)
    }
  }

  const handleZoomPrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
  }

  const handleZoomNext = () => {
    setSelectedIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-white group cursor-zoom-in">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 600px"
            className="object-contain object-center p-2 transition-transform duration-200 md:group-hover:scale-105"
            priority
            onClick={handleImageClick}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <ImagePlaceholderIcon className="h-24 w-24 text-gray-400" />
          </div>
        )}

        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-2 top-1/2 z-[1] -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md opacity-100 transition-opacity hover:bg-white md:opacity-0 md:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 top-1/2 z-[1] -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md opacity-100 transition-opacity hover:bg-white md:opacity-0 md:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="relative">
          <div
            ref={thumbnailRef}
            className="scrollbar-hide flex justify-center gap-2 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
          >
            {allImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => handleThumbnailClick(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-primary-600 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} - ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain object-center bg-white p-0.5"
                />
              </button>
            ))}
          </div>
          
          {allImages.length > 4 && (
            <>
              <button
                type="button"
                onClick={() => scrollThumbnails('left')}
                className="absolute left-0 top-1/2 z-[1] -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-md hover:bg-white"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => scrollThumbnails('right')}
                className="absolute right-0 top-1/2 z-[1] -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 p-1.5 shadow-md hover:bg-white"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRightIcon className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Mẫu mã sản phẩm có thể thay đổi theo lô hàng
      </p>

      <ImageZoomModal
        image={currentImage}
        productName={productName}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        onPrev={handleZoomPrev}
        onNext={handleZoomNext}
        hasPrev={allImages.length > 1}
        hasNext={allImages.length > 1}
      />
    </div>
  )
}

