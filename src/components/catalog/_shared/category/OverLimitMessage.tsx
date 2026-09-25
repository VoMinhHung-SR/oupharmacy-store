'use client'
import React from 'react'
import { SubcategoriesGrid } from './SubcategoriesGrid'
import { Subcategory } from '@/lib/services/products'
import { Breadcrumb, CrumbItem } from '@/components/Breadcrumb'
import { Container } from '@/components/Container'
import { OverLimitCategorySkeleton } from '@/components/skeletons'
import { PAGE_Y } from '@/lib/layout/pageLayout'

interface OverLimitMessageProps {
  categoryName: string
  productCount: number
  subcategories: Subcategory[]
  categorySlug: string
  loading?: boolean
}

export function OverLimitMessage({
  categoryName,
  subcategories,
  categorySlug,
  loading = false,
}: OverLimitMessageProps) {
  const breadcrumbs: CrumbItem[] = [
    { label: 'Trang chủ', href: '/' },
    { label: categoryName, href: `/${categorySlug}` },
  ]

  if (loading) {
    return <OverLimitCategorySkeleton />
  }

  return (
    <Container className={PAGE_Y}>
      <Breadcrumb items={breadcrumbs} className="mb-6" />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">{categoryName}</h1>
        <p className="text-gray-600">Vui lòng chọn danh mục con để xem sản phẩm cụ thể.</p>
      </div>

      <SubcategoriesGrid
        subcategories={subcategories}
        currentCategorySlug={categorySlug}
        loading={false}
      />
    </Container>
  )
}
