import Link from 'next/link'
import React from 'react'
import { getCategoriesSSG, CategoryLevel0 } from '@/lib/services/categories'
import { Container } from '@/components/Container'

/**
 * Categories Page với SSG (Static Site Generation)
 * Fetch categories tại build time
 */
export default async function CategoriesPage() {
  let categories: CategoryLevel0[] = []
  
  try {
    categories = await getCategoriesSSG()
  } catch (error) {
    console.error('Error fetching categories:', error)
  }

  const renderCategories = () => {
    if (categories.length === 0) {
      return (
        <div className="rounded-lg border p-8 text-center text-gray-600">
          Không có danh mục nào
        </div>
      )
    }

    return (
      <div className="space-y-12">
        {categories.map((level0) => (
          <div key={level0.id} className="space-y-6">
            {/* Level 0 Category */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">{level0.name}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {/* Level 1 Categories */}
                {level0.level1 && level0.level1.length > 0 ? (
                  level0.level1.map((level1) => (
                    <div key={level1.id} className="space-y-2">
                      <Link
                        href={`/${level1.path_slug || level1.slug}`}
                        className="block rounded-lg border p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium text-base">{level1.name}</div>
                        <div className="mt-1 text-xs text-gray-500">Xem sản phẩm →</div>
                      </Link>
                      
                      {/* Level 2 Categories (nếu có) */}
                      {level1.level2 && level1.level2.length > 0 && (
                        <div className="ml-2 space-y-1">
                          {level1.level2.map((level2) => (
                            <Link
                              key={level2.id}
                              href={`/${level2.path_slug || level2.slug}`}
                              className="block text-sm text-gray-600 hover:text-primary-600 py-1"
                            >
                              {level2.name}
                              {level2.total && level2.total > 5 && (
                                <span className="ml-1 text-xs text-gray-400">
                                  (+{level2.total - 5})
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <Link
                    href={`/${level0.path_slug || level0.slug}`}
                    className="rounded-lg border p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium">{level0.name}</div>
                    <div className="mt-1 text-xs text-gray-500">Xem sản phẩm →</div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Container className="py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Danh mục sản phẩm</h1>
        {renderCategories()}
      </div>
    </Container>
  )
}


