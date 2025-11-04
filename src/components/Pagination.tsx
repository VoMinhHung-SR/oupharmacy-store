import Link from 'next/link'
import React from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, basePath }) => {
  const prev = Math.max(1, page - 1)
  const next = Math.min(totalPages, page + 1)
  return (
    <div className="flex items-center justify-center gap-2 text-sm">
      <Link className="rounded border px-3 py-1 hover:bg-gray-50" href={`${basePath}?page=${prev}`}>Trước</Link>
      <span className="text-gray-600">Trang {page}/{totalPages}</span>
      <Link className="rounded border px-3 py-1 hover:bg-gray-50" href={`${basePath}?page=${next}`}>Sau</Link>
    </div>
  )
}

export default Pagination


