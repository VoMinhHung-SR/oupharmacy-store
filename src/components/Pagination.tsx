import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  buttonClassName?: string
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  className = '',
  buttonClassName = ''
}) => {
  if (totalPages <= 1) return null

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const isPrevDisabled = currentPage <= 1
  const isNextDisabled = currentPage >= totalPages

  return (
    <div className={`mt-8 flex items-center justify-center gap-2 text-sm ${className}`}>
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={`rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-primary-600 ${buttonClassName}`}
      >
        Trước
      </button>
      <span className="text-gray-600">
        Trang {currentPage}/{totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`rounded border px-3 py-1 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-primary-600 ${buttonClassName}`}
      >
        Sau
      </button>
    </div>
  )
}

export default Pagination