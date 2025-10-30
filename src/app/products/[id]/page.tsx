import React from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import { Button } from '@/components/Button'

interface Props {
  params: { id: string }
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = params

  // Placeholder data
  const product = {
    id,
    name: `Sản phẩm ${id}`,
    price: 199000,
    description:
      'Mô tả ngắn về sản phẩm. Thành phần, công dụng, cách dùng sẽ được bổ sung sau.',
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Sản phẩm', href: '/products' },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square w-full rounded-lg border bg-gray-100" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square w-full rounded border bg-gray-50" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <div className="text-2xl text-primary-700">{product.price.toLocaleString('vi-VN')}₫</div>
          <p className="text-sm text-gray-600">{product.description}</p>
          <div className="flex gap-3 pt-2">
            <Button>Thêm vào giỏ</Button>
            <Button variant="outline">Mua ngay</Button>
          </div>
        </div>
      </div>
    </div>
  )
}


