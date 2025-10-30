import Link from 'next/link'
import React from 'react'

export default function CategoriesPage() {
  const categories = [
    { slug: 'vitamin', name: 'Vitamin & Khoáng chất' },
    { slug: 'skincare', name: 'Chăm sóc da' },
    { slug: 'digest', name: 'Hỗ trợ tiêu hóa' },
    { slug: 'beauty', name: 'Hỗ trợ làm đẹp' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Danh mục nổi bật</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => (
          <Link key={c.slug} href={`/categories/${c.slug}`} className="rounded-lg border p-6 hover:shadow">
            <div className="font-medium">{c.name}</div>
            <div className="mt-1 text-xs text-gray-500">Xem sản phẩm →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


