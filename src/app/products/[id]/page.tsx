"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProduct } from '@/lib/hooks/useProducts'

interface Props {
  params: { id: string }
}

/**
 * Redirect từ /products/[id] sang /{category-slug}/{medicine-slug} để sử dụng routing mới
 */
export default function ProductDetailPage({ params }: Props) {
  const { id } = params
  const router = useRouter()
  const { data: product, isLoading: loading } = useProduct(id)

  useEffect(() => {
    if (!loading && product) {
      // Tạo URL mới từ category slug và medicine slug
      const categorySlug = product.category?.path_slug || product.category?.slug || product.category?.name.toLowerCase().replace(/\s+/g, '-')
      const medicineSlug = product.medicine.slug

      if (categorySlug && medicineSlug) {
        router.replace(`/${categorySlug}/${medicineSlug}`)
      }
    }
  }, [product, loading, router])

  // Hiển thị loading hoặc null trong khi redirect
  return null
}