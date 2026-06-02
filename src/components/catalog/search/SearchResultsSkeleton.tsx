import Breadcrumb, { CrumbItem } from '@/components/Breadcrumb'
import { Container } from '@/components/Container'

interface SearchResultsSkeletonProps {
  breadcrumbItems: CrumbItem[]
}

export function SearchResultsSkeleton({ breadcrumbItems }: SearchResultsSkeletonProps) {
  return (
    <Container className="py-4">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-6 mt-4 h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>
    </Container>
  )
}
