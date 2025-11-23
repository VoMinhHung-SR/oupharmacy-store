'use client'

import React from 'react'
import Container from '@/components/Container'
import ProductCard from '@/components/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image_url?: string
  packaging?: string
  medicine_unit_id?: number
}

interface BestsellingProductsProps {
  products?: Product[]
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Thực phẩm bảo vệ sức khỏe NMN PQQ',
    price: 6675000,
    originalPrice: 8900000,
    packaging: 'Hộp 60 Viên',
  },
  {
    id: '2',
    name: 'Viên uống Best King Jpanwell hỗ trợ tăng cường sinh lý và khả năng',
    price: 1040000,
    originalPrice: 1300000,
    packaging: 'Hộp 60 Viên',
  },
  {
    id: '3',
    name: 'Viên uống giảm ho Nano Anpacov Biochempha',
    price: 119200,
    originalPrice: 149000,
    packaging: 'Hộp 60 Viên',
  },
  {
    id: '4',
    name: 'Viên nhai Brauer Baby & Kids Ultra Pure DHA hỗ trợ phát triển não',
    price: 388800,
    originalPrice: 486000,
    packaging: 'Hộp 60 viên',
  },
  {
    id: '5',
    name: 'Nước Yến Sào Cao Cấp Nunest Relax - Ngủ Ngon, Giảm Căng thẳng',
    price: 246750,
    originalPrice: 329000,
    packaging: 'Hộp 6 Hũ',
  },
  {
    id: '6',
    name: 'Chai xịt Aloclair Plus Spray giảm đau nhanh bệnh tay chân miệng',
    price: 229000,
    packaging: 'Hộp x 15ml',
  },
]

export const BestsellingProducts: React.FC<BestsellingProductsProps> = ({ products = mockProducts }) => {
  return (
    <section className="py-12 bg-white">
      <Container>
        {/* Section header */}
        <div className="bg-red-600 text-white inline-block px-6 py-2 rounded-t-lg mb-6">
          <h2 className="text-xl font-bold">Sản phẩm bán chạy</h2>
        </div>

        {/* Products grid */}
        <div className="bg-primary-50 p-6 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

export default BestsellingProducts

